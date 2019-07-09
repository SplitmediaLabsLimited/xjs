// With sample usage of an external dependency: lodash
import get from 'lodash/get';
let _callbacks = {};

export function exec(fn: string, ...args: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    // @TODO: Add condition for remote thingy
    const externalFunction = get(window, ['external', fn]);
    if (typeof externalFunction !== 'function') {
      reject(new Error(`${fn} is not a valid external call, or is not supported on the target environment.`));
      return;
    }

    const xsplitFunction: Function = window.external[fn];
    const ret: string = xsplitFunction(...args);

    _callbacks[ret] = (result) => {
      resolve(result);
    }
  });
}
