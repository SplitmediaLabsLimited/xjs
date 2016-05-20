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
  setRotateY(value: number): Promise<IItemLayout>;

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
  setRotateX(value: number): Promise<IItemLayout>;

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
  setRotateZ(value: number): Promise<IItemLayout>;

  /**
   * return: Promise<Object>
   *
   * Get the cropping of the item
   *
   * This returns an object with properties of left, top, right, and bottom
   * whose values are between 0 - 1. This object is not a coordinate system.
   * Top value indicates the portion of the item removed(cropped) from the top,
   * left value indicates the portion of the item removed from the left,
   * and so on.
   *
   * #### Usage
   *
   * ```javascript
   * item.getCropping().then(function(crop) {
   *   // The rest of your code here
   *   var left = crop.left;
   *   var top = crop.top;
   *   var right = crop.right;
   *   var bottom = crop.bottom;
   * });
   * ```
   */
  getCropping(): Promise<Object>;

  /**
   * param: (value: Object)
   *
   * Set Item cropping.
   *
   * This accepts an object with properties left, top, right, and bottom
   * whose values are between 0 - 1. This object is not a coordinate system.
   * Top value indicates the portion of the item removed(cropped) from the top,
   * left value indicates the portion of the item removed from the left,
   * and so on.
   *
   * *Chainable.*
   *
   * Please do note that this method will NOT automatically modify/calculate
   * the height and width of the item whenever you modify cropping,
   * unlike the behavior of XBC when modifying it through the properties window.
   *
   * You will need to manually modify the height and width of the item each time
   * you modify this value to get the best results. If not, it might result to
   * the stretching and/or shrinking of the item.
   * #### Usage
   *
   * ```javascript
   * var obj = {};
   * obj.left = 0.1;
   * obj.top = 0.2;
   * obj.right = 0;
   * obj.bottom = 0.1;
   * item.setCropping(obj).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setCropping(value: Object): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get canvas rotation of the item
   *
   * #### Usage
   *
   * ```javascript
   * item.getCanvasRotate().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getCanvasRotate(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set canvas rotation of the item (possible values - 0, 90, 180, 270)
   *
   * *Chainable.*
   *
   * #### Usage
   *
   * ```javascript
   * item.setCanvasRotate(90).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setCanvasRotate(value: number): Promise<IItemLayout>;

  /**
   * return: Promise<number>
   *
   * Get the z-rotation value as can be seen in the item properties window.
   * This value takes into account rotateZ along with canvas rotation.
   *
   * #### Usage
   *
   * ```javascript
   * item.getEnhancedRotate().then(function(deg) {
   *   // The rest of your code here
   * });
   * ```
   */
  getEnhancedRotate(): Promise<number>;

  /**
   * param: (value: number)
   * ```
   * return: Promise<Item>
   * ```
   *
   * Set Rotate Z value of the item, also taking into account canvas rotation.
   *
   * *Chainable.*
   *
   * This method automatically modifies/calculates
   * the height and width of the item whenever you modify the z-rotation value,
   * changing its orientation (vertical / horizontal) at certain angles.
   * This behavior is what is exhibited in the item properties window.
   *
   * #### Usage
   *
   * ```javascript
   * item.setEnhancedRotate(30).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setEnhancedRotate(value: number): Promise<IItemLayout>;

  /**
   * param: (value: Object)
   *
   * Set item cropping while automatically calculating
   * and modifying width and height to account for the cropped value.
   *
   * This accepts an object with properties left, top, right, and bottom
   * whose values are between 0 - 1. This object is not a coordinate system.
   * Top value indicates the portion of the item removed(cropped) from the top,
   * left value indicates the portion of the item removed from the left,
   * and so on.
   *
   * *Chainable.*
   *
   * This behaves the same as in the item properties window
   * and is done to prevent item stretching.
   *
   * #### Usage
   *
   * ```javascript
   * var obj = {};
   * obj.left = 0.1;
   * obj.top = 0.2;
   * obj.right = 0;
   * obj.bottom = 0.1;
   * item.setCroppingEnhanced(obj).then(function(item) {
   *   // Promise resolves with same Item instance
   * });
   * ```
   */
  setCroppingEnhanced(value: Object): Promise<IItemLayout>;
}

