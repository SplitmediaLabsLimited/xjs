/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {CuePoint} from './cuepoint';
import {Logger} from '../../internal/util/logger';

/**
 *  Used by sources that implement the Playback interface.
 */
export enum ActionAfterPlayback {
  NONE,
  REWIND,
  LOOP,
  TRANSPARENT,
  HIDE
}

const AUDIO_REGEX =
  /\.(mp3|aac|cda|ogg|m4a|flac|wma|aiff|aif|wav|mid|midi|rma)$/;
const VIDEO_REGEX =
  /\.(avi|flv|mkv|mp4|mpg|wmv|3gp|3g2|asf|f4v|mov|mpeg|vob|webm)$/;

export interface ISourcePlayback {
  playbackPosition(value?: number): Promise<number|ISourcePlayback>
  playbackDuration(): Promise<number>
  playing(value?: boolean): Promise<boolean|ISourcePlayback>
  playbackStartPostion(value?: number): Promise<number|ISourcePlayback>
  playbackEndPosition(value?: number): Promise<number|ISourcePlayback>
  actionAfterPlayback(value?: number): Promise<number|ISourcePlayback>
  autoStartOnSceneLoad(value?: boolean): Promise<boolean|ISourcePlayback>
  forceDeinterlace(value?: boolean): Promise<boolean|ISourcePlayback>
  rememberPlaybackPosition(value?: boolean): Promise<boolean|ISourcePlayback>
  showPlaybackPosition(value?: boolean): Promise<boolean|ISourcePlayback>
  cuePoints(cuePoints?: CuePoint[]): Promise<CuePoint[]|ISourcePlayback>

  /**
   * return: Promise<boolean>
   *
   * Determines if it is possible to move the playback position of this media
   * source. It is possible for some video formats to not allow seeking of the
   * playback position.
   */
  isSeekable(): Promise<boolean>;

  // /**
  //  * return: Promise<number>
  //  *
  //  * Gets the playback position of this source in seconds. The system can
  //  * store precision up to 100ns.
  //  */
  // getPlaybackPosition(): Promise<number>;

  // /**
  //  * param: (value: number)
  //  *
  //  * Sets the playback position of this source. Parameter is in seconds, up to
  //  * a precision level of 100ns.
  //  *
  //  * *Chainable.*
  //  */
  // setPlaybackPosition(value: number): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<number>
  //  *
  //  * Gets the total playback duration of this source in seconds. Precision is up
  //  * to 100ns units.
  //  */
  // getPlaybackDuration(): Promise<number>;

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Checks if current source is playing.
  //  */
  // isPlaying(): Promise<boolean>;

  // /**
  //  * param: (value: boolean)
  //  *
  //  * Plays (or pauses playback for) this source.
  //  *
  //  * *Chainable.*
  //  */
  // setPlaying(value: boolean): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<number>
  //  *
  //  * Gets the specified start position in seconds for this source, with precision
  //  * up to 100ns. If this source loops or is set to rewind, the playback position
  //  * will return to the start position.
  //  */
  // getPlaybackStartPosition(): Promise<number>;

  // /**
  //  * return: Promise<number>
  //  *
  //  * Sets the specified start position in seconds for this source, with precision
  //  * up to 100ns. If this source loops or is set to rewind, the playback position
  //  * will return to the start position.
  //  *
  //  * *Chainable.*
  //  */
  // setPlaybackStartPosition(value: number): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<number>
  //  *
  //  * Gets the specified end position in seconds for this source, with precision
  //  * up to 100ns. If playback reaches the end position, this source will then
  //  * execute the specified action after playback (rewind, loop, etc.)
  //  */
  // getPlaybackEndPosition(): Promise<number>;

  // /**
  //  * return: Promise<number>
  //  *
  //  * Sets the specified end position in seconds for this source, with precision
  //  * up to 100ns. If playback reaches the end position, this source will then
  //  * execute the specified action after playback (rewind, loop, etc.)
  //  *
  //  * *Chainable.*
  //  */
  // setPlaybackEndPosition(value: number): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<ActionAfterPlayback>
  //  *
  //  * Gets the specified action after playback for this source is done (either
  //  * playback reaches the end of the video, or the specified playback end
  //  * position.)
  //  *
  //  * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
  //  */
  // getActionAfterPlayback(): Promise<ActionAfterPlayback>;

