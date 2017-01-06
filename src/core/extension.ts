/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from '../core/environment';
import {exec} from '../internal/internal';
import {App} from '../internal/app';

export class Extension {
  private static _instance: Extension;
  private _presName: string;

  static _callback = {};
  protected _id: string;


  /**
   *  Gets the instance of the Extension class. Use this instead of the constructor.
   */
  static getInstance() {
    if (Extension._instance === undefined) {
      Extension._instance = new Extension();
    }
    Extension._instance.getId().then(id => {
      Extension._instance._id = String(id)
    })
    return Extension._instance;
  }

  constructor() {
    if (Environment.isExtension()) {
      this._presName = window.location.href;
    } else {
      throw new Error('Extension class can only be used on Extension Plugins');
    }
  }

  /**
   * param: (configObj: JSON)
   * ```
   * return: Promise<ExtensionWindow|Error>
   * ```
   *
   * Save the configuration object to the presentation
   */
  saveConfig(configObj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if ({}.toString.call(configObj) === '[object Object]') {
        exec(
          'SetPresProperty',
          this._presName,
          JSON.stringify(configObj)
        );
        resolve(this);
      } else {
        reject(Error('Configuration object should be in JSON format'));
      }
    });
  }

  /**
   * return: Promise<JSON>
   *
   * Get the saved configuration from the presentation
   */
  loadConfig(): Promise<any> {
    return new Promise(resolve => {
      exec('GetPresProperty', this._presName, config => {
        let configObj = config === '' ? {} : JSON.parse(config);
        resolve(configObj);
      });
    });
  }

  /**
   *  return: Promise<string>
   *
   * Get's the extensions id.
   */
  getId(): Promise<string> {
    return new Promise(resolve => {
      if(this._id === undefined) {
        App.postMessage("8")
        Extension._callback['ExtensionWindowID'] = ({resolve})
      } else {
        resolve(this._id)
      }
    })
  }
}

window.Setid = function(id) {
    Extension._callback['ExtensionWindowID'].resolve(id);
  }
