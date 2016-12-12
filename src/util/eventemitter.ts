// simple event emitter
export class EventEmitter {
  private _handlers: { [listener: string]: Function[] } = {};

  /** This function attaches a handler to an event. Duplicate handlers are allowed. */
  on(event: string, handler: Function) {
    if (this._handlers[event] === undefined) {
      this._handlers[event] = [];
    }
    this._handlers[event].push(handler);
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
    if (this._handlers[event] === undefined) {
      return;
    }

    for (let handler of this._handlers[event]) {
      handler.apply(this, params);
    }
  }
}