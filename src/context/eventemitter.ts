// simple event emitter
export class MyEventEmitter {
  private handlers: { [listener: string]: Function[] } = {};

  // allows duplicates
  on(event: string, handler: Function) {
    if (this.handlers[event] === undefined) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  emit(event: string, ...params: any[]) {
    for (let handler of this.handlers[event]) {
      handler.apply(this, params);
    }
  }
}
