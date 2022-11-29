/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ucode.d.ts" />

declare module 'ubus' {
  export type IArgs = obj<ubus_any>;
  export type ubus_any = array | bool | double | int | obj | str;
}
