/* eslint-disable @typescript-eslint/no-use-before-define */
import ts from 'typescript';

import { createTransformerFactory, isNodeExported } from './helpers/utils';

enum ClassHelperKind {
  createClass = 'create_class',
  instanceOf = 'instance_of',
  super = 'super',
  decorateMembers = 'decorate_class_members',
}

// class Class {...} => __create_class('Class', ...)
const classTransformerFactory = createTransformerFactory({
  file: __filename,
  name: 'class',
  // visitEachChild: VisitMode.afterTransform,

  shouldTransformNode: ts.isClassLike,

  transformNode: (classNode, { factory, idFor }) => {
    const parentClassNode = classNode.heritageClauses?.find(
      (n) => n.token === ts.SyntaxKind.ExtendsKeyword,
    )?.types[0];
    const className = classNode.name?.getText() ?? 'AnonymousClass';
    const isExported = isNodeExported(classNode);

    const protoItems = <ts.ObjectLiteralElementLike[]>[];
    const protoDecorators = <ts.PropertyAssignment[]>[];
    const staticItems = <ts.ObjectLiteralElementLike[]>[];
    const staticDecorators = <ts.PropertyAssignment[]>[];
    const initializerItems = <ts.Statement[]>[];

    let ctorNode: ts.ConstructorDeclaration | undefined;

    // to register decorators of members
    const collectMemberDecorators = (
      node: ts.Node,
      target: ts.PropertyAssignment[],
      key: string,
    ) => {
      let decorators: readonly ts.Decorator[] | undefined;
      if (
        ts.canHaveDecorators(node) &&
        (decorators = ts.getDecorators(node)) &&
        decorators.length
      ) {
        target.push(
          factory.createPropertyAssignment(
            key,
            factory.createArrayLiteralExpression(
              decorators.map((d) => d.expression),
              false,
            ),
          ),
        );
        return true;
      }
      return false;
    };

    // to wrap with decorator helper if necessary
    const wrapMembersDecorate = (
      members: ts.ObjectLiteralExpression,
      decorators: ts.PropertyAssignment[],
    ): ts.Expression => {
      if (decorators.length === 0) return members;
      return factory.createCallExpression(idFor(ClassHelperKind.decorateMembers), undefined, [
        members,
        factory.createObjectLiteralExpression(decorators, true),
      ]);
    };

    // loop over each class member
    classNode.forEachChild((child) => {
      if (!ts.isClassElement(child)) return;

      // item name
      const name = <string>child.name?.getText();

      // modifiers
      let isStatic = false;
      if (ts.canHaveModifiers(child)) {
        const modifiers = ts.getModifiers(child);

        // we do not care about declare
        if (modifiers?.find((m) => m.kind === ts.SyntaxKind.DeclareKeyword)) return;

        isStatic = !!modifiers?.find((m) => m.kind === ts.SyntaxKind.StaticKeyword);
      }

      // properties
      if (ts.isPropertyDeclaration(child)) {
        // static prop?
        if (isStatic) {
          staticItems.push(
            factory.createPropertyAssignment(name, child.initializer ?? factory.createNull()),
          );
          collectMemberDecorators(child, staticDecorators, name);
        } else {
          protoItems.push(factory.createPropertyAssignment(name, factory.createNull()));
          collectMemberDecorators(child, protoDecorators, name);
          // has an initializer => to the ctor block
          if (child.initializer) {
            initializerItems.push(
              factory.createExpressionStatement(
                factory.createBinaryExpression(
                  factory.createPropertyAccessExpression(factory.createThis(), name),
                  factory.createToken(ts.SyntaxKind.EqualsToken),
                  child.initializer,
                ),
              ),
            );
          }
        }
      }
      // constructor
      else if (ts.isConstructorDeclaration(child)) {
        ctorNode = child;
      }
      // methods
      else if (ts.isMethodDeclaration(child)) {
        let methodTarget = isStatic ? staticItems : protoItems;
        methodTarget.push(
          factory.createMethodDeclaration(
            undefined,
            child.asteriskToken,
            child.name,
            child.questionToken,
            child.typeParameters,
            child.parameters,
            child.type,
            child.body,
          ),
        );
        collectMemberDecorators(child, isStatic ? staticDecorators : protoDecorators, name);
      }
    });

    // create ctor if we have initializers or ctor
    if (ctorNode || initializerItems.length > 0) {
      const ctorParams = <ts.ParameterDeclaration[]>[];
      if (ctorNode) {
        ctorNode.parameters.forEach((param) => {
          const name = param.name.getText();
          const mods = ts.canHaveModifiers(param) ? ts.getModifiers(param) ?? [] : [];
          const isProp = !!mods
            .map((m) => m.kind)
            .find((k) =>
              [
                ts.SyntaxKind.PrivateKeyword,
                ts.SyntaxKind.ProtectedKeyword,
                ts.SyntaxKind.ReadonlyKeyword,
              ].includes(k),
            );

          // are we a class prop?
          if (isProp) {
            protoItems.push(factory.createPropertyAssignment(name, factory.createNull()));
            // has an initializer => to the ctor block
            initializerItems.push(
              factory.createExpressionStatement(
                factory.createBinaryExpression(
                  factory.createPropertyAccessExpression(factory.createThis(), name),
                  factory.createToken(ts.SyntaxKind.EqualsToken),
                  factory.createIdentifier(name),
                ),
              ),
            );
          }
          // adds the parameter
          ctorParams.push(
            factory.createParameterDeclaration(
              undefined,
              param.dotDotDotToken,
              param.name,
              param.questionToken,
              param.type,
              param.initializer,
            ),
          );
        });
      } else if (parentClassNode) {
        // no ctor, define a ...args param
        ctorParams.push(
          factory.createParameterDeclaration(
            undefined,
            factory.createToken(ts.SyntaxKind.DotDotDotToken),
            factory.createIdentifier('args'),
          ),
        );
        // ...and call super with it before any initializer
        initializerItems.unshift(
          factory.createExpressionStatement(
            factory.createCallExpression(idFor(ClassHelperKind.super), undefined, [
              factory.createThis(),
              factory.createStringLiteral('__constructor__'),
              factory.createSpreadElement(factory.createIdentifier('args')),
            ]),
          ),
        );
      }

      // create the constructor
      protoItems.push(
        factory.createPropertyAssignment(
          '__constructor__',
          factory.createFunctionExpression(
            undefined,
            undefined,
            undefined,
            undefined,
            ctorParams,
            undefined,
            factory.createBlock([...initializerItems, ...(ctorNode?.body?.statements ?? [])]),
          ),
        ),
      );
    }

    // class builder
    const classBuilder = factory.createCallExpression(
      idFor(ClassHelperKind.createClass),
      undefined,
      [
        // class name as 'ClassName'
        factory.createStringLiteral(className),
        // proto object
        wrapMembersDecorate(
          factory.createObjectLiteralExpression(protoItems, true),
          protoDecorators,
        ),
        // static proto object
        wrapMembersDecorate(
          factory.createObjectLiteralExpression(staticItems, true),
          staticDecorators,
        ),
        // super class
        parentClassNode ? <ts.Identifier>parentClassNode.expression : factory.createNull(),
      ],
    );

    if (ts.isClassExpression(classNode)) {
      // if it was a class expression (stuff = class Xyz {...})
      return classBuilder;
    } else {
      // create the class const
      let newClass: ts.VariableDeclarationList | ts.VariableStatement;
      newClass = factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(className),
            undefined,
            undefined,
            classBuilder,
          ),
        ],
        ts.NodeFlags.Const,
      );

      // returns it exported or not
      if (isExported) {
        newClass = factory.createVariableStatement(
          [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
          newClass,
        );
      }
      return newClass;
    }
  },
});

