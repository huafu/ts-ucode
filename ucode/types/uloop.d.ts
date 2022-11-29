/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ucode.d.ts" />

declare module 'uloop' {
  export const ULOOP_READ: int;
  export const ULOOP_WRITE: int;
  export const ULOOP_EDGE_TRIGGER: int;
  export const ULOOP_BLOCKING: int;

  export type ITimer = {
    cancel(): bool;
    remaining(): int;
    set(timeout_ms: int): bool;
  };

  export type IHandle = {
    delete(): bool;
    fileno(): int;
    // FIXME: https://github.com/jow-/ucode/blob/d64d5d685d86b38dda8a314b7d1404633e26b346/lib/uloop.c#L309
    handle(): any;
  };

  export type IProcess = {
    delete(): bool;
    pid(): int;
  };

  export type IPipe = {
    // XXX: https://github.com/jow-/ucode/blob/d64d5d685d86b38dda8a314b7d1404633e26b346/lib/uloop.c#L742
    receive(): str;
    receiving(): bool;
    send(msg: str): bool;
    sending(): bool;
  };
  export type TaskCallback = (pipe: IPipe) => void;
  export type TaskInputCallback = () => str;
  // FIXME: https://github.com/jow-/ucode/blob/d64d5d685d86b38dda8a314b7d1404633e26b346/lib/uloop.c#L1000
  export type TaskOutputCallback = (str: str) => any;
  export type ITask = {
    finished(): bool;
    kill(): bool;
    pid(): int;
  };

  export const error: ErrorFunction;
  export function cancelling(): bool;
  export function done(): bool;
  export function end(): void;
  export function handle(fileno: int, callback: (flags: int) => void, flags?: int): IHandle;
  export function init(): bool;
  export function process(
    executable: str,
    args: array | null,
    env: obj | null,
    callback: (exit_code: int) => void,
  ): IProcess;
  export function run(timeout_ms?: int): int;
  export function running(): bool;
  export function task(
    func: TaskCallback | null,
    output_cb?: TaskOutputCallback | null,
    input_cb?: TaskInputCallback,
  ): ITask;
  export function timer(timeout_ms: int | null, callback?: () => void): ITimer;
}
