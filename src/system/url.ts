/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';

/**
 *  Class for adding a web source to the stage.
 *  URLs will use http by default unless https
 *  is specified. This class supports adding
 *  locally hosted HTML files as well.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var Url = XJS.Url;
 *
 * var urlPromise = new Url('https://www.xsplit.com').addToScene();
 * ```
 */
export class Url implements Addable {

  private _url: string;

  /**
   *  param: (url: string)
   *
   *  Creates a URL object. If unspecified, protocol is http.
   */
  constructor(url: string) {
    this._url = url;
  }

  private _getUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (/^https?:\/\//i.test(this._url)) {
        resolve(this._url);
      } else if (/[a-z]+:\/\//i.test(this._url)) {
        reject(new Error('You may only add HTTP or HTTPS URLs to the stage.'));
      } else {
        resolve("http://" + this._url);
      }
    });
  }

  /**
   *  return: Promise<boolean>
   *
   *  Adds this URL to the current scene as an HTML source.
   *
   *  Will raise an error if URL is not http or https.
   */
  addToScene(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._getUrl().then(url => {
        iApp.callFunc('addurl', url).then(() => {
          resolve(true);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }
}
