import Internal from 'internal';

import { AppConfig, PropertyType } from './types';

class App {
  private _internal: Internal;

  constructor(config: AppConfig) {
    this._internal = config.internal;
  }

  setProperty(prop: PropertyType, params: any): Promise<any> {
    if (prop.setValidator(params)) {
      return this._internal.exec(
        'AppSetPropertyAsync',
        prop.key,
        prop.setTransformer(params)
      );
    }
  }

  async getProperty(prop: PropertyType): Promise<any> {
    const ret = await this._internal.exec('AppGetPropertyAsync', prop.key);
    return prop.getTransformer(ret);
  }
}

export default App;
