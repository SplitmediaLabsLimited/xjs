import Internal from '../../internal';
import App from '../app';

export interface SceneConfig {
  app: App;
  internal: Internal;
  index?: number;
  xml?: string;
  uid?: string;
}
