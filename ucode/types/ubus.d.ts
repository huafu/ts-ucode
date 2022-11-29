/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ubus.types.d.ts" />

declare module 'ubus' {
  // core types
  export type SubscribeCallback = () => any | void;

  export type IObjectCallInfo = {
    acl: {
      group: str;
      object?: str;
      user: str;
    };
    method?: str;
    object: {
      id: int;
      name?: str;
      path?: str;
    };
  };
  export type IObjectRequest<A extends IArgs, R extends obj | null> = {
    args: A;
    error(code: int): bool;
    info: IObjectCallInfo;
    reply(data: R, code?: int): bool;
  };

  export type ObjectMethod<A extends IArgs, R extends obj | null> = (
    req: IObjectRequest<A, R>,
  ) => R | void;

  export type ListenerCallback<I = any, O extends any | void = any | void> = (
    type: str,
    data?: I,
  ) => O;

  export interface IListener {
    remove(): bool;
  }

  export interface INotifier {
    abort(): bool;
    completed(): bool;
  }

  export interface IObject {
    notify(
      type: str,
      message?: obj,
      data_cb?: func,
      status_cb?: func,
      completion_cb?: func,
      timeout?: num,
    ): INotifier;
    remove(): bool;
    subscribed(): bool;
  }

  export interface IObjectMethods<A extends IArgs, R extends obj> {
    [method_name: str]: {
      args: A;
      call: ObjectMethod<A, R>;
    };
  }

  export interface ISubscriber {
    remove(): bool;
    subscribe(object: str): bool;
    unsubscribe(object: str): bool;
  }

  export interface ISubscriberRequest<T = any> {
    data: T;
    info: IObjectCallInfo;
    type: str;
  }

  export type SubscriberNotifyCallback = (req: ISubscriberRequest) => any;

  export type SubscriberRemoveCallback = () => null;

  export type DeferredReplyCallback<T = any> = (data?: T) => null;

  export interface IDeferred {
    abort(): bool;
    completed(): bool;
  }

  export interface IConnection {
    call(object: str, method: str, args?: any): obj | null;
    defer(object: str, method: str, args?: obj, reply_cb?: DeferredReplyCallback): IDeferred;
    disconnect(): bool;
    event(type: str, data?: obj): bool;
    error: ErrorFunction;
    list(): str[];
    list(object: str): obj;
    listener(type_pattern: str, callback: ListenerCallback): IListener;
    publish(
      object: str,
      methods: IObjectMethods<any, any>,
      subscribe_cb?: SubscribeCallback,
    ): IObject;
    publish(object: str, methods: null, subscribe_cb: SubscribeCallback): IObject;
    remove(item: ISubscriber | IObject | IListener): bool;
    subscriber(
      notify_cb: SubscriberNotifyCallback,
      remove_cb: SubscriberRemoveCallback,
    ): ISubscriber;
  }

  export function connect(socket?: str, timeout?: num): IConnection;
  export const error: ErrorFunction;
}
