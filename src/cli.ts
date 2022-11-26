/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const COMPILER_OPTIONS: ts.CompilerOptions = {
	keyofStringsOnly: true,
	forceConsistentCasingInFileNames: true,
	target: ts.ScriptTarget.ESNext,
	module: ts.ModuleKind.ES2015,
	moduleResolution: ts.ModuleResolutionKind.NodeJs,
	noLib: true,
	importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
	useDefineForClassFields: false,
	experimentalDecorators: true,
	noEmitHelpers: true,
	declaration: false,
	emitDeclarationOnly: false,
	typeRoots: []
};

export function compile(sourceDir: string, targetDir: string): void {
	const cfg = ts.parseJsonConfigFileContent(
		{
			compilerOptions: <ts.CompilerOptions>{
				...COMPILER_OPTIONS,
				rootDir: sourceDir,
				outDir: targetDir
			},
			include: [path.resolve(__dirname, '..', 'ucode', 'types'), sourceDir]
		},
		ts.sys,
		process.cwd()
	);
	const host = ts.createCompilerHost(cfg.options);

	// write .uc files and not .js ones
	host.writeFile = (fileName: string, contents: string) => {
		const file = fileName.replace(/\.js$/, '.uc');
		const dir = path.dirname(file);
		fs.mkdirSync(dir, { recursive: true });
		return fs.writeFileSync(file, contents, { encoding: 'utf-8' });
	};

	const program = ts.createProgram(cfg.fileNames, cfg.options, host);
	const transformers: ts.CustomTransformers = {};
	const emitResult = program.emit(undefined, undefined, undefined, undefined, transformers);

	let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

	allDiagnostics.forEach((diagnostic) => {
		if (diagnostic.file) {
			let { line, character } = ts.getLineAndCharacterOfPosition(
				diagnostic.file,
				diagnostic.start!
			);
			let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
			console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
		} else {
			console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
		}
	});

	let exitCode = emitResult.emitSkipped ? 1 : 0;
	process.exit(exitCode);
}

export const init = () => {
	const dir = process.cwd();
	fs.copyFileSync(
		path.resolve(__dirname, '..', 'ucode', 'package.template.json'),
		path.resolve(dir, 'package.json')
	);
	fs.copyFileSync(
		path.resolve(__dirname, '..', 'ucode', 'tsconfig.template.json'),
		path.resolve(dir, 'tsconfig.json')
	);
	console.log(
		"Don't forget to run `npm install` so that you get typings and good completion in your IDE"
	);
};

export const run = () => {
	const args = process.argv.slice(2);

	if (args.length === 1 && args[0] === 'init') {
		return init();
	}

	const cwd = process.cwd();
	const firstArgIsDir =
		args[0]?.length > 0 && fs.existsSync(args[0]) && fs.statSync(args[0]).isDirectory();
	const root = path.resolve(firstArgIsDir ? args[0] : args[0] ? path.dirname(args[0]) : cwd);
	let srcDir = args[0] ? root : undefined;
	const tsconfigFile = path.resolve(root, 'tsconfig.json');
	let defaultDstDir = path.resolve(root, 'out');
	let defaultSrcDir: string = root;

	if (fs.existsSync(tsconfigFile)) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const options = require(tsconfigFile).compilerOptions as ts.CompilerOptions | undefined;
		if (options?.rootDir) defaultSrcDir = path.resolve(root, options.rootDir);
		if (options?.outDir) defaultDstDir = path.resolve(root, options.outDir);
	}

	compile(srcDir ?? defaultSrcDir, args[1] ?? defaultDstDir);
};

if (require.main === module) run();
