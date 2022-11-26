/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ucode.base.d.ts" />

declare const enum UcType {
	null = 0,
	integer = 1,
	boolean = 2,
	string = 3,
	double = 4,
	array = 5,
	object = 6,
	regexp = 7,
	function = 8
	// closure = 9,
	// upvalue = 10,
	// resource = 11,
	// program = 12,
	// source = 13
}

declare type UcTypeToJs<UC extends UcType> = UC extends UcType.null
	? nil
	: UC extends UcType.integer
	? int
	: UC extends UcType.boolean
	? bool
	: UC extends UcType.string
	? str
	: UC extends UcType.double
	? double
	: UC extends UcType.array
	? array
	: UC extends UcType.object
	? obj
	: UC extends UcType.regexp
	? regexp
	: UC extends UcType.function
	? func
	: never;

declare type UcTypeOfJs<T> = T extends nil
	? UcType.null
	: T extends int
	? UcType.integer
	: T extends bool
	? UcType.boolean
	: T extends str
	? UcType.string
	: T extends double
	? UcType.double
	: T extends array
	? UcType.array
	: T extends obj
	? UcType.object
	: T extends regexp
	? UcType.regexp
	: T extends func
	? UcType.function
	: never;

declare type UcTypeToName<UC extends UcType> = UC extends UcType.null
	? null
	: UC extends UcType.integer
	? 'int'
	: UC extends UcType.boolean
	? 'bool'
	: UC extends UcType.string
	? 'string'
	: UC extends UcType.double
	? 'double'
	: UC extends UcType.array
	? 'array'
	: UC extends UcType.object
	? 'object'
	: UC extends UcType.regexp
	? 'regexp'
	: UC extends UcType.function
	? 'function'
	: never;

declare type UcTypeOfName<UN extends UcTypeName> = UN extends null
	? UcType.null
	: UN extends 'int'
	? UcType.integer
	: UN extends 'bool'
	? UcType.boolean
	: UN extends 'string'
	? UcType.string
	: UN extends 'double'
	? UcType.double
	: UN extends 'array'
	? UcType.array
	: UN extends 'object'
	? UcType.object
	: UN extends 'regexp'
	? UcType.regexp
	: UN extends 'function'
	? UcType.function
	: never;

declare type UcNameOfJsType<T> = T extends int | double
	? 'int' | 'double'
	: T extends bool
	? 'bool'
	: T extends str
	? 'string'
	: T extends array
	? 'array'
	: T extends regexp
	? 'regexp'
	: T extends func
	? 'function'
	: T extends obj
	? 'object'
	: T extends nil
	? null
	: never;

declare type nil = null | undefined;
declare type obj<T = any> = Record<string, T>;
declare type bool = boolean;
declare type int = number;
declare type double = number;
declare type str = string;
declare type num = int | double;
declare type numeric = num | str;
declare type regexp = RegExp;
declare type array<T = any> = T[];
declare type func<A = any, R = any | never, T = any> = (this: T, ...args: A[]) => R;

declare type Exception = {
	type: str;
	message: str;
	stacktrace: {
		filename: str;
		line: int;
		byte: int;
		function?: str;
		context?: str;
	}[];
};

declare type UcTypeName = UcTypeToName<any>;

declare type uc_scalar = nil | bool | int | double | str | regexp;
declare type uc_any = uc_scalar | obj | array | func;

declare type uc_array<T> = {
	readonly [n: number]: T;
};

declare type $uc<js_type> = js_type extends null | undefined
	? nil
	: js_type extends (infer T)[]
	? array<T>
	: js_type extends (...args: any[]) => any
	? func
	: js_type extends true | false | boolean
	? bool
	: js_type extends number
	? num
	: js_type extends RegExp
	? regexp
	: js_type extends string
	? str
	: js_type extends object | Record<string, any>
	? obj
	: never;

/** fixes object types to transform optional props so that they can accept null as well */
declare type Nils<O extends obj> = {
	[Key in keyof O]: Key extends OptionalPropertiesOf<O> ? O[Key] | nil : O[Key];
};

declare type UcPartial<O extends obj> = Nils<Partial<O>>;

declare type NilsToOptionals<T extends obj> = Pick<T, NonNullablePropertiesOf<T>> & {
	[K in NullablePropertiesOf<T>]?: NonNullable<T[K]>;
};

declare type OptionalPropertiesOf<T extends obj> = Exclude<
	{
		[K in keyof T]: T extends Record<K, T[K]> ? never : K;
	}[keyof T],
	undefined
>;

declare type NullablePropertiesOf<T extends obj> = Exclude<
	{
		[K in keyof T]: T extends Record<K, T[K]> ? (null extends T[K] ? K : never) : K;
	}[keyof T],
	undefined
>;

declare type NonNullablePropertiesOf<T extends obj> = Exclude<
	{
		[K in keyof T]: T extends Record<K, T[K]> ? (null extends T[K] ? never : K) : never;
	}[keyof T],
	undefined
>;
