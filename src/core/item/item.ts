/// <reference path="../../../defs/es6-promise.d.ts" />

import {Rectangle} from '../../internal/util/rectangle';
import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';

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

export class Item {
  private name: string;
  private id: string;
  private sceneID: number;
  private type: ItemTypes;
  private value: any;
  private keepLoaded: boolean;

  private xmlparams: {};

  constructor(props?: {}) {
    props = props ? props : {};

    this.name = props['name'];
    this.id = props['id'];
    this.sceneID = props['sceneID'];
    this.value = props['value'];
    this.keepLoaded = props['keeploaded'];
    this.type = props['type'];

    this.xmlparams = props;
  }

  /** Set name of the item */
  setName(value: string) {
    let slot = iItem.attach(this.id);

    this.name = value;

    iItem.set('prop:name', this.name, slot);
  }

  /** Get the current name of the item */
  getName(): Promise<string> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:name', slot).then((val) => {
        this.name = val;

        resolve(val);
      });
    });
  }

  /** Get the video item's main definition */
  getValue(): Promise<string|XML> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:item', slot).then((val) => {
        val = (val === 'null') ? '' : val;

        if (val === '') { // don't return XML for null values
          this.value = '';
          resolve(val);
        }

        try {
          this.value = XML.parseJSON(JXON.parse(val));
          resolve(this.value);
        } catch (e) {
          // value is not JXON
          this.value = val;
          resolve(val);
        }

        resolve(this.value);
      });
    });
  }

  /** Set the video item's main definition */
  setValue(value: string | XML) {
    let slot = iItem.attach(this.id);

    var val: string = (typeof value === 'string') ?
      <string> value : (<XML> value).toString();

    if (typeof value !== 'string') { // XML
      this.value = JXON.parse(val);
    }

    iItem.set('prop:item', val, slot);
  }

  /** Get Keep loaded option */
  getKeepLoaded(): Promise<boolean> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:keeploaded', slot).then((val) => {
        this.keepLoaded = (val === '1');

        resolve(this.keepLoaded);
      });
    });
  }

  /** Set Keep loaded option to ON or OFF */
  setKeepLoaded(value: boolean) {
    let slot = iItem.attach(this.id);

    this.keepLoaded = value;

    iItem.set('prop:keeploaded', (this.keepLoaded ? '1' : '0'), slot);
  }

  /** Get the type of the item */
  getType(): Promise<ItemTypes> {
    return new Promise((resolve) => {
      let slot = iItem.attach(this.id);

      iItem.get('prop:type', slot).then((val) => {
                this.type = ItemTypes[ItemTypes[Number(val)]];

                resolve(this.type);
      });
    });
  }

  /** Get Item ID */
  getID(): Promise<string> {
    return new Promise((resolve) => {
      resolve(this.id);
    });
  }

  /** Get (1-indexed) Scene ID where the item is loaded */
  getSceneID(): Promise<number> {
    return new Promise((resolve) => {
      resolve(Number(this.sceneID) + 1);
    });
  }

  /** Convert the Item object to XML */
  toXML(): XML {
    var item: JXON = new JXON();

    item['tag'] = 'item';
    item['name'] = this.name;
    item['item'] = this.value;
    item['type'] = this.type;

    return XML.parseJSON(item);
  }

  /** Get the current source (when called for sources), or the source that
   * was right-clicked to open the config window (when called from the
     * config window). */
  static getCurrentSource(): Promise<Item> {

    return new Promise((resolve, reject) => {
      if (Environment.isScriptPlugin()) {
        reject(Error('Script plugins do not have sources ' +
          'associated with them.'));
      } else if (Environment.isSourceHtml() || Environment.isSourceConfig()) {
        resolve(); // TODO
        // View.MAIN.searchItems(iItem.getBaseID()).then(items => {
        //  resolve(items[0]); // assuming this always exists
        //});
      }
    });
  }
}
