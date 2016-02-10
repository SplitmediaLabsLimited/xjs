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

  /**
   * return: Promise<Rectangle>
   *
   * Get the cropping of the source
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   *
   * #### Usage
   *
   * ```javascript
   * source.getCropping().then(function(crop) {
   *   // The rest of your code here
   * });
   * ```
   */
  getCropping(): Promise<Rectangle>;

  /**
   * param: (value: Rectangle)
   *
   * Set Source cropping. Relative coordinates (0-1) are required.
   *
   * *Chainable.*
   *
   * Please do note that this method will NOT automatically modify/calculate
   * the height and width of the source whenever you modify cropping,
   * unlike the behavior of XBC when modifying it through the properties window.
   *
   * You will need to manually modify the height and width of the source each time
   * you modify this value to get the best results. If not, it might result to
   * the stretching and/or shrinking of the source.
   * #### Usage
   *
   * ```javascript
   * var rect = xjs.Rectangle.fromCoordinates(0.1, 0.1, 0.2, 0.01);
   * source.setCropping(rect).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setCropping(value: Rectangle): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get canvas rotation of the source
   *
   * #### Usage
   *
   * ```javascript
   * source.getCanvasRotate().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getCanvasRotate(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set canvas rotation of the source (possible values - 0, 90, 180, 270)
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * source.setCanvasRotate(90).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setCanvasRotate(value: number): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get the z-rotation value as can be seen in the source properties window.
   * This value takes into account rotateZ along with canvas rotation.
   *
   * #### Usage
   *
   * ```javascript
   * source.getEnhancedRotate().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getEnhancedRotate(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Source>
   * ```
   *
   * Set Rotate Z value of the source, also taking into account canvas rotation.
   *
   * *Chainable.*
   *
   * This method automatically modifies/calculates
   * the height and width of the source whenever you modify the z-rotation value,
   * changing its orientation (vertical / horizontal) at certain angles.
   * This behavior is what is exhibited in the source properties window.
   *
   * #### Usage
   *
   * ```javascript
   * source.setEnhancedRotate(30).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   */
  setEnhancedRotate(value: number): Promise<IItemLayout>;

  /**
   * param: (value: Rectangle)
   *
   * Set source cropping while automatically calculating
   * and modifying width and height to account for the cropped value.
   *
   * *Chainable.*
   *
   * This behaves the same as in the source properties window
   * and is done to prevent source stretching.
   *
   * #### Usage
   *
   * ```javascript
   * var rect = xjs.Rectangle.fromCoordinates(0.1, 0.1, 0.2, 0.01);
   * source.setEnhancedCropping(rect).then(function(source) {
   *   // Promise resolves with same Source instance
   * });
   * ```
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  // setEnhancedCropping(value: Rectangle): Promise<IItemLayout>;
}

export class ItemLayout implements IItemLayout {
  private _id: string;
  private position: Rectangle;

  private _getCanvasAndZRotate(value: number): Object {
    var rotationObject = {};
    if (value >= -180 && value <= -135)
    {
      rotationObject['canvasRotate'] = 180;
      rotationObject['zRotate'] = value + 180;
      rotationObject['orientation'] = "landscape";
    }
    else if (value > -135 && value < -45)
    {
      rotationObject['canvasRotate'] = 270;
      rotationObject['zRotate'] = value + 90;
      rotationObject['orientation'] = "portrait";
    }
    else if (value >= -45 && value <= 45)
    {
      rotationObject['canvasRotate'] = 0;
      rotationObject['zRotate'] = value;
      rotationObject['orientation'] = "landscape";
    }
    else if (value > 45 && value < 135)
    {
      rotationObject['canvasRotate'] = 90
      rotationObject['zRotate'] = value - 90;
      rotationObject['orientation'] = "portrait";
    }
    else if (value >= 135 && value <= 180)
    {
      rotationObject['canvasRotate'] = 180
      rotationObject['zRotate'] = value - 180;
      rotationObject['orientation'] = "landscape";
    }
    return rotationObject;
  }

  private _adjustRotation(value: number): number {
    if (value > 180) {
      value -= 360;
    } else if (value < -180) {
      value += 360;  
    }
    return value;
  }

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
    return new Promise((resolve, reject) => {
      try {
        iItem.set('prop:pos', value.toCoordinateString(), this._id).then(() => {
          resolve(this);
        });
      } catch(err) {
        reject(err);
      }
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

  getCropping():Promise<Rectangle> {
    return new Promise(resolve => {
      iItem.get('prop:crop', this._id).then(val => {
        var [left, top, right, bottom] = decodeURIComponent(val).split(',');
        resolve(Rectangle.fromCoordinates(Number(left), Number(top),
          Number(right), Number(bottom)));
      });
    });
  }

  setCropping(value: Rectangle): Promise<ItemLayout> {
    return new Promise(resolve => {
        iItem.set('prop:crop', value.toCoordinateString(), this._id).then(() => {
          resolve(this);
      });
    });
  }

  getCanvasRotate(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:rotate_canvas', this._id).then(val => {
        var value = Number(val);
        if ([0, 90, 180, 270].indexOf(value) < 0) {
          resolve(0);
        } else {
          resolve(value);
        }
      });
    });
  }

  setCanvasRotate(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if ([0, 90, 180, 270].indexOf(value) < 0) {
        reject(
          Error('Invalid value. Only possible values are 0, 90, 180 and 270'));
      } else {
        iItem.set('prop:rotate_canvas', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getEnhancedRotate(): Promise<number> {
    return new Promise(resolve => {
      var rotateZ, rotateCanvas, rotateValue;
      iItem.get('prop:rotate_z', this._id).then(val => {
        rotateZ = Number(val);
        return iItem.get('prop:rotate_canvas', this._id);
      }).then(val => {
        rotateCanvas = Number(val);
        rotateValue = this._adjustRotation(rotateCanvas + rotateZ);
        resolve(rotateValue);
      });
    });
  }

  setEnhancedRotate(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -180 || value > 180) {
        reject(Error('Invalid value. Min: -180, Max: 180'));
      } else {
        var formerObject;
        var valueObject = this._getCanvasAndZRotate(Number(value));
        this.getEnhancedRotate().then(val => {
          formerObject = this._getCanvasAndZRotate(Number(val));
          return iItem.set('prop:rotate_z', String(valueObject['zRotate']), this._id)
        }).then(() => {
          return iItem.set('prop:rotate_canvas', String(valueObject['canvasRotate']), this._id)
        }).then(() => {
          if (formerObject['orientation'] !== valueObject['orientation'])
          {
            // interChangeHeightAndWidth();
            var outputResolution, widthMax, heightMax;
            iItem.get('mixerresolution', this._id).then(val => {
              outputResolution = val.split(',');
              widthMax = Number(outputResolution[0]);
              heightMax = Number(outputResolution[1]);
              return iItem.get('prop:pos', this._id);
            }).then(val => {
              var position = val.split(',');
              var leftPosition = parseFloat(position[0]) * widthMax;
              var topPosition = parseFloat(position[1]) * heightMax;
              var rightPosition = parseFloat(position[2]) * widthMax;
              var bottomPosition = parseFloat(position[3]) * heightMax;

              var newLeft, newRight, newTop, newBottom;
              var widthValue = Math.round(rightPosition - leftPosition);
              var heightValue = Math.round(bottomPosition - topPosition);

              if (heightValue > widthMax) {
                newLeft = 0;
                newRight = widthMax;
              } else {
                var xCenter = leftPosition + ((rightPosition - leftPosition)/2);
                newLeft = xCenter - (heightValue/2);
                newRight = xCenter + (heightValue/2);
              }

              if (widthValue > heightMax) {
                newTop = 0;
                newBottom = heightMax;
              } else {
                var yCenter = topPosition + ((bottomPosition - topPosition)/2);
                newTop = yCenter - (widthValue/2);
                newBottom = yCenter + (widthValue/2);
              }

              var leftPos = newLeft/widthMax;
              var topPos = newTop/heightMax;
              var rightPos = newRight/widthMax;
              var bottomPos = newBottom/heightMax;

              return iItem.set('prop:pos', leftPos.toFixed(6) + "," +
                topPos.toFixed(6) + "," + rightPos.toFixed(6) + "," +
                bottomPos.toFixed(6), this._id);
            }).then(() => {
              return iItem.get('prop:posaspect', this._id);
            }).then(val => {
              return iItem.set('prop:pos', val, this._id)
            });
          }
        });
      }
    });
  }  
}
