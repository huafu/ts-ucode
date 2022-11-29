import { mkdir, writeFile } from 'fs/promises';
import { basename, dirname, resolve } from 'path';

import type { Linter } from 'eslint';
import { ESLint } from 'eslint';
import ts from 'typescript';
import type { Mutable } from 'utility-types';

import { getPrinter } from './debug';
import transformers from './transformers';

const console = getPrinter();

const COMPILER_CONFIG: ts.CompilerOptions = {
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
  typeRoots: [],
  strict: true,
  skipLibCheck: true,
  alwaysStrict: false,
};

const LINTER_CONFIG: Linter.Config = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  extends: 'eslint:recommended',
  rules: {
    'no-unsafe-finally': 'off',
    'no-native-reassign': 'off',
    complexity: ['off', 11],
    'require-yield': 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'never'],
    indent: ['error', 'tab'],
  },
};

type CodeFixer = (filePath: string, code: string) => Promise<string>;

const createFixer = (cwd: string): CodeFixer => {
  const eslint = new ESLint({ fix: true, useEslintrc: false, cwd, baseConfig: LINTER_CONFIG });
  const fixCode = async (filePath: string, code: string): Promise<string> => {
    const results = await eslint.lintText(code, { filePath });
    if (results.length !== 1)
      throw new Error(`ESLint error on ${filePath}: results length is ${results.length}`);
    const [res] = results;
    if (res.fatalErrorCount > 0) {
      const errors = res.messages.filter((m) => m.fatal);
      let _line = 0;
      const line = () => `${++_line}`.padStart(3, ' ');
      console.debug(
        `\n---\n${filePath}:\n${code
          .split('\n')
          .map((l) => `${line()} | ${l}`)
          .join('\n')}\n---\n`,
      );
      for (let error of errors) {
        console.debug(`${error.line}:${error.column} ${error.message}`);
      }
      throw new Error(`ESLint error on ${filePath}: ${errors[0].message}`);
    }
    for (let msg of res.messages) {
      console.debug(`[eslint:fix] ${msg.message}`);
    }
    return res.output ?? code;
  };
  return fixCode;
};

class UcodeFile {
  protected fixed = false;
  protected written = false;
  readonly targetDir: string;
  readonly targetFile: string;
  readonly targetPath: string;

  constructor(
    readonly project: UcodeProject,
    readonly originalPath: string,
    readonly content: string,
  ) {
    this.targetPath = originalPath.replace(/\.js$/, '.uc');
    this.targetDir = dirname(this.targetPath);
    this.targetFile = basename(this.targetPath);
  }

  async fix(): Promise<this> {
    if (!this.fixed) {
      (<Mutable<this>>this).content = await this.project.fixer(this.targetPath, this.content);
      this.fixed = true;
    }
    return this;
  }
  get isFixed() {
    return this.fixed;
  }

  async ensureDirExists(): Promise<this> {
    if (!this.project.isDirCreated(this.targetDir)) {
      await this.project.ensureDirExists(this.targetDir);
    }
    return this;
  }
  get isDirCreated() {
    return this.project.isDirCreated(this.targetDir);
  }

  async write(): Promise<this> {
    if (this.written) return this;
    await this.fix();
    await this.ensureDirExists();
    await writeFile(this.targetPath, this.content, { encoding: 'utf-8' });
    this.written = true;
    return this;
  }
  get isWritten() {
    return this.written;
  }
}

class UcodeProject {
  protected files: Record<string, UcodeFile>;
  protected createdDirs: Set<string>;

  readonly fixer: CodeFixer;
  readonly tsFileWriter: ts.WriteFileCallback;

  constructor(readonly rootDir: string) {
    this.files = {};
    this.fixer = createFixer(rootDir);
    this.createdDirs = new Set<string>();
    this.tsFileWriter = (fileName: string, text: string) => {
      this.files[fileName] = new UcodeFile(this, fileName, text);
    };
  }

  isDirCreated(dir: string) {
    return this.createdDirs.has(dir);
  }

  async ensureDirExists(path: string): Promise<this> {
    if (!this.createdDirs.has(path)) {
      await mkdir(path, { recursive: true });
      this.createdDirs.add(path);
    }
    return this;
  }

  async persist(): Promise<this> {
    const files = Object.values(this.files);
    // first fix all
    await Promise.race(files.map((file) => file.fix()));
    // then create all dirs (no race on this one)
    await Promise.all(files.map((file) => file.ensureDirExists()));
    // finally save all
    await Promise.race(files.map((file) => file.write()));

    return this;
  }
}

export const compile = async (sourceDir: string, targetDir: string): Promise<void> => {
  const cfg = ts.parseJsonConfigFileContent(
    {
      compilerOptions: <ts.CompilerOptions>{
        ...COMPILER_CONFIG,
        rootDir: sourceDir,
        outDir: targetDir,
      },
      include: [resolve(__dirname, '..', 'ucode', 'types'), sourceDir],
    },
    ts.sys,
    process.cwd(),
  );
  // ensure correct compiler options
  cfg.options = { ...cfg.options, ...COMPILER_CONFIG };

  // create the project instance
  const project = new UcodeProject(sourceDir);

  // create the compiler host
  const host = ts.createCompilerHost(cfg.options);
  host.writeFile = project.tsFileWriter;

  // create the ts program
  const program = ts.createProgram(cfg.fileNames, cfg.options, host);

  // emit files in memory
  const emitResult = program.emit(undefined, undefined, undefined, undefined, transformers);

  // show diagnostics
  const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        <number>diagnostic.start,
      );
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
    }
  });

  if (!emitResult.emitSkipped) {
    // fix and write files
    await project.persist();
  }

  let exitCode = emitResult.emitSkipped ? 1 : 0;
  process.exit(exitCode);
};
