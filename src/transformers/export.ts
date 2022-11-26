import ts from 'typescript';

import { VisitMode, createTransformerFactory, describeNode, isNodeExported } from './helpers/utils';

// grab existing export maps
const exportDeclarationTransformerFactory = createTransformerFactory({
	// only direct children of source file nodes can be exported, no need to visit any child
	visitEachChild: VisitMode.never,

	shouldTransformNode: ts.isExportDeclaration,

	transformNode: (decl, { registerExport, sourceFile }) => {
		if (!decl.exportClause)
			throw new SyntaxError(
				`Star exports are not handled yet (in ${sourceFile.fileName}: ${decl.getText()})`
			);
		if (ts.isNamespaceExport(decl.exportClause))
			throw new SyntaxError(
				`Namespace export are not handled yet (in ${sourceFile.fileName}: ${decl.getText()})`
			);
		registerExport(...(decl.exportClause?.elements ?? []));
		// we return nothing so that the node get removed
		return undefined;
	}
});

// move all exported symbols to the end of the file in one mapped export
const exportTransformerFactory = createTransformerFactory({
	// only direct children of source file nodes can be exported, no need to visit any child
	visitEachChild: VisitMode.never,

	shouldTransformNode: isNodeExported,

	transformNode: (node, { registerExport, sourceFile, factory }) => {
		const modifiers = ts.canHaveModifiers(node)
			? ts.getModifiers(node)?.filter((m) => m.kind !== ts.SyntaxKind.ExportKeyword) ?? []
			: [];

		// export function myFunction(...) {...}
		if (ts.isFunctionDeclaration(node)) {
			registerExport(<string>node.name?.getText());
			return factory.createFunctionDeclaration(
				modifiers,
				node.asteriskToken,
				node.name,
				node.typeParameters,
				node.parameters,
				node.type,
				node.body
			);
		}
		// export const/let myVar = ...
		else if (ts.isVariableStatement(node)) {
			registerExport(
				...node.declarationList.declarations.reduce((names, { name }) => {
					if (ts.isIdentifier(name)) return [...names, name.text];
					throw new SyntaxError(
						`Unhandled export binding (in ${sourceFile.fileName}: ${describeNode(node)})`
					);
				}, <string[]>[])
			);
			return factory.createVariableStatement(modifiers, node.declarationList);
		}
		// else fail
		else {
			throw new SyntaxError(
				`Node is exported but it could not be duplicated (in: ${
					sourceFile.fileName
				}: ${describeNode(node)})`
			);
		}
	}
});

export default [exportDeclarationTransformerFactory, exportTransformerFactory];
