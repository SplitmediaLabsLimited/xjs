/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {MicrophoneDevice as MicrophoneDevice} from '../../system/microphone';
import {CameraSource} from '../source/camera';
import {System} from '../../system/system';
import {Logger} from '../../internal/util/logger';

export interface ISourceCamera {

  audioOffset(value?:number): Promise<number|ISourceCamera>
  audioInput(value?:MicrophoneDevice): Promise<MicrophoneDevice|ISourceCamera>
  delay(value?:number): Promise<number|ISourceCamera>
  forceDeinterlace(value?:boolean): Promise<boolean|ISourceCamera>
  streamPause(value?:boolean): Promise<boolean|ISourceCamera>


  /**
   * return: Promise<string>
   *
   * Gets the device ID of the underlying camera device.
   */
  deviceId(): Promise<string>

  /**
   * return: Promise<number>
   *
   * Gets audio delay with respect to video feed in milliseconds
   */
  // getAudioOffset(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets audio delay with respect to video feed in milliseconds
   */
  // setAudioOffset(value: number): Promise<ISourceCamera>

  /**
   * return: Promise<MicrophoneDevice>
   *
   * Gets the microphone device tied as an audio input,
   * rejected if no microphone device is used
   */
  // getAudioInput(): Promise<MicrophoneDevice>

  /**
   * param: (value: number)
   *
   * Sets the microphone device to be tied as an audio input
   */
  // setAudioInput(value: MicrophoneDevice): Promise<ISourceCamera>

  /**
   * return: Promise<boolean>
   *
   * Checks if camera feed is paused
   */
  // isStreamPaused(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Sets whether camera feed is paused or not
   */
  // setStreamPaused(value: boolean): Promise<CameraSource>

  /**
   * return: Promise<boolean>
   *
   * Checks if camera device is a hardware encoder or not. This check may fail
   * if camera device is reinitializing or not present (value defaults to false)
   *
   */
  isHardwareEncoder(): Promise<boolean>
  /**
   * return: Promise<boolean>
   *
   * Checks if camera device is active and present.
   *
   */
  isActive(): Promise<boolean>

  /**
   * return: Promise<number>
   *
   * Gets feed capture delay in milliseconds
   */
  // getDelay(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets feed capture delay in milliseconds, accepts only positive delay
   */
  // setDelay(value: number): Promise<CameraSource>

  /**
   * return: Promise<boolean>
   *
   * Checks whether deinterlacing is enforced
   */
  // isForceDeinterlace(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Enables or disables forcing of deinterlacing
   */
  // setForceDeinterlace(value: boolean): Promise<CameraSource>
}

export class SourceCamera implements ISourceCamera {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  protected _delayExclusionObject = {
    roxio: "vid_1b80&pid_e0(01|11|12)",
    hauppauge1: "vid_2040&pid_49(0[0-3]|8[0-3])",
    hauppauge2: "vid_2040&pid_e50[012a4]"
  };

