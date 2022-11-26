import ts from 'typescript';

import { VisitMode, createTransformerFactory } from './helpers/utils';

const importPathTransformerFactory = createTransformerFactory({
	// we don't want to visit each descendant, only direct children of source file
	visitEachChild: VisitMode.never,

	shouldTransformNode: ts.isImportDeclaration,

	transformNode: (node, { factory }) => {
		let path: string;
		if (/^\.{1,2}\//.test((path = node.moduleSpecifier.getText().slice(1, -1)))) {
			const moduleSpecifier = factory.createStringLiteral(path + '.uc', true);
			return factory.createImportDeclaration(
				node.modifiers,
				node.importClause,
				moduleSpecifier,
				node.assertClause
			);
		}
		return node;
	}
});

export default [importPathTransformerFactory];
