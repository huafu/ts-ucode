import ts from 'typescript';

import { createTransformerFactory } from './helpers/utils';

const throwTransformerFactory = createTransformerFactory({
	shouldTransformNode: ts.isThrowStatement,

	transformNode: (throwStmt, { factory }) =>
		factory.createExpressionStatement(
			factory.createCallExpression(factory.createIdentifier('die'), undefined, [
				throwStmt.expression
			])
		)
});

export default [throwTransformerFactory];
