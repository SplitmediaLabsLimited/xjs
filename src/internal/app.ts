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
    return new Promise((resolve, reject) => {
      App.get(name).then((xml: string) => {        
        try {
          let propsJSON: JXON = JXON.parse(xml),
            propsArr: JXON[] = [];         
          
          if (propsJSON.children && propsJSON.children.length > 0) {
            propsArr = propsJSON.children;
          }

          resolve(propsArr);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /** Gets all the items of the given condition as list */
  static getAsItemList(name: string): Promise<JXON[]> {
    return new Promise((resolve, reject) => {      
      let propsArr: JXON[] = [];
      App.get(name).then((xml: string) => {
        try {
          let propsJSON: JXON = JXON.parse(xml)              
        
          const recursion = children => {            
            children.forEach(child => {
              if(child['tag'] === 'item') propsArr.push(child);
              //type 12 is considered as group and contains a wrapper placement for sub group items
              if(child['type'] === '12' && child.children && child.children.length > 0) {
                child.children.forEach(placement => {
                  if (placement['tag'] === 'placement' && placement.children && placement.children.length > 0) {
                    recursion(placement.children);
                  }
                });
              }
            });           
          };

          //this is when it is actually getting from presetConfig
          if(propsJSON['tag'] === 'configuration' && propsJSON.children && propsJSON.children.length > 0) {
            //this is actually getting from each scene
            propsJSON.children.forEach(placement => {
              if(placement['tag'] === 'placement' && placement.children && placement.children.length > 0) {
                recursion(placement.children);
              }
            });
          //assuming getting from a scene
          } else if (propsJSON['tag'] === 'placement' && propsJSON.children && propsJSON.children.length > 0) {
            recursion(propsJSON.children);
          }
          resolve(propsArr);
        } catch (e) {
          resolve(propsArr);
        }
      });
    });
  }

  /** Get the value of the given global property */
  static getGlobalProperty(name: string):Promise<any> {
    return new Promise(resolve => {
      exec('GetGlobalProperty', name).then(result => {
        resolve(result);
      })
    })
  }

  /** Calls a DLL function synchronously */
  static callDll(func: string, ...arg: string[]): Promise<string> {
    var args: any[] = [].slice.call(arguments);
    return new Promise(resolve => {
      args.unshift('CallDll');
      exec.apply(this, args).then(result => {
        resolve(result);
      });
    })
  }

  /** Calls an application method asynchronously */
  static callFunc(func: string, ...args: string[]): Promise<string> {
    return new Promise(resolve => {
      exec('AppCallFuncAsync', func, ...args, (ret) => {
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
