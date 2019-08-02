import Internal from 'internal';
import Item from 'core/item';

import parser from 'fast-xml-parser';

interface SceneConfig {
  internal: Internal;
  index: number;
}

class Scene {
  private _internal: Internal;
  private _index: number;

  constructor(config: SceneConfig) {
    this._internal = config.internal;
    this._index = config.index;
  }

  async getItems(): Promise<Item[]> {
    const xmlString = await this._internal.exec(
      'AppGetPropertyAsync',
      `presetconfig:${this._index}`
    );

    const sceneObject = parser.parse(xmlString, { ignoreAttributes: false });
    const items =
      sceneObject.placement.item instanceof Array
        ? sceneObject.placement.item
        : [sceneObject.placement.item];

    return items.map(item => new Item({ internal: this._internal, ...item }));
  }
}

export default Scene;
