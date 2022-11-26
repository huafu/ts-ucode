declare interface Global {
	[key: str]: any;
}
declare const global: Global;

declare interface CompilerOptions {
	lstrip_blocks?: bool;
	trim_block?: bool;
	strict_declarations?: bool;
	raw_mode?: bool;
	module_search_path?: str[];
	force_dynlink_list?: str[];
}

declare interface ErrorFunction {
	(code: true): int;
	(code?: false): str;
}

declare interface Env {
	[K: str]: str;
}

declare type DateTimeSpec = {
	sec: int;
	min: int;
	hour: int;
	mday: int;
	mon: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
	year: int;
	wday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
	yday: int;
	isdst: 0 | 1;
};

declare function require(mod: str): any;

declare function abs(val: numeric): num;
declare function atan2(x: numeric, y: numeric): num;
declare function chr(...n: int[]): str;
declare function cos(x: numeric): num;
declare function die(msg: any): never;
declare function exists<T extends obj>(obj: T, key: keyof T | str): key is keyof T;
declare function exit(code: int): never;
declare function exp(n: numeric): num;
declare function filter<T>(
	arr: uc_array<T>,
	fn: (val: T, idx: int, arr: array<T>) => bool
): array<T>;
declare function getenv(name: keyof Env): null | str;
declare function getenv(): Env;
declare function hex(x: str): num;
declare function index<T>(arr: uc_array<T>, needle: any): int;
declare function index(str: str, needle: any): int;
declare function int(x: any): int;
declare function join(sep: str, arr: array): str;
declare function keys<T>(obj: T): (keyof T)[];
declare function lc(str: str): str;
declare function length(str: str | array | obj): int;
declare function log(x: any): num;
declare function ltrim(str: str, c?: str): str;
declare function map<T, R>(arr: uc_array<T>, fn: (val: T, idx: int, arr: T[]) => R): R[];
declare function ord(str: str, offset?: int): int | null;
declare function pop<T>(arr: T[]): T | null;
declare function print(...args: any[]): int;
declare function push<T>(arr: T[], ...items: T[]): T;
declare function rand(): num;
declare function reverse<T>(arr: T[]): T[];
declare function reverse(str: str): str;
declare function rindex<T>(arr: uc_array<T>, needle: any): int;
declare function rindex(str: str, needle: any): int;
declare function rtrim(str: str, c?: str): str;
declare function shift<T>(arr: T[]): T | null;
declare function sin(x: numeric): num;
declare function slice<T>(arr: T[], offset?: int | nil, end?: int): T[];
declare function sort<T>(arr: T[], sort_fn?: (lhs: T, rhs: T) => int): T[];
declare function splice<T>(arr: T[], offset: int, len: int, ...items: T[]): T | null;
declare function split(str: str, sep: str | regexp, limit?: int): str[];
declare function sqrt(x: numeric): num;
declare function srand(n: numeric): null;
declare function substr(str: str, offset: int, len?: int): str;
declare function time(): int;
declare function trim(str: str, c?: str): str;
declare function type<T>(x: T): UcNameOfJsType<T>;
declare function uchr(...n: int[]): str;
declare function uc(str: str): str;
declare function unshift<T>(arr: T[], ...items: T[]): T;
declare function values<T>(obj: obj<T>): T[];
declare function printf(fmt: str, ...args: any[]): int;
declare function sprintf(fmt: str, ...args: any[]): str;
declare function match(str: str, pattern: regexp): str[] | str[][] | null;
declare function replace(str: str, pattern: regexp | str, replace: str, limit?: int): str;
declare function replace(
	str: str,
	pattern: regexp | str,
	replace: (match: str, ...capture_block: str[]) => str,
	limit?: int
): str;
declare function json(str: str): any;
declare function include(path: str, scope?: obj): null;
declare function warn(...ars: any[]): int;
declare function system(cmd: str | (str | num)[], timeout_ms?: numeric): int;
declare function trace(level?: int): null;
declare function proto(val: obj): obj | null;
declare function proto<T extends obj, P extends obj>(
	val: T & ThisType<Omit<P, keyof T>, T>,
	proto: P & ThisType<Omit<P, keyof T>, T>
): Omit<P, keyof T> & T;
declare function sleep(ms: int): bool;
declare function assert(cond: bool, msg?: str): void | never;
declare function render(path: str, scope?: object): str;
declare function render<A>(fn: (...args: A[]) => any, ...args: A[]): str;
declare function regexp(source: str, flags?: str): regexp;
declare function wildcard(subject: str, pattern: str, ignore_case?: bool): bool;
declare function sourcepath(depth?: int | null, dironly?: bool): str | null;
declare function min<T>(...val: T[]): T;
declare function max<T>(...val: T[]): T;
declare function b64dec(str: str): str | null;
declare function b64enc(str: str): str | null;
declare function uniq<T>(arr: T[]): T[];
declare function localtime(timestamp?: numeric): DateTimeSpec;
declare function gmtime(timestamp?: numeric): DateTimeSpec;
declare function timelocal(time: DateTimeSpec): int;
declare function timegm(time: DateTimeSpec): int;
declare function clock(monotonic?: bool): [int, int];
declare function hexdec(hex_str: str, skip_chars?: str): str;
declare function hexenc(val: str): str;
declare function gc(op?: 'coolect'): true;
declare function gc(op: 'start', interval?: int): bool;
declare function gc(op: 'stop'): bool;
declare function gc(op: 'count'): int;
declare function loadstring(code: str, options?: CompilerOptions): (...args: any[]) => any;
declare function loadstring(code: str, options: CompilerOptions & { raw_mode: false }): () => str;
declare function loadfile(path: str, options?: CompilerOptions): (...args: any[]) => any;
declare function loadfile(path: str, options: CompilerOptions & { raw_mode: false }): () => str;
declare function call<A, R>(
	fn: (...args: A[]) => R,
	ctx?: obj | null,
	scope?: obj | null,
	...args: A[]
): R;

declare const ARGV: str[];
