/// <reference path="../../defs/_references.ts" />

import exec from './internal';

var POSTMESSAGE_CLOSE: string = '1';
var POSTMESSAGE_SIZE: string = '2';

export class App {
  /** Get the value of the given property */
  static get(name: string): Promise<string> {
    return new Promise(resolve => {
      exec('AppGetPropertyAsync', name, resolve);
    });
  }

  /** Sets the value of a property */
  static set(name: string, value: string): Promise<Boolean> {
    return new Promise(resolve => {
        exec('AppSetPropertyAsync', name, value, ret => {
          resolve(ret === '0' ? false : true);
        });
    });
  }
}
