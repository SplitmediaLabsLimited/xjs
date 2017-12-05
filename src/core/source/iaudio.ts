/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger';

export interface IAudio {
  /**
   * param?: value<number|IAudio>
   * ```
   * return: Promise<number>
   * ```
   *
   * Get/Set source's volume level expressed as an integer from 0 to 100
   */
  volume(value?: number): Promise<number|IAudio>;

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|IAudio>
   * ```
   *
   * Get/Set source's mute option is active
   */
  mute(value?: boolean): Promise<boolean|IAudio>;

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|IAudio>
   * ```
   *
   * Get/Set if source is automatically being muted when hiding
   */
  autoMute(value?: boolean): Promise<boolean|IAudio>;

  /**
   * param?: value<boolean>
   * ```
   * return: Promise<boolean|IAudio>
   * ```
   *
   * Get/Set if audio is also output to system sound
   */
  streamOnlyAudio(value?: boolean): Promise<boolean|IAudio>;

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

  volume(value?: number): Promise<number|Audio> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'volume',  true)
      }
      if (value) {
        value = value < 0 ? 0 : value > 100 ? 100 : value;
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:volume', String(value), this._id)
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:volume', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:volume', String(value),
        this._srcId, this._id, this._updateId.bind(this))
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:volume', this._srcId,
        this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then((val?) => {
        if(val) {
          resolve(Number(val));
        } else {
          resolve(this);
        }
      });
    })
  }

  mute(value?: boolean): Promise<boolean|Audio> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'mute',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:mute', (value ? '1' : '0'), this._id)
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:mute', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:mute', (value ? '1' : '0'),
        this._srcId, this._id, this._updateId.bind(this))
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:mute', this._srcId,
        this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then((val?) => {
        if(val) {
          resolve(val === '1');
        } else {
          resolve(this);
        }
      });
    })
  }

  autoMute(value?: boolean): Promise<boolean|Audio> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'autoMute',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:keepaudio', (value ? '0' : '1'), this._id)
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:keepaudio', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:keepaudio', (value ? '0' : '1'),
        this._srcId, this._id, this._updateId.bind(this))
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:keepaudio', this._srcId,
        this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then((val?) => {
        if(val) {
          resolve(val === '1');
        } else {
          resolve(this);
        }
      });
    })
  }

  streamOnlyAudio(value?: boolean): Promise<boolean|Audio> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'streamOnlyAudio',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:sounddev', (value ? '1' : '0'), this._id)
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:sounddev', this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:sounddev', (value ? '1' : '0'),
        this._srcId, this._id, this._updateId.bind(this))
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:sounddev', this._srcId,
        this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then((val?) => {
        if(val) {
          resolve(val === '1');
        } else {
          resolve(this);
        }
      });
    })
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
