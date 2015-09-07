/// <reference path="../../../defs/es6-promise.d.ts" />

import {Rectangle} from '../../util/rectangle';
import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {Scene} from '../scene';

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

/**
 * An Item represents an object that is used as a source on the stage.
 * Some possible sources are games, microphones, or a webpage.
 */
export class Item {
  protected _id: string;
  protected _type: ItemTypes;
  protected _value: any;
  private _name: string;
  private _cname: string;
  private _sceneID: number;
  private _keepLoaded: boolean;

  private _xmlparams: {};

  constructor(props?: {}) {
    props = props ? props : {};

    this._name = props['name'];
    this._cname = props['cname'];
    this._id = props['id'];
    this._sceneID = props['sceneID'];
    this._value = props['value'];
    this._keepLoaded = props['keeploaded'];
    this._type = Number(props['type']);

    this._xmlparams = props;
  }

  /** Sets the name of the item */
  setName(value: string): Promise<Item> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this._name = value;
      iItem.set('prop:name', this._name, slot).then(() => {
        resolve(this);
      });
    });
  }

  /** Gets the current name of the item */
  getName(): Promise<string> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:name', slot).then(val => {
        this._name = val;
        resolve(val);
      });
    });
  }

  /** Sets the custom name of the item */
  setCustomName(value: string): Promise<Item> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this._cname = value;
      iItem.set('prop:cname', this._cname, slot).then(() => {
        resolve(this);
      });
    });
  }

  /** Gets the custom name of the item */
  getCustomName(): Promise<string> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:cname', slot).then(val => {
        this._cname = val;
        resolve(val);
      });
    });
  }

  /** Get the video item's main definition */
  getValue(): Promise<string|XML> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:item', slot).then(val => {
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

  /** Set the video item's main definition */
  setValue(value: string | XML): Promise<Item> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      var val: string = (typeof value === 'string') ?
        <string> value : (<XML> value).toString();
      if (typeof value !== 'string') { // XML
        this._value = JXON.parse(val);
      } else {
        this._value = val;
      }
      iItem.set('prop:item', val, slot).then(() => {
        resolve(this);
      });
    });
  }

  /** Check if item is kept loaded in memory */
  getKeepLoaded(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:keeploaded', slot).then(val => {
        this._keepLoaded = (val === '1');
        resolve(this._keepLoaded);
      });
    });
  }

  /** Set Keep loaded option to ON or OFF */
  setKeepLoaded(value: boolean): Promise<Item> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this._keepLoaded = value;
      iItem.set('prop:keeploaded', (this._keepLoaded ? '1' : '0'), slot)
        .then(() => {
          resolve(this);
      });
    });
  }

  /** Get the type of the item */
  getType(): Promise<ItemTypes> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:type', slot).then(val => {
        this._type = ItemTypes[ItemTypes[Number(val)]];
        resolve(this._type);
      });
    });
  }

  /** Get the ID of the item */
  getID(): Promise<string> {
    return new Promise(resolve => {
      resolve(this._id);
    });
  }

  /** Get (1-indexed) Scene ID where the item is loaded */
  getSceneID(): Promise<number> {
    return new Promise(resolve => {
      resolve(Number(this._sceneID) + 1);
    });
  }

  /** Convert the Item object to an XML string */
  toXML(): XML {
    var item: JXON = new JXON();

    item['tag'] = 'item';
    item['name'] = this._name;
    item['item'] = this._value;
    item['type'] = this._type;
    item['selfclosing'] = true;

    if (this._cname) {
      item['cname'] = this._cname;
    }

    return XML.parseJSON(item);
  }

  /** Get the current source (when function is called by sources), or the source
   * that was right-clicked to open the config window (when function is called
   * from the config window) */
  static getCurrentSource(): Promise<Item> {
    return new Promise((resolve, reject) => {
      if (Environment.isExtension()) {
        reject(Error('Extensions do not have sources ' +
          'associated with them.'));
      } else if (Environment.isSourcePlugin() || Environment.isSourceConfig()) {
        Scene.searchAllForItemId(iItem.getBaseID()).then(item => {
          resolve(item); // this should always exist
        });
      }
    });
  }
}
