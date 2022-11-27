import ts from 'typescript';

import { createTransformerFactory } from './helpers/utils';

const forOfTransformerFactory = createTransformerFactory({
	file: __filename,
	name: 'main',
	shouldTransformNode: ts.isForOfStatement,

	transformNode: (forOf, { factory }) =>
		factory.createForInStatement(forOf.initializer, forOf.expression, forOf.statement)
});

export default [forOfTransformerFactory];
