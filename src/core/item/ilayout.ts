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
   * item.isKeepAspectRatio().then(function(bool) {
   *   // The rest of your code here
   * });
   * ```
   */
  isKeepAspectRatio(): Promise<boolean>;

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set Aspect Ratio to ON or OFF
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setKeepAspectRatio(true).then(function(item) {
   *   // Promise resolves with same Item instance
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
   * item.isPositionLocked().then(function(bool) {
   *   // The rest of your code here
   * });
   * ```
   */
  isPositionLocked(): Promise<boolean>;

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set Position Lock to ON or OFF
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setPositionLocked(true).then(function(item) {
   *   // Promise resolves with same Item instance
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
   * item.isEnhancedResizeEnabled().then(function(bool) {
   *   // The rest of your code here
   * });
   * ```
   */
  isEnhancedResizeEnabled(): Promise<boolean>;

  /**
   * param: (value: boolean)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set Enhance Resize to ON or OFF
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setEnhancedResizeEnabled(true).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setEnhancedResizeEnabled(value: boolean): Promise<IItemLayout>;

  /**
   * return: Promise<Rectangle>
   *
   * Get the position of the item
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   *
   * #### Usage
   *
   * ```javascript
   * item.getPosition().then(function(pos) {
   *   // The rest of your code here
   * });
   * ```
   */
  getPosition(): Promise<Rectangle>;

  /**
   * param: (value: Rectangle)
   *
   * Set Item Position. Relative coordinates (0-1) are required.
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * var rect = xjs.Rectangle.fromCoordinates(0, 0, 1, 1);
   * item.setPosition(rect).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setPosition(value: Rectangle): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Y value of the item
   *
   * #### Usage
   *
   * ```javascript
   * item.getRotateY().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getRotateY(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set Rotate Y value of the item
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setRotateY(30).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setRotateY(value: number): Promise<ItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get Rotate X value of the item
   *
   * #### Usage
   *
   * ```javascript
   * item.getRotateX().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getRotateX(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set Rotate X value of the item
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setRotateX(30).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setRotateX(value: number): Promise<ItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get Rotate Z value of the item.
   *
   * #### Usage
   *
   * ```javascript
   * item.getRotateX().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getRotateZ(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set Rotate Z value of the item.
   *
   * *Chainable.*
   *
   * Please do note that this method will NOT automatically modify/calculate
   * the height and width of the item whenever you modify the rotate Z value,
   * unlike the behavior of XBC when modifying it through the properties window.
   *
   * You will need to manually modify the height and width of the item each time
   * you modify this value to get the best results. If not, it might result to
   * the stretching and/or shrinking of the item.
   *
   * #### Usage
   *
   * ```javascript
   * item.setRotateZ(30).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setRotateZ(value: number): Promise<ItemLayout>;
}

export class ItemLayout implements IItemLayout {
  private _id: string;
  private position: Rectangle;

  isKeepAspectRatio(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:keep_ar', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setKeepAspectRatio(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:keep_ar', value ? '1' : '0', slot).then(() => {
        resolve(this);
      });
    });
  }

  isPositionLocked(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:lockmove', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setPositionLocked(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:lockmove', value ? '1' : '0', slot).then(() => {
        resolve(this);
      });
    });
  }

  isEnhancedResizeEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:mipmaps', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setEnhancedResizeEnabled(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:mipmaps', value ? '1' : '0', slot).then(() => {
        resolve(this);
      });
    });
  }

  getPosition():Promise<Rectangle> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:pos', slot).then(val => {
        var [left, top, right, bottom] = decodeURIComponent(val).split(',');
        this.position = Rectangle.fromCoordinates(Number(left), Number(top),
          Number(right), Number(bottom));
        resolve(this.position);
      });
    });
  }

  setPosition(value: Rectangle): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this.position = value;
      iItem.set('prop:pos', value.toCoordinateString(), slot).then(() => {
        resolve(this);
      });
    });
  }

  getRotateY(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:rotate_y', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateY(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:rotate_y', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateX(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:rotate_x', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateX(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:rotate_x', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateZ(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:rotate_z', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateZ(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:rotate_z', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }
}
