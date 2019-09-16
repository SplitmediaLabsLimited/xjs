import Internal from 'internal';
import Item from 'core/item';
import App from 'core/app';

import parser from 'fast-xml-parser';

interface SceneConfig {
  app: App;
  internal: Internal;
  index: number;
}

class Scene {
  private _app: App;
  private _internal: Internal;
  private _index: number;

  constructor(config: SceneConfig) {
    this._app = config.app;
    this._internal = config.internal;
    this._index = config.index;
  }

  async getItems(): Promise<Item[]> {
    const xmlString = await this._internal.exec(
      'AppGetPropertyAsync',
      `sceneconfig:${this._index}`
    );

    const sceneObject = parser.parse(xmlString, {
      attributeNamePrefix: '',
      ignoreAttributes: false,
    });
    const items =
      sceneObject.placement.item instanceof Array
        ? sceneObject.placement.item
        : [sceneObject.placement.item];

    return items.map(
      item => new Item({ internal: this._internal, attributes: items })
    );
  }
}

export default Scene;
