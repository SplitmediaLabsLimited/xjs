import Internal from '../../internal';
import sprintf from '../../helpers/sprintf';

import { AppConfig, PropertyType } from './types';

class App {
  private _internal: Internal;

  constructor(config: AppConfig) {
    this._internal = config.internal;
  }

  setProperty(prop: PropertyType, param: any): Promise<any> {
    if (prop.setValidator(param)) {
      const params = { ...param };
      const key = sprintf(prop.key, params, true);

      return this._internal.exec(
        'AppSetPropertyAsync',
        key,
        prop.setTransformer(params)
      );
    }

    throw new Error(`Params "${param}" validation failed`);
  }

  async getProperty(prop: PropertyType, param: any): Promise<any> {
    if (prop.getValidator(param)) {
      const key = sprintf(prop.key, param);
      const ret = await this._internal.exec('AppGetPropertyAsync', key);
      return prop.getTransformer(ret);
    }

    throw new Error(`Params "${param}" validation failed`);
  }
}

export default App;
