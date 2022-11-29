import ts from 'typescript';

import { createTransformerFactory } from './helpers/utils';

const parameterDefaultValueTransformerFactory = createTransformerFactory<
  ts.FunctionDeclaration | ts.FunctionExpression | ts.ArrowFunction
>({
  file: __filename,
  name: 'main',
  // only treat fn with at least one param with default value
  shouldTransformNode: (node) =>
    (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) &&
    !!node.parameters.find((p) => p.initializer),

  // mode default value from param to fn body
  transformNode: (fn, { factory }) => {
    const initializers = <ts.Statement[]>[];
    const params = <ts.ParameterDeclaration[]>[];
    fn.parameters.forEach((param) => {
      const name = param.name.getText();
      // new param, cleaned up
      params.push(
        factory.createParameterDeclaration(
          param.modifiers,
          param.dotDotDotToken,
          param.name,
          param.questionToken,
          param.type,
          undefined,
        ),
      );
      // if there is an initializer, add it to the initializers (which will be inserted at the top of the fn body)
      if (param.initializer) {
        initializers.push(
          factory.createExpressionStatement(
            factory.createBinaryExpression(
              factory.createIdentifier(name),
              factory.createToken(ts.SyntaxKind.EqualsToken),
              factory.createBinaryExpression(
                factory.createIdentifier(name),
                factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                param.initializer,
              ),
            ),
          ),
        );
      }
    });

    // create new body
    const body: ts.Statement[] = [...initializers];
    if (fn.body) {
      if (ts.isBlock(fn.body)) body.push(...fn.body.statements);
      else body.push(factory.createReturnStatement(fn.body));
    }
    const block = factory.createBlock(body);
    // create new function with new parameters (no initializers) and initializer block in the body
    if (ts.isArrowFunction(fn)) {
      fn = factory.createArrowFunction(
        fn.modifiers,
        fn.typeParameters,
        params,
        fn.type,
        fn.equalsGreaterThanToken,
        block,
      );
    } else {
      const create = ts.isFunctionDeclaration(fn)
        ? factory.createFunctionDeclaration
        : factory.createFunctionExpression;
      fn = create(
        fn.modifiers,
        fn.asteriskToken,
        fn.name,
        fn.typeParameters,
        params,
        fn.type,
        block,
      );
    }

    return fn;
  },
});

export default [parameterDefaultValueTransformerFactory];
