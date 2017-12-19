/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from '../core/environment';
import {exec} from '../internal/internal';
import {App} from '../internal/app';
import {Remote} from '../internal/remote';
import window from '../util/window';

export class Extension {
  private static _instance: Extension;
  private _presName: string;
  static _proxyCallback = {};
  static _remoteCallback = {};

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
      Extension._instance._id = String(id);
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
        ).then(result => {
          resolve(this);
        })
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
   *  Get the extension id.
   */
  getId(handler?: Function): Promise<string> {
    return new Promise(resolve => {
      if(this._id === undefined) {
        if (Remote.remoteType === 'remote') {
          let message = {
            type: 'extWindow',
            instance: Extension._instance
          }
          Extension._remoteCallback['ExtensionWindowID'] = ({resolve});
          Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
        } else if (Remote.remoteType === 'proxy') {
          Extension._proxyCallback['ExtensionWindowID'] = handler;
          App.postMessage("8");
        } else {
          Extension._callback['ExtensionWindowID'] = ({resolve});
          App.postMessage("8");
        }
      } else {
        resolve(this._id);
      }
    })
  }

  static _finalCallback(message) {
    return new Promise(resolve => {
      const result = JSON.parse(decodeURIComponent(message));
      Extension._remoteCallback['ExtensionWindowID'].resolve(result['result']);
    })
  }
}

const oldSetid = window.Setid;
window.Setid = function(id) {
  if (Remote.remoteType === 'proxy') {
    if (Extension._proxyCallback['ExtensionWindowID'] === undefined) return;
    Extension._proxyCallback['ExtensionWindowID'].call(this, id);
  } else {
    Extension._callback['ExtensionWindowID'].resolve(id);
  }

  if (typeof oldSetid === 'function') {
    oldSetid(id)
  }
}
