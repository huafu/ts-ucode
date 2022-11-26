import ts from 'typescript';

import { createTransformerFactory } from './helpers/utils';

// ucode returns the last item in the stack when arrow functions have body as well, we need to discard that with a final `return`

const arrowFnTransformer = createTransformerFactory({
	shouldTransformNode: (node: ts.Node): node is ts.ArrowFunction =>
		ts.isArrowFunction(node) &&
		ts.isBlock(node.body) &&
		!ts.isReturnStatement(node.body.statements[node.body.statements.length - 1]),

	transformNode: (fn, { factory }) =>
		factory.createArrowFunction(
			fn.modifiers,
			fn.typeParameters,
			fn.parameters,
			fn.type,
			fn.equalsGreaterThanToken,
			// append block with an empty return statement
			factory.createBlock(
				[...(<ts.Block>fn.body).statements, factory.createReturnStatement()],
				true
			)
		)
});

export default [arrowFnTransformer];
