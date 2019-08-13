import { XjsTypes, XjsEnvironments, LogVerbosity, Config } from './types';
import Internal from 'internal';
import View from '../view';

/**
 * The Xjs class
 */
export default class Xjs {
  static version = '%XJS_VERSION%';

  private _internal: Internal;

  type: XjsTypes;

  environment: XjsEnvironments;

  logVerbosity: LogVerbosity;

  version: string;

  sendMessage: any;

  onMessageReceive: any;

  logger: any;

  exec: any;

  view: View;

  constructor(config: Config = { type: XjsTypes.Local }) {
    Object.keys(config).forEach((key: string) => {
      if (this.hasOwnProperty(key)) {
        this[key] = config[key];
      }
    });

    // Initialize the internal methods and the view
    this._internal = new Internal();

    this.exec = this._internal.exec;
  }

  getView(index: number) {
    return new View({
      internal: this._internal,
      index,
    });
  }
}
