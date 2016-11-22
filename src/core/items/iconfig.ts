/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Global} from '../../internal/global';
import {exec} from '../../internal/internal';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger'

export interface IItemConfigurable {

  /**
   * return: Promise<any>
   *
   * Gets the configuration JSON
   */
  loadConfig(): Promise<any>;

  /**
   * param: config<JSON>
   *
   * Persists a JSON object for configuration. Available to items only.
   *
   * *Chainable.*
   */
  saveConfig(configObj: any);

  /**
   * param: config<JSON>
   *
   * Requests the item to save a configuration. This makes the item emit the save-config event.
   *
   * *Chainable.*
   */
  requestSaveConfig(configObj: any);

  /**
   * param: config<JSON>
   *
   * Requests the item to save a configuration. This makes the item emit the apply-config event.
   *
   * *Chainable.*
   */
  applyConfig(configObj: any);
}

export class ItemConfigurable {
  private _id: string;
  private _srcId: string;
  protected _isItemCall: boolean;

  loadConfig(): Promise<any> {
    let called: boolean = false;
    if(this._isItemCall) {
      Logger.warn('loadConfig', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:BrowserConfiguration', this._id).then(
        config => {
          let configObj = config === 'null' ? {} : JSON.parse(config);
          let persist = Global.getPersistentConfig();
          for (var key in persist) {
            delete configObj[key];
          }
          resolve(configObj);
        });
    });
  }

  saveConfig(configObj: any): Promise<any> {
    if(this._isItemCall){
      Logger.warn('saveConfig', true)
    }
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin) {
        let slot = iItem.attach(this._id);
        let savingAllowed = false;
        iItem.get('prop:srcid').then(srcId => {
          if (typeof srcId !== 'string' || srcId === '') {
            // version is lower than 2.8
            savingAllowed = (slot === 0);
          } else {
            savingAllowed = srcId === this._srcId;
          }

          // only allow direct saving for self
          if (savingAllowed) {
            // check for valid object
            if ({}.toString.call(configObj) === '[object Object]') {
              // add persisted configuration if available
              // currently only top level merging is available
              let persist = Global.getPersistentConfig();
              for (var key in persist) {
                configObj[key] = persist[key];
              }
              exec('SetBrowserProperty', 'Configuration',
                JSON.stringify(configObj));
              resolve(this);
            } else {
              reject(Error('Configuration object should be ' +
                'in JSON format.'));
            }
          } else {
            reject(Error('Items may only request other ' +
              'Items to save a configuration. Consider ' +
              'calling requestSaveConfig() on this Item ' +
              'instance instead.'));
          }
        });
      } else {
        reject(Error(
          'Extensions and source properties windows are ' +
          'not allowed to directly save configuration objects. ' +
          'Call requestSaveConfig() instead.'));
      }
    });
  }

  requestSaveConfig(configObj: any): Promise<any> {
    return new Promise(resolve=> {
      let slot = iItem.attach(this._id);

      exec('CallInner' + (slot === 0 ? '' : (slot + 1)),
          'MessageSource', JSON.stringify({
              'request': 'saveConfig',
              'data': configObj
          }));

      resolve(this);
    });
  }

  applyConfig(configObj: any): Promise<any> {
    return new Promise(resolve=> {
      let slot = iItem.attach(this._id);

      exec('CallInner' + (slot === 0 ? '' : (slot + 1)),
          'MessageSource', JSON.stringify({
              'request': 'applyConfig',
              'data': configObj
          }));

      resolve(this);
    });
  }

}
