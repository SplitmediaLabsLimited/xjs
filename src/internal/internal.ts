interface CallbackType {
  [asyncId: string]: any;
}

class Internal {
  private _callbacks: CallbackType = {};

  constructor() {
    const existingAsyncCallback = window.OnAsyncCallback;
    window.OnAsyncCallback = (asyncId: string, result: string) => {
      if (typeof this._callbacks[asyncId] === 'function') {
        this._callbacks[asyncId](decodeURIComponent(result));
        delete this._callbacks[asyncId];
      }

      if (typeof existingAsyncCallback === 'function') {
        existingAsyncCallback(asyncId, result);
      }
    };
  }

  exec(fn: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      // @TODO: Add condition for remote thingy
      if (
        window.external &&
        window.external[fn] &&
        typeof window.external[fn] !== 'function'
      ) {
        reject(
          new Error(
            `${fn} is not a valid external call, or is not supported on the target environment.`
          )
        );
        return;
      }

      const ret = window.external[fn](...args);

      this._callbacks[ret] = result => {
        resolve(result);
      };
    });
  }
}

export default Internal;
