/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Global} from '../../internal/global';
import {exec} from '../../internal/internal';
import {Environment} from '../environment';

export interface IItemConfigurable {
  loadConfig(): Promise<any>;
  saveConfig(configObj: any);
  requestSaveConfig(configObj: any);
  applyConfig(configObj: any);
}

export class ItemConfigurable {
  private _id: string;

  loadConfig(): Promise<any> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:BrowserConfiguration', slot).then(
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
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin) {
        let slot = iItem.attach(this._id);
        // only allow direct saving for self
        if (slot === 0) {
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
            reject(Error('Sources may only request other ' +
              'sources to save a configuration. Consider ' +
              'calling requestSaveConfig() on this Item ' +
              'instance instead.'));
          }
        } else {
          reject(Error(
            'Extensions and source configuration windows are ' +
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
