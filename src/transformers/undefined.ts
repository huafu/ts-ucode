import { SyntaxKind } from 'typescript';

import { createTransformerFactory, isUndefined } from './helpers/utils';

// undefined => null
const undefinedTransformerFactory = createTransformerFactory({
	file: __filename,
	name: 'main',
	shouldTransformNode: isUndefined,

	transformNode: (_undefined, { factory }) => factory.createToken(SyntaxKind.NullKeyword)
});

export default [undefinedTransformerFactory];
