/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';


export interface IItemLayout {

  /**
   * return: Promise<boolean>
   *
   * Check if Aspect Ratio is set to ON or OFF
   *
   * #### Usage
   *
   * ```javascript
   * source.isKeepAspectRatio().then(function(bool) {
   *   // The rest of your code here
   * });
   * ```
   */
  isKeepAspectRatio(): Promise<boolean>;

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Aspect Ratio to ON or OFF
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setKeepAspectRatio(true).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setKeepAspectRatio(value: boolean): Promise<IItemLayout>;

  /**
   * return: Promise<boolean>
   *
   * Check if Position Locked is set to ON or OFF
   *
   * #### Usage
   *
   * ```javascript
   * source.isPositionLocked().then(function(bool) {
   *   // The rest of your code here
   * });
   * ```
   */
  isPositionLocked(): Promise<boolean>;

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Position Lock to ON or OFF
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setPositionLocked(true).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setPositionLocked(value: boolean): Promise<IItemLayout>;

  /**
   * return: Promise<boolean>
   *
   * Check if Enhance Resize is Enabled or Disabled
   *
   * #### Usage
   *
   * ```javascript
   * source.isEnhancedResizeEnabled().then(function(bool) {
   *   // The rest of your code here
   * });
   * ```
   */
  isEnhancedResizeEnabled(): Promise<boolean>;

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Enhance Resize to ON or OFF
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setEnhancedResizeEnabled(true).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setEnhancedResizeEnabled(value: boolean): Promise<IItemLayout>;

  /**
   * return: Promise<Rectangle>
   *
   * Get the position of the source
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   *
   * #### Usage
   *
   * ```javascript
   * source.getPosition().then(function(pos) {
   *   // The rest of your code here
   * });
   * ```
   */
  getPosition(): Promise<Rectangle>;

  /**
   * param: (value: Rectangle)
   *
   * Set Source Position. Relative coordinates (0-1) are required.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * var rect = xjs.Rectangle.fromCoordinates(0, 0, 1, 1);
   * source.setPosition(rect).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setPosition(value: Rectangle): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Y value of the source
   *
   * #### Usage
   *
   * ```javascript
   * source.getRotateY().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getRotateY(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Rotate Y value of the source
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setRotateY(30).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setRotateY(value: number): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get Rotate X value of the source
   *
   * #### Usage
   *
   * ```javascript
   * source.getRotateX().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getRotateX(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Rotate X value of the source
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setRotateX(30).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setRotateX(value: number): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Z value of the source.
   *
   * #### Usage
   *
   * ```javascript
   * source.getRotateX().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getRotateZ(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Rotate Z value of the source.
   *
   * *Chainable.*
   *
   * Please do note that this method will NOT automatically modify/calculate
   * the height and width of the source whenever you modify the rotate Z value,
   * unlike the behavior of XBC when modifying it through the properties window.
   *
   * You will need to manually modify the height and width of the source each time
   * you modify this value to get the best results. If not, it might result to
   * the stretching and/or shrinking of the source.
   *
   * #### Usage
   *
   * ```javascript
   * source.setRotateZ(30).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setRotateZ(value: number): Promise<IItemLayout>;
}

export class ItemLayout implements IItemLayout {
  private _id: string;
  private position: Rectangle;

  isKeepAspectRatio(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:keep_ar', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setKeepAspectRatio(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      iItem.set('prop:keep_ar', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  isPositionLocked(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:lockmove', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setPositionLocked(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      iItem.set('prop:lockmove', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  isEnhancedResizeEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:mipmaps', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setEnhancedResizeEnabled(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      iItem.set('prop:mipmaps', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  getPosition():Promise<Rectangle> {
    return new Promise(resolve => {
      iItem.get('prop:pos', this._id).then(val => {
        var [left, top, right, bottom] = decodeURIComponent(val).split(',');
        this.position = Rectangle.fromCoordinates(Number(left), Number(top),
          Number(right), Number(bottom));
        resolve(this.position);
      });
    });
  }

  setPosition(value: Rectangle): Promise<ItemLayout> {
    return new Promise(resolve => {
      this.position = value;
        iItem.set('prop:pos', value.toCoordinateString(), this._id).then(() => {
          resolve(this);
      });
    });
  }

  getRotateY(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:rotate_y', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateY(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        iItem.set('prop:rotate_y', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateX(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:rotate_x', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateX(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        iItem.set('prop:rotate_x', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateZ(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:rotate_z', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateZ(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        iItem.set('prop:rotate_z', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }
}
