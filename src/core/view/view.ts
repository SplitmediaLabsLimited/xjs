import Internal from 'internal';
import Scene from 'core/scene';
import App from 'core/app';

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
      `preset:${this._index}`
    );

    return new Scene({
      app: this._app,
      internal: this._internal,
      index: currentSceneIndex,
    });
  }
}

export default View;
