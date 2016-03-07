/// <reference path="../../../defs/es6-promise.d.ts" />

import {exec} from '../../internal/internal';
import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {ItemChroma, IItemChroma, KeyingType, ChromaPrimaryColors,
ChromaAntiAliasLevel} from './ichroma';
import {ItemTransition, IItemTransition} from './itransition';
import {Source} from './source';
import {Scene} from '../scene';
import {Transition} from '../transition';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {Environment} from '../environment';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';

/**
 * The ScreenSource class represents a screen capture source.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition}
 *
 *  All methods marked as *Chainable* resolve with the original `ScreenSource`
 *  instance.
 */
export class ScreenSource extends Source implements IItemLayout, IItemColor, IItemChroma, IItemTransition {
  /**
   * return: Promise<Rectangle>
   *
   * Gets the Capture Area of the Screen Capture Source. Returns a Rectangle
   * object.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
   getCaptureArea(): Promise<Rectangle> {
    return new Promise(resolve => {
      this.getValue().then(val => {
        if (!(val instanceof XML)) {
          resolve(Rectangle.fromCoordinates(0, 0, 0, 0));
        } else {
          let _value: JXON = JXON.parse(val);
          resolve(Rectangle.fromCoordinates(
            Number(_value['left']),
            Number(_value['top']),
            Number(_value['width']) + Number(_value['left']),
            Number(_value['height']) + Number(_value['top'])
          ));
        }
      });
    });
  }

  /**
   * param: Promise<Rectangle>
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Sets the Window Capture Area of the Screen Capture Source.
   *
   * *Chainable.*
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   */
  setCaptureArea(dimension: Rectangle): Promise<ScreenSource> {
    return new Promise(resolve => {
      this.getValue().then(val => {
        return new Promise(iResolve => {
          iItem.get('screenresolution', this._id).then(res => {
            let _res = res.split(',');
            iResolve({
              value : val,
              res : Rectangle.fromCoordinates(
                Number(_res[0]),
                Number(_res[1]),
                Number(_res[2]),
                Number(_res[3])
              )
            });
          });
        });
      }).then((obj: { value: any, res: Rectangle }) => {
        let _config = new JXON();

        if (!(obj.value instanceof XML)) {
          _config['tag'] = 'screen';
          _config['module'] = '';
          _config['window'] = '';
          _config['hwnd'] = '0';
          _config['wclient'] = '0';
          _config['left'] = '0';
          _config['top'] = '0';
          _config['width'] = '0';
          _config['height'] = '0';
        } else {
          _config = JXON.parse(obj.value);
        }

        _config['left'] = dimension.getLeft() >= obj.res.getLeft() ?
          dimension.getLeft() : Number(_config['left']) >= obj.res.getLeft() ?
            _config['left'] : obj.res.getLeft();
        _config['top'] = dimension.getTop() >= obj.res.getTop() ?
          dimension.getTop() : Number(_config['top']) >= obj.res.getTop() ?
            _config['top'] : obj.res.getTop();
        _config['width'] = dimension.getWidth() <= obj.res.getWidth() ?
          dimension.getWidth() : Number(_config['width']) <=
            obj.res.getWidth() ? _config['width'] : obj.res.getWidth();
        _config['height'] = dimension.getHeight() <= obj.res.getHeight() ?
          dimension.getHeight() : Number(_config['height']) <=
            obj.res.getHeight() ? _config['height'] : obj.res.getHeight();

        this.setValue(XML.parseJSON(_config)).then(() => {
          resolve(this);
        });
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Checks if the Screen Capture Source only captures the
   * Client area (does not capture the title bar, menu bar, window border, etc.)
   */
  isClientArea(): Promise<boolean> {
    return new Promise(resolve => {
      this.getValue().then(val => {
        if (!(val instanceof XML)) {
          resolve(false);
        } else {
          let _value: JXON = JXON.parse(val);
          resolve(_value['wclient'] === '1');
        }
      });
    });
  }

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Set the Screen Capture to capture the Client area only or include
   * the titlebar, menu bar, window border, etc.
   */
  setClientArea(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      this.getValue().then(val => {
        let _config = new JXON();

        if (!(val instanceof XML)) {
          _config['tag'] = 'screen';
          _config['module'] = '';
          _config['window'] = '';
          _config['hwnd'] = '0';
          _config['wclient'] = '0';
          _config['left'] = '0';
          _config['top'] = '0';
          _config['width'] = '0';
          _config['height'] = '0';
        } else {
          _config = JXON.parse(val);
        }

        _config['wclient'] = (value ? '1' : '0');

        this.setValue(XML.parseJSON(_config)).then(() => {
          resolve(this);
        })
      });
    });
  }

  /**
   * return: Promise<boolean>
   *
   * Checks if the Screen Capture Source captures a window based on
   * the window's title.
   */
  isStickToTitle(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapTrackWindowTitle', this._id).then(val => {
        resolve(val === '0');
      });
    });
  }

  /**
   * param: Promise<boolean>
   * ```
   * return: Promise<ScreenSource>
   * ```
   *
   * Set the Screen Capture to capture the window based on the window title.
   * Useful when capturing programs with multiple tabs, for you to only
   * capture a particular tab.
   */
  setStickToTitle(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapTrackWindowTitle', value ? '0' : '1', this._id)
        .then(() => {
          resolve(this);
        });
    });
  }

  /**
   * return Promise<ScreenSource>
   *
   * Checks if the Screen Capture layered window is selected.
   * 
   */
  getCaptureLayered(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapLayered', this._id).then(val => {
        resolve(this);
      });
    });
  }

  /**
   * param: (value: boolean)
   * 
   * return Promise<ScreenSource>
   *
   * Sets the Screen Capture Layered window 
   * 
   */
  setCaptureLayered(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapLayered', value ? '1' : '0', this._id).then(val => {
        resolve(this);
      });
    });
  }

  /**
   * return Promise<ScreenSource>
   *
   * Checks if the Exclusive Window capture is selected.
   * 
   */
  getOptimizedCapture(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapOptCapture1', this._id).then(val => {
        resolve(this);
      });
    });
  }

  /**
   * param: (value: boolean)
   * 
   * return Promise<ScreenSource>
   *
   * Sets the Exclusive Window capture.
   * 
   */
  setOptimizedCapture(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapOptCapture1', value ? '1' : '0', this._id).then(val => {
        resolve(this);
      });
    });
  }


  /**
   * return Promise<ScreenSource>
   *
   * Checks if the Show mouse clicks is selected.
   * 
   */
  getShowMouseClicks(): Promise<boolean> {
    return new Promise(resolve => {
    iItem.get('prop:ScrCapShowClicks', this._id).then(val => {
        resolve(this);
      });
    });
  }

  /**
   * param: (value: boolean)
   * 
   * return Promise<ScreenSource>
   *
   * Sets the Show mouse clicks.
   * 
   */
  setShowMouseClicks(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
    iItem.set('prop:ScrCapShowClicks', value ? '1' : '0', this._id).then(val => {
        resolve(this)
      });
    });
  }

  /**
   * return Promise<ScreenSource>
   *
   * Checks if the Show mouse is selected.
   * 
   */
  getShowMouse(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ScrCapShowMouse', this._id).then(val => {
        resolve(this);
      });
    });
  }

  /**
   * param: (value: boolean)
   * 
   * return Promise<ScreenSource>
   *
   * Sets the Show Mouse.
   * 
   */
  setShowMouse(value: boolean): Promise<ScreenSource> {
    return new Promise(resolve => {
      iItem.set('prop:ScrCapShowMouse', value ? '1' : '0', this._id).then(val => {
        if (val === true) {
          iItem.set('prop:ScrCapShowClicks', value ? '1' : '0', this._id);
        }
        resolve(this);
      });
    });
  }

  ScrCapShowMouse


  // ItemLayout

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
  setCanvasRotate: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setCropping setCropping}
   */
  setCropping: (value: Object) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setCroppingEnhanced setCroppingEnhanced}
   */
  setCroppingEnhanced: (value: Object) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemLayout#setEnhancedRotate setEnhancedRotate}
   */
  setEnhancedRotate:        (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setKeepAspectRatio setKeepAspectRatio}
   */
  setKeepAspectRatio: (value: boolean) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setPositionLocked setPositionLocked}
   */
  setPositionLocked: (value: boolean) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setEnhancedResizeEnabled setEnhancedResizeEnabled}
   */
  setEnhancedResizeEnabled: (value: boolean) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setPosition setPosition}
   */
  setPosition: (value: Rectangle) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateY setRotateY}
   */
  setRotateY: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateX setRotateX}
   */
  setRotateX: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemLayout#setRotateZ setRotateZ}
   */
  setRotateZ: (value: number) => Promise<ScreenSource>;
  
  // ItemColor

  /**
   * See: {@link #core/IItemColor#getTransparency getTransparency}
   */
  getTransparency: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBrightness getBrightness}
   */
  getBrightness: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getContrast getContrast}
   */
  getContrast: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getHue getHue}
   */
  getHue: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getSaturation getSaturation}
   */
  getSaturation: () => Promise<number>;

  /**
   * See: {@link #core/IItemColor#getBorderColor getBorderColor}
   */
  getBorderColor: () => Promise<Color>;

  /**
   * See: {@link #core/IItemColor#isFullDynamicColorRange isFullDynamicColorRange}
   */
  isFullDynamicColorRange: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemColor#setTransparency setTransparency}
   */
  setTransparency: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemColor#setBrightness setBrightness}
   */
  setBrightness: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemColor#setContrast setContrast}
   */
  setContrast: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemColor#setHue setHue}
   */
  setHue: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemColor#setSaturation setSaturation}
   */
  setSaturation: (value: number) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemColor#setBorderColor setBorderColor}
   */
  setBorderColor: (value: Color) => Promise<ScreenSource>;

  /**
   * See: {@link #core/IItemColor#setFullDynamicColorRange setFullDynamicColorRange}
   */
  setFullDynamicColorRange: (value: boolean) => Promise<ScreenSource>;
  
  // ItemChroma

  /**
   * See: {@link #core/IItemChroma#isChromaEnabled isChromaEnabled}
   */
  isChromaEnabled: () => Promise<boolean>;

  /**
   * See: {@link #core/IItemChroma#setChromaEnabled setChromaEnabled}
   */
  setChromaEnabled: (value: boolean) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getKeyingType getKeyingType}
   */
  getKeyingType: () => Promise<KeyingType>;
  
  /**
   * See: {@link #core/IItemChroma#setKeyingType setKeyingType}
   */
  setKeyingType: (value: KeyingType) => Promise<ScreenSource>;

  // BOTH CHROMA LEGACY AND CHROMA RGB
  
  /**
   * See: {@link #core/IItemChroma#getChromaAntiAliasLevel getChromaAntiAliasLevel}
   */
  getChromaAntiAliasLevel: () => Promise<ChromaAntiAliasLevel>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaAntiAliasLevel setChromaAntiAliasLevel}
   */
  setChromaAntiAliasLevel: (value: ChromaAntiAliasLevel) => Promise<ScreenSource>;

  // CHROMA LEGACY MODE
   
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyBrightness getChromaLegacyBrightness}
   */
  getChromaLegacyBrightness: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyBrightness setChromaLegacyBrightness}
   */
  setChromaLegacyBrightness: (value: number) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacySaturation getChromaLegacySaturation}
   */
  getChromaLegacySaturation: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacySaturation setChromaLegacySaturation}
   */
  setChromaLegacySaturation: (value: number) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyHue getChromaLegacyHue}
   */
  getChromaLegacyHue: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyHue setChromaLegacyHue}
   */
  setChromaLegacyHue: (value: number) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyThreshold getChromaLegacyThreshold}
   */
  getChromaLegacyThreshold: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyThreshold setChromaLegacyThreshold}
   */
  setChromaLegacyThreshold: (value: number) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaLegacyAlphaSmoothing getChromaLegacyAlphaSmoothing}
   */
  getChromaLegacyAlphaSmoothing: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaLegacyAlphaSmoothing setChromaLegacyAlphaSmoothing}
   */
  setChromaLegacyAlphaSmoothing: (value: number) => Promise<ScreenSource>;

  // CHROMA KEY RGB MODE
  
  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyPrimaryColor getChromaRGBKeyPrimaryColor}
   */
  getChromaRGBKeyPrimaryColor: () => Promise<ChromaPrimaryColors>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyPrimaryColor setChromaRGBKeyPrimaryColor}
   */
  setChromaRGBKeyPrimaryColor: (value: ChromaPrimaryColors) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyThreshold getChromaRGBKeyThreshold}
   */
  getChromaRGBKeyThreshold: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyThreshold setChromaRGBKeyThreshold}
   */
  setChromaRGBKeyThreshold: (value: number) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaRGBKeyExposure getChromaRGBKeyExposure}
   */
  getChromaRGBKeyExposure: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaRGBKeyExposure setChromaRGBKeyExposure}
   */
  setChromaRGBKeyExposure: (value: number) => Promise<ScreenSource>;

  // COLOR KEY MODE
  
  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyThreshold getChromaColorKeyThreshold}
   */
  getChromaColorKeyThreshold: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyThreshold setChromaColorKeyThreshold}
   */
  setChromaColorKeyThreshold: (value: number) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyExposure getChromaColorKeyExposure}
   */
  getChromaColorKeyExposure: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyExposure setChromaColorKeyExposure}
   */
  setChromaColorKeyExposure: (value: number) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemChroma#getChromaColorKeyColor getChromaColorKeyColor}
   */
  getChromaColorKeyColor: () => Promise<Color>;
  
  /**
   * See: {@link #core/IItemChroma#setChromaColorKeyColor setChromaColorKeyColor}
   */
  setChromaColorKeyColor: (value: Color) => Promise<ScreenSource>;

  // ItemTransition

  /**
   * See: {@link #core/IItemTransition#isVisible isVisible}
   */
  isVisible: () => Promise<boolean>;
  
  /**
   * See: {@link #core/IItemTransition#setVisible setVisible}
   */
  setVisible: (value: boolean) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemTransition#getTransition getTransition}
   */
  getTransition: () => Promise<Transition>;
  
  /**
   * See: {@link #core/IItemTransition#setTransition setTransition}
   */
  setTransition: (value: Transition) => Promise<ScreenSource>;
  
  /**
   * See: {@link #core/IItemTransition#getTransitionTime getTransitionTime}
   */
  getTransitionTime: () => Promise<number>;
  
  /**
   * See: {@link #core/IItemTransition#setTransitionTime setTransitionTime}
   */
  setTransitionTime: (value: number) => Promise<ScreenSource>;
}

applyMixins(ScreenSource, [ItemLayout, ItemColor, ItemChroma, ItemTransition]);
