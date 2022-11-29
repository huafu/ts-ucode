/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference no-default-lib="true"/>
/// <reference path="./ubus.types.d.ts" />

declare module 'ubus' {
  // core types
  export type SubscribeCallback = () => any | void;

  export type IObjectCallInfo = {
    acl: {
      user: str;
      group: str;
      object?: str;
    };
    object: {
      id: int;
      name?: str;
      path?: str;
    };
    method?: str;
  };
  export type IObjectRequest<A extends IArgs, R extends obj | null> = {
    reply(data: R, code?: int): bool;
    error(code: int): bool;
    info: IObjectCallInfo;
    args: A;
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
    completed(): bool;
    abort(): bool;
  }

  export interface IObject {
    subscribed(): bool;
    notify(
      type: str,
      message?: obj,
      data_cb?: func,
      status_cb?: func,
      completion_cb?: func,
      timeout?: num,
    ): INotifier;
    remove(): bool;
  }

  export interface IObjectMethods<A extends IArgs, R extends obj> {
    [method_name: str]: {
      call: ObjectMethod<A, R>;
      args: A;
    };
  }

  export interface ISubscriber {
    subscribe(object: str): bool;
    unsubscribe(object: str): bool;
    remove(): bool;
  }

  export interface ISubscriberRequest<T = any> {
    type: str;
    data: T;
    info: IObjectCallInfo;
  }

  export type SubscriberNotifyCallback = (req: ISubscriberRequest) => any;

  export type SubscriberRemoveCallback = () => null;

  export type DeferredReplyCallback<T = any> = (data?: T) => null;

  export interface IDeferred {
    completed(): bool;
    abort(): bool;
  }

  export interface IConnection {
    list(): str[];
    list(object: str): obj;

    call(object: str, method: str, args?: any): obj | null;

    defer(object: str, method: str, args?: obj, reply_cb?: DeferredReplyCallback): IDeferred;

    publish(
      object: str,
      methods: IObjectMethods<any, any>,
      subscribe_cb?: SubscribeCallback,
    ): IObject;
    publish(object: str, methods: null, subscribe_cb: SubscribeCallback): IObject;

    remove(item: ISubscriber | IObject | IListener): bool;

    listener(type_pattern: str, callback: ListenerCallback): IListener;

    subscriber(
      notify_cb: SubscriberNotifyCallback,
      remove_cb: SubscriberRemoveCallback,
    ): ISubscriber;

    event(type: str, data?: obj): bool;

    error: ErrorFunction;

    disconnect(): bool;
  }

  export function connect(socket?: str, timeout?: num): IConnection;
  export const error: ErrorFunction;
}
