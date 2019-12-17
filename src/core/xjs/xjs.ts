import { XjsTypes, XjsEnvironments, LogVerbosity, Config } from './types';
import Internal from '../../internal';
import App from '../app';
import View from '../view';

export default class Xjs {
  static version = '%XJS_VERSION%';

  private type: XjsTypes;

  private environment: XjsEnvironments;

  private logVerbosity: LogVerbosity;

  private version: string;

  private sendMessage: any;

  private onMessageReceive: any;

  private logger: any;

  private exec: any;

  app: App;

  _internal: Internal;

  constructor(config: Config = { type: XjsTypes.Local }) {
    Object.keys(config).forEach((key: string) => {
      if (this.hasOwnProperty(key)) {
        this[key] = config[key];
      }
    });

    // Initialize the internal methods and the view
    this._internal = new Internal();

    this.exec = this._internal.exec;

    this.app = new App({ internal: this._internal });
  }

  getView(index: number) {
    return new View({
      app: this.app,
      internal: this._internal,
      index,
    });
  }
}
