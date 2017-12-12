import {Remote} from '../internal/remote'

// simple event emitter
export class EventEmitter {
  private _handlers: { [listener: string]: Function[] } = {};
  static _remoteHandlers = {};
  static _proxyHandlers = {};

  /** This function attaches a handler to an event. Duplicate handlers are allowed. */
  on(event: string, handler: Function, _id?: string) {
    if (Remote.remoteType === 'remote') {
      let id = _id ? _id : new Date().getTime() + '_' + Math.floor(Math.random()*1000)
      let message = {
        event,
        id,
        type: 'event-emitter'
      }
      if (EventEmitter._remoteHandlers[id] === undefined) {
        EventEmitter._remoteHandlers[id] = [];
      }
      EventEmitter._remoteHandlers[id].push(handler)
      Remote.sendMessage(encodeURIComponent(JSON.stringify(message)))
    } else if (Remote.remoteType === 'proxy') {
      if (EventEmitter._proxyHandlers[_id] === undefined) {
        EventEmitter._proxyHandlers[_id] = [];
      }
      EventEmitter._proxyHandlers[_id].push(handler)
    } else {
      if (this._handlers[event] === undefined) {
        this._handlers[event] = [];
      }
      this._handlers[event].push(handler);
    }
  }

  /** This function removes a handler to an event.*/
  off(event: string, handler: Function) {
    if (Remote.remoteType === 'remote') {
      if (EventEmitter._remoteHandlers[event] !== undefined) {
        for (var i = EventEmitter._remoteHandlers[event].length - 1; i >= 0; i--) {
          if (EventEmitter._remoteHandlers[event][i] === handler) {
            EventEmitter._remoteHandlers[event].splice(i, 1);
          }
        }
      }
    } else if (Remote.remoteType === 'proxy') {
      if (EventEmitter._proxyHandlers[event] !== undefined) {
        for (var i = EventEmitter._proxyHandlers[event].length - 1; i >= 0; i--) {
          if (EventEmitter._proxyHandlers[event][i] === handler) {
            EventEmitter._proxyHandlers[event].splice(i, 1);
          }
        }
      }
    } else {
      if (this._handlers[event] !== undefined) {
        for (var i = this._handlers[event].length - 1; i >= 0; i--) {
          if (this._handlers[event][i] === handler) {
            this._handlers[event].splice(i, 1);
          }
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
    } else if (Remote.remoteType === 'remote') {
      if (EventEmitter._remoteHandlers[event] === undefined) return;
      for (let handler of EventEmitter._remoteHandlers[event]) {
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

  static _setCallback(message:string) {
    return new Promise(resolve => {
      if (EventEmitter._proxyHandlers[message[0]] === undefined) {
          EventEmitter._proxyHandlers[message[0]] = [];
      }
      resolve (EventEmitter._proxyHandlers[message[0]].push(message[1]))
    })
  }

  static _finalCallback(message:string) {
    return new Promise(resolve => {
      const result = JSON.parse(decodeURIComponent(message));
      if (EventEmitter._remoteHandlers[result['id']] !== undefined) {
        for (let handler of EventEmitter._remoteHandlers[result['id']]) {
          handler.apply(this, [result['result']])
        }
      }
      resolve()
    })
  }
}