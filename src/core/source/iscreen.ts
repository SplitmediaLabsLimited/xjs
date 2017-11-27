/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {XML} from '../../internal/util/xml';
import {JSON as JXON} from '../../internal/util/json';
import {Rectangle} from '../../util/rectangle';
import {iSource, ISource} from './isource';
import {Logger} from '../../internal/util/logger';

export interface ISourceScreen {
  stickToTitle(value?: boolean): Promise<boolean|ISourceScreen>
  captureLayered(value?: boolean): Promise<boolean|ISourceScreen>
  optimizedCapture(value?: boolean): Promise<boolean|ISourceScreen>
  showMouseClicks(value?: boolean): Promise<boolean|ISourceScreen>
  showMouse(value?: boolean): Promise<boolean|ISourceScreen>
  captureArea(dimension?: Rectangle): Promise<Rectangle|ISourceScreen>
  clientAreaOnly(value?: boolean): Promise<boolean|ISourceScreen>
  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Checks if the Screen Capture Item captures a window based on
  //  * the window's title.
  //  */
  // isStickToTitle(): Promise<boolean>

  // /**
  //  * param: Promise<boolean>
  //  * ```
  //  * return: Promise<ISourceScreen>
  //  * ```
  //  *
  //  * Set the Screen Capture to capture the window based on the window title.
  //  * Useful when capturing programs with multiple tabs, for you to only
  //  * capture a particular tab.
  //  */
  // setStickToTitle(value: boolean): Promise<ISourceScreen>

  // /**
  //  * return Promise<boolean>
  //  *
  //  * Checks if the Screen Capture layered window is selected.
  //  */
  // getCaptureLayered(): Promise<boolean>

  // /**
  //  * param: (value: boolean)
  //  * ```
  //  * return Promise<ISourceScreen>
  //  * ```
  //  *
  //  * Sets the Screen Capture Layered window
  //  */
  // setCaptureLayered(value: boolean): Promise<ISourceScreen>

  // /**
  //  * return Promise<boolean>
  //  *
  //  * Checks if the Exclusive Window capture is selected.
  //  */
  // getOptimizedCapture(): Promise<boolean>

  // /**
  //  * param: (value: boolean)
  //  * ```
  //  * return Promise<ISourceScreen>
  //  * ```
  //  *
  //  * Sets the Exclusive Window capture.
  //  */
  // setOptimizedCapture(value: boolean): Promise<ISourceScreen>

  // /**
  //  * return Promise<boolean>
  //  *
  //  * Checks if the Show mouse clicks is selected.
  //  *
  //  */
  // getShowMouseClicks(): Promise<boolean>


  // /**
  //  * param: (value: boolean)
  //  * ```
  //  * return Promise<ISourceScreen>
  //  * ```
  //  *
  //  * Sets the Show mouse clicks.
  //  */
  // setShowMouseClicks(value: boolean): Promise<ISourceScreen>

  // /**
  //  * return Promise<boolean>
  //  *
  //  * Checks if the Show mouse is selected.
  //  *
  //  */
  // getShowMouse(): Promise<boolean>

  // /**
  //  * param: (value: boolean)
  //  * ```
  //  * return Promise<ISourceScreen>
  //  * ```
  //  *
  //  * Sets the Show Mouse.
  //  */
  // setShowMouse(value: boolean): Promise<ISourceScreen>

  // /**
  //  * return: Promise<Rectangle>
  //  *
  //  * Gets the Capture Area of the Screen Capture Item. Returns a Rectangle
  //  * object.
  //  *
  //  * See also: {@link #util/Rectangle Util/Rectangle}
  //  */
  //  getCaptureArea(): Promise<Rectangle>

  // /**
  //  * param: Promise<Rectangle>
  //  * ```
  //  * return: Promise<ISourceScreen>
  //  * ```
  //  *
  //  * Sets the Window Capture Area of the Screen Capture Item.
  //  *
  //  * *Chainable.*
  //  *
  //  * See also: {@link #util/Rectangle Util/Rectangle}
  //  */
  // setCaptureArea(dimension: Rectangle): Promise<ISourceScreen>

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Checks if the Screen Capture Item only captures the
  //  * Client area (does not capture the title bar, menu bar, window border, etc.)
  //  */
  // isClientArea(): Promise<boolean>

