// With sample usage of an external dependency: lodash
import get from 'lodash-es/get';

let _callbacks = {};

export function exec(fn: string, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    // @TODO: Add condition for remote thingy
    const xsplitFunction = get(window, ['external', fn]);
    if (typeof xsplitFunction !== 'function') {
      reject(new Error(`${fn} is not a valid external call, or is not supported on the target environment.`));
      return;
    }

    const ret: string = xsplitFunction(...args);

    _callbacks[ret] = (result) => {
      resolve(result);
    }
  });
}

const existingAsyncCallback = window.OnAsyncCallback;
window.OnAsyncCallback = (asyncId: string, result: string) => {
  if (typeof _callbacks[asyncId] === 'function') {
    _callbacks[asyncId](decodeURIComponent(result));
    delete _callbacks[asyncId];
  }

  if (typeof existingAsyncCallback === 'function') {
    existingAsyncCallback(asyncId, result);
  }
};
