/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {App as iApp} from '../../internal/app';
import {Item as iItem} from '../../internal/item';
import {
  minVersion,
  versionCompare,
  getVersion
} from '../../internal/util/version';
import {XML} from '../../internal/util/xml';
import {JSON as JXON} from '../../internal/util/json';
import {Environment} from '../environment';
import {Scene} from '../scene';
import {Item, ViewTypes} from '../items/item';
import {iSource, ISource, ItemTypes} from '../source/isource';
import {GameSource} from './game';
import {CameraSource} from './camera';
import {AudioSource} from './audio';
import {VideoPlaylistSource} from './videoplaylist'
import {HtmlSource} from './html';
import {FlashSource} from './flash';
import {ScreenSource} from './screen';
import {ImageSource} from './image';
import {MediaSource} from './media';

/**
 * A `Source` represents an object of an Item that is used on the stage.
 * Manipulating Source specific properties would render changes to all
 * items linked to that source.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Scene = xjs.Scene
 *
 * xjs.ready()
 *    .then(Scene.getById(1))
 *    .then(function(scene) {
 *    scene.getSources().then(function(sources) {
 *    return sources[0].setCustomName('Custom Name');
 *    })
 * })
 *```
 *
 * All methods marked as *Chainable* resolve with the original `Source` instance.
 * This allows you to perform sequential operations correctly: *
 * ```javascript
 * var xjs = require('xjs');
 * var Source = xjs.Source;
 *
 * xjs.ready()
 *    .then(Source.getCurrentSource)
 *    .then(function(source){
 *     //Manipulate source here
 *     return source.setName('New Name');
 *  }).then(function(source){
 *     return source.setKeepLoaded(true)
 *  }).then(function(source){
 *     // set more source properties here
 *  })
 * ```
 */

export class Source implements ISource{
  protected _id: string;
  protected _srcId: string;
  protected _type: ItemTypes;
  protected _value: any;
  protected _name: string;
  protected _cname: string;
  protected _sceneId: string;
  protected _keepLoaded: boolean;

  protected _xmlparams: {};
  protected _isItemCall: boolean;

  constructor(props?: {}) {
    props = props ? props : {};

    this._name = props['name'];
    this._cname = props['cname'];
    this._id = props['id'];
    this._srcId = props['srcid'];
    this._sceneId = props['sceneId'];
    this._value = props['value'];
    this._keepLoaded = props['keeploaded'];
    this._type = Number(props['type']);

    this._xmlparams = props;
    this._isItemCall = false;
  }
  /**
   * return: Promise<Source>
   *
   * Get the current source (when function is called by sources), or the source
   * that was right-clicked to open the source properties window (when function is called
   * from the source properties window)
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Source.getCurrentSource().then(function(source) {
   *   // This will fetch the current source (the plugin)
   * }).catch(function(err) {
   *   // Handle the error here. Errors would only occur
   *   // if we try to execute this method on Extension plugins
   * });
   * ```
   */
  static getCurrentSource(): Promise<Source> {
    return new Promise((resolve, reject) => {
      if (Environment.isExtension()) {
        reject(Error('Extensions do not have sources ' +
          'associated with them.'));
      } else if (
        (Environment.isSourcePlugin() || Environment.isSourceProps()) &&
        versionCompare(getVersion())
          .is
          .greaterThan(minVersion)
      ) {
        iItem.get('itemlist').then(itemlist => {
          const itemId = itemlist.split(',')[0];
          Scene.searchItemsById(itemId).then(item => {
            return item.getSource();
          }).then(source => {
            resolve(source);
          }).catch(() => resolve(null));
        });
      } else if (Environment.isSourcePlugin() || Environment.isSourceProps()) {
        Scene.searchItemsById(iItem.getBaseId()).then(item => {
          return item.getSource();
        }).then(source => {
          resolve(source);
        });
      }
    });
  }

  /**
   * return: Promise<Item[]>
   *
   * Get the item List of the current Source.
   * The item list is a list of items linked to a single Source.
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Source.getItemList()
   * .then(function(items) {
   *   // This will fetch the item list of the current Source
   *   for (var i = 0 ; i < items.length ; i++) {
   *     // Manipulate each item here
   *   }
   * });
   * ```
   *
   * This is just the shorter way of getting items that are linked to a single
   * source. See the long version below:
   * ```javascript
   * xjs.Source.getCurrentSource()
   * .then(source.getItemList)
   * .then(function(items) {
   * // Manipulate the items here
   * })
   * ```
   */
  static getItemList(): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      if (Environment.isExtension()) {
        reject(Error('Extensions do not have default items associated with them.'));
      } else if (
        versionCompare(getVersion())
          .is
          .lessThan(minVersion)
      ) {
        Scene.searchItemsById(iItem.getBaseId()).then(item => {
          const itemArray = [];
          itemArray.push(item);
          resolve(itemArray);
        });
      } else if (Environment.isSourcePlugin() || Environment.isSourceProps()) {
        iItem.get('itemlist').then(itemlist => {
          const promiseArray: Promise<Item>[] = [];
          const itemsArray = itemlist.split(',');

          itemsArray.forEach(itemId => {
            promiseArray.push(new Promise(itemResolve => {
              Scene.searchItemsById(itemId).then(item => {
                itemResolve(item);
              }).catch(() => itemResolve(null));
            }));
          });

          Promise.all(promiseArray).then(results => {
            resolve(results.filter(res => res !== null));
          });
        });
      }
    });
  }

  /**
   * return: Promise<Source[]>
   *
   * Get all unique Source from every scene.
   * Total number of Sources returned may be less than total number of items on
   * all the scenes due to `Linked` items only having a single Source.
   *
   * #### Usage
   * ```javascript
   * xjs.Source.getAllSources().then(function(sources) {
   *   for(var i = 0 ; i < sources.length ; i++) {
   *      if(sources[i] instanceof xjs.HtmlSource) {
   *        // Manipulate HTML Source here
   *      }
   *    }
   * })
   * ```
   */
  static getAllSources(): Promise<Source[]> {
    return new Promise((resolve,reject)=> {
      let allJson = [];
      let allSrc = []
      let uniqueObj = {};
      let uniqueSrc = [];
      let promiseArray = [];
      iApp.getAsItemList('sceneconfig').then(jsonArr => {
        allJson = jsonArr;
        let sourcePromise = srcid => new Promise(sourceResolve => {
          Scene.searchSourcesById(srcid).then(result => {
            allSrc = allSrc.concat(result);
            sourceResolve(result);
          }).catch(err => {
            sourceResolve(null);
          });
        })
        for (var i = 0; i < allJson.length ; i++) {
          if (typeof allJson[i] !== 'undefined') {
            promiseArray.push(sourcePromise(allJson[i]['srcid']));
          }
        }
        Promise.all(promiseArray).then(results => {
          for(var h = 0; h< allSrc.length; h++) {
            if (allSrc[h] !== null) {
              for(var key in allSrc[h]){
                if(key === '_srcId'){
                  uniqueObj[allSrc[h][key]] = allSrc[h];
                }
              }
            }
          }
          for(var j in uniqueObj) {
            if(uniqueObj.hasOwnProperty(j)) {
              uniqueSrc.push(uniqueObj[j]);
            }
          }
          resolve(uniqueSrc);
        })
      }).catch(err => {
        reject(err)
      })
    })
  }

  // Shared with Item

  /**
   * See: {@link #core/ISource#setName setName}
   */
  setName: (value: string) => Promise<Source>

  /**
   * See: {@link #core/ISource#getName getName}
   */
  getName: () => Promise<string>

  /**
   * See: {@link #core/ISource#setCustomName setCustomName}
   */
  setCustomName: () => Promise<Source>

  /**
   * See: {@link #core/ISource#getCustomName getCustomName}
   */
  getCustomName: ()  => Promise<string>

  /**
   * See: {@link #core/ISource#getValue getValue}
   */
  getValue: () => Promise<string | XML>

  /**
   * See: {@link #core/ISource#setValue setValue}
   */
  setValue: (value: string | XML) => Promise<Source>

  /**
   * See: {@link #core/ISource#getKeepLoaded getKeepLoaded}
   */
  getKeepLoaded: () => Promise<boolean>

  /**
   * See: {@link #core/ISource#setKeepLoaded setKeepLoaded}
   */
  setKeepLoaded: (value: boolean) => Promise<Source>

  /**
   * See: {@link #core/ISource#getId getId}
   */
  getId: () => Promise<string>

  /**
   * See: {@link #core/ISource#getSourceId getSourceId}
   */
  getSourceId: () => Promise<string>

  /**
   * See: {@link #core/ISource#getItemList getItemList}
   */
  getItemList: () => Promise<Item[]>

  /**
   * See: {@link #core/ISource#refresh refresh}
   */
  refresh: () => Promise<Source>

  /**
   * See: {@link #core/ISource#getType getType}
   */
  getType: () => Promise<ItemTypes>

}

applyMixins(Source, [iSource])