export class ItemLayout implements IItemLayout {
  private _id: string;
  private position: Rectangle;

  private _getCanvasAndZRotate(value: number): Object {
    var rotationObject: Object = {};
    if (value >= -180 && value <= -135)
    {
      rotationObject['canvasRotate'] = 180;
      rotationObject['zRotate'] = value + 180;
      rotationObject['orientation'] = 'landscape';
    }
    else if (value > -135 && value < -45)
    {
      rotationObject['canvasRotate'] = 270;
      rotationObject['zRotate'] = value + 90;
      rotationObject['orientation'] = 'portrait';
    }
    else if (value >= -45 && value <= 45)
    {
      rotationObject['canvasRotate'] = 0;
      rotationObject['zRotate'] = value;
      rotationObject['orientation'] = 'landscape';
    }
    else if (value > 45 && value < 135)
    {
      rotationObject['canvasRotate'] = 90
      rotationObject['zRotate'] = value - 90;
      rotationObject['orientation'] = 'portrait';
    }
    else if (value >= 135 && value <= 180)
    {
      rotationObject['canvasRotate'] = 180
      rotationObject['zRotate'] = value - 180;
      rotationObject['orientation'] = 'landscape';
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
        var [left, top, right, bottom] = String(val).split(',');
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

  getCropping():Promise<Object> {
    return new Promise(resolve => {
      var cropObject: Object = {};
      iItem.get('prop:crop', this._id).then(val => {
        var [left, top, right, bottom] = String(val).split(',');
        cropObject['left'] = Number(left);
        cropObject['top'] = Number(top);
        cropObject['right'] = Number(right);
        cropObject['bottom'] = Number(bottom);
        resolve(cropObject);
      });
    });
  }

  setCropping(value: Object): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value.hasOwnProperty('top') && value.hasOwnProperty('left') &&
        value.hasOwnProperty('right') && value.hasOwnProperty('bottom')) {
        iItem.set('prop:crop', value['left'].toFixed(6) + ',' +
              value['top'].toFixed(6) + ',' + value['right'].toFixed(6) + ',' +
              value['bottom'].toFixed(6), this._id).then(() => {
          resolve(this);
        });
      } else {
        reject('Error setting cropping,' +
          ' insufficient properties (left, top, right, bottom)');
      }
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
      var rotateZ;
      var rotateCanvas;
      var rotateValue;
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
          return iItem.set('prop:rotate_z',
            String(valueObject['zRotate']), this._id)
        }).then(() => {
          return iItem.set('prop:rotate_canvas',
            String(valueObject['canvasRotate']), this._id)
        }).then(() => {
          if (formerObject['orientation'] !== valueObject['orientation'])
          {
            // interChangeHeightAndWidth();
            var outputResolution;
            var widthMax;
            var heightMax;
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

              var newLeft;
              var newRight;
              var newTop;
              var newBottom;
              var widthValue = Math.round(rightPosition - leftPosition);
              var heightValue = Math.round(bottomPosition - topPosition);

              if (heightValue > widthMax) {
                newLeft = 0;
                newRight = widthMax;
              } else {
                var xCenter = leftPosition +
                  ((rightPosition - leftPosition) / 2);
                newLeft = xCenter - (heightValue / 2);
                newRight = xCenter + (heightValue / 2);
              }

              if (widthValue > heightMax) {
                newTop = 0;
                newBottom = heightMax;
              } else {
                var yCenter = topPosition + ((bottomPosition - topPosition) / 2);
                newTop = yCenter - (widthValue/2);
                newBottom = yCenter + (widthValue/2);
              }

              var leftPos = newLeft / widthMax;
              var topPos = newTop / heightMax;
              var rightPos = newRight / widthMax;
              var bottomPos = newBottom / heightMax;

              return iItem.set('prop:pos', leftPos.toFixed(6) + ',' +
                topPos.toFixed(6) + ',' + rightPos.toFixed(6) + ',' +
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

  setCroppingEnhanced(value: Object): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {

      if (value.hasOwnProperty('top') && value.hasOwnProperty('left') &&
        value.hasOwnProperty('right') && value.hasOwnProperty('bottom')) {

        var originalWidth;
        var originalHeight;
        var outputResolution;
        var position;
        var canvasRotate;
        var preCropPosition: Object = {};

        iItem.get('mixerresolution', this._id).then(val => {
          outputResolution = val.split(',');
          return iItem.get('prop:pos', this._id);
        }).then(val => {
          position = val.split(',');
          return iItem.get('prop:rotate_canvas', this._id);
        }).then(val => {
          canvasRotate = val;
          return iItem.get('prop:crop', this._id);
        }).then(val => {
          var mixerWidth = parseInt(outputResolution[0]);
          var mixerHeight = parseInt(outputResolution[1]);

          var leftPositionInit = parseFloat(position[0]) * mixerWidth;
          var topPositionInit = parseFloat(position[1]) * mixerHeight;
          var rightPositionInit = parseFloat(position[2]) * mixerWidth;
          var bottomPositionInit = parseFloat(position[3]) * mixerHeight;

          var widthValue = rightPositionInit - leftPositionInit;
          var heightValue = bottomPositionInit - topPositionInit;

          var crop = val.split(',');

          var leftCropRaw = parseFloat(crop[0]);
          var topCropRaw = parseFloat(crop[1]);
          var rightCropRaw = parseFloat(crop[2]);
          var bottomCropRaw = parseFloat(crop[3]);

          var leftValue = Math.round(leftCropRaw * 100);
          var topValue = Math.round(topCropRaw * 100);
          var rightValue = Math.round(rightCropRaw * 100);
          var bottomValue = Math.round(bottomCropRaw * 100);

          var isNoCropping = ((leftValue == 0) && (topValue == 0) &&
            (rightValue == 0) && (bottomValue == 0));

          if (canvasRotate == 270)
          {
            if (isNoCropping)
            {
              preCropPosition = position;
              originalHeight = widthValue;
              originalWidth = heightValue;
            }
            else
            {
              var leftPosition = parseFloat(position[3]);
              var topPosition = parseFloat(position[0]);
              var rightPosition = parseFloat(position[1]);
              var bottomPosition = parseFloat(position[2]);

              if (leftCropRaw != 0 || rightCropRaw != 0)
              {
                originalWidth = heightValue / (1 - rightCropRaw - leftCropRaw);

                var leftDifference = (originalWidth * leftCropRaw) / mixerHeight;
                preCropPosition[3] = leftPosition + leftDifference;

                var rightDifference = (originalWidth * rightCropRaw) /
                  mixerHeight;
                preCropPosition[1] = rightPosition - rightDifference;
              }
              else
              {
                originalWidth = heightValue;
              }
              if (topCropRaw != 0 || bottomCropRaw != 0)
              {
                originalHeight = widthValue / (1 - bottomCropRaw - topCropRaw);

                var topDifference = (originalHeight * topCropRaw) / mixerWidth;
                preCropPosition[0] = topPosition - topDifference;

                var bottomDifference = (originalHeight * bottomCropRaw) /
                  mixerWidth;
                preCropPosition[2] = bottomPosition + bottomDifference;
              }
              else
              {
                originalHeight = widthValue;
              }

              if (leftCropRaw == 0)
              {
                preCropPosition[3] = position[3];
              }

              if (topCropRaw == 0)
              {
                preCropPosition[0] = position[0];
              }

              if (rightCropRaw == 0)
              {
                preCropPosition[1] = position[1];
              }

              if (bottomCropRaw == 0)
              {
                preCropPosition[2] = position[2];
              }
            }
          }
          else if (canvasRotate == 180)
          {
            if (isNoCropping)
            {
              preCropPosition = position;
              originalWidth = widthValue;
              originalHeight = heightValue;
            }
            else
            {
              var leftPosition = parseFloat(position[2]);
              var topPosition = parseFloat(position[3]);
              var rightPosition = parseFloat(position[0]);
              var bottomPosition = parseFloat(position[1]);

              if (leftCropRaw != 0 || rightCropRaw != 0)
              {
                originalWidth = widthValue / (1 - rightCropRaw - leftCropRaw);

                var leftDifference = (originalWidth * leftCropRaw) / mixerWidth;
                preCropPosition[2] = leftPosition + leftDifference;

                var rightDifference = (originalWidth * rightCropRaw) / mixerWidth;
                preCropPosition[0] = rightPosition - rightDifference;
              }
              else
              {
                originalWidth = widthValue;
              }
              if (topCropRaw != 0 || bottomCropRaw != 0)
              {
                originalHeight = heightValue / (1 - bottomCropRaw - topCropRaw);

                var topDifference = (originalHeight * topCropRaw) / mixerHeight;
                preCropPosition[3] = topPosition + topDifference;

                var bottomDifference = (originalHeight * bottomCropRaw) /
                  mixerHeight;
                preCropPosition[1] = bottomPosition - bottomDifference;
              }
              else
              {
                originalHeight = heightValue;
              }

              if (leftCropRaw == 0)
              {
                preCropPosition[2] = position[2];
              }

              if (topCropRaw == 0)
              {
                preCropPosition[3] = position[3];
              }

              if (rightCropRaw == 0)
              {
                preCropPosition[0] = position[0];
              }

              if (bottomCropRaw == 0)
              {
                preCropPosition[1] = position[1];
              }
            }
          }
          else if (canvasRotate == 90)
          {
            if (isNoCropping)
            {
              preCropPosition = position;
              originalHeight = widthValue;
              originalWidth = heightValue;
            }
            else
            {
              var leftPosition = parseFloat(position[1]);
              var topPosition = parseFloat(position[2]);
              var rightPosition = parseFloat(position[3]);
              var bottomPosition = parseFloat(position[0]);

              if (leftCropRaw != 0 || rightCropRaw != 0)
              {
                originalWidth = heightValue / (1 - rightCropRaw - leftCropRaw);

                var leftDifference = (originalWidth * leftCropRaw) / mixerHeight;
                preCropPosition[1] = leftPosition - leftDifference;

                var rightDifference = (originalWidth * rightCropRaw) /
                  mixerHeight;
                preCropPosition[3] = rightPosition + rightDifference;
              }
              else
              {
                originalWidth = heightValue;
              }
              if (topCropRaw != 0 || bottomCropRaw != 0)
              {
                originalHeight = widthValue / (1 - bottomCropRaw - topCropRaw);

                var topDifference = (originalHeight * topCropRaw) / mixerWidth;
                preCropPosition[2] = topPosition + topDifference;

                var bottomDifference = (originalHeight * bottomCropRaw) /
                  mixerWidth;
                preCropPosition[0] = bottomPosition - bottomDifference;

              }
              else
              {
                originalHeight = widthValue;
              }

              if (leftCropRaw == 0)
              {
                preCropPosition[1] = position[1];
              }

              if (topCropRaw == 0)
              {
                preCropPosition[2] = position[2];
              }

              if (rightCropRaw == 0)
              {
                preCropPosition[3] = position[3];
              }

              if (bottomCropRaw == 0)
              {
                preCropPosition[0] = position[0];
              }
            }
          }
          // canvasRotate is zero
          else
          {
            if (isNoCropping)
            {
              preCropPosition = position;
              originalHeight = heightValue;
              originalWidth = widthValue;
            }
            else
            {
              var leftPosition = parseFloat(position[0]);
              var topPosition = parseFloat(position[1]);
              var rightPosition = parseFloat(position[2]);
              var bottomPosition = parseFloat(position[3]);

              if (leftCropRaw != 0 || rightCropRaw != 0)
              {
                originalWidth = widthValue / (1 - rightCropRaw - leftCropRaw);

                var leftDifference = (originalWidth * leftCropRaw) / mixerWidth;
                preCropPosition[0] = leftPosition - leftDifference;

                var rightDifference = (originalWidth * rightCropRaw) /
                  mixerWidth;
                preCropPosition[2] = rightPosition + rightDifference;
              }
              else
              {
                originalWidth = widthValue;
              }

              if (topCropRaw != 0 || bottomCropRaw != 0)
              {
                originalHeight = heightValue / (1 - bottomCropRaw - topCropRaw);

                var topDifference = (originalHeight * topCropRaw) / mixerHeight;
                preCropPosition[1] = topPosition - topDifference;

                var bottomDifference = (originalHeight * bottomCropRaw) /
                  mixerHeight;
                preCropPosition[3] = bottomPosition + bottomDifference;
              }
              else
              {
                originalHeight = heightValue;
              }

              if (leftCropRaw == 0)
              {
                preCropPosition[0] = position[0];
              }

              if (topCropRaw == 0)
              {
                preCropPosition[1] = position[1];
              }

              if (rightCropRaw == 0)
              {
                preCropPosition[2] = position[2];
              }

              if (bottomCropRaw == 0)
              {
                preCropPosition[3] = position[3];
              }
            }
          }

          var leftCrop = value['left'];
          var topCrop = value['top'];
          var rightCrop = value['right'];
          var bottomCrop = value['bottom'];

          var leftPosition = parseFloat(preCropPosition[0]);
          var topPosition = parseFloat(preCropPosition[1]);
          var rightPosition = parseFloat(preCropPosition[2]);
          var bottomPosition = parseFloat(preCropPosition[3]);

          var sourceHeight = (bottomPosition - topPosition) * mixerHeight;
          var sourceWidth = (rightPosition - leftPosition) * mixerWidth;

          var newLeft, newTop, newRight, newBottom;

          if (canvasRotate == 270)
          {
            newLeft = ((topCrop * sourceWidth) / mixerWidth) + leftPosition;
            newTop = ((rightCrop * sourceHeight) / mixerHeight) + topPosition;
            newRight = rightPosition - ((bottomCrop * sourceWidth) / mixerWidth);
            newBottom = bottomPosition -
              ((leftCrop * sourceHeight) / mixerHeight);
          }
          else if (canvasRotate == 180)
          {
            newLeft = ((rightCrop * sourceWidth) / mixerWidth) + leftPosition;
            newTop = ((bottomCrop * sourceHeight) / mixerHeight) + topPosition;
            newRight = rightPosition - ((leftCrop * sourceWidth) / mixerWidth);
            newBottom = bottomPosition -
              ((topCrop * sourceHeight) / mixerHeight);
          }
          else if (canvasRotate == 90)
          {
            newLeft = ((bottomCrop * sourceWidth) / mixerWidth) + leftPosition;
            newTop = ((leftCrop * sourceHeight) / mixerHeight) + topPosition;
            newRight = rightPosition - ((topCrop * sourceWidth) / mixerWidth);
            newBottom = bottomPosition -
              ((rightCrop * sourceHeight) / mixerHeight);
          }
          else
          {
            newLeft = ((leftCrop * sourceWidth) / mixerWidth) + leftPosition;
            newTop = ((topCrop * sourceHeight) / mixerHeight) + topPosition;
            newRight = rightPosition - ((rightCrop * sourceWidth) / mixerWidth);
            newBottom = bottomPosition -
              ((bottomCrop * sourceHeight) / mixerHeight);
          }

          iItem.set('prop:crop', value['left'].toFixed(6) + ',' +
            value['top'].toFixed(6) + ',' + value['right'].toFixed(6) + ',' +
            value['bottom'].toFixed(6), this._id).then(() => {
              return iItem.set('prop:pos', newLeft.toFixed(6) + ',' +
                newTop.toFixed(6) + ',' + newRight.toFixed(6) + ',' +
                newBottom.toFixed(6), this._id);
          }).then(() => {
            resolve(this);
          });
        });
      } else {
        reject('Error setting cropping,' +
          ' insufficient properties (left, top, right, bottom)');
      }
    });
  }
}
