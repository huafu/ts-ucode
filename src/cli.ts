/* eslint-disable @typescript-eslint/no-non-null-assertion */
import fs from 'fs';
import path from 'path';
import type ts from 'typescript';

import { compile } from './compiler';

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

export const run = async () => {
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

	await compile(srcDir ?? defaultSrcDir, args[1] ?? defaultDstDir);
};

if (require.main === module) run().then(() => console.log('Done'));
