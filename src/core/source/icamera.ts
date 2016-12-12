/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {MicrophoneDevice as MicrophoneDevice} from '../../system/microphone';
import {CameraSource} from '../source/camera';
import {System} from '../../system/system';
import {Logger} from '../../internal/util/logger';

export interface ISourceCamera {
  /**
   * return: Promise<string>
   *
   * Gets the device ID of the underlying camera device.
   */
  getDeviceId(): Promise<string>

  /**
   * return: Promise<number>
   *
   * Gets audio delay with respect to video feed in milliseconds
   */
  getAudioOffset(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets audio delay with respect to video feed in milliseconds
   */
  setAudioOffset(value: number): Promise<ISourceCamera>

  /**
   * return: Promise<MicrophoneDevice>
   *
   * Gets the microphone device tied as an audio input,
   * rejected if no microphone device is used
   */
  getAudioInput(): Promise<MicrophoneDevice>

  /**
   * param: (value: number)
   *
   * Sets the microphone device to be tied as an audio input
   */
  setAudioInput(value: MicrophoneDevice): Promise<ISourceCamera>

  /**
   * return: Promise<boolean>
   *
   * Checks if camera feed is paused
   */
  isStreamPaused(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Sets whether camera feed is paused or not
   */
  setStreamPaused(value: boolean): Promise<CameraSource>

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
  getDelay(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets feed capture delay in milliseconds, accepts only positive delay
   */
  setDelay(value: number): Promise<CameraSource>

  /**
   * return: Promise<boolean>
   *
   * Checks whether deinterlacing is enforced
   */
  isForceDeinterlace(): Promise<boolean>

  /**
   * param: (value: boolean)
   *
   * Enables or disables forcing of deinterlacing
   */
  setForceDeinterlace(value: boolean): Promise<CameraSource>
}

export class SourceCamera implements ISourceCamera {
  private _id: string;
  private _isItemCall: boolean;

  protected _delayExclusionObject = {
    roxio: "vid_1b80&pid_e0(01|11|12)",
    hauppauge1: "vid_2040&pid_49(0[0-3]|8[0-3])",
    hauppauge2: "vid_2040&pid_e50[012a4]"
  };

  getDeviceId(): Promise<string> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getDeviceId', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(val => {
        resolve(val);
      });
    });
  }

  getAudioOffset(): Promise<number> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getAudioOffset', true)
    }
    return new Promise(resolve => {
      var streamDelay, audioDelay;
      iItem.get('prop:StreamDelay', this._id).then(val => {
        streamDelay = Number(val);
        return iItem.get('prop:AudioDelay', this._id);
      }).then(val => {
        audioDelay = Number(val);
        resolve((audioDelay - streamDelay) / 10000);
      });
    });
  }

  setAudioOffset(value: number): Promise<SourceCamera> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setAudioOffset', true)
    }
    return new Promise((resolve, reject) => {
      var itemAudio, delay;
      iItem.get('prop:itemaudio', this._id).then(val => {
        itemAudio = val;
        return this.isAudioAvailable();
      }).then(val => {
        if (val === false && itemAudio === '') {
          reject(new Error('Device has no audio'));
        } else {
          return this.getDelay();
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
    });
  }

  getAudioInput(): Promise<MicrophoneDevice> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getAudioInput', true)
    }
    return new Promise((resolve, reject) => {
      var itemAudioId;
      iItem.get('prop:itemaudio', this._id).then(val => {
        if (val === '') {
          reject(new Error('No tied audio input'));
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
          reject(new Error('Tied audio input not present'));
        }
      });
    });
  }

  setAudioInput(value: MicrophoneDevice): Promise<SourceCamera> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setAudioInput', true)
    }
    return new Promise((resolve, reject) => {
      iItem.set('prop:itemaudio', value.getDisplayId(), this._id)
        .then(val => {
          resolve(this);
        });
    });
  }

  isStreamPaused(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'isStreamPaused', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:StreamPause', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setStreamPaused(value: boolean): Promise<CameraSource> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setStreamPaused', true)
    }
    return new Promise((resolve, reject) => {
      iItem.set('prop:StreamPause', value ? '1' : '0',
        this._id).then(() => {
          return iItem.get('prop:StreamPause', this._id);
        }).then(val => {
          if (value === (val === ('1'))) {
            resolve(this);
          } else {
            reject(new Error('Camera feed cannot be paused/resumed or is not present'));
          }
        });
    });
  }

  isHardwareEncoder(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'isHardwareEncoder', true)
    }
    return new Promise((resolve, reject) => {
      iItem.get('prop:hwencoder', this._id).then(val => {
        if (val === '1') {
          resolve(true);
        } else {
          this.isActive().then(isActive => {
            if (isActive) {
              resolve(false);
            } else {
              reject(new Error
                ('Cannot check hardware encoding. Device not present'));
            }
          })
        }
      });
    });
  }

  isActive(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'isActive', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:activestate', this._id).then(val => {
        resolve(val === 'active');
      });
    });
  }

  getDelay(): Promise<number> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'getDelay', true)
    }
    return new Promise(resolve => {
      var streamDelay, audioDelay;
      iItem.get('prop:StreamDelay', this._id).then(val => {
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
    });
  }

  setDelay(value: number): Promise<CameraSource> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setDelay', true)
    }
    return new Promise((resolve, reject) => {
      var isPositive, audioOffset;
      this.isHardwareEncoder().then(val => {
        if (val === true) {
          reject(new Error('Cannot set delay to hardware encoder devices'));
        } else {
          return this.getValue();
        }
      }).then(val => {
        for (var key in this._delayExclusionObject) {
          var regex = new RegExp(
            this._delayExclusionObject[key].toLowerCase(), 'g');
          if (typeof val === 'string' && val.toLowerCase().match(regex) != null) {
            reject(new Error('Cannot set delay to specific device'));
            break;
          }
        }
        return this.getAudioOffset();
      }).then(val => {
        audioOffset = val;
        if (audioOffset >= 0) {
          isPositive = true;
          return iItem.set('prop:StreamDelay', String(value * 10000), this._id);
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
    });
  }

  isForceDeinterlace(): Promise<boolean> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'isForceDeinterlace', true)
    }
    return new Promise(resolve => {
      iItem.get('prop:fdeinterlace', this._id).then(val => {
        resolve(val === '3');
      });
    });
  }

  setForceDeinterlace(value: boolean): Promise<CameraSource> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setForceDeinterlace', true)
    }
    return new Promise(resolve => {
      iItem.set('prop:fdeinterlace', (value ? '3' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isAudioAvailable: () => Promise<boolean>;

  getValue: () => Promise<string>;
}
