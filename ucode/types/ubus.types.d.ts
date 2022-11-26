declare module 'ubus' {
	export type ubus_any = array | bool | double | int | obj | str;

	export type IArgs = obj<ubus_any>;
}
