import Internal from '../../internal';
import Scene from '../scene';
import App from '../app';

import { ViewConfig } from './types';

class View {
  private _app: App;
  private _internal: Internal;
  private _index: number;

  constructor(config: ViewConfig) {
    this._app = config.app;
    this._internal = config.internal;
    this._index = config.index;
  }

  async getCurrentScene(): Promise<Scene> {
    const currentSceneIndex = await this._internal.exec(
      'AppGetPropertyAsync',
      `scene:${this._index}`
    );

    return new Scene({
      app: this._app,
      internal: this._internal,
      index: currentSceneIndex,
    });
  }
}

export default View;
