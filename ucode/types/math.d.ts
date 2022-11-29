/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ucode.d.ts" />

declare module 'math' {
  export function abs(n: double): double;
  export function abs(n: int): int;
  export function abs(n: str): int | double;
  export function atan2(d1: double, d2: double): double;
  export function cos(n: double): double;
  export function exp(n: double): double;
  export function log(n: double): double;
  export function pow(x: double, y: double): double;
  export function rand(): int;
  export function sin(n: double): double;
  export function sqrt(n: double): double;
  export function srand(v: int): void;
}
