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

export function compile(sourceDir: string, targetDir = `${sourceDir}/out/`): void {
	const cfg = ts.parseJsonConfigFileContent(
		{
			compilerOptions: <ts.CompilerOptions>{
				...COMPILER_OPTIONS,
				rootDir: sourceDir,
				outDir: targetDir
			},
			include: [path.resolve(__dirname, '..', 'ucode', 'types', '*')]
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
	console.log(`Process exiting with code '${exitCode}'.`);
	process.exit(exitCode);
}

export const run = () => {
	compile(process.argv[2] || process.cwd(), process.argv[3]);
};

if (require.main === module) run();
