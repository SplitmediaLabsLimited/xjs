/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Rectangle} from '../../util/rectangle';
import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {Scene} from '../scene';
import {ItemLayout, IItemLayout} from './ilayout';

export enum SourceTypes {
  UNDEFINED,
  FILE,
  LIVE,
  TEXT,
  BITMAP,
  SCREEN,
  FLASHFILE,
  GAMESOURCE,
  HTML
}

/**
 * A `Source` represents an object that is used as a source on the stage.
 * Some possible sources are games, microphones, or a webpage.
 *
 * Implements: {@link #core/IItemLayout Core/IItemLayout}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Scene = xjs.Scene.getById(0);
 *
 * Scene.getSources().then(function(sources) {
 *   if (sources.length === 0) return;
 *
 *   // There's a valid source, let's use that
 *   var source = sources[sources.length - 1];
 *   return source.setCustomName('SourceTesting');
 * }).then(function(source) {
 *   // Do something else here
 * });
 * ```
 * All methods marked as *Chainable* resolve with the original `Source` instance.
 * This allows you to perform sequential operations correctly:
 * ```javascript
 * var xjs = require('xjs');
 * var Source = xjs.Source;
 *
 * // a source that sets its own properties on load
 * xjs.ready()
 *    .then(Source.getCurrentSource)
 *    .then(function(source) {
 *     return source.setCustomName('MyCustomName');
 *  }).then(function(source) {
 *     return source.setKeepLoaded(true);
 *  }).then(function(source) {
 *     // set more properties here
 *  });
 * ```
 */
export class Source implements IItemLayout {
  protected _id: string;
  protected _type: SourceTypes;
  protected _value: any;
  private _name: string;
  private _cname: string;
  private _sceneId: number;
  private _keepLoaded: boolean;

  private _xmlparams: {};

  constructor(props?: {}) {
    props = props ? props : {};

    this._name = props['name'];
    this._cname = props['cname'];
    this._id = props['id'];
    this._sceneId = props['sceneId'];
    this._value = props['value'];
    this._keepLoaded = props['keeploaded'];
    this._type = Number(props['type']);

    this._xmlparams = props;
  }

  /**
   * param: (value: string)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Sets the name of the source.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setName('newNameHere').then(function(source) {
   *   // Promise resolves with same Source instance when name has been set
   *   return source.getName();
   * }).then(function(name) {
   *   // 'name' should be the updated value by now.
   * });
   * ```
   */
  setName(value: string): Promise<Source> {
    return new Promise(resolve => {
      this._name = value;
      iItem.set('prop:name', this._name, this._id).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Gets the name of the source.
   *
   * #### Usage
   *
   * ```javascript
   * source.getName().then(function(name) {
   *   // Do something with the name
   * });
   * ```
   */
  getName(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:name', this._id).then(val => {
        this._name = val;
        resolve(val);
      });
    });
  }

  /**
   * param: (value: string)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Sets the custom name of the source.
   *
   * The main difference between `setName` and `setCustomName` is that the CustomName
   * can be edited by users using XBC through the bottom panel. `setName` on
   * the other hand would update the source's internal name property.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setCustomName('newNameHere').then(function(source) {
   *   // Promise resolves with same Source instance when custom name has been set
   *   return source.getCustomName();
   * }).then(function(name) {
   *   // 'name' should be the updated value by now.
   * });
   * ```
   */
  setCustomName(value: string): Promise<Source> {
    return new Promise(resolve => {
      this._cname = value;
      iItem.set('prop:cname', this._cname, this._id).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Gets the custom name of the source.
   *
   * #### Usage
   *
   * ```javascript
   * source.getCustomName().then(function(name) {
   *   // Do something with the name
   * });
   * ```
   */
  getCustomName(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:cname', this._id).then(val => {
        this._cname = val;
        resolve(val);
      });
    });
  }

  /**
   * return: Promise<string|XML>
   *
   * Gets a special string that refers to the source's main definition.
   *
   * This method can resolve with an XML object, which is an object generated by
   * the framework. Call `toString()` to transform into an XML String. (See the
   * documentation for `setValue` for more details.)
   *
   * #### Usage
   *
   * ```javascript
   * source.getValue().then(function(value) {
   *   // Do something with the value
   * });
   * ```
   */
  getValue(): Promise<string|XML> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(val => {
        val = (val === 'null') ? '' : val;
        if (val === '') { // don't return XML for null values
          this._value = '';
          resolve(val);
        } else {
          try {
            this._value = XML.parseJSON(JXON.parse(val));
            resolve(this._value);
          } catch (e) {
            // value is not valid XML (it is a string instead)
            this._value = val;
            resolve(val);
          }
        }
      });
    });
  }

  /**
   * param: (value: string)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set the source's main definition; this special string defines the source's
   * "identity". Each type of source requires a different format for this value.
   *
   * *Chainable.*
   *
   * **WARNING:**
   * Please do note that using this method COULD break the current source, possibly modifying
   * its type IF you set an invalid string for the current source.
   *
   * #### Possible values by source type
   * - FILE - path/URL
   * - LIVE - Device ID
   * - BITMAP - path
   * - SCREEN - XML string
   * - FLASHFILE - path
   * - GAMESOURCE - XML string
   * - HTML - path/URL or html:<plugin>
   *
   * #### Usage
   *
   * ```javascript
   * source.setValue('@DEVICE:PNP:\\?\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\GLOBAL')
   *   .then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setValue(value: string | XML): Promise<Source> {
    return new Promise(resolve => {
      var val: string = (typeof value === 'string') ?
        <string> value : (<XML> value).toString();
      if (typeof value !== 'string') { // XML
        this._value = JXON.parse(val);
      } else {
        this._value = val;
      }
      iItem.set('prop:item', val, this._id).then(() => {
        resolve(this);
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Check if source is kept loaded in memory
   *
   * #### Usage
   *
   * ```javascript
   * source.getKeepLoaded().then(function(isLoaded) {
   *   // The rest of your code here
   * });
   * ```
   */
  getKeepLoaded(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:keeploaded', this._id).then(val => {
        this._keepLoaded = (val === '1');
        resolve(this._keepLoaded);
      });
    });
  }

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Keep loaded option to ON or OFF
   *
   * Sources with Keep loaded set to ON would emit `scene-load` event each time
   * the active scene switches to the source's current scene.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setKeepLoaded(true).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setKeepLoaded(value: boolean): Promise<Source> {
    return new Promise(resolve => {
      this._keepLoaded = value;
      iItem.set('prop:keeploaded', (this._keepLoaded ? '1' : '0'), this._id)
        .then(() => {
          resolve(this);
      });
    });
  }

  /**
   * return: Promise<SourceTypes>
   *
   * Get the type of the source
   *
   * #### Usage
   *
   * ```javascript
   * source.getType().then(function(type) {
   *   // The rest of your code here
   * });
   * ```
   */
  getType(): Promise<SourceTypes> {
    return new Promise(resolve => {
      iItem.get('prop:type', this._id).then(val => {
        this._type = SourceTypes[SourceTypes[Number(val)]];
        resolve(this._type);
      });
    });
  }

  /**
   * return: Promise<string>
   *
   * Get the ID of the source
   *
   * #### Usage
   *
   * ```javascript
   * source.getId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getId(): Promise<string> {
    return new Promise(resolve => {
      resolve(this._id);
    });
  }

  /**
   * return: Promise<number>
   *
   * Get (1-indexed) Scene ID where the source is loaded
   *
   * #### Usage
   *
   * ```javascript
   * source.getSceneId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getSceneId(): Promise<number> {
    return new Promise(resolve => {
      resolve(Number(this._sceneId) + 1);
    });
  }

  /**
   * return: XML
   *
   * Convert the Source object to an XML object. Use `toString()` to
   * get the string version of the returned object.
   *
   * #### Usage
   *
   * ```javascript
   * var xml = source.toXML();
   * ```
   */
  toXML(): XML {
    var item: JXON = new JXON();

    item['tag'] = 'item';
    item['name'] = this._name;
    item['item'] = this._value;
    item['type'] = this._type;
    item['selfclosing'] = true;

    if (this._cname) {
      item['cname'] = this._cname;
    }

    return XML.parseJSON(item);
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
      } else if (Environment.isSourcePlugin() || Environment.isSourceConfig()) {
        Scene.searchSourcesById(iItem.getBaseId()).then(item => {
          resolve(item); // this should always exist
        });
      }
    });
  }

  /**
   *  return: Promise<Source>
   *
   *  Refreshes the specified source.
   *
   *  #### Usage
   *  ```javascript
   *  // Sample 1: let source refresh itself
   *  xjs.Source.getCurrentSource().then(function(source) {
   *    source.refresh(); // execution of JavaScript halts because of refresh
   *  });
   *
   *  // Sample 2: refresh some other source 'otherSource'
   *  otherSource.refresh().then(function(source) {
   *    // further manipulation of other source goes here
   *  });
   *  ```
   */
  refresh(): Promise<Source> {
    return new Promise(resolve => {
      iItem.set('refresh', '', this._id).then(() => {
        resolve(this);
      });
    });
  }

   // SourceLayout

  /**
   * See: {@link #core/IItemLayout#isKeepAspectRatio isKeepAspectRatio}
   */
  isKeepAspectRatio: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isPositionLocked isPositionLocked}
   */
  isPositionLocked: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#isEnhancedResizeEnabled isEnhancedResizeEnabled}
   */
  isEnhancedResizeEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemLayout#getCanvasRotate getCanvasRotate}
   */
  getCanvasRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getCropping getCropping}
   */
  getCropping: () => Promise<Object>;

  /**
   * See: {@link #core/IItemLayout#getEnhancedRotate getEnhancedRotate}
   */
  getEnhancedRotate: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getPosition getPosition}
   */
  getPosition: () => Promise<Rectangle>;

  /**
   * See: {@link #core/IItemLayout#getRotateY getRotateY}
   */
  getRotateY: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateX getRotateX}
   */
  getRotateX: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#getRotateZ getRotateZ}
   */
  getRotateZ: () => Promise<number>;

  /**
   * See: {@link #core/IItemLayout#setCanvasRotate setCanvasRotate}
   */
  setCanvasRotate: (value: number) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate:        (value: number) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio:       (value: boolean) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked:        (value: boolean) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled:  (value: boolean) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition:              (value: Rectangle) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY:              (value: number) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX:              (value: number) => Promise<Source>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ:              (value: number) => Promise<Source>;

}

applyMixins(Source, [ItemLayout]);
