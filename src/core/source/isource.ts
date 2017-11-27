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
  name(value?: string): Promise<string|ISource>

  /**
   * return: Promise<ISource>
   *
   * Gets or Sets the Source custom name
   */
  customName(value?: string): Promise<string|ISource>

  /**
   * return: Promise<string|XML>
   *
   * Gets Source main definition
   */
  value(value?: string | XML):  Promise<string|XML|ISource>

  /**
   * return: Promise<boolean>
   *
   * Check if Source is kept loaded in memory
   */
  keepLoaded(value?: boolean): Promise<boolean|ISource>

  /**
   * return: Promise<string>
   *
   * Get the Source ID
   */
  id(): Promise<string>

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
  itemList(): Promise<ISource[]>

  /**
   * return: Promise<ItemType>
   *
   * Get the type of the source
   */
  type(): Promise<number>

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

  name(value?: string): Promise<string|ISource> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'name',  true)
      }
      this._name = value ? value : this._name;

      if (
        versionCompare(getVersion())
          .is
          .lessThan(minVersion) && value
      ) {
        iItem.set('prop:name', this._name, this._id).then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && value) {
        this._checkPromise = iItem.get('itemlist', this._id)
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:name', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('itemlist', this._srcId,
        this._id, this._updateId.bind(this))
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:name', this._srcId,
        this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        const promiseArray: Promise<boolean>[] = [];
        const itemsArray = val.split(',');
        let isID: boolean = /^{[A-F0-9\-]*}$/i.test(itemsArray[0]);
        if(isID) {
          itemsArray.forEach(itemId => {
            promiseArray.push(new Promise(itemResolve => {
              iItem.set('prop:name', this._name, itemId).then(() => {
                itemResolve(true);
              });
                iItem.wrapSet('prop:name', this._name, this._srcId,
                              itemId, this._updateId.bind(this))
            }));
          });

          Promise.all(promiseArray).then(() => {
            resolve(this);
          });
        } else {
          this._name = String(val);
          resolve(val);
        }
      })
    })
  }

  customName(value?: string): Promise<string|iSource> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'customName',  true)
      }
      this._cname = value ? value : this._cname;

      if (this._isItemCall && value) {
        iItem.set('prop:cname', this._cname, this._id)
        .then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('prop:cname', this._id)
        .then(val => {
          resolve(val);
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:cname', this._cname, this._srcId, this._id, this._updateId.bind(this))
        .then(() => {
          resolve(this);
        });
      }  else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:cname', this._srcId,
          this._id, this._updateId.bind(this))
        .then(val => {
          resolve(val);
        });
      }
    })
  }

  value(value?: string | XML): Promise<string|XML|iSource> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'customName',  true)
      }
      let val;
      if (value) {
        val = (typeof value === 'string') ?
          <string>value : JXON.parse((<XML>value).toString());
      }

      this._value = val ? val : this._value

      if (this._isItemCall && val) {
        iItem.set(String(this._type) === '2' ? 'prop:item' : 'prop:srcitem' , val, this._id)
        .then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !val) {
        this._checkPromise = iItem.get('prop:item', this._id)
      } else if (!this._isItemCall && val) {
        iItem.wrapSet('prop:srcitem', val, this._srcId, this._id, this._updateId.bind(this))
        .then(() => {
          resolve(this);
        });
      }  else if (!this._isItemCall && !val) {
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
    })
  }

  keepLoaded(value?: boolean): Promise<boolean|iSource> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'keepLoaded',  true)
      }

      this._keepLoaded = value ? value : this._keepLoaded;
      this._globalsrc = value ? value : this._globalsrc;

      if (
        versionCompare(getVersion())
          .is
          .lessThan(globalsrcMinVersion) && value
      ) {
        iItem.set('prop:globalsrc', (this._globalsrc ? '1' : '0'), this._id)
      } else if (this._isItemCall && value) {
        iItem.set('prop:keeploaded', (this._keepLoaded ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:keeploaded', this._id)
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:keeploaded', (this._keepLoaded ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
        .then(() => {
          resolve(this);
        });
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:keeploaded', this._srcId,
        this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        this._keepLoaded = (val === '1');
        resolve(this._keepLoaded);
      });
    })
  }

  id(): Promise<string> {
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

  itemList(): Promise<iSource[]> {
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

  type(): Promise<number> {
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