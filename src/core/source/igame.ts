/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {XML} from '../../internal/util/xml';
import {JSON as JXON} from '../../internal/util/json';
import {Source} from './source';
import {iSource, ISource, ItemTypes} from './isource';
import {Logger} from '../../internal/util/logger';

const MIN_FPS = 24;
const MAX_FPS = 300;

export interface ISourceGame {

  /**
   * return: Promise<boolean>
   *
   * Check if Game Special Optimization is currently enabled or not
   */
  isSpecialOptimizationEnabled(): Promise<boolean>

  /**
   * param: Promise<boolean>
   *
   * Set Game Special Optimization to on or off
   *
   * *Chainable.*
   */
  setSpecialOptimizationEnabled(value: boolean): Promise<ISourceGame>

  /**
   * return: Promise<boolean>
   *
   * Check if Show Mouse is currently enabled or not
   */
  isShowMouseEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Set Show Mouse in game to on or off
   *
   * *Chainable.*
   */
  setShowMouseEnabled(value: boolean): Promise<ISourceGame>

  /**
   * param: path<string>
   *
   * Set the offline image of a game item
   *
   * *Chainable.*
   */
  setOfflineImage(path: string): Promise<ISourceGame>

  /**
   * return: Promise<string>
   *
   * Get the offline image of a game item
   */
  getOfflineImage(): Promise<string>

  /**
   * return: Promise<boolean>
   *
   * Get the transparency of a game item.
   * Please note that game transparency only works if Game Special Optimization is also enabled.
   */
  isTransparent(): Promise<boolean>

  /**
   * param: value<boolean>
   *
   * Set the transparency of a game item
   * Please note that game transparency only works if Game Special Optimization is also enabled.
   *
   * *Chainable.*
   */
  setTransparent(value: boolean): Promise<ISourceGame>

  /**
   * return: Promise<number>
   *
   * Get the maximum number of frames per second the game is being limited to by XBC
   */
  getGameFPSCap(): Promise<number>

  /**
   * param: path<string>
   *
   * Set the maximum number of frames per second the game is being limited to by XBC.
   * Accepter values are either 0 (disable capping) or within the range of 24 to 300 fps
   *
   * *Chainable.*
   */
  setGameFPSCap(fps: number): Promise<ISourceGame>
}

export class iSourceGame implements ISourceGame {
  private _id: string;
  private _type: ItemTypes;
  private _value: any;
  private _srcId: string;
  private _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  isSpecialOptimizationEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isSpecialOptimizationEnabled', true)
        iItem.get('GameCapSurfSharing', this._id).then(res => {
          resolve(res === '1');
        });
      } else {
        iItem.wrapGet('GameCapSurfSharing', this._srcId, this._id, this._updateId.bind(this)).then(res => {
          resolve(res === '1');
        });
      }
    });
  }

  setSpecialOptimizationEnabled(value: boolean): Promise<iSourceGame> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setSpecialOptimizationEnabled', true)
        iItem.set('GameCapSurfSharing', (value ? '1' : '0'),
          this._id).then(() => {
            resolve(this);
        });
      } else {
        iItem.wrapSet('GameCapSurfSharing', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this)).then(() => {
            resolve(this);
        });
      }
    });
  }

  isShowMouseEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isShowMouseEnabled', true)
        iItem.get('GameCapShowMouse', this._id).then(res => {
          resolve(res === '1');
        });
      } else {
        iItem.wrapGet('GameCapShowMouse', this._srcId, this._id, this._updateId.bind(this)).then(res => {
          resolve(res === '1');
        });
      }
    });
  }

  setShowMouseEnabled(value: boolean): Promise<iSourceGame> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setShowMouseEnabled', true)
        iItem.set('GameCapShowMouse', (value ? '1' : '0'), this._id).then(() => {
          resolve(this);
        });
      } else {
        iItem.wrapSet('GameCapShowMouse', (value ? '1' : '0'), this._srcId, this._id, this._updateId.bind(this)).then(() => {
          resolve(this);
        });
      }
    });
  }

  setOfflineImage(path: string): Promise<iSourceGame> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setOfflineImage', true)
    }
    return new Promise((resolve, reject) => {
      if (this._type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game item'));
      } else if (Environment.isSourcePlugin()) {
        reject(
          Error('Source plugins cannot update offline images of other items')
        );
      } else if (!(this._value instanceof XML)) {
        this.getValue().then(() => {
          this.setOfflineImage(path).then(itemObj => {
            resolve(itemObj);
          });
        });
      } else {
        var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?' +
          '\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*))\.(png|gif|jpg|jpeg|tif)$');
        if (regExp.test(path) || path === '') {
          var valueObj = JXON.parse(this._value.toString());
          valueObj['replace'] = path;
          this.setValue(XML.parseJSON(valueObj)).then(() => {
            resolve(this);
          });
        }
      }
    });
  }

  getOfflineImage(): Promise<string> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getOfflineImage', true)
    }
    return new Promise((resolve, reject) => {
      if (this._type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game item'));
      } else {
        this.getValue().then(() => {
          var valueObj = JXON.parse(this._value.toString());
          resolve(valueObj['replace'] ? valueObj['replace'] : '');
        });
      }
    });
  }

  isTransparent(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isTransparent', true)
        this._checkPromise = iItem.get('prop:GameCapAlpha', this._id);
      } else {
        this._checkPromise = iItem.wrapGet('prop:GameCapAlpha', this._srcId, this._id, this._updateId.bind(this));
      }
      this._checkPromise.then(res => {
        resolve(res === '1');
      });
    });
  }

  setTransparent(value: boolean): Promise<iSourceGame> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setTransparent', true)
        this._checkPromise = iItem.set('prop:GameCapAlpha', (value ? '1' : '0'), this._id);
      } else {
        this._checkPromise = iItem.wrapSet('prop:GameCapAlpha', (value ? '1' : '0'), this._srcId, this._id, this._updateId.bind(this));
      }
      this._checkPromise.then(() => {
        resolve(this);
      });
    });
  }

  getGameFPSCap(): Promise<number> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getGameFPSCap', true)
        this._checkPromise = iItem.get('prop:GameCapFrameTimeLimit', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:GameCapFrameTimeLimit', this._srcId, this._id, this._updateId.bind(this));
      }
      this._checkPromise.then(res => {
        if (res === '0' || res === '') {
          resolve(0);
        } else {
          let fps = Math.floor(10000000/Number(res));
          fps = Math.min(Math.max(fps, MIN_FPS), MAX_FPS);
          resolve(fps);
        }
      });
    });
  }

  setGameFPSCap(value: number): Promise<iSourceGame> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use an integer as the parameter.'));
      } else if (value !== 0 && (Number(value) < MIN_FPS || Number(value) > MAX_FPS)) {
        reject(RangeError(`Game FPS cap may only be 0 or in the range of ${MIN_FPS} to ${MAX_FPS} .`));
      } else {
        let frametime = Math.floor(10000000/Number(value));
        if(this._isItemCall){
          Logger.warn('sourceWarning', 'setGameFPSCap', true)
          iItem.set('prop:GameCapFrameTimeLimit', String(frametime), this._id).then(() => {
            resolve(this);
          });
        } else {
          iItem.wrapSet('prop:GameCapFrameTimeLimit', String(frametime), this._srcId, this._id, this._updateId.bind(this)).then(() => {
            resolve(this);
          });
        }
      }
    });
  }

  getValue: () => Promise<string | XML>

  setValue: (value: string | XML) => Promise<iSourceGame>

}