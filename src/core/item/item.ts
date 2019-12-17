import parser from 'fast-xml-parser';

import Internal from '../../internal';
import Xjs from '../xjs';

import { ItemConfig, PropertyType } from './types';

class Item {
  private _internal: Internal;
  private _attributes: any;

  static fromXMLString(xmlString: string, xjs: Xjs) {
    const itemObject = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });

    // Check if valid XML... we consider it valid if it has an id :D
    if (
      itemObject &&
      itemObject.item &&
      typeof itemObject.item.id !== 'undefined'
    ) {
      return new Item({
        internal: xjs._internal,
        attributes: itemObject.item,
      });
    }

    throw new Error('Invalid XML passed to `fromXMLString`');
  }

  constructor(config: ItemConfig) {
    this._internal = config.internal;
    this._attributes = config.attributes;
  }

  setProperty(prop: PropertyType, param: any): Promise<any> {
    if (prop.setValidator(param)) {
      this._internal.exec('SearchVideoItem', this._attributes.id);
      return this._internal.exec(
        'SetLocalPropertyAsync',
        prop.key,
        prop.setTransformer(param)
      );
    }

    throw new Error(`Params "${param}" validation failed`);
  }

  async getProperty(prop: PropertyType, param: any): Promise<any> {
    if (prop.getValidator(param)) {
      this._internal.exec('SearchVideoItem', this._attributes.id);
      const ret = await this._internal.exec('GetLocalPropertyAsync', prop.key);
      return prop.getTransformer(ret);
    }

    throw new Error(`Params "${param}" validation failed`);
  }
}

export default Item;
