/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from './internal';
import {JSON as JXON} from './util/json';

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
        resolve(Number(ret) < 0 ? false : true);
      });
    });
  }

  /** Gets the value of the given property as list */
  static getAsList(name: string): Promise<JXON[]> {
    return new Promise(resolve => {
      App.get(name).then((xml: string) => {
        let propsJSON: JXON = JXON.parse(xml),
          propsArr: JXON[] = [];

        if (propsJSON.children && propsJSON.children.length > 0) {
          propsArr = propsJSON.children;
        }

        resolve(propsArr);
      });
    });
  }

  /** Get the value of the given global property */
  static getGlobalProperty(name: string): string {
    return exec('GetGlobalProperty', name);
  }

  /** Calls a DLL function synchronously */
  static callDll(func: string, ...arg: string[]): string {
    var args: any[] = [].slice.call(arguments);
    args.unshift('CallDll');
    return exec.apply(this, args);
  }

  /** Calls an application method asynchronously */
  static callFunc(func: string, arg: string): Promise<string> {
    return new Promise(resolve => {
      exec('AppCallFuncAsync', func, arg, (ret) => {
          resolve(ret);
      });
    });
  }

  static postMessage(key: string, ...args: any[]): Promise<string> {
    return new Promise(resolve => {
      args.unshift(key);
      args.unshift('PostMessageToParent');
      args.push(val => {
        resolve(val);
      });
      exec.apply(this, args);
    });
  }
}
