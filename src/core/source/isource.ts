/// <reference path="../../../defs/es6-promise.d.ts" />

import {Source} from './source';
import {App as iApp} from '../../internal/app';
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

/**
 * ItemTypes is used to define the type of the current Source.
 *
 * Check `getType()` method of {@link #core/Source#getType Core/Source}
 */
export enum ItemTypes {
  UNDEFINED,
  FILE,
  LIVE,
  TEXT,
  BITMAP,
  SCREEN,
  FLASHFILE,
  GAMESOURCE,
  HTML
}

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
  getId(): Promise<string>

  /**
   * return Promise<ISource>
   *
   * Refreshes Specified Item
   */
  refresh(): Promise<ISource>

  /**
   * return: Promise<ISource[]>
   *
   * Get the item list of the current item instance. This is useful when an item is
   * an instance of a linked item, with multiple other items having the same
   * source.
   */
  getItemList(): Promise<ISource[]>

  /**
   * return: Promise<ItemType>
   *
   * Get the type of the source
   */
  getType(): Promise<number>

}

/**
 * Used by Source and Item to implement methods that are used on both classes
 * More info to be added soon.
 */

export class iSource implements ISource{
  private _id: string;
  private _value: any;
  private _name: string;
  private _cname: string;
  private _keepLoaded: boolean;
  private _globalsrc: boolean;
  private _isItemCall: boolean;
  private _type: ItemTypes;
  private _sceneId: string;
  private _srcId: string;
  private _checkPromise;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  setName(value: string): Promise <iSource> {
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
        if (this._isItemCall) {
          Logger.warn('sourceWarning', 'setName', true)
          iItem.set('prop:name', this._name, this._id)
          .then(() => {
            resolve(this);
          });
        } else {
          iItem.wrapSet('prop:name', this._name, this._srcId, this._id, this._updateId.bind(this))
          .then(() => {
            resolve(this);
          });
        }
      }
    });
  }

  getName(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getName',  true)
        this._checkPromise = iItem.get('prop:name', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:name', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        this._name = String(val);
        resolve(val);
      });
    });
  }

  setCustomName(value: string): Promise<Source> {
    return new Promise(resolve => {
      this._cname = value;
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setCustomName', true)
        iItem.set('prop:cname', this._cname, this._id)
        .then(() => {
          resolve(this);
        });
      } else {
        iItem.wrapSet('prop:cname', this._cname, this._srcId, this._id, this._updateId.bind(this))
        .then(() => {
          resolve(this);
        });
      }
    });
  }

  getCustomName(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getCustomName', true)
        iItem.get('prop:cname', this._id)
        .then(val => {
          resolve(val);
        });
      } else {
        iItem.wrapGet('prop:cname', this._srcId,
          this._id, this._updateId.bind(this))
        .then(val => {
          resolve(val);
        });
      }
    });
  }

  getValue(): Promise<string | XML> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getValue', true)
        this._checkPromise = iItem.get('prop:item', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:item', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
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
    return new Promise((resolve, reject) => {
      var prevVal
      var val: string = (typeof value === 'string') ?
      <string>value : (<XML>value).toString();
      if (typeof value !== 'string') { // XML
        this._value = JXON.parse(val);
      } else {
        this._value = val;
      }

      let typeCheck = this.getValue().then(origVal => {
        return new Promise((typeRes, typeRej) => {
          if (String(origVal).indexOf('{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1 &&
            val.indexOf('{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1 &&
            this._type === ItemTypes.LIVE) {
              typeRej(Error('Value is not a valid Audio source'))
          } else {
            typeRes(true)
          }
        })
      })

      typeCheck.then(() => {
        if(this._isItemCall){
          Logger.warn('sourceWarning', 'setValue', true)
          iItem.set(String(this._type) === '2' ? 'prop:item' : 'prop:srcitem' , val, this._id)
          .then(() => {
            resolve(this);
          });
        } else {
          iItem.wrapSet('prop:srcitem', val, this._srcId, this._id, this._updateId.bind(this))
          .then(() => {
            resolve(this);
          });
        }
      })
    });
  }

  getKeepLoaded(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getKeepLoaded', true)
        this._checkPromise = iItem.get('prop:keeploaded', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:keeploaded', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
          this._keepLoaded = (val === '1');
          resolve(this._keepLoaded);
        });
    });
  }

  setKeepLoaded(value: boolean): Promise<Source> {
    return new Promise(resolve => {
      this._keepLoaded = value;
      this._globalsrc = value;
      if(versionCompare(getVersion())
        .is
        .lessThan(globalsrcMinVersion)) {
        iItem.set('prop:globalsrc', (this._globalsrc ? '1' : '0'), this._id)
      }
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setKeepLoaded', true)
        iItem.set('prop:keeploaded', (this._keepLoaded ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
      } else {
        iItem.wrapSet('prop:keeploaded', (this._keepLoaded ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
        .then(() => {
          resolve(this);
        });
      }
    });
  }

  getId(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        resolve(this._id)
      } else {
        if (versionCompare(getVersion()).is.lessThan(minVersion)) {
          reject(Error('Only available on versions above ' + minVersion));
        } else {
        iItem.wrapGet('prop:srcid', this._srcId, this._id, this._updateId.bind(this))
        .then(srcid => {
            resolve(srcid);
          });
        }
      }
    });
  }

  refresh(): Promise<iSource> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        iItem.set('refresh', '', this._id).then(() => {
          resolve(this);
        });
      } else {
        iItem.wrapSet('refresh', '', this._srcId, this._id,
          this._updateId.bind(this)).then(() => {
          resolve(this);
        });
      }
    });
  }

  getItemList(): Promise<iSource[]> {
    return new Promise((resolve, reject) => {
      if (
        versionCompare(getVersion())
          .is
          .lessThan(minVersion)
      ) {
        Scene.searchItemsById(this._id).then(item => {
          const itemArray = [];
          itemArray.push(item);
          resolve(itemArray);
        });
      } else {
        if (this._isItemCall) {
          this._checkPromise = iItem.get('itemlist', this._id)
        } else {
          this._checkPromise = iItem.wrapGet('itemlist', this._srcId,
            this._id, this._updateId.bind(this))
        }
        this._checkPromise.then(itemlist => {
          const promiseArray: Promise<iSource>[] = [];
          const itemsArray = String(itemlist).split(',');

          itemsArray.forEach(itemId => {
            promiseArray.push(new Promise(itemResolve => {
              Scene.searchItemsById(itemId).then(item => {
                itemResolve(item);
              }).catch(() => itemResolve(null));
            }));
          });

          Promise.all(promiseArray).then(results => {
            resolve(results.filter(res => res !== null));
          });
        });
      }
    })
  }

  getType(): Promise<number> {
    return new Promise(resolve => {
      if(this._isItemCall) {
        this._checkPromise = iItem.get('prop:type', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:type', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
        this._type = ItemTypes[ItemTypes[Number(val)]];
        resolve(this._type);
      });
    });
  }

}