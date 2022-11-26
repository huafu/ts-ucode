declare module 'uloop' {
	export const ULOOP_READ: int;
	export const ULOOP_WRITE: int;
	export const ULOOP_EDGE_TRIGGER: int;
	export const ULOOP_BLOCKING: int;

	export type ITimer = {
		set(timeout_ms: int): bool;
		remaining(): int;
		cancel(): bool;
	};

	export type IHandle = {
		fileno(): int;
		// FIXME: https://github.com/jow-/ucode/blob/d64d5d685d86b38dda8a314b7d1404633e26b346/lib/uloop.c#L309
		handle(): any;
		delete(): bool;
	};

	export type IProcess = {
		pid(): int;
		delete(): bool;
	};

	export type IPipe = {
		send(msg: str): bool;
		// XXX: https://github.com/jow-/ucode/blob/d64d5d685d86b38dda8a314b7d1404633e26b346/lib/uloop.c#L742
		receive(): str;
		sending(): bool;
		receiving(): bool;
	};
	export type TaskCallback = (pipe: IPipe) => void;
	export type TaskInputCallback = () => str;
	// FIXME: https://github.com/jow-/ucode/blob/d64d5d685d86b38dda8a314b7d1404633e26b346/lib/uloop.c#L1000
	export type TaskOutputCallback = (str: str) => any;
	export type ITask = {
		pid(): int;
		kill(): bool;
		finished(): bool;
	};

	export const error: ErrorFunction;
	export function init(): bool;
	export function run(timeout_ms?: int): int;
	export function timer(timeout_ms: int | null, callback?: () => void): ITimer;
	export function handle(fileno: int, callback: (flags: int) => void, flags?: int): IHandle;
	export function process(
		executable: str,
		args: array | null,
		env: obj | null,
		callback: (exit_code: int) => void
	): IProcess;

	export function task(
		func: TaskCallback | null,
		output_cb?: TaskOutputCallback | null,
		input_cb?: TaskInputCallback
	): ITask;

	export function cancelling(): bool;
	export function running(): bool;
	export function done(): bool;
	export function end(): void;
}
