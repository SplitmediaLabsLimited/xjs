/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Rectangle} from '../../util/rectangle';
import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {Scene} from '../scene';
import {ItemLayout, IItemLayout} from './ilayout';

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
export class Item implements IItemLayout {
  protected _id: string;
  protected type: ItemTypes;
  protected value: any;
  private name: string;
  private cname: string;
  private sceneID: number;
  private keepLoaded: boolean;

  private xmlparams: {};

  constructor(props?: {}) {
    props = props ? props : {};

    this.name = props['name'];
    this.cname = props['cname'];
    this._id = props['id'];
    this.sceneID = props['sceneID'];
    this.value = props['value'];
    this.keepLoaded = props['keeploaded'];
    this.type = Number(props['type']);

    this.xmlparams = props;
  }

  /** Sets the name of the item */
  setName(value: string): Promise<Item> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this.name = value;
      iItem.set('prop:name', this.name, slot).then(() => {
        resolve(this);
      });
    });
  }

  /** Gets the current name of the item */
  getName(): Promise<string> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:name', slot).then(val => {
        this.name = val;
        resolve(val);
      });
    });
  }

  /** Sets the custom name of the item */
  setCustomName(value: string): Promise<Item> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this.cname = value;
      iItem.set('prop:cname', this.cname, slot).then(() => {
        resolve(this);
      });
    });
  }

  /** Gets the custom name of the item */
  getCustomName(): Promise<string> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:cname', slot).then(val => {
        this.cname = val;
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
          this.value = '';
          resolve(val);
        } else {
          try {
            this.value = XML.parseJSON(JXON.parse(val));
            resolve(this.value);
          } catch (e) {
            // value is not valid XML (it is a string instead)
            this.value = val;
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
        this.value = JXON.parse(val);
      } else {
        this.value = val;
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
        this.keepLoaded = (val === '1');
        resolve(this.keepLoaded);
      });
    });
  }

  /** Set Keep loaded option to ON or OFF */
  setKeepLoaded(value: boolean): Promise<Item> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this.keepLoaded = value;
      iItem.set('prop:keeploaded', (this.keepLoaded ? '1' : '0'), slot)
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
        this.type = ItemTypes[ItemTypes[Number(val)]];
        resolve(this.type);
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
      resolve(Number(this.sceneID) + 1);
    });
  }

  /** Convert the Item object to an XML string */
  toXML(): XML {
    var item: JXON = new JXON();

    item['tag'] = 'item';
    item['name'] = this.name;
    item['item'] = this.value;
    item['type'] = this.type;
    item['selfclosing'] = true;

    if (this.cname) {
      item['cname'] = this.cname;
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

    // ItemLayout

  /**
   * return: Promise<boolean>
   *
   * Check if Aspect Ratio is set to ON or OFF
   */
  isKeepAspectRatio:        () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Position Locked is set to ON or OFF
   */
  isPositionLocked:         () => Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Check if Enhance Resize is Enabled or Disabled
   */
  isEnhancedResizeEnabled:   () => Promise<boolean>;

  /**
   * return: Promise<Rectangle>
   *
   * Get the position of the item
   */
  getPosition:              () => Promise<Rectangle>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Y value of the item
   */
  getRotateY:              () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate X value of the item
   */
  getRotateX:              () => Promise<number>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Z value of the item
   */
  getRotateZ:              () => Promise<number>;

  /**
   * param: value<boolean>
   *
   * Set Aspect Ratio to ON or OFF
   */
  setKeepAspectRatio:       (value: boolean) => Promise<Item>;

  /**
   * param: value<boolean>
   *
   * Set Position Lock to ON or OFF
   */
  setPositionLocked:        (value: boolean) => Promise<Item>;

  /**
   * param: value<boolean>
   *
   * Set Enhance Resize to ON or OFF
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<Item>;

  /**
   * param: value<Rectangle>
   *
   * Set Item position
   */
  setPosition:              (value: Rectangle) => Promise<Item>;

  /**
   * param: value<number>
   *
   * Set Rotate Y value of the item
   */
  setRotateY:              (value: number) => Promise<Item>;

  /**
   * param: value<number>
   *
   * Set Rotate X value of the item
   */
  setRotateX:              (value: number) => Promise<Item>;

  /**
   * param: value<number>
   *
   * Set Rotate Z value of the item
   */
  setRotateZ:              (value: number) => Promise<Item>;
}

applyMixins(Item, [ItemLayout]);
