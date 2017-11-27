/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';
import {Logger} from '../../internal/util/logger';

export interface ISourceAudio {

  silenceDetection(value?: boolean): Promise<boolean|ISourceAudio>
  silenceThreshold(value?: number): Promise<number|ISourceAudio>
  silencePeriod(value?: number): Promise<number|ISourceAudio>
  audioOffset(value?: number): Promise<number|ISourceAudio>

  /**
   * return: Promise<boolean>
   *
   * Check if silence detection is on or off
   */
  // isSilenceDetectionEnabled(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Set silence detection to ON or OFF
   */
  // setSilenceDetectionEnabled(value: boolean): Promise<ISourceAudio>

  /**
   * return: Promise<number>
   *
   * Gets silenced detection threshold.
   * Amplitude less than threshold will be detected as silence.
   */
  // getSilenceThreshold(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets silence detection threshold, min of 0, max of 128
   */
  // setSilenceThreshold(value: number): Promise<ISourceAudio>

  /**
   * return: Promise<number>
   *
   * Gets silenced detection period in ms time unit.
   * Reaction time before filter removes noice/sound less than threshold
   */
  // getSilencePeriod(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets silence detection period, min of 0, max of 10000
   */
  // setSilencePeriod(value: number): Promise<ISourceAudio>

  /**
   * return: Promise<number>
   *
   * Gets audio delay (1 unit = 100ns)
   */
  // getAudioOffset(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets audio delay, accepts only positive delay
   */
  // setAudioOffset(value: number): Promise<ISourceAudio>
}

export class SourceAudio implements ISourceAudio {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  silenceDetection(value?: boolean): Promise<boolean|SourceAudio> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'silenceDetection',  true)
      }

      if (this._isItemCall && value) {
        iItem.set('prop:AudioGainEnable', (value ? '1' : '0'), this._id)
        .then(res => {
            resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('prop:AudioGainEnable', this._id).then(val => {
          resolve(val === '1');
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:AudioGainEnable', (value ? '1' : '0'),
        this._srcId, this._id, this._updateId.bind(this))
        .then(res => {
            resolve(this);
        });
      }  else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:AudioGainEnable', this._srcId, this._id,
        this._updateId.bind(this)).then(val => {
        resolve(val === '1');
      });
      }
    })
  }

  silenceThreshold(value?: number): Promise<number|SourceAudio> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'silenceThreshold',  true)
      }

      if (typeof value !== 'number' && value) {
        reject(Error('Only numbers are acceptable values for threshold'));
      } else if (value && (value % 1 !== 0 || value < 0 || value > 128)) {
        reject(Error('Only integers in the range 0-128 are acceptable for threshold'));
      } else if (this._isItemCall && value) {
        iItem.set('prop:AudioGain', String(value), this._id).then(res => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('prop:AudioGain', this._id).then(val => {
          resolve(Number(val));
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:AudioGain', String(value), this._srcId,
        this._id, this._updateId.bind(this)).then(res => {
          resolve(this);
        });
      }  else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:AudioGain', this._srcId, this._id, this._updateId.bind(this))
        .then(val => {
          resolve(Number(val));
        });
      }
    })
  }

  silencePeriod(value?: number): Promise<number|SourceAudio> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'silencePeriod',  true)
      }

      if (typeof value !== 'number' && value) {
        reject(Error('Only numbers are acceptable values for silence period'));
      } else if (value && (value % 1 !== 0 || value < 0 || value > 128)) {
        reject(Error('Only integers in the range 0-128 are acceptable for silence period'));
      } else if (this._isItemCall && value) {
        iItem.set('prop:AudioGainLatency', String(value), this._id).then(res => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('prop:AudioGainLatency', this._id).then(val => {
          resolve(Number(val));
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:AudioGainLatency', String(value), this._srcId,
        this._id, this._updateId.bind(this)).then(res => {
        resolve(this);
      });
      }  else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:AudioGainLatency', this._srcId,
        this._id, this._updateId.bind(this)).then(val => {
        resolve(Number(val));
      });
      }
    })
  }

  audioOffset(value?: number): Promise<number|SourceAudio> {
    return new Promise((resolve, reject) => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'audioOffset',  true)
      }

      if (typeof value !== 'number' && value) {
        reject(Error('Only numbers are acceptable values for offset'));
      } else if (value && value < 0) {
        reject(Error('Audio offset cannot be negative'));
      } else if (this._isItemCall && value) {
        iItem.set('prop:AudioDelay', String(value), this._id).then(res => {
          resolve(this);
        });
      } else if (this._isItemCall && !value) {
        iItem.get('prop:AudioDelay', this._id).then(val => {
          resolve(Number(val));
        });
      } else if (!this._isItemCall && value) {
        iItem.wrapSet('prop:AudioDelay', String(value), this._srcId,
        this._id, this._updateId.bind(this)).then(res => {
          resolve(this);
        });
      }  else if (!this._isItemCall && !value) {
        iItem.wrapGet('prop:AudioDelay', this._srcId, this._id,
        this._updateId.bind(this)).then(val => {
          resolve(Number(val));
        });
      }
    })
  }
}
