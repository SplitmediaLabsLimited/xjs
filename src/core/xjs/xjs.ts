import { XjsTypes, XjsEnvironments, LogVerbosity, Config } from './types';
import Internal from 'internal';
import View from '../view';

/**
 * # XJS Class
 *
 * The entry class that unlocks just about everything that you
 * can do in XJS Framework.
 *
 * You need to control an item in a scene? You'll have to go through
 * this class. Want to programmatically modify the scene's name?
 * You'll need to go through this class.
 *
 * To use this library using the recommended way (through npm/yarn),
 * you'll need to import this first.
 *
 * ```javascript
 * import Xjs from 'xjs-framework';
 * ```
 */
export default class Xjs {
  /**
   * The version number of Xjs
   */
  static version = '%XJS_VERSION%';

  private _internal: Internal;

  private type: XjsTypes;

  private environment: XjsEnvironments;

  private logVerbosity: LogVerbosity;

  private version: string;

  private sendMessage: any;

  private onMessageReceive: any;

  private logger: any;

  private exec: any;

  /**
   * XJS Constructor
   *
   * Create an instance of Xjs
   *
   * @param config  Config
   */
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

  /**
   * Get an instance of a view based on the index.
   *
   * The usual "main" view that is used by both the stream and the XSplit Broadcaster Stage
   * is `0`.
   *
   * If you want to control an item in, let's say, the projector, you'll have to
   * access a view with a greater index.
   *
   * @param index Number
   */
  getView(index: number) {
    return new View({
      internal: this._internal,
      index,
    });
  }
}
