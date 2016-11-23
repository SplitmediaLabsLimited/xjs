/// <reference path="../../../defs/es6-promise.d.ts" />

import {Source} from './source';
import {Item as iItem} from '../../internal/item';
import {
  minVersion,
  versionCompare,
  getVersion,
  globalsrcMinVersion
} from '../../internal/util/version';
import {XML} from '../../internal/util/xml';
import {JSON as JXON} from '../../internal/util/json';
import {Environment} from '../environment';
import {Scene} from '../scene';
import {Logger} from '../../internal/util/logger';

export interface ISource {
  /**
   * return: Promise<ISource>
   *
   * Sets the Source name
   */
  setName(value: string): Promise<ISource>

  /**
   * return: Promise<string>
   *
   * Gets the Source name
   */
  getName(): Promise<string>

  /**
   * return: Promise<ISource>
   *
   * Sets the Source custom name
   */
  setCustomName(string): Promise<ISource>

  /**
   * return: Promise<string>
   *
   * Gets the Source custom name
   */
  getCustomName(): Promise<string>

  /**
   * return: Promise<string|XML>
   *
   * Gets Source main definition
   */
  getValue(): Promise<string|XML>

  /**
   * return: Promise<ISource>
   *
   * Sets Source main definition
   */
  setValue(string): Promise<ISource>

  /**
   * return: Promise<boolean>
   *
   * Check if Source is kept loaded in memory
   */
  getKeepLoaded(): Promise<boolean>

  /**
   * return: Promise<ISource>
   *
   * Set Keep loaded option to ON or OFF
   */
  setKeepLoaded(boolean): Promise<ISource>

  /**
   * return: Promise<string>
   *
   * Get the Source ID
   */
  getSourceId(): Promise<string>
}

/**
 * Used by Source and Item to implement methods that are used on both classes
 * More info to be added soon.
 */

export class iSource implements ISource{
  protected _id: string;
  protected _value: any;
  protected _name: string;
  protected _cname: string;
  protected _keepLoaded: boolean;
  protected _globalsrc: boolean;
  protected _isItemCall: boolean;
  protected _type: string;

  constructor(props?: {}) {
    props = props ? props : {};

    this._name = props['name'];
    this._cname = props['cname'];
    this._id = props['id'];
    this._value = props['value'];
  }

  setName(value: string): Promise <iSource> {
    if(this._isItemCall) {
      Logger.warn('sourceWarning', 'setName', true)
    }
    return new Promise(resolve => {
      this._name = value;

      if (
        versionCompare(getVersion())
          .is
          .lessThan(minVersion)
      ) {
        iItem.set('prop:name', this._name, this._id).then(() => {
          resolve(this);
        });
      } else {
        iItem.get('itemlist', this._id).then(itemlist => {
          const promiseArray: Promise<boolean>[] = [];
          const itemsArray = itemlist.split(',');

          itemsArray.forEach(itemId => {
            promiseArray.push(new Promise(itemResolve => {
              iItem.set('prop:name', this._name, itemId).then(() => {
                itemResolve(true);
              });
            }));
          });

          Promise.all(promiseArray).then(() => {
            resolve(this);
          });
        });
      }
    });
  }

  getName(): Promise<string> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getName',  true)
    }
    return new Promise(resolve => {
      iItem.get('prop:name', this._id).then(val => {
        this._name = val;
        resolve(val);
      });
    });
  }

  setCustomName(value: string): Promise<Source> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setCustomName', true)
    }
    return new Promise(resolve => {
      this._cname = value;
      iItem.set('prop:cname', this._cname, this._id).then(() => {
        resolve(this);
      });
    });
  }

  getCustomName(): Promise<string> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getCustomName', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:cname', this._id).then(val => {
        this._cname = val;
        resolve(val);
      });
    });
  }

  getValue(): Promise<string | XML> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getValue', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(val => {
        val = (val === 'null') ? '' : val;
        if (val === '') { // don't return XML for null values
          this._value = '';
          resolve(val);
        } else {
          try {
            this._value = XML.parseJSON(JXON.parse(val));
            resolve(this._value);
          } catch (e) {
            // value is not valid XML (it is a string instead)
            this._value = val;
            resolve(val);
          }
        }
      });
    });
  }

  setValue(value: string | XML): Promise<Source> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setValue', true)
    }
    return new Promise(resolve => {
      var val: string = (typeof value === 'string') ?
        <string>value : (<XML>value).toString();
      if (typeof value !== 'string') { // XML
        this._value = JXON.parse(val);
      } else {
        this._value = val;
      }
      iItem.set('prop:item', val, this._id).then(() => {
        resolve(this);
      });
    });
  }

  getKeepLoaded(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getKeepLoaded', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:keeploaded', this._id).then(val => {
        this._keepLoaded = (val === '1');
        resolve(this._keepLoaded);
      });
    });
  }

  setKeepLoaded(value: boolean): Promise<Source> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setKeepLoaded', true)
    }
    return new Promise(resolve => {
      this._keepLoaded = value;
      this._globalsrc = value;
      if(versionCompare(getVersion())
        .is
        .lessThan(globalsrcMinVersion)) {
        iItem.set('prop:globalsrc', (this._globalsrc ? '1' : '0'), this._id)
      }
      iItem.set('prop:keeploaded', (this._keepLoaded ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
    });
  }

  getSourceId(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (versionCompare(getVersion()).is.lessThan(minVersion)) {
        reject(new Error('Only available on versions above ' + minVersion));
      } else {
        iItem.get('prop:srcid', this._id).then(srcid => {
          resolve(srcid);
        });
      }
    });
  }
}