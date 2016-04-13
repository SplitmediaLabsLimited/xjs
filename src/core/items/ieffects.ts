/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Color} from '../../util/color';

/**
 *  Used by sources that implement the Effect interface.
 *  Check `getMaskEffect()`/`setMaskEffect()` method of
 *  {@link #core/CameraSource#getMaskEffect Core/CameraSource},
 *  {@link #core/FlashSource#getMaskEffect Core/FlashSource},
 *  {@link #core/GameSource#getMaskEffect Core/GameSource},
 *  {@link #core/HtmlSource#getMaskEffect Core/HtmlSource},
 *  {@link #core/ImageSource#getMaskEffect Core/ImageSource},
 *  {@link #core/MediaSource#getMaskEffect Core/MediaSource}, and
 *  {@link #core/ScreenSource#getMaskEffect Core/ScreenSource}.
 */
export enum MaskEffect {
    NONE,
    SHAPE,
    FILE_BIND_TO_SOURCE,
    FILE_BIND_TO_STAGE
}

const _DEFAULT_EFFECT_VALUES: Object = {
  'MASK_EFFECT' : MaskEffect.NONE,
  'BORDER_RADIUS' : 0,
  'BORDER_THICKNESS' : 0,
  'BORDER_OPACITY' : 100,
  'BORDER_COLOR' : Color.fromRGBString('#FFFFFF'),
  'SHADOW_COLOR' : Color.fromRGBString('#FFFFFF'),
  'SHADOW_THICKNESS' : 0,
  'SHADOW_BLUR' : 0,
  'SHADOW_OPACITY' : 100,
  'SHADOW_OFFSET_X' : 0,
  'SHADOW_OFFSET_Y' : 0,
  'FILE_MASK' : '',
  'FILE_MASK_GUIDE' : false
};

const _DEFAULT_EDGE_EFFECT_CONFIG: string = '0,1.00,1.00,1.00,1|1,0,0,0,1|2,0,0,0,0|3,1.00,1.00,1.00,1';

export interface IItemEffect {

  /**
   * return: Promise<MaskEffect>
   *
   * Determines the mask effect being used
   */
  getMaskEffect(): Promise<MaskEffect>;

  /**
   * param: (value: MaskEffect)
   *
   * Sets the mask effect to any one of three possible choices: Shape/Edge effects, File masking (both bind to stage and bind to source), or None(mask effect disabled).
   *
   * *Chainable.*
   *
   * After setting the mask effect, you may tweak settings specific to that effect.
   * - None
   * - Shape: methods prefixed with `getBorderEffect-*`, `getShadowEffect-*`, `setBorderEffect-*`, or `setShadowEffect-*`
   * - File: methods `getFileMask`, `setFileMask`, `showFileMaskingGuide` and `isFileMaskingGuideVisible`
   */
  setMaskEffect(value: MaskEffect): Promise<IItemEffect>;

  // SHAPE/EDGE EFFECTS

