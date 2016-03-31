/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {App as iApp} from '../internal/app';


export class IO {

  /**
   * param: (path: string)
   * ```
   * return: Promise<string>
   * ```
   *
   * Returns a base-64 encoded string of the target file's contents.
   * UTF-8 encoded files may be decoded through:
   * ```javascript
   * IO.getFileContent('C:\\text.txt').then(function(base64Content) {
   *   var actualContent = decodeURIComponent(escape(window.atob(base64Content));
   * });
   * ```
   */
  static getFileContent(path: string): Promise<string> {
    return new Promise(resolve => {
      resolve(exec('GetFileContent', path));
    });
  }

  /**
   * param: (url: string)
   * ```
   * return: Promise<string>
   * ```
   *
   * Returns a base-64 encoded string of the target endpoint's contents.
   * Redirects are resolved, and this bypasses access-control-allow-origin.
   *
   * UTF-8 encoded content may be decoded through:
   * ```javascript
   * IO.getWebContent('http://example.com').then(function(base64Content) {
   *   var actualContent = decodeURIComponent(escape(window.atob(base64Content));
   * });
   * ```
   */
  static getWebContent(url: string): Promise<string> {
    return new Promise(resolve => {
      exec('GetWebContent', url, encoded => {
        resolve(encoded);
      });
    });
  }

  /**
   * param: (url: string)
   *
   * Opens a URL in the user's default browser. URL must specify HTTP or HTTPS.
   *
   */
  static openUrl(url: string) {
    exec('OpenUrl', url);
  }

  private static _ALLOW_MULTI_SELECT: number = 0x200;
  private static _FILE_MUST_EXIST: number = 0x1000;
  private static _FORCE_SHOW_HIDDEN: number = 0x10000000;

  /**
   * param: ([options] [, filter]) -- see below
   * ```
   * return: Promise<string[]>
   * ```
   * Opens a file dialog for the user to select a file (or multiple files).
   * Resolves with an array of strings, each of which contains the full path
   * and filename of a selected file. Rejects when the dialog is canceled.
   *
   * The first (optional) argument is a JSON object that can be used to indicate
   * that certain flags should be true. These are documented as follows:
   * - `allowMultiSelect`: allows users to select multiple files.
   * - `fileMustExist`: prevents users from typing a name of a nonexistent file
   * - `forceShowHidden`: lets the dialog show files marked as System or Hidden
   *  (but not both)
   *
   * The second argument (also optional) is a JSON object used to specify the
   * filter for items to be displayed. It takes two members:
   * - `name`: the description of the filter (for example: Image Files)
   * - `extensions`: an array of file extensions (for example: `['jpg','bmp']`);
   */
  static openFileDialog(optionBag ?: {
        allowMultiSelect ?: boolean,
        fileMustExist    ?: boolean,
        forceShowHidden  ?: boolean
      },
      filter ?: { name : boolean, extensions : String[] }): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let flags: number = 0;
      if (optionBag !== undefined && optionBag !== null) {
        if (optionBag.allowMultiSelect === true) {
          flags = flags | IO._ALLOW_MULTI_SELECT;
        }

        if (optionBag.fileMustExist === true) {
          flags = flags | IO._FILE_MUST_EXIST;
        }

        if (optionBag.forceShowHidden === true) {
          flags = flags | IO._FORCE_SHOW_HIDDEN;
        }
      }

      let filterString: string = '';
      if (filter !== undefined && filter !== null &&
          filter.name !== undefined && filter.extensions !== undefined) {
        filterString = filter.name + '|';
        filterString += (filter.extensions.map(val => {
          return '*.' + val;
        })).join(';');
        filterString += '||';
      }

      exec('OpenFileDialogAsync', null, null, String(flags), filterString,
          path => {
            if (path !== 'null') {
              resolve(path.split('|'));
            } else {
              reject(Error('File selection cancelled.'));
            }
      });
    });
  }

  /**
   * param: (file: string)
   *
   * return: Promise<number>
   *
   * Returns the duration of a video file on the local system, specified in
   * units of 10^-7 seconds.
   */

  static _callback = {};
  static getVideoDuration(file: string) {

    return new Promise((resolve, reject) => {

      if (IO._callback[file] === undefined){
        IO._callback[file] = [];
      }

      IO._callback[file].push({resolve,reject});
      exec('GetVideoDuration', file);
    });
  };
}

window.OnGetVideoDuration = function(file: string, duration: number) {
  IO._callback[decodeURIComponent(file)].shift().resolve(duration);
  if(IO._callback[decodeURIComponent(file)].length === 0) {
    delete IO._callback[decodeURIComponent(file)];
  }
};

window.OnGetVideoDurationFailed = function(file: string) {
  IO._callback[decodeURIComponent(file)].shift().reject(
    Error('Invalid file path.'));
  if(IO._callback[decodeURIComponent(file)].length === 0) {
    delete IO._callback[decodeURIComponent(file)];
  }
};

