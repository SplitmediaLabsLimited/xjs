/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {XML} from '../../internal/util/xml';
import {JSON as JXON} from '../../internal/util/json';
import {ItemTypes, Item} from '../items/item';
import {Source} from './source'
import {iSource, ISource} from './isource'

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
}

export class iSourceGame implements ISourceGame {
  private _id: string;
  private _type: ItemTypes;
  private _value: any;

  isSpecialOptimizationEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('GameCapSurfSharing', this._id).then(res => {
        resolve(res === '1');
      });
    });
  }

  setSpecialOptimizationEnabled(value: boolean): Promise<iSourceGame> {
    return new Promise(resolve => {
      iItem.set('GameCapSurfSharing', (value ? '1' : '0'),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  isShowMouseEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('GameCapShowMouse', this._id).then(res => {
        resolve(res === '1');
      });
    });
  }

  setShowMouseEnabled(value: boolean): Promise<iSourceGame> {
    return new Promise(resolve => {
      iItem.set('GameCapShowMouse', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    });
  }

  setOfflineImage(path: string): Promise<iSourceGame> {
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

  getValue: () => Promise<string | XML>

  setValue: (value: string | XML) => Promise<iSourceGame>

}