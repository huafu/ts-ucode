declare module 'math' {
	export function abs(n: str): int | double;
	export function abs(n: double): double;
	export function abs(n: int): int;
	export function atan2(d1: double, d2: double): double;
	export function cos(n: double): double;
	export function exp(n: double): double;
	export function log(n: double): double;
	export function sin(n: double): double;
	export function sqrt(n: double): double;
	export function pow(x: double, y: double): double;
	export function rand(): int;
	export function srand(v: int): void;
}