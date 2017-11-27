/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {XML} from '../../internal/util/xml';
import {JSON as JXON} from '../../internal/util/json';
import {Source} from './source';
import {iSource, ISource, ItemTypes} from './isource';
import {Logger} from '../../internal/util/logger';

export interface ISourceGame {
  specialOptimization(value?: boolean): Promise<boolean|ISourceGame>
  showMouse(value?: boolean): Promise<boolean|ISourceGame>
  offlineImage(path?: string): Promise<string|ISourceGame>

  /**
   * return: Promise<boolean>
   *
   * Check if Game Special Optimization is currently enabled or not
   */
  // isSpecialOptimizationEnabled(): Promise<boolean>

  /**
   * param: Promise<boolean>
   *
   * Set Game Special Optimization to on or off
   *
   * *Chainable.*
   */
  // setSpecialOptimizationEnabled(value: boolean): Promise<ISourceGame>

  /**
   * return: Promise<boolean>
   *
   * Check if Show Mouse is currently enabled or not
   */
  // isShowMouseEnabled(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Set Show Mouse in game to on or off
   *
   * *Chainable.*
   */
  // setShowMouseEnabled(value: boolean): Promise<ISourceGame>

  /**
   * param: path<string>
   *
   * Set the offline image of a game item
   *
   * *Chainable.*
   */
  // setOfflineImage(path: string): Promise<ISourceGame>

  /**
   * return: Promise<string>
   *
   * Get the offline image of a game item
   */
  // getOfflineImage(): Promise<string>
}

export class iSourceGame implements ISourceGame {
  private _id: string;
  private _type: ItemTypes;
  private _value: any;
  private _srcId: string;
  private _isItemCall: boolean;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  specialOptimization(value?: boolean): Promise<boolean|iSourceGame> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'specialOptimization',  true)
      }

      if (this._isItemCall && value) {
        iItem.set('GameCapSurfSharing', (value ? '1' : '0'),
        this._id).then(() => {
          resolve(this);
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('GameCapSurfSharing', (value ? '1' : '0'),
        this._srcId, this._id, this._updateId.bind(this)).then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('GameCapSurfSharing', this._id).then(res => {
          resolve(res === '1');
        });
      } else if (!this._isItemCall && !value) {
        iItem.wrapGet('GameCapSurfSharing', this._srcId, this._id, this._updateId.bind(this)).then(res => {
          resolve(res === '1');
        });
      }
    })
  }

  showMouse(value?: boolean): Promise<boolean|iSourceGame> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'showMouse',  true)
      }

      if (this._isItemCall && value) {
        iItem.set('GameCapShowMouse', (value ? '1' : '0'), this._id).then(() => {
          resolve(this);
        });
      } else if (!this._isItemCall && !value) {
        iItem.wrapSet('GameCapShowMouse', (value ? '1' : '0'), this._srcId, this._id, this._updateId.bind(this)).then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('GameCapShowMouse', this._id).then(res => {
          resolve(res === '1');
        });
      }  else if (!this._isItemCall && !value) {
        iItem.wrapGet('GameCapShowMouse', this._srcId, this._id, this._updateId.bind(this)).then(res => {
          resolve(res === '1');
        });
      }
    })
  }

  offlineImage(path?: string): Promise<string|iSourceGame> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'offlineImage',  true)
      }

      if (this._type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game item'));
      } else if (path && Environment.isSourcePlugin()) {
        reject(
          Error('Source plugins cannot update offline images of other items')
        );
      } else if (path && !(this._value instanceof XML)) {
        this.value().then(() => {
          this.offlineImage(path).then(itemObj => {
            resolve(itemObj);
          });
        });
      } else if (path) {
        var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?' +
        '\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*))\.(png|gif|jpg|jpeg|tif)$');
        if (regExp.test(path) || path === '') {
          var valueObj = JXON.parse(this._value.toString());
          valueObj['replace'] = path;
          this.value(XML.parseJSON(valueObj)).then(() => {
            resolve(this);
          });
        }
      } else if (!path) {
        this.value().then(() => {
          var valueObj = JXON.parse(this._value.toString());
          resolve(valueObj['replace'] ? valueObj['replace'] : '');
        });
      }
    })
  }

  value: (value?: string | XML) => Promise<string | XML | iSourceGame>

}