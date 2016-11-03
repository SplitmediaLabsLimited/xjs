/// <reference path="../../../defs/es6-promise.d.ts" />

import {Source} from './source';
import {Item as iItem} from '../../internal/item';
import {
  minVersion,
  versionCompare,
  getVersion
} from '../../internal/util/version';
import {XML} from '../../internal/util/xml';
import {JSON as JXON} from '../../internal/util/json';
import {Environment} from '../environment';
import {Scene} from '../scene';
import {ItemTypes} from '../items/item'

/**
 * Used by Source and Item to implement methods that are used on both classes
 * More info to be added soon.
 */

export class iSource {
  protected _id: string;
  protected _value: any;
  protected _name: string;
  protected _cname: string;
  protected _keepLoaded: boolean;
  protected _isItemCall: boolean;

  constructor(props?: {}) {
    props = props ? props : {};

    this._name = props['name'];
    this._cname = props['cname'];
    this._id = props['id'];
    this._value = props['value'];
  }
  setName(value: string): Promise<Source> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
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
      console.warn('Should only be called on Sources. Improve this message.')
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
      console.warn('Should only be called on Sources. Improve this message.')
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
      console.warn('Should only be called on Sources. Improve this message.')
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
      console.warn('Should only be called on Sources. Improve this message.')
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
      console.warn('Should only be called on Sources. Improve this message.')
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
}