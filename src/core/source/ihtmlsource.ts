/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {Environment} from '../environment';
import {Rectangle} from '../../util/rectangle';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';

export class IHtmlSource {
  protected _id: string;
  protected _isItemCall: boolean;

  constructor(props?: {}) {
    props = props ? props : {};

    this._id = props['id'];
  }

  /**
   * return: Promise<string>
   *
   * Gets the URL of this webpage item.
   */
  getURL(): Promise<string> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(url => {
        let _url = String(url).split('*');
        url = _url[0];
        resolve(url);
      });
    });
  }

  /**
   * param: (url: string)
   * ```
   * return: Promise<HtmlSource>
   * ```
   *
   * Sets the URL of this webpage item.
   *
   * *Chainable.*
   */
  setURL(value: string): Promise<IHtmlSource> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise((resolve, reject) => {
      iItem.get('prop:item', this._id).then(url => {
        let _url = String(url).split('*');
        _url[0] = value;

        return iItem.set('prop:item', _url.join('*'), this._id);
      }).then(code => {
        if (code) {
          resolve(this);
        } else {
          reject('Invalid value');
        }
      });
    });
  }
}
