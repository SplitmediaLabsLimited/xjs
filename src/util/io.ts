/// <reference path="../../defs/es6-promise.d.ts" />

import {exec} from '../internal/internal';
import {App as iApp} from '../internal/app';
import {Environment} from '../core/environment';
import {Remote} from '../internal/remote';

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
  static openUrl(url: string):Promise<string> {
    return new Promise(resolve => {
      exec('OpenUrl', url).then(res => {
        resolve(res)
      })
    })
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
      if (Environment.isSourcePlugin()) {
        reject(Error('function is not available for source'));
      } else {
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
      }
    });
  }

  static _callback = {};
  static _remoteCallback = {};
  static _proxyCallback = {};

  /**
   * param: (file: string)
   *
   * return: Promise<number>
   *
   * Returns the duration of a video file on the local system, specified in
   * units of 10^-7 seconds.
   */
  static getVideoDuration(file: any) {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('function is not available for source'));
      } else {
        if (typeof file !== 'undefined') {
          if (Remote.remoteType === 'remote') {
            let message = {
              file,
              type: 'window'
            }
            if (IO._remoteCallback[file] === undefined) {
              IO._remoteCallback[file] = [];
            }
            IO._remoteCallback[file].push({resolve,reject});
            Remote.sendMessage(encodeURIComponent(JSON.stringify(message)))
          } else if (Remote.remoteType === 'proxy') {
            if (IO._proxyCallback[file[0]] === undefined) {
              IO._proxyCallback[file[0]] = [];
            }
            IO._proxyCallback[file[0]].push(file[1]);
            exec('GetVideoDuration', file[0]);
          } else {
            if (IO._callback[file] === undefined){
              IO._callback[file] = [];
            }
            IO._callback[file].push({resolve,reject});
            exec('GetVideoDuration', file);
          }
        } else {
          reject(new Error('No file indicated.'))
        }
      }
    });
  };

  static finalCallback(message:string) {
    return new Promise(resolve => {
      const result = JSON.parse(decodeURIComponent(message))
      if (result['result'] !== undefined) {
        IO._remoteCallback[result['file']].shift().resolve(result['result'])
      } else {
        IO._remoteCallback[decodeURIComponent(result['file'])].shift().reject(
          Error('Invalid file path.'));
      }
    })
  }
}

window.OnGetVideoDuration = function(file: string, duration: string) {
  if (Remote.remoteType === 'proxy') {
    IO._proxyCallback[decodeURIComponent(file)][0].apply(this, [Number(duration), file]);
  } else {
    IO._callback[decodeURIComponent(file)].shift().resolve(Number(duration));
    if(IO._callback[decodeURIComponent(file)].length === 0) {
      delete IO._callback[decodeURIComponent(file)];
    }
  }
};

window.OnGetVideoDurationFailed = function(file: string) {
  if (Remote.remoteType === 'proxy') {
    IO._proxyCallback[decodeURIComponent(file)][0].apply(this, [undefined, file]);
  } else {
    IO._callback[decodeURIComponent(file)].shift().reject(
      Error('Invalid file path.'));
    if(IO._callback[decodeURIComponent(file)].length === 0) {
      delete IO._callback[decodeURIComponent(file)];
    }
  }
};

