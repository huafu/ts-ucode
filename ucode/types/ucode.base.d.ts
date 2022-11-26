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
var Symbol: SymbolConstructor;
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
	readonly constructor: {
		readonly name: string;
	};
	readonly name: string;
	[Symbol.__brand]: 'object';
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
	value?: any;
	writable?: boolean;
	get?(): any;
	set?(v: any): void;
}

declare interface TypedPropertyDescriptor<T> {
	enumerable?: boolean;
	configurable?: boolean;
	writable?: boolean;
	value?: T;
	get?: () => T;
	set?: (value: T) => void;
}

declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string) => void;
declare type MethodDecorator = <T>(
	target: Object,
	propertyKey: string,
	descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;
declare type ParameterDecorator = (
	target: Object,
	propertyKey: string,
	parameterIndex: number
) => void;

declare var NaN: number;
declare var Infinity: number;
