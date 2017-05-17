/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Addable} from './iaddable';
import {Scene} from '../core/scene';

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
        resolve('http://' + this._url);
      }
    });
  }

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Adds this URL to the current scene as an HTML source by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   *
   *  Will raise an error if URL is not http or https.
   */
  addToScene(value?: number | Scene ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let scenePrefix = '';
      let scenePromise;
      if (typeof value === 'number' || value instanceof Scene) {
        scenePromise = new Promise((innerResolve, innerReject) => {
          Scene.getSceneCount().then(sceneCount => {
            if (typeof value === 'number') {
              let int = Math.floor(value);
              if (int > sceneCount || int === 0) {
                innerReject(new Error('Scene not existing.'));
              } else {
                scenePrefix = 's:' + (int - 1) + '|';
                innerResolve();
              }
            } else {
              value.getSceneNumber().then(int => {
                if (int > sceneCount || int === 0) {
                  innerReject(new Error('Scene not existing.'));
                } else {
                  scenePrefix = 's:' + (int - 1) + '|';
                  innerResolve();
                }
              });
            }
          });
        });
      } else if (typeof value === 'undefined') {
        scenePromise = Promise.resolve();
      } else {
        scenePromise = Promise.reject(new Error('Optional parameter \'scene\' only accepts integers or an XJS.Scene object'))
      }

      scenePromise.then(() => {
        return this._getUrl();
      }).then(url => {
        return iApp.callFunc(scenePrefix + 'addurl', url);
      }).then(() => {
        resolve(true);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
