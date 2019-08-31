import Internal from 'internal';

import { AppConfig } from './types';

class App {
  private _internal: Internal;

  constructor(config: AppConfig) {
    this._internal = config.internal;
  }

  setProperty(prop: string, params: string): Promise<string> {
    return this._internal.exec('AppSetPropertyAsync', prop, params);
  }

  getProperty(prop: string): Promise<string> {
    return this._internal.exec('AppGetPropertyAsync', prop);
  }
}

export default App;
