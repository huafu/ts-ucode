import ts from 'typescript';

import { createTransformerFactory } from './helpers/utils';

const methodTransformerFactory = createTransformerFactory({
	shouldTransformNode: ts.isMethodDeclaration,

	transformNode: (method, { factory }) =>
		factory.createPropertyAssignment(
			method.name,
			factory.createFunctionExpression(
				undefined,
				method.asteriskToken,
				undefined,
				method.typeParameters,
				method.parameters,
				method.type,
				<ts.Block>method.body
			)
		)
});

export default [methodTransformerFactory];
