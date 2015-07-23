/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';

export class App {
  /** Gets application's frame time (duration per frame in 100ns unit) */
  getFrametime(): Promise<string> {
    return new Promise(resolve => {
      iApp.get('frametime').then(val => {
        resolve(val);
      });
    });
  }
}

