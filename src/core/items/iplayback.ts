/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {CuePoint} from './cuepoint';

/**
 *  Used by items that implement the Playback interface.
 *  Check `getActionAfterPlayback()`/`setActionAfterPlayback()` method of
 *  {@link #core/Mediaitem#getActionAfterPlayback Core/Mediaitem}.
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

export interface IItemPlayback {

  /**
   * return: Promise<boolean>
   *
   * Determines if it is possible to move the playback position of this media
   * item. It is possible for some video formats to not allow seeking of the
   * playback position.
   */
  isSeekable(): Promise<boolean>;

  /**
   * return: Promise<number>
   *
   * Gets the playback position of this item in seconds. The system can
   * store precision up to 100ns.
   */
  getPlaybackPosition(): Promise<number>;

  /**
   * param: (value: number)
   *
   * Sets the playback position of this item. Parameter is in seconds, up to
   * a precision level of 100ns.
   *
   * *Chainable.*
   */
  setPlaybackPosition(value: number): Promise<IItemPlayback>;

  /**
   * return: Promise<number>
   *
   * Gets the total playback duration of this item in seconds. Precision is up
   * to 100ns units.
   */
  getPlaybackDuration(): Promise<number>;

  /**
   * return: Promise<boolean>
   *
   * Checks if current item is playing.
   */
  isPlaying(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Plays (or pauses playback for) this item.
   *
   * *Chainable.*
   */
  setPlaying(value: boolean): Promise<IItemPlayback>;

  /**
   * return: Promise<number>
   *
   * Gets the specified start position in seconds for this item, with precision
   * up to 100ns. If this item loops or is set to rewind, the playback position
   * will return to the start position.
   */
  getPlaybackStartPosition(): Promise<number>;

  /**
   * return: Promise<number>
   *
   * Sets the specified start position in seconds for this item, with precision
   * up to 100ns. If this item loops or is set to rewind, the playback position
   * will return to the start position.
   *
   * *Chainable.*
   */
  setPlaybackStartPosition(value: number): Promise<IItemPlayback>;

  /**
   * return: Promise<number>
   *
   * Gets the specified end position in seconds for this item, with precision
   * up to 100ns. If playback reaches the end position, this item will then
   * execute the specified action after playback (rewind, loop, etc.)
   */
  getPlaybackEndPosition(): Promise<number>;

  /**
   * return: Promise<number>
   *
   * Sets the specified end position in seconds for this item, with precision
   * up to 100ns. If playback reaches the end position, this item will then
   * execute the specified action after playback (rewind, loop, etc.)
   *
   * *Chainable.*
   */
  setPlaybackEndPosition(value: number): Promise<IItemPlayback>;

  /**
   * return: Promise<ActionAfterPlayback>
   *
   * Gets the specified action after playback for this item is done (either
   * playback reaches the end of the video, or the specified playback end
   * position.)
   *
   * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
   */
  getActionAfterPlayback(): Promise<ActionAfterPlayback>;

  /**
   * param: (value: ActionAfterPlayback)
   *
   * Sets the action to be executed on this item once playback is done (either
   * playback reaches the end of the video, or the specified playback end
   * position.)
   *
   * *Chainable.*
   *
   * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
   */
  setActionAfterPlayback(value: ActionAfterPlayback): Promise<IItemPlayback>;

  /**
   * return: Promise<boolean>
   *
   * Checks whether this item is set to start playback when the application
   * switches to this item's scene.
   */
  isAutostartOnSceneLoad(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Specifies whether this item is set to start playback when the application
   * switches to this item's scene.
   *
   * *Chainable.*
   */
  setAutostartOnSceneLoad(value: boolean): Promise<IItemPlayback>;

  /**
   * return: Promise<boolean>
   *
   * Checks whether Force Deinterlace is active.
   */
  isForceDeinterlace(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets the Force Deinterlace setting.
   *
   * *Chainable.*
   */
  setForceDeinterlace(value: boolean): Promise<IItemPlayback>;

  /**
   * return: Promise<boolean>
   *
   * Check whether this item should retain its playback position when switching
   * scenes.
   */
  isRememberingPlaybackPosition(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets whether this item should retain its playback position when switching
   * scenes.
   *
   * *Chainable.*
   */
  setRememberingPlaybackPosition(value: boolean): Promise<IItemPlayback>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this item is set to display its playback position.
   */
  isShowingPlaybackPosition(): Promise<boolean>;

  /**
   * param: (value: boolean)
   *
   * Sets whether this item should display its playback position.
   *
   * *Chainable.*
   */
  setShowingPlaybackPosition(value: boolean): Promise<IItemPlayback>;

  /**
   * return: Promise<CuePoint[]>
   *
   * Gets the set of Cue Points created for this item.
   *
   * See also: {@link #core/CuePoint Core/CuePoint}
   */
  getCuePoints(): Promise<CuePoint[]>;

  /**
   * param: (value: CuePoint[])
   *
   * Assign the specified array of Cue Points for this item.
   *
   * *Chainable.*
   *
   * See also: {@link #core/CuePoint Core/CuePoint}
   */
  setCuePoints(value: CuePoint[]): Promise<IItemPlayback>;

  getValue(): Promise<string>;
  setValue(value: string): Promise<any>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this item's file type is an audio file type.
   */
  isAudio(): Promise<boolean>;

  /**
   * return: Promise<boolean>
   *
   * Checks if this item's file type is a video file type.
   */
  isVideo(): Promise<boolean>;
}

export class ItemPlayback implements IItemPlayback {
  private _id: string;
  protected _isItemCall: boolean;

  isSeekable(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('sync:syncable', this._id).then(val => {
        resolve(val === '1' ? true : false);
      });
    });
  }

  getPlaybackPosition(): Promise<number> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('sync:position', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackPosition(value: number): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('sync:position', String(value * 10000000),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getPlaybackDuration(): Promise<number> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('sync:duration', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  isPlaying(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('sync:state', this._id).then(val => {
        resolve(val === "running");
      });
    });
  }

  setPlaying(value: boolean): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('sync:state', value ? "running" : "stopped",
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getPlaybackStartPosition(): Promise<number> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:InPoint', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackStartPosition(value: number): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('prop:InPoint', String(value * 10000000), this._id).then(() => {
        resolve(this);
      });
    });
  }

  getPlaybackEndPosition(): Promise<number> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:OutPoint', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackEndPosition(value: number): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('prop:OutPoint', String(value * 10000000),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getActionAfterPlayback(): Promise<ActionAfterPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:OpWhenFinished', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setActionAfterPlayback(value: ActionAfterPlayback): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('prop:OpWhenFinished', String(value), this._id).then(() => {
        resolve(this);
      });
    });
  }

  isAutostartOnSceneLoad(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:StartOnLoad', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setAutostartOnSceneLoad(value: boolean): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('prop:StartOnLoad', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isForceDeinterlace(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:fdeinterlace', this._id).then(val => {
        resolve(val === '3');
      });
    });
  }

  setForceDeinterlace(value: boolean): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('prop:fdeinterlace', (value ? '3' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isRememberingPlaybackPosition(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:RememberPosition', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setRememberingPlaybackPosition(value: boolean): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('prop:RememberPosition', (value ? '1' : '0'),
        this._id).then(() => {
          resolve(this);
      });
    })
  }

  isShowingPlaybackPosition(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:ShowPosition', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setShowingPlaybackPosition(value: boolean): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.set('prop:ShowPosition', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  getCuePoints(): Promise<CuePoint[]> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:CuePoints', this._id).then(cuePointString => {
        if (cuePointString === '') {
          resolve([]);
        } else {
          const cuePointStrings: string[] = cuePointString.split(',');
          const cuePoints: CuePoint[] = cuePointStrings.map(
            string => CuePoint._fromString(string));
          resolve(cuePoints);
        }
      })
    });
  }

  setCuePoints(cuePoints: CuePoint[]): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      const cuePointString = cuePoints.map(point => point.toString()).join(',');
      resolve(this);
    });
  }

  isAudio(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(filename => {
        resolve(AUDIO_REGEX.test(filename));
      });
    });
  }

  isVideo(): Promise<boolean> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(filename => {
        resolve(VIDEO_REGEX.test(filename));
      });
    });
  }

  getValue(): Promise<string> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise(resolve => {
      // we do not do any additional checking since we are assured of the type
      iItem.get('prop:item', this._id).then(val => {
        resolve(val);
      });
    });
  };

  setValue(filename: string): Promise<ItemPlayback> {
    if(this._isItemCall){
      console.warn('Should only be called on Sources. Improve this message.')
    }
    return new Promise((resolve, reject) => {
      if (VIDEO_REGEX.test(filename) || AUDIO_REGEX.test(filename)) {
        iItem.set('prop:item', filename, this._id)
        .then(() => iItem.set('prop:name', filename, this._id))
        .then(() => iItem.set('prop:CuePoints', '', this._id))
        .then(() => {
          resolve(this);
        })
      } else {
        reject(new Error('You can only set the value to a valid media type'));
      }
    });
  }
}