  // /**
  //  * param: (value: ActionAfterPlayback)
  //  *
  //  * Sets the action to be executed on this source once playback is done (either
  //  * playback reaches the end of the video, or the specified playback end
  //  * position.)
  //  *
  //  * *Chainable.*
  //  *
  //  * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
  //  */
  // setActionAfterPlayback(value: ActionAfterPlayback): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Checks whether this source is set to start playback when the application
  //  * switches to this source's scene.
  //  */
  // isAutostartOnSceneLoad(): Promise<boolean>;

  // /**
  //  * param: (value: boolean)
  //  *
  //  * Specifies whether this source is set to start playback when the application
  //  * switches to this source's scene.
  //  *
  //  * *Chainable.*
  //  */
  // setAutostartOnSceneLoad(value: boolean): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Checks whether Force Deinterlace is active.
  //  */
  // isForceDeinterlace(): Promise<boolean>;

  // /**
  //  * param: (value: boolean)
  //  *
  //  * Sets the Force Deinterlace setting.
  //  *
  //  * *Chainable.*
  //  */
  // setForceDeinterlace(value: boolean): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Check whether this source should retain its playback position when switching
  //  * scenes.
  //  */
  // isRememberingPlaybackPosition(): Promise<boolean>;

  // /**
  //  * param: (value: boolean)
  //  *
  //  * Sets whether this source should retain its playback position when switching
  //  * scenes.
  //  *
  //  * *Chainable.*
  //  */
  // setRememberingPlaybackPosition(value: boolean): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<boolean>
  //  *
  //  * Checks if this source is set to display its playback position.
  //  */
  // isShowingPlaybackPosition(): Promise<boolean>;

  // /**
  //  * param: (value: boolean)
  //  *
  //  * Sets whether this source should display its playback position.
  //  *
  //  * *Chainable.*
  //  */
  // setShowingPlaybackPosition(value: boolean): Promise<ISourcePlayback>;

  // /**
  //  * return: Promise<CuePoint[]>
  //  *
  //  * Gets the set of Cue Points created for this source.
  //  *
  //  * See also: {@link #core/CuePoint Core/CuePoint}
  //  */
  // getCuePoints(): Promise<CuePoint[]>;

  // /**
  //  * param: (value: CuePoint[])
  //  *
  //  * Assign the specified array of Cue Points for this source.
  //  *
  //  * *Chainable.*
  //  *
  //  * See also: {@link #core/CuePoint Core/CuePoint}
  //  */
  // setCuePoints(value: CuePoint[]): Promise<ISourcePlayback>;

  getValue(): Promise<string>;
  setValue(value: string): Promise<any>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this source's file type is an audio file type.
   */
  isAudio(): Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this source's file type is a video file type.
   */
  isVideo(): Promise<boolean>;
}

export class SourcePlayback implements ISourcePlayback {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  isSeekable(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isSeekable',  true)
        this._checkPromise = iItem.get('sync:syncable', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('sync:syncable', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  playbackPosition(value?: number): Promise<number|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'playbackPosition',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('sync:position', String(value * 10000000), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('sync:position', String(value * 10000000),
        this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('sync:position', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('sync:position', this._srcId,
        this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(Number(val) / 10000000);
        } else {
          resolve(this);
        }
      });
    })
  }

  playbackDuration(): Promise<number> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'playbackDuration',  true)
        this._checkPromise = iItem.get('sync:duration', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('sync:duration', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  playing(value?: boolean): Promise<boolean|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'playing',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('sync:state', value ? "running" : "stopped", this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('sync:state', value ? "running" : "stopped",
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('sync:state', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('sync:state', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(val === "running");
        } else {
          resolve(this);
        }
      });
    })
  }

  playbackStartPostion(value?: number): Promise<number|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'playbackStartPostion',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:InPoint', String(value * 10000000), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:InPoint', String(value * 10000000),
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:InPoint', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:InPoint', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(Number(val) / 10000000);
        } else {
          resolve(this);
        }
      });
    })
  }

  playbackEndPosition(value?: number): Promise<number|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'playbackEndPosition',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:OutPoint', String(value * 10000000), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:OutPoint', String(value * 10000000),
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:OutPoint', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:OutPoint', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(Number(val) / 10000000);
        } else {
          resolve(this);
        }
      });
    })
  }

  actionAfterPlayback(value?: ActionAfterPlayback): Promise<ActionAfterPlayback|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'actionAfterPlayback',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:OpWhenFinished', String(value), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:OpWhenFinished', String(value),
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:OpWhenFinished', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:OpWhenFinished', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(Number(val));
        } else {
          resolve(this);
        }
      });
    })
  }

  autoStartOnSceneLoad(value?: boolean): Promise<boolean|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'autoStartOnSceneLoad',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:StartOnLoad', (value ? '1' : '0'), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:StartOnLoad', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:StartOnLoad', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:StartOnLoad', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(val === '1');
        } else {
          resolve(this);
        }
      });
    })
  }

  forceDeinterlace(value?: boolean): Promise<boolean|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'forceDeinterlace',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:fdeinterlace', (value ? '3' : '0'), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:fdeinterlace', (value ? '3' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:fdeinterlace', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:fdeinterlace', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(val === '3');
        } else {
          resolve(this);
        }
      });
    })
  }

  rememberPlaybackPosition(value?: boolean): Promise<boolean|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'rememberPlaybackPosition',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:RememberPosition', (value ? '1' : '0'), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:RememberPosition', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:RememberPosition', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:RememberPosition', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(val === '1');
        } else {
          resolve(this);
        }
      });
    })
  }

  showPlaybackPosition(value?: boolean): Promise<boolean|SourcePlayback> {
    return new Promise(resolve => {
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'showPlaybackPosition',  true)
      }

      if (this._isItemCall && value) {
        this._checkPromise = iItem.set('prop:ShowPosition', (value ? '1' : '0'), this._id)
      } else if (!this._isItemCall && value) {
        this._checkPromise = iItem.wrapSet('prop:ShowPosition', (value ? '1' : '0'),
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !value) {
        this._checkPromise = iItem.get('prop:ShowPosition', this._id)
      }  else if (!this._isItemCall && !value) {
        this._checkPromise = iItem.wrapGet('prop:ShowPosition', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(val => {
        if (val) {
          resolve(val === '1');
        } else {
          resolve(this);
        }
      });
    })
  }

  cuePoints(cuePoints?: CuePoint[]): Promise<CuePoint[]|SourcePlayback> {
    return new Promise(resolve => {
      const cuePointString = cuePoints ? cuePoints.map(point => point.toString()).join(',') : undefined;
      if (this._isItemCall) {
        Logger.warn('sourceWarning', 'cuePoints',  true)
      }

      if (this._isItemCall && cuePoints) {
        this._checkPromise = iItem.set('prop:CuePoints', cuePointString, this._id)
      } else if (!this._isItemCall && cuePoints) {
        this._checkPromise = iItem.wrapSet('prop:CuePoints', cuePointString,
          this._srcId, this._id, this._updateId.bind(this))
      } else if (this._isItemCall && !cuePoints) {
        this._checkPromise = iItem.get('prop:CuePoints', this._id)
      }  else if (!this._isItemCall && !cuePoints) {
        this._checkPromise = iItem.wrapGet('prop:CuePoints', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }

      this._checkPromise.then(cuePointString => {
        if (cuePoints) {
          resolve(this);
        } else {
          if (cuePointString === '') {
            resolve([]);
          } else {
            const cuePointStrings: string[] = cuePointString.split(',');
            const cuePoints: CuePoint[] = cuePointStrings.map(
              string => CuePoint._fromString(string));
            resolve(cuePoints);
          }
        }
      });
    })
  }

  isAudio(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isAudio',  true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(filename => {
        resolve(AUDIO_REGEX.test(filename));
      });
    });
  }

  isVideo(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isVideo',  true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(filename => {
        resolve(VIDEO_REGEX.test(filename));
      });
    });
  }

  getValue(): Promise<string> {
    return new Promise(resolve => {
      // we do not do any additional checking since we are assured of the type
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getValue',  true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId,
          this._id, this._updateId.bind(this).bind(this))
      }
      this._checkPromise.then(filename => {
        resolve(filename);
      });
    });
  };

  setValue(filename: string): Promise<SourcePlayback> {
    return new Promise((resolve, reject) => {
      if (VIDEO_REGEX.test(filename) || AUDIO_REGEX.test(filename)) {
        if(this._isItemCall){
          Logger.warn('sourceWarning', 'setValue', true)
          this._checkPromise = iItem.set('prop:srcitem', filename, this._id)
        } else {
          this._checkPromise = iItem.wrapSet('prop:srcitem', filename,
            this._srcId, this._id, this._updateId.bind(this))
        }
        this._checkPromise
        .then(() => iItem.set('prop:name', filename, this._id))
        .then(() => iItem.set('prop:CuePoints', '', this._id))
        .then(() => {
          resolve(this);
        });
      } else {
        reject(Error('You can only set the value to a valid media type'));
      }
    });
  }
}