  /**
   * return: Promise<number>
   *
   * Gets the border effect radius (0 - 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   */
  getBorderEffectRadius(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the border effect radius (0 - 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   */
  setBorderEffectRadius(value: number): Promise<IItemEffect>;

  /**
   * return: Promise<number>
   *
   * Gets the border effect thickness (0 - 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   */
  getBorderEffectThickness(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the border effect thickness (0 - 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   *
   * Note that since a source occupies its own 'window' in the XBC stage,
   * it is specifically made that the edge effects are still within the boundaries of the source,
   * such that increasing border thickness adds the layer inwards instead of outwards.
   */
  setBorderEffectThickness(value: number): Promise<IItemEffect>;

  /**
   * return: Promise<number>
   *
   * Gets the border effect opacity (0 - 100). Only relevant when mask effect is set to shape
   */
  getBorderEffectOpacity(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the border effect opacity (0 - 100). Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   */
  setBorderEffectOpacity(value: number): Promise<IItemEffect>;

  /**
   * return: Promise<Color>
   *
   * Gets the border effect color. Only relevant when mask effect is set to shape
   */
  getBorderEffectColor(): Promise<Color>;

  /**
   * param: (value: Color)
   *
   * Sets the border effect color. Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   */
  setBorderEffectColor(value: Color): Promise<IItemEffect>;

  /**
   * return: Promise<number>
   *
   * Gets the shadow effect thickness (0 - 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   */
  getShadowEffectThickness(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the shadow effect thickness (0 - 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   *
   * Note that since a source occupies its own 'window' in the XBC stage,
   * it is specifically made that the edge effects are still within the boundaries of the source,
   * such that increasing thickness adds the layer inwards instead of outwards.
   */
  setShadowEffectThickness(value: number): Promise<IItemEffect>;

  /**
   * return: Promise<number>
   *
   * Gets the shadow effect blur (0 - 100). Only relevant when mask effect is set to shape
   */
  getShadowEffectBlur(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the shadow effect blur (0 - 100). Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   */
  setShadowEffectBlur(value: number): Promise<IItemEffect>;

  /**
   * return: Promise<number>
   *
   * Gets the shadow effect opacity (0 - 100). Only relevant when mask effect is set to shape
   */
  getShadowEffectOpacity(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the shadow effect opacity (0 - 100). Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   */
  setShadowEffectOpacity(value: number): Promise<IItemEffect>;

  /**
   * return: Promise<number>
   *
   * Gets the horizontal shadow effect offset (-100 to -100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   */
  getShadowEffectOffsetX(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the horizontal shadow effect offset (-100 to 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   *
   * A positive horizontal offset shifts the shadow to the right of the horizontal center at the background,
   * which visually seems to decrease the left portion of the shadow.
   * A negative horizontal offset in turn shifts the shadow to the left,
   * visually decreasing the right portion of the shadow.
   */
  setShadowEffectOffsetX(value: number): Promise<IItemEffect>;

  /**
   * return: Promise<number>
   *
   * Gets the vertical shadow effect offset (-100 to 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   */
  getShadowEffectOffsetY(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the vertical shadow effect offset (-100 to 100), relative to the size of the source.
   * Only relevant when mask effect is set to shape
   *
   * *Chainable.*
   *
   * A positive vertical offset shifts the shadow below the vertical center at the background,
   * which visually seems to decrease the top portion of the shadow.
   * A negative vertical offset in turn shifts the shadow above,
   * visually decreasing the bottom portion of the shadow.
   */
  setShadowEffectOffsetY(value: number): Promise<IItemEffect>;

  // FILE MASKING

  /**
   * return: Promise<string>
   *
   * Determines the image used to mask the source. Only relevant when mask effect is set to file
   */
  getFileMask(): Promise<string>;

  /**
   * param: (value: string)
   *
   * Sets the image to be used used to mask the source. Only relevant when mask effect is set to file
   *
   * *Chainable.*
   *
   */
  setFileMask(value: string): Promise<IItemEffect>;

  /**
   * return: Promise<boolean>
   *
   * Check whether the file masking guide is visible or not. Only relevant when mask effect is set to file
   */
  isFileMaskingGuideVisible(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * shows or hides the file masking guide. Only relevant when mask effect is set to file
   *
   * *Chainable.*
   *
   * The file masking guide highlights the area of the source that is currently being masked.
   * Please note that resetting mask effect also resets this to false
   */
  showFileMaskingGuide(value: boolean): Promise<IItemEffect>;
}

export class ItemEffect implements IItemEffect {
  private _id: string;

  private _convertToHex(value: string): string {
    var hex = (parseInt(String(Number(value) * 255))).toString(16);
    if (hex.length < 2)
    {
      hex = '0' + hex;
    }
    return hex;
  }

  private _getEdgeEffectValue(value: Object): Promise<number> {
    return new Promise((resolve, reject) => {
      iItem.get('prop:edgeeffectcfg', this._id).then(val => {
        if (val !== '' && val !== null) {
          var edgeConfig = val.split("|");
          var arrayIndex = value['arrayIndex'];
          var individualIndex = value['indIndex'];

          if (typeof edgeConfig[arrayIndex] !== 'undefined') {
            var cfgArray = edgeConfig[arrayIndex].split(',');
            if (Array.isArray(individualIndex)) {
              var newArray = [];
              for (var i = 0; i < individualIndex.length; ++i) {
                var config = individualIndex[i];
                newArray.push(cfgArray[config]);
              }
              resolve(newArray);
            } else {
              resolve(cfgArray[individualIndex]);
            }
          } else {
            reject(RangeError('Invalid parameter. Array index given not included.'));
          }
        } else {
          reject(ReferenceError('Edge effect configuration not set.'));
        }
      });
    });
  }

  private _setEdgeEffectValue(value: Object): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      iItem.get('prop:edgeeffectcfg', this._id).then(val => {
        var edgeConfig = [];
        var edgeEffectString;
        if (val !== '' && val !== null) {
          edgeEffectString = val;
        } else {
          edgeEffectString = _DEFAULT_EDGE_EFFECT_CONFIG;
        }
        var edgeArray = edgeEffectString.split("|");
        var edgeArrayLength = edgeArray.length;
        for (var i = 0; i < edgeArrayLength; ++i) {
          edgeConfig.push(edgeArray[i].split(','));
        }
        var arrayIndex = value['arrayIndex'];
        var individualIndex = value['indIndex'];
        var setValue = value['value'];

        if (typeof edgeConfig[arrayIndex] !== 'undefined') {
          var oldArray = edgeConfig[arrayIndex];
          if (Array.isArray(individualIndex)) {
            for (var j = 0; j < individualIndex.length; ++j) {
              var tempIndex = individualIndex[j];
              oldArray[tempIndex] = setValue[j];
            }
          } else {
            oldArray[individualIndex] = setValue;
          }

          edgeConfig[arrayIndex] = oldArray;
          var edgeEffectStringValue = '';
          for (var k = 0; k < edgeConfig.length; ++k) {
            edgeEffectStringValue = edgeEffectStringValue + edgeConfig[k].toString();
            if (k !== edgeConfig.length - 1) {
              edgeEffectStringValue = edgeEffectStringValue + '|';
            }
          }
          iItem.set('prop:edgeeffectcfg', edgeEffectStringValue, this._id)
          .then(() => {
            resolve(this);
          });
        } else {
          reject(RangeError('Invalid parameter. Array index given not included.'));
        }
      });
    });
  }

  private _getRGBArray(value: Color): Array<number> {
    var hex = value.getRgb();
    var r = parseInt(hex.substring(0,2), 16)/255;
    var g = parseInt(hex.substring(2,4), 16)/255;
    var b = parseInt(hex.substring(4), 16)/255;
    return [r, g, b];
  }

  getMaskEffect(): Promise<MaskEffect> {
    return new Promise(resolve => {
      iItem.get('prop:edgeeffectid', this._id).then(val => {
        if (val === 'border') {
          resolve(MaskEffect.SHAPE);
        } else {
          iItem.get('prop:edgeeffectmaskmode', this._id).then(val => {
            if (val === '1' || val === '3') {
              resolve(MaskEffect.FILE_BIND_TO_SOURCE);
            } else if (val === '2' || val === '4') {
              resolve(MaskEffect.FILE_BIND_TO_STAGE);
            } else {
              resolve(_DEFAULT_EFFECT_VALUES['MASK_EFFECT']);
            }
          });
        }
      });
    });
  }

  setMaskEffect(value: MaskEffect): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a MaskEffect value as the parameter.'));
      } else if (value < 0 || value > 3) {
        reject(RangeError('Use a MaskEffect value as the parameter.'));
      } else {
        if (value === 1) {
          iItem.set('prop:edgeeffectmaskmode', '0', this._id).then(() => {
            return iItem.set('prop:edgeeffectid', 'border', this._id);
          }).then(() => {
            resolve(this);
          });
        } else {
          iItem.set('prop:edgeeffectid', '', this._id).then(() => {
            if (value === 2 || value === 3) {
              value = value - 1;
            } else {
              value = 0;
            }
            return iItem.set('prop:edgeeffectmaskmode', String(value), this._id);
          }).then(() => {
            resolve(this);
          });
        }
      }
    });
  }

  getBorderEffectRadius(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 1;
      parameterObject['indIndex'] = 1;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['BORDER_RADIUS']);
      });
    });
  }

  setBorderEffectRadius(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < 0 || value > 100) {
        reject(RangeError('Valid value is a number from 0 - 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 1;
        parameterObject['indIndex'] = 1;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getBorderEffectThickness(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 1;
      parameterObject['indIndex'] = 2;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['BORDER_THICKNESS']);
      });
    });
  }

  setBorderEffectThickness(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < 0 || value > 100) {
        reject(RangeError('Valid value is a number from 0 - 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 1;
        parameterObject['indIndex'] = 2;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getBorderEffectOpacity(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 0;
      parameterObject['indIndex'] = 4;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['BORDER_OPACITY']);
      });
    });
  }

  setBorderEffectOpacity(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < 0 || value > 100) {
        reject(RangeError('Valid value is a number from 0 - 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 0;
        parameterObject['indIndex'] = 4;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getBorderEffectColor(): Promise<Color> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 0;
      parameterObject['indIndex'] = [1, 2, 3];
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Color.fromRGBString('#' + this._convertToHex(val[0]) + this._convertToHex(val[1]) + this._convertToHex(val[2])));
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['BORDER_COLOR']);
      });
    });
  }

  setBorderEffectColor(value: Color): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 0;
      parameterObject['indIndex'] = [1, 2, 3];
      parameterObject['value'] = this._getRGBArray(value);
      this._setEdgeEffectValue(parameterObject).then(() => {
        resolve(this);
      });
    });
  }

  getShadowEffectColor(): Promise<Color> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 3;
      parameterObject['indIndex'] = [1, 2, 3];
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Color.fromRGBString('#' + this._convertToHex(val[0]) + this._convertToHex(val[1]) + this._convertToHex(val[2])));
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['SHADOW_COLOR']);
      });
    });
  }

  setShadowEffectColor(value: Color): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 3;
      parameterObject['indIndex'] = [1, 2, 3];
      parameterObject['value'] = this._getRGBArray(value);
      this._setEdgeEffectValue(parameterObject).then(() => {
        resolve(this);
      });
    });
  }

  getShadowEffectThickness(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 1;
      parameterObject['indIndex'] = 3;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['SHADOW_THICKNESS']);
      });
    });
  }

  setShadowEffectThickness(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < 0 || value > 100) {
        reject(RangeError('Valid value is a number from 0 - 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 1;
        parameterObject['indIndex'] = 3;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getShadowEffectBlur(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 2;
      parameterObject['indIndex'] = 3;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['SHADOW_BLUR']);
      });
    });
  }

  setShadowEffectBlur(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < 0 || value > 100) {
        reject(RangeError('Valid value is a number from 0 - 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 2;
        parameterObject['indIndex'] = 3;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getShadowEffectOpacity(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 3;
      parameterObject['indIndex'] = 4;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['SHADOW_OPACITY']);
      });
    });
  }

  setShadowEffectOpacity(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < 0 || value > 100) {
        reject(RangeError('Valid value is a number from 0 - 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 3;
        parameterObject['indIndex'] = 4;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getShadowEffectOffsetX(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 2;
      parameterObject['indIndex'] = 1;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['SHADOW_OFFSET_X']);
      });
    });
  }

  setShadowEffectOffsetX(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < -100 || value > 100) {
        reject(RangeError('Valid value is a number from -100 to 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 2;
        parameterObject['indIndex'] = 1;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getShadowEffectOffsetY(): Promise<number> {
    return new Promise(resolve => {
      var parameterObject = {};
      parameterObject['arrayIndex'] = 2;
      parameterObject['indIndex'] = 2;
      this._getEdgeEffectValue(parameterObject).then(val => {
        resolve(Number(val) * 100);
      }).catch(err => {
        resolve(_DEFAULT_EFFECT_VALUES['SHADOW_OFFSET_Y']);
      });
    });
  }

  setShadowEffectOffsetY(value: number): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(TypeError('Use a number as the parameter.'));
      } else if (value < -100 || value > 100) {
        reject(RangeError('Valid value is a number from -100 to 100.'));
      } else {
        var parameterObject = {};
        parameterObject['arrayIndex'] = 2;
        parameterObject['indIndex'] = 2;
        parameterObject['value'] = value/100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve(this);
        });
      }
    });
  }

  getFileMask(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:edgeeffectmask', this._id).then(val => {
        resolve(val);
      });
    });
  }

  setFileMask(value: string): Promise<ItemEffect> {
    return new Promise(resolve => {
      iItem.set('prop:edgeeffectmask', value, this._id).then(() => {
        resolve(this);
      });
    });
  }

  isFileMaskingGuideVisible(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      iItem.get('prop:edgeeffectmaskmode', this._id).then(val => {
        if (val === '4' || val === '3') {
          resolve(true);
        } else if (val === '2' || val === '1') {
          resolve(false);
        } else {
          reject(new Error('This method is not available if filemasking is not enabled.'));
        }
      });
    });
  }

  showFileMaskingGuide(value: boolean): Promise<ItemEffect> {
    return new Promise((resolve, reject) => {
      iItem.get('prop:edgeeffectmaskmode', this._id).then(val => {
        if (val === '1' || val === '3') {
          iItem.set('prop:edgeeffectmaskmode', value ? '3' : '1', this._id);
        } else if (val === '2' || val === '4') {
          iItem.set('prop:edgeeffectmaskmode', value ? '4' : '2', this._id);
        } else {
          reject(new Error('This method is not available if filemasking is not enabled.'));
        }
      })
    });
  }
}