  // /**
  //  * param: Promise<boolean>
  //  * ```
  //  * return: Promise<ISourceScreen>
  //  * ```
  //  *
  //  * Set the Screen Capture to capture the Client area only or include
  //  * the titlebar, menu bar, window border, etc.
  //  */
  // setClientArea(value: boolean): Promise<ISourceScreen>
}

export class iSourceScreen implements ISourceScreen {
  private _id: string;
  private _value: any;
  private _isItemCall: boolean;
  private _srcId: string;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  stickToTitle(value?: boolean): Promise<boolean|iSourceScreen> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'stickToTitle',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:ScrCapTrackWindowTitle', value ? '0' : '1', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:ScrCapTrackWindowTitle', value ? '0' : '1',
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:ScrCapTrackWindowTitle', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:ScrCapTrackWindowTitle', this._srcId,
          this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        val ? resolve(val === '0') : resolve(this);
      });
    })
  }

  captureLayered(value?: boolean): Promise<boolean|iSourceScreen> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'captureLayered',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:ScrCapLayered', value ? '1' : '0', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:ScrCapLayered', value ? '1' : '0',
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:ScrCapLayered', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:ScrCapLayered',
          this._srcId, this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        val ? resolve(val === '1') : resolve(this);
      });
    })
  }

  optimizedCapture(value?: boolean): Promise<boolean|iSourceScreen> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'optimizedCapture',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:ScrCapOptCapture1', value ? '1' : '0', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:ScrCapOptCapture1', value ? '1' : '0',
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:ScrCapOptCapture1', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:ScrCapOptCapture1',
          this._srcId, this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        val ? resolve(val === '1') : resolve(this);
      });
    })
  }

  showMouseClicks(value?: boolean): Promise<boolean|iSourceScreen> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'showMouseClicks',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:ScrCapShowClicks', value ? '1' : '0', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:ScrCapShowClicks', value ? '1' : '0',
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:ScrCapShowClicks', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:ScrCapShowClicks',
          this._srcId, this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        val ? resolve(val === '1') : resolve(this);
      });
    })
  }

  showMouse(value?: boolean): Promise<boolean|iSourceScreen> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'showMouse',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:ScrCapShowMouse', value ? '1' : '0', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:ScrCapShowMouse', value ? '1' : '0',
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:ScrCapShowMouse', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:ScrCapShowMouse',
          this._srcId, this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        if (value) {
          if (val === true) {
            iItem.set('prop:ScrCapShowClicks', value ? '1' : '0', this._id);
          }
          resolve(this)
        } else {
          resolve(val === '1')
        }
      });
    })
  }

  captureArea(dimension?: Rectangle): Promise<Rectangle|iSourceScreen> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'captureArea',  true)
      }

      this.getValue().then(val => {
        return new Promise(iResolve => {
          if (dimension && this._isItemCall) {
            this._checkPromise = iItem.get('screenresolution', this._id)
          } else if (dimension && !this._isItemCall) {
            this._checkPromise = iItem.wrapGet('screenresolution', this._srcId,
              this._id,this._updateId.bind(this))
          } else if( !dimension) {
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
          }
          this._checkPromise.then(res => {
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
        })
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
    })
  }

  clientAreaOnly(value?: boolean): Promise<boolean|iSourceScreen> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'clientAreaOnly',  true)
      }

      this.getValue().then(val => {
        let _config = new JXON();
        if (!(val instanceof XML) && !value) {
          resolve(false);
        } else if (!value) {
          let _value: JXON = JXON.parse(val);
          resolve(_value['wclient'] === '1');
        } else if (value && !(val instanceof XML)) {
          _config['tag'] = 'screen';
          _config['module'] = '';
          _config['window'] = '';
          _config['hwnd'] = '0';
          _config['wclient'] = '0';
          _config['left'] = '0';
          _config['top'] = '0';
          _config['width'] = '0';
          _config['height'] = '0';
        } else if (value) {
          _config = JXON.parse(val);
        }

        _config['wclient'] = (value ? '1' : '0');
        this.setValue(XML.parseJSON(_config)).then(() => {
          resolve(this);
        })
      });
    });
  }

  getValue: () => Promise<string | XML>

  setValue: (value: string | XML) => Promise<iSourceScreen>

}