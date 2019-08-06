import Internal from 'internal';

import { ItemConfig, PropertyType } from './types';

class Item {
  private _internal: Internal;
  private _attributes: any;

  constructor(config: ItemConfig) {
    this._internal = config.internal;
    this._attributes = config.attributes;
  }

  setProperty(prop: PropertyType, param: any): void {
    if (prop.setValidator(param)) {
      this._internal.exec('SearchVideoItem', this._attributes.id);
      this._internal.exec(
        'SetLocalPropertyAsync',
        prop.key,
        prop.setTransformer(param)
      );
    }
  }

  getProperty(prop: PropertyType): Promise<string> {
    this._internal.exec('SearchVideoItem', this._attributes.id);
    return this._internal.exec('GetLocalPropertyAsync', prop.key);
  }
}

export default Item;
