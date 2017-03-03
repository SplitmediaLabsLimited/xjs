import {Remote} from '../internal/remote'

// simple event emitter
export class EventEmitter {
  private _handlers: { [listener: string]: Function[] } = {};
  static _remoteHandlers = {};
  static _proxyHandlers = {};

  /** This function attaches a handler to an event. Duplicate handlers are allowed. */
  on(event: string, handler: Function) {
    if (Remote.remoteType === 'remote') {
      let message = {
        event,
        type: 'event-emitter'
      }
      if (EventEmitter._remoteHandlers[event] === undefined) {
        EventEmitter._remoteHandlers[event] = [];
      }
      EventEmitter._remoteHandlers[event].push(handler)
      Remote.sendMessage(encodeURIComponent(JSON.stringify(message)))
    } else if (Remote.remoteType === 'proxy') {
      if (EventEmitter._proxyHandlers[event] === undefined) {
        EventEmitter._proxyHandlers[event] = [];
      }
      EventEmitter._proxyHandlers[event].push(handler)
    } else {
      if (this._handlers[event] === undefined) {
        this._handlers[event] = [];
      }
      this._handlers[event].push(handler);
    }
  }

  off(event: string, handler: Function) {
    if (this._handlers[event] !== undefined) {
      for (var i = this._handlers[event].length - 1; i >= 0; i--) {
        if (this._handlers[event][i] === handler) {
          this._handlers[event].splice(i, 1);
        }
      }
    }
  }

  /** This function lets an event trigger with any number of supplied parameters. */
  emit(event: string, ...params: any[]) {
    if (Remote.remoteType === 'proxy') {
      if (EventEmitter._proxyHandlers[event] === undefined) {
        return;
      }
      for (let handler of EventEmitter._proxyHandlers[event]) {
        handler.apply(this, params);
      }
    } else {
      if (this._handlers[event] === undefined) {
        return;
      }

      for (let handler of this._handlers[event]) {
        handler.apply(this, params);
      }
    }
  }

  static setCallback(message:string) {
    return new Promise(resolve => {
      if (EventEmitter._proxyHandlers[message[0]] === undefined) {
          EventEmitter._proxyHandlers[message[0]] = [];
      }
      resolve (EventEmitter._proxyHandlers[message[0]].push(message[1]))
    })
  }

  static finalCallback(message:string) {
    return new Promise(resolve => {
      const result = JSON.parse(decodeURIComponent(message));
      for (let handler of EventEmitter._remoteHandlers[result['event']]) {
        handler.apply(this, [result['result']])
      }
      resolve()
    })
  }
}