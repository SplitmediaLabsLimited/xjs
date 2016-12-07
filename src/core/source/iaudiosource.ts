/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Environment} from '../environment';

export interface ISourceAudio {

  /**
   * return: Promise<boolean>
   *
   * Check if silence detection is on or off
   */
  isSilenceDetectionEnabled(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Set silence detection to ON or OFF
   */
  setSilenceDetectionEnabled(value: boolean): Promise<ISourceAudio>

  /**
   * return: Promise<number>
   *
   * Gets silenced detection threshold.
   * Amplitude less than threshold will be detected as silence.
   */
  getSilenceThreshold(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets silence detection threshold, min of 0, max of 128
   */
  setSilenceThreshold(value: number): Promise<ISourceAudio>

  /**
   * return: Promise<number>
   *
   * Gets silenced detection period in ms time unit.
   * Reaction time before filter removes noice/sound less than threshold
   */
  getSilencePeriod(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets silence detection period, min of 0, max of 10000
   */
  setSilencePeriod(value: number): Promise<ISourceAudio>

  /**
   * return: Promise<number>
   *
   * Gets audio delay (1 unit = 100ns)
   */
  getAudioOffset(): Promise<number>

  /**
   * param: (value: number)
   *
   * Sets audio delay, accepts only positive delay
   */
  setAudioOffset(value: number): Promise<ISourceAudio>
}

export class SourceAudio implements ISourceAudio {
  private _id: string;

  isSilenceDetectionEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:AudioGainEnable', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setSilenceDetectionEnabled(value: boolean): Promise<SourceAudio> {
    return new Promise((resolve, reject) => {
      iItem.set('prop:AudioGainEnable', (value ? '1' : '0'), this._id)
      .then(res => {
          resolve(this);
      });
    });
  }

  getSilenceThreshold(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:AudioGain', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setSilenceThreshold(value: number): Promise<SourceAudio> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for threshold'));
      } else if (value % 1 !== 0 || value < 0 || value > 128) {
        reject(
          Error('Only integers in the range 0-128 are acceptable for threshold')
        );
      } else {
        iItem.set('prop:AudioGain', String(value), this._id).then(res => {
          resolve(this);
        });
      }
    });
  }

  getSilencePeriod(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:AudioGainLatency', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setSilencePeriod(value: number): Promise<SourceAudio> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for period'));
      } else if (value % 1 !== 0 || value < 0 || value > 10000) {
        reject(
          Error('Only integers in the range 0-10000 are acceptable for period')
        );
      } else {
        iItem.set('prop:AudioGainLatency', String(value), this._id).then(res => {
          resolve(this);
        });
      }
    });
  }

  getAudioOffset(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:AudioDelay', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setAudioOffset(value: number): Promise<SourceAudio> {
    return new Promise((resolve, reject) => {
      if (typeof value !== 'number') {
        reject(Error('Only numbers are acceptable values for period'));
      }
      else if (value < 0) {
        reject(Error('Audio offset cannot be negative'));
      } else {
        iItem.set('prop:AudioDelay', String(value), this._id).then(res => {
          resolve(this);
        });
      }
    });
  }
}
