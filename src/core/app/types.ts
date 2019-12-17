import Internal from '../../internal';

export interface AppConfig {
  internal: Internal;
}

export interface PropertyType {
  key: string;
  setValidator: (param: any) => boolean;
  setTransformer: (param: any) => any;
  getValidator: (param: any) => boolean;
  getTransformer: (param: any) => any;
}
