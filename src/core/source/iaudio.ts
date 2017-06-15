/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger';

export interface IAudio {

  /**
   * return: Promise<number>
   *
   * Get source's volume level expressed as an integer from 0 to 100
   */
  getVolume(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Set volume level of source as an integer from 0 (muted) to 100 (maximum)
   *
   * *Chainable.*
   */
  setVolume(value: number): Promise<IAudio>;

  /**
   * return: Promise<boolean>
   *
   * Check if source's mute option is active
   */
  isMute(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Set source's Mute property to ON or OFF
   *
   * *Chainable.*
   */
  setMute(value: boolean): Promise<IAudio>;

  /**
   * return: Promise<boolean>
   *
   * Check if source is automatically being muted when hiding
   */
  isAutoMute(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Set source to automatically mute when hiding
   *
   * *Chainable.*
   */
  setAutoMute(value: boolean): Promise<IAudio>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is also output to system sound
   */
  isStreamOnlyAudio(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets whether audio should also be output to system sound
   *
   * *Chainable.*
   */
  setStreamOnlyAudio(value: boolean): Promise<IAudio>;

  /**
   * return: Promise<boolean>
   *
   * Checks if audio is available
   */
  isAudioAvailable(): Promise<boolean>;
}

export class Audio implements IAudio {
  private _id: string;
  private _srcId: string;
  protected _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  getVolume(): Promise<number> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getVolume',  true)
        this._checkPromise = iItem.get('prop:volume', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:volume', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        resolve(Number(val));
      });
    });
  }

  setVolume(value: number): Promise<Audio> {
    return new Promise(resolve => {
      value = value < 0 ? 0 : value > 100 ? 100 : value;
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setVolume', true)
        this._checkPromise = iItem.set('prop:volume', String(value), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:volume', String(value),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
        resolve(this);
      });
    });
  }

  isMute(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isMute',  true)
        this._checkPromise = iItem.get('prop:mute', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:mute', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1');
      });
    });
  }

  setMute(value: boolean): Promise<Audio> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setMute', true)
        this._checkPromise = iItem.set('prop:mute', (value ? '1' : '0'), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:mute', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
        resolve(this);
      });
    });
  }

  isAutoMute(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isAutoMute',  true)
        this._checkPromise = iItem.get('prop:keepaudio', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:keepaudio', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val !== '1');
      });
    });
  }

  setAutoMute(value: boolean): Promise<Audio> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setAutoMute', true)
        this._checkPromise = iItem.set('prop:keepaudio', (value ? '0' : '1'), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:keepaudio', (value ? '0' : '1'),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
        resolve(this);
      });
    });
  }

  isStreamOnlyAudio(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isStreamOnlyAudio',  true)
        this._checkPromise = iItem.get('prop:sounddev', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:sounddev', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1');
      });
    });
  }

  setStreamOnlyAudio(value: boolean): Promise<Audio> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setStreamOnlyAudio', true)
        this._checkPromise = iItem.set('prop:sounddev', (value ? '1' : '0'), this._id)
      } else {
        this._checkPromise = iItem.wrapSet('prop:sounddev', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(() => {
        resolve(this);
      });
    });
  }

  isAudioAvailable(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isAudioAvailable',  true)
        this._checkPromise = iItem.get('prop:audioavail', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:audioavail', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1');
      });
    });
  }
}
