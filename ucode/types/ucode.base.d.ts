/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-shadow-restricted-names */
/* eslint-disable @typescript-eslint/no-empty-interface */
/// <reference no-default-lib="true"/>

// necessary code for ts to work

// so that for/of works
interface SymbolConstructor {
  readonly iterator: unique symbol;
  readonly __brand: unique symbol;
}
declare var Symbol: SymbolConstructor;
interface IteratorYieldResult<TYield> {
  done?: false;
  value: TYield;
}
interface IteratorReturnResult<TReturn> {
  done: true;
  value: TReturn;
}
type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;
interface Iterator<T, TReturn = any, TNext = undefined> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}
interface IterableIterator<T> extends Iterator<T> {
  [Symbol.iterator](): IterableIterator<T>;
}
// end of for/of

declare interface Array<T> {
  [Symbol.__brand]: 'array';
  [Symbol.iterator](): IterableIterator<T>;
  [n: number]: T;
}

declare interface Boolean {
  [Symbol.__brand]: 'bool';
}

declare interface Function {
  [Symbol.__brand]: 'function';
}

declare interface IArguments {
  [Symbol.__brand]: 'array';
  [Symbol.iterator](): IterableIterator<any>;
  [index: number]: any;
}

declare interface Number {
  [Symbol.__brand]: 'int' | 'double';
}

declare interface Object {
  [Symbol.__brand]: 'object';
  readonly constructor: {
    readonly name: string;
  };
  readonly name: string;
}
// to make decorator works
interface ObjectConstructor {
  readonly prototype: Object;
  getOwnPropertyDescriptor(o: any, p: PropertyKey): PropertyDescriptor | null;
  defineProperty<T>(o: T, p: PropertyKey, attributes: PropertyDescriptor): T;
}
declare var Object: ObjectConstructor;

declare interface RegExp {
  [Symbol.__brand]: 'regexp';
}

declare interface String {
  [Symbol.__brand]: 'string';
}

declare interface CallableFunction extends Function {}
declare interface NewableFunction extends Function {}

declare type PropertyKey = string;

interface PropertyDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  get?(): any;
  set?(v: any): void;
  value?: any;
  writable?: boolean;
}

declare interface TypedPropertyDescriptor<T> {
  configurable?: boolean;
  enumerable?: boolean;
  get?: () => T;
  set?: (value: T) => void;
  value?: T;
  writable?: boolean;
}

declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string) => void;
declare type MethodDecorator = <T>(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void;
declare type ParameterDecorator = (
  target: Object,
  propertyKey: string,
  parameterIndex: number,
) => void;

declare var NaN: number;
declare var Infinity: number;

// taken from typescript lib.es5.d.ts, couldn't find a way to use them directly from there without import...

/**
 * Make all properties in T optional
 */
declare type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties in T required
 */
declare type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Make all properties in T readonly
 */
declare type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * From T, pick a set of properties whose keys are in the union K
 */
declare type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Construct a type with a set of properties K of type T
 */
declare type Record<K extends keyof any, T> = {
  [P in K]: T;
};

/**
 * Exclude from T those types that are assignable to U
 */
declare type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
declare type Extract<T, U> = T extends U ? T : never;

/**
 * Construct a type with the properties of T except for those in type K.
 */
declare type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

/**
 * Exclude null and undefined from T
 */
declare type NonNullable<T> = T & {};

/**
 * Obtain the parameters of a function type in a tuple
 */
declare type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
  ? P
  : never;

/**
 * Obtain the parameters of a constructor function type in a tuple
 */
declare type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

/**
 * Obtain the return type of a function type
 */
declare type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : any;

/**
 * Obtain the return type of a constructor function type
 */
declare type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : any;

/**
 * Convert string literal type to uppercase
 */
declare type Uppercase<S extends string> = intrinsic;

/**
 * Convert string literal type to lowercase
 */
declare type Lowercase<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to uppercase
 */
declare type Capitalize<S extends string> = intrinsic;

/**
 * Convert first character of string literal type to lowercase
 */
declare type Uncapitalize<S extends string> = intrinsic;

/**
 * Marker for contextual 'this' type
 */
interface ThisType<T> {}
