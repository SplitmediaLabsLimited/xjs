/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';

export class IO {

  /**
   * Returns a base-64 encoded string of the target file's contents.
   * UTF-8 encoded files may be decoded through:
   * ```javascript
   * var decodedContent = decodeURIComponent(escape(window.atob(base64Content));
   * ```
   */
  static getFileContent(path: string): Promise<string> {
    return new Promise(resolve => {
      resolve(exec('GetFileContent', path));
    });
  }

  /**
   * Returns a base-64 encoded string of the target endpoint's contents.
   * Redirects are resolved, and this bypasses access-control-allow-origin.
   *
   * UTF-8 encoded content may be decoded through:
   * ```javascript
   * var decodedContent = decodeURIComponent(escape(window.atob(base64Content));
   * ```
   */
  static getWebContent(url: string): Promise<string> {
    return new Promise(resolve => {
      exec('GetWebContent', url, (encoded) => {
        resolve(encoded);
      });
    });
  }

  /** Opens a URL in the user's default browser. URLs need to
   *
   */
  static openUrl(url: string) {
    exec('OpenUrl', url);
  }
}