  deviceId(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getDeviceId', true)
        iItem.get('prop:item', this._id).then(val => {
          resolve(val);
        });
      } else {
        iItem.wrapGet('prop:item', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val);
        });
      }
    });
  }

  audioOffset(value?: number): Promise<number|SourceCamera> {
    return new Promise((resolve, reject) => {
      var streamDelay, audioDelay, itemAudio, delay;
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'audioOffset',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.get('prop:itemaudio', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapGet('prop:itemaudio', this._srcId,
        this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        iItem.get('prop:StreamDelay', this._id).then(val => {
          streamDelay = Number(val);
          return iItem.get('prop:AudioDelay', this._id);
        }).then(val => {
          audioDelay = Number(val);
          resolve((audioDelay - streamDelay) / 10000);
        });
      } else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:StreamDelay', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          streamDelay = Number(val);
          return iItem.get('prop:AudioDelay', this._id);
        }).then(val => {
          audioDelay = Number(val);
          resolve((audioDelay - streamDelay) / 10000);
        });
      }

      this._checkPromise.then(val => {
        itemAudio = val;
        return this.isAudioAvailable();
      }).then(val => {
        if (val === false && itemAudio === '') {
          reject(Error('Device has no audio'));
        } else {
          return this.delay();
        }
      }).then(val => {
        delay = val;
        if (value >= 0) {
          return iItem.set('prop:StreamDelay', String(delay * 10000), this._id);
        } else {
          return iItem.set('prop:StreamDelay',
            String((delay + (value * -1)) * 10000), this._id);
        }
      }).then(val => {
        if (value >= 0) {
          return iItem.set('prop:AudioDelay',
            String((delay + value) * 10000), this._id);
        } else {
          return iItem.set('prop:AudioDelay', String(delay * 10000), this._id);
        }
      }).then(val => {
        resolve(this);
      });
    })
  }

  audioInput(value?: MicrophoneDevice): Promise<MicrophoneDevice|SourceCamera> {
    return new Promise((resolve, reject) => {
      var itemAudioId;
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'audioInput',  true)
      }

      if (this._isItemCall && value) {
        iItem.set('prop:itemaudio', value.getDisplayId(), this._id)
        .then(val => {
          resolve(this);
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:itemaudio', value.getDisplayId(),
        this._srcId, this._id, this._updateId.bind(this))
        .then(val => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:itemaudio', this._id)
      } else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:itemaudio', this._srcId,
        this._id, this._updateId.bind(this))
      }

      this._checkPromise.then(val => {
        if (val === '') {
          reject(Error('No tied audio input'));
        } else {
          itemAudioId = val;
          return System.getMicrophones();
        }
      }).then(val => {
        var micDevice;
        if (val !== undefined) {
          for (var i = 0; i < val.length; ++i) {
            if (val[i].getDisplayId() === itemAudioId) {
              micDevice = val[i];
              break;
            }
          }
        }

        if (micDevice !== undefined) {
          resolve(micDevice);
        } else {
          reject(Error('Tied audio input not present'));
        }
      });
    })
  }

  streamPause(value?: boolean): Promise<boolean|SourceCamera> {
    return new Promise((resolve, reject) => {
      var itemAudioId;
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'streamPause',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:StreamPause', value ? '1' : '0',
        this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:StreamPause', value ? '1' : '0',
        this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        iItem.get('prop:StreamPause', this._id).then(val => {
          resolve(val === '1');
        });
      } else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:StreamPause', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val === '1');
        });
      }

      this._checkPromise.then(() => {
        return iItem.get('prop:StreamPause', this._id);
      }).then(val => {
        if (value === (val === ('1'))) {
          resolve(this);
        } else {
          reject(Error('Camera feed cannot be paused/resumed or is not present'));
        }
      });
    })
  }

  isHardwareEncoder(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isHardwareEncoder', true)
        this._checkPromise = iItem.get('prop:hwencoder', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:hwencoder', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(val => {
          if (val === '1') {
            resolve(true);
          } else {
            this.isActive().then(isActive => {
              if (isActive) {
                resolve(false);
              } else {
                reject(Error
                  ('Cannot check hardware encoding. Device not present'));
              }
            })
          }
        });
    });
  }

  isActive(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isActive', true)
        iItem.get('prop:activestate', this._id).then(val => {
          resolve(val === 'active');
        });
      } else {
        iItem.wrapGet('prop:activestate', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val === 'active');
        });
      }
    });
  }

  delay(value?: number): Promise<number|SourceCamera> {
    return new Promise((resolve, reject) => {
      var isPositive, audioOffset, streamDelay, audioDelay;
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'delay',  true)
      }

      if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:StreamDelay', this._id)
      } else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:StreamDelay', this._srcId,
          this._id, this._updateId.bind(this)).then(val => {
          streamDelay = Number(val);
          return iItem.get('prop:AudioDelay', this._id);
        })
      } else if (value) {
        this.isHardwareEncoder().then(val => {
          if (val === true) {
            reject(Error('Cannot set delay to hardware encoder devices'));
          } else {
            return this.value();
          }
        }).then(val => {
          for (var key in this._delayExclusionObject) {
            var regex = new RegExp(
              this._delayExclusionObject[key].toLowerCase(), 'g');
            if (typeof val === 'string' && val.toLowerCase().match(regex) != null) {
              reject(Error('Cannot set delay to specific device'));
              break;
            }
          }
          return this.audioOffset();
        }).then(val => {
          audioOffset = val;
          if (audioOffset >= 0) {
            isPositive = true;
            if(this._isItemCall) {
              return iItem.set('prop:StreamDelay', String(value * 10000), this._id);
            } else {
              return iItem.wrapSet('prop:StreamDelay', String(value * 10000), this._srcId, this._id, this._updateId.bind(this));
            }
          } else {
            isPositive = false;
            return iItem.set('prop:StreamDelay',
              String((value + (audioOffset * -1)) * 10000), this._id);
          }
        }).then(val => {
          if (isPositive) {
            return iItem.set('prop:AudioDelay',
              String((value + audioOffset) * 10000), this._id);
          } else {
            return iItem.set('prop:AudioDelay', String(value * 10000), this._id);
          }
        }).then(val => {
          resolve(this);
        });
      }

      this._checkPromise.then(val => {
        streamDelay = Number(val);
        return iItem.get('prop:AudioDelay', this._id);
      }).then(val => {
        audioDelay = Number(val);

        if (streamDelay < audioDelay) {
          resolve(streamDelay / 10000);
        } else {
          resolve(audioDelay / 10000);
        }
      });
    })
  }

  forceDeinterlace(value?: boolean): Promise<boolean|SourceCamera> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'forceDeinterlace',  true)
      }

      if (this._isItemCall && value) {
        iItem.set('prop:fdeinterlace', (value ? '3' : '0'), this._id).then(() => {
          resolve(this);
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:fdeinterlace', (value ? '3' : '0'), this._srcId,
        this._id, this._updateId.bind(this)).then(() => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('prop:fdeinterlace', this._id).then(val => {
          resolve(val === '3');
        });
      } else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:fdeinterlace', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val === '3');
        });
      }
    })
  }

  isAudioAvailable: () => Promise<boolean>;

  value: () => Promise<string>;
}
