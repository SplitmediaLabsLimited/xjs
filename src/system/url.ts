/// <reference path="../../defs/es6-promise.d.ts" />

import {Addable} from './iaddable';
import {Scene} from '../core/scene';
import{checkSplitmode} from '../internal/util/splitmode';
import {addToSceneHandler} from '../util/addtosceneutil';

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
        reject(Error('You may only add HTTP or HTTPS URLs to the stage.'));
      } else {
        resolve('http://' + this._url);
      }
    });
  }

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this URL to the current scene as an HTML source by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Will only raise an error if URL is not http or https.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value?: number | Scene ): Promise<any> {
    return new Promise((resolve, reject) => {
      let scenePrefix = '';
      checkSplitmode(value).then((prefix) => {
        scenePrefix = prefix
        return this._getUrl();
      }).then(url => {
        return addToSceneHandler(scenePrefix + 'addurl', url);
      }).then(result => {
        resolve(result);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
