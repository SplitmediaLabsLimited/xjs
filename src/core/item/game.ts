/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Item as iItem} from '../../internal/item';
import {App as iApp} from '../../internal/app';
import {ItemLayout, IItemLayout} from './ilayout';
import {ItemColor, IItemColor} from './icolor';
import {Item} from './item';
import {Scene} from '../scene';
import {Rectangle} from '../../util/rectangle';
import {Color} from '../../util/color';
import {JSON as JXON} from '../../internal/util/json';
import {XML} from '../../internal/util/xml';
import {ItemTypes} from './item';
import {Environment} from '../environment';
import {Game} from '../../system/game';

export class GameItem extends Item implements IItemLayout, IItemColor {

  constructor(props: {} | Game) {
    var game = props;
    props = {};

    if (game instanceof Game) {
      // Parse the game object, convert it to XML
      var valueObj = new JXON();
      valueObj['pid'] = game.getPid();
      valueObj['handle'] = game.getHandle();
      valueObj['hwnd'] = game.getWindowHandle();
      valueObj['GapiType'] = game.getGapiType();
      valueObj['width'] = game.getResolution().getWidth();
      valueObj['height'] = game.getResolution().getHeight();
      valueObj['flags'] = game.isFullscreen() ? '1' : '0';
      valueObj['wndname'] = game.getWindowName();
      valueObj['lastframets'] = game.getLastFrameTimestamp();
      valueObj['fpsRender'] = game.getFpsRender();
      valueObj['fpsCapture'] = game.getFpsCapture();
      valueObj['imagename'] = game.getImageName();
      valueObj['replace'] = game.getReplace();
      valueObj['tag'] = 'src';
      valueObj['selfclosing'] = true;

      props['value'] = XML.encode(XML.parseJSON(valueObj).toString());
      props['name'] = valueObj['wndname'] + ' (' + valueObj['GapiType'] +')';
      props['type'] = ItemTypes.GAMESOURCE;
    }
    super(props);
  }

  /**
   * return: boolean
   *
   * Check if Game Special Optimization is currently enabled or not
   */
  isSpecialOptimization(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('GameCapSurfSharing').then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: boolean
   *
   * Set Game Special Optimization to on or off
   */
  setSpecialOptimization(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('GameCapSurfSharing', (value ? '1' : '0'), slot);
  }

  /**
   * return: boolean
   *
   * Check if Show Mouse is currently enabled or not
   */
  isShowMouse(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('GameCapShowMouse').then(res => {
        resolve(res === '1');
      });
    });
  }

  /**
   * param: string
   *
   * Set the offline image of a game source
   */
  setOfflineImage(path: string) {
    if (this.type !== ItemTypes.GAMESOURCE) {
      throw new Error('Current item should be a game source');
    }

    if (Environment.isSourceHtml()) {
       new Error('Source plugins cannot update offline images of other sources');
    }

    if (!(this.value instanceof XML)) {
      this.getValue().then(() => {
        this.setOfflineImage(path);
      });
      return;
    }

    var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?' +
      '\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*))\.(png|gif|jpg|jpeg|tif)$');

    if (regExp.test(path)) {
      var valueObj = JXON.parse(this.value.toString());
      valueObj['replace'] = path;
      this.setValue(XML.parseJSON(valueObj));
    }
  }

  /**
   * return: string
   *
   * Get the offline image of a game source
   */
  getOfflineImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.type !== ItemTypes.GAMESOURCE) {
        reject(Error('Current item should be a game source'));
      }

      if (!(this.value instanceof XML)) {
        this.getValue().then(() => {
          this.getOfflineImage().then(val => {
            resolve(val);
          });
        });
      } else {
        var valueObj = JXON.parse(this.value.toString());
        resolve(valueObj['replace']);
      }
    });
  }

  /**
   * param: boolean
   *
   * Set Show Mouse in game to on or off
   */
  setShowMouse(value: boolean) {
    let slot = iItem.attach(this.id);

    iItem.set('GameCapShowMouse', (value ? '1' : '0'), slot);
  }

  // ItemLayout

  /** Check if Aspect Ratio is set to ON or OFF */
  isKeepAspectRatio:        () => Promise<boolean>;

  /** Check if Position Locked is set to ON or OFF */
  isPositionLocked:         () => Promise<boolean>;

  /** Check if Enhance Resize is Enabled or Disabled */
  isEnhancedResizeEnabled:   () => Promise<boolean>;

  /** Get the position of the item */
  getPosition:              () => Promise<Rectangle>;

  /** Set Aspect Ratio to ON or OFF */
  setKeepAspectRatio:       (value: boolean) => void;

  /** Set Position Lock to ON or OFF */
  setPositionLocked:        (value: boolean) => void;

  /** Set Enhance Resize to ON or OFF */
  setEnhancedResizeEnabled:  (value: boolean) => void;

  /** Set Item position */
  setPosition:              (value: Rectangle) => void;

  // ItemColor

  /** Get Item Transparency value */
  getTransparency: () => Promise<number>;

  /** Get Item Brightness value */
  getBrightness:   () => Promise<number>;

  /** Get Item Contrast value */
  getContrast:     () => Promise<number>;

  /** Get Item Hue value */
  getHue:          () => Promise<number>;

  /** Get Item Saturation value */
  getSaturation:   () => Promise<number>;

  /** Get Border Color */
  getBorderColor:  () => Promise<Color>;

  /** Set Item Transparency */
  setTransparency: (value: number) => void;

  /** Set Item Brightness */
  setBrightness:   (value: number) => void;

  /** Set Item Contrast */
  setContrast:     (value: number) => void;

  /** Set Item Hue */
  setHue:          (value: number) => void;

  /** Set Item Saturation */
  setSaturation:   (value: number) => void;

  /** Set Border Color */
  setBorderColor:  (value: Color) => void;

}

applyMixins(GameItem, [ItemLayout, ItemColor]);
