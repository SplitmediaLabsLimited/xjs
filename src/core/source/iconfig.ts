/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Global} from '../../internal/global';
import {exec} from '../../internal/internal';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger'

export interface ISourceConfigurable {

  /**
   * return: Promise<any>
   *
   * Gets the configuration JSON
   */
  loadConfig(): Promise<any>;

  /**
   * param: config<JSON>
   *
   * Persists a JSON object for configuration. Available to sources only.
   *
   * *Chainable.*
   */
  saveConfig(configObj: any);

  /**
   * param: config<JSON>
   *
   * Requests the source to save a configuration. This makes the source emit
   * the save-config event.
   *
   * *Chainable.*
   */
  requestSaveConfig(configObj: any);

  /**
   * param: config<JSON>
   *
   * Requests the source to save a configuration. This makes the source emit
   * the apply-config event.
   *
   * *Chainable.*
   */
  applyConfig(configObj: any);
}

export class SourceConfigurable {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  loadConfig(): Promise<any> {
    let called: boolean = false;
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'loadConfig',  true)
        this._checkPromise = iItem.get('prop:BrowserConfiguration', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:BrowserConfiguration', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(
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
      Logger.warn('sourceWarning', 'saveConfig', true)
    }
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin) {
        let slot;
        let savingAllowed = false;
        iItem.attach(this._id).then(res => {
          slot = res;
          return iItem.get('prop:srcid');
        }).then(srcId => {
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
            reject(Error('Sources may only request other ' +
              'Sources to save a configuration. Consider ' +
              'calling requestSaveConfig() on this Source ' +
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
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'requestSaveConfig', true)
    }
    return new Promise(resolve=> {
      let slot;
      iItem.attach(this._id).then(res => {
        slot = res;
        exec('CallInner' + (slot === 0 ? '' : (slot + 1)),
            'MessageSource', JSON.stringify({
                'request': 'saveConfig',
                'data': configObj
            }));
        resolve(this);
      });
    });
  }

  applyConfig(configObj: any): Promise<any> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'applyConfig', true)
    }
    return new Promise(resolve=> {
      let slot;
      iItem.attach(this._id).then(res => {
        slot = res;
        exec('CallInner' + (slot === 0 ? '' : (slot + 1)),
          'MessageSource', JSON.stringify({
              'request': 'applyConfig',
              'data': configObj
          }));
        resolve(this);
      });
    });
  }
}
