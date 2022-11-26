import { readFileSync } from 'fs';
import ts from 'typescript';

export const isUndefined = (node: ts.Node): boolean =>
	node.kind === ts.SyntaxKind.UndefinedKeyword ||
	(ts.isIdentifier(node) && node.text === 'undefined');

export const isNodeExported = (node: ts.Node) =>
	ts.canHaveModifiers(node) &&
	!!ts.getModifiers(node)?.find((m) => m.kind === ts.SyntaxKind.ExportKeyword);

export type DictForFile<T> = (sf: ts.SourceFile, ctx: ts.TransformationContext) => T;

const dictForFileBuilder = <T>(
	empty: (sf: ts.SourceFile, context: ts.TransformationContext) => T
): DictForFile<T> => {
	let map: Record<string, T> = {};
	return (sf, ctx) => {
		const key = sf.fileName;
		return map[key] ?? (map[key] = empty(sf, ctx));
	};
};

const helpersFor = dictForFileBuilder((sourceFile, { factory }) => {
	const injections: ts.Statement[] = [];
	const ids: Partial<Record<string, string>> = {};
	const exportSpecifiers: ts.ExportSpecifier[] = [];
	const exportSymbols: string[] = [];

	const registerExport = (...nameOrSpecifier: (string | ts.ExportSpecifier)[]) => {
		for (let item in nameOrSpecifier) {
			if (typeof item === 'string') exportSymbols.push(item);
			else exportSpecifiers.push(item);
		}
	};

	// prepares injection of a helper and returns its identifier
	const idFor = (name: string): ts.Identifier => {
		if (!ids[name]) {
			const sf = ts.createSourceFile(
				`${name}.js`,
				readFileSync(require.resolve(`./${name}.uc`), { encoding: 'utf-8' }),
				sourceFile.languageVersion
			);
			const item = sf.statements.find(ts.isExportAssignment)?.expression;
			if (!item) throw new TypeError(`Unable to find default export of ${name}.js`);

			const idName = `__ucode_${name}__`;
			injections.push(
				factory.createVariableStatement(
					undefined,
					factory.createVariableDeclarationList(
						[
							factory.createVariableDeclaration(
								factory.createIdentifier(idName),
								undefined,
								undefined,
								item
							)
						],
						ts.NodeFlags.Const
					)
				)
			);

			ids[name] = idName;
		}
		return factory.createIdentifier(<string>ids[name]);
	};

	const sourceFileTransformer: ts.Transformer<ts.SourceFile> = (sf) => {
		// all exported symbols count
		const exportsCount = exportSpecifiers.length + exportSymbols.length;
		const injectionsCount = injections.length;
		const modificationsCount = exportsCount + injectionsCount;

		// nothing to do here
		if (modificationsCount === 0) return sf;

		let statements = [...sf.statements];

		// first perform injections if any
		if (injectionsCount > 0) {
			// get the index of the last import stmt
			const lastImportIndex = statements
				.map(({ kind }) => kind)
				.lastIndexOf(ts.SyntaxKind.ImportDeclaration);
			// re-create source file with added injections
			statements = [
				...statements.slice(0, lastImportIndex + 1),
				...injections,
				...statements.slice(lastImportIndex + 1)
			];
		}

		if (exportsCount > 0) {
			// ensure we do not have a default export as well as named exports
			statements.forEach((n) => {
				if (ts.isExportAssignment(n)) {
					throw new SyntaxError(
						`A file with named exports cannot have default export yet (in ${
							sf.fileName
						}: ${n.getText()})`
					);
				}
			});

			// move all exports to one mapping at the end of the file
			statements = [
				...sf.statements,
				// create the global export declaration
				factory.createExportDeclaration(
					undefined,
					false,
					factory.createNamedExports([
						...exportSpecifiers,
						...exportSymbols.map((name) =>
							factory.createExportSpecifier(false, undefined, factory.createIdentifier(name))
						)
					]),
					undefined,
					undefined
				)
			];
		}

		return factory.updateSourceFile(sf, statements);
	};

	return { sourceFileTransformer, idFor, registerExport };
});

type IPrivateHelpers = ReturnType<typeof helpersFor>;
type IHelpers = Omit<IPrivateHelpers, 'sourceFileTransformer'>;

type CustomTransformationContext = {
	factory: ts.NodeFactory;
	sourceFile: ts.SourceFile;
} & IHelpers;

export enum VisitMode {
	never,
	beforeTransform,
	afterTransform,
	default = beforeTransform
}
type CreateTransformerFactoryOptions<T extends ts.Node = ts.Node> = {
	shouldTransformNode?: ((node: ts.Node) => node is T) | ((node: ts.Node) => boolean);
	transformNode: (node: T, ctx: CustomTransformationContext) => ts.VisitResult<ts.Node>;
	visitEachChild?: VisitMode;
};

export const createTransformerFactory = <T extends ts.Node>({
	shouldTransformNode = <any>(() => true),
	transformNode,
	visitEachChild
}: CreateTransformerFactoryOptions<T>): ts.TransformerFactory<ts.SourceFile> => {
	return (context) => {
		let customContext: CustomTransformationContext;

		const visitor: ts.Visitor = (node) => {
			let res: ts.VisitResult<ts.Node> = node;

			if (visitEachChild === VisitMode.beforeTransform)
				res = ts.visitEachChild(res, visitor, context);

			if (!res) return res;

			if (shouldTransformNode(node)) res = transformNode(node, customContext);

			if (!res || visitEachChild !== VisitMode.afterTransform) return res;

			if (Array.isArray(res)) return res.map((n) => ts.visitEachChild(n, visitor, context));

			return ts.visitEachChild(<T>res, visitor, context);
		};
		return (sf) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const helpers = <IHelpers>helpersFor(sf, context);
			customContext = { factory: context.factory, sourceFile: sf, ...helpers };
			return ts.visitEachChild(sf, visitor, context);
		};
	};
};

export const finalTransformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
	return (sf) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { sourceFileTransformer } = helpersFor(sf, context);
		return sourceFileTransformer(sf);
	};
};