// new Class(...) => Class.create(...)
const newKeywordTransformerFactory = createTransformerFactory({
  file: __filename,
  name: 'new',
  // visitEachChild: VisitMode.afterTransform,

  shouldTransformNode: ts.isNewExpression,

  transformNode: (newKw, { factory }) =>
    factory.createCallExpression(
      factory.createPropertyAccessExpression(newKw.expression, factory.createIdentifier('__new__')),
      newKw.typeArguments,
      newKw.arguments,
    ),
});

// super => __super(this)
const superKeywordTransformerFactory = createTransformerFactory({
  file: __filename,
  name: 'super',
  // visitEachChild: VisitMode.afterTransform,

  shouldTransformNode: (node) => node.kind === ts.SyntaxKind.SuperKeyword,

  transformNode: (superKw, { factory, idFor }) =>
    factory.createCallExpression(idFor(ClassHelperKind.super), undefined, [factory.createThis()]),
});

// super(...) => __super(this, '__constructor__', ...)
const superCtorCallTransformerFactory = createTransformerFactory({
  file: __filename,
  name: 'super()',
  // visitEachChild: VisitMode.afterTransform,

  shouldTransformNode: (node): node is ts.CallExpression =>
    ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.SuperKeyword,

  transformNode: (call, { idFor, factory }) =>
    factory.createCallExpression(idFor(ClassHelperKind.super), call.typeArguments, [
      factory.createThis(),
      factory.createStringLiteral('__constructor__'),
      ...call.arguments,
    ]),
});

// super.method(...) => __super(this, 'method', ...)
const superMethodCallTransformerFactory = createTransformerFactory({
  file: __filename,
  name: 'super.xxx()',
  // visitEachChild: VisitMode.afterTransform,

  shouldTransformNode: (node): node is ts.CallExpression =>
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.kind === ts.SyntaxKind.SuperKeyword,

  transformNode: (call, { factory, idFor }) => {
    const prop = <ts.PropertyAccessExpression>call.expression;
    return factory.createCallExpression(idFor(ClassHelperKind.super), call.typeArguments, [
      factory.createThis(),
      factory.createStringLiteral(prop.name.getText()),
      ...call.arguments,
    ]);
  },
});

// obj instanceof Class => __instance_of(obj, Class)
const instanceOfTransformerFactory = createTransformerFactory({
  file: __filename,
  name: 'instanceof',
  // visitEachChild: VisitMode.afterTransform,

  shouldTransformNode: (node): node is ts.BinaryExpression =>
    ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.InstanceOfKeyword,

  transformNode: (bin, { factory, idFor }) =>
    factory.createCallExpression(idFor(ClassHelperKind.instanceOf), undefined, [
      bin.left,
      bin.right,
    ]),
});

export default [
  classTransformerFactory,
  newKeywordTransformerFactory,
  superMethodCallTransformerFactory,
  superCtorCallTransformerFactory,
  superKeywordTransformerFactory,
  instanceOfTransformerFactory,
];
