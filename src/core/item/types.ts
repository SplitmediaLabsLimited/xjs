import Internal from '../../internal';

export interface ItemConfig {
  internal: Internal;
  attributes: any;
}

export interface PropertyType {
  key: string;
  setValidator: (param: any) => boolean;
  setTransformer: (param: any) => any;
  getValidator: (param: any) => boolean;
  getTransformer: (param: any) => any;
}
