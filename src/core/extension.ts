/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from '../core/environment';
import {exec} from '../internal/internal';

export class Extension {
  private static _instance: Extension;
  private _presName: string;

  /**
   *  Gets the instance of the Extension class. Use this instead of the constructor.
   */
  static getInstance() {
    if (Extension._instance === undefined) {
      Extension._instance = new Extension();
    }
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
}
