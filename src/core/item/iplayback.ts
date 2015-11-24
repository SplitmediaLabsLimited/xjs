/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {CuePoint} from './cuepoint';

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
  isSeekable(): Promise<boolean>;
  getPlaybackPosition(): Promise<number>;
  setPlaybackPosition(value: number): Promise<IItemPlayback>;
  getPlaybackDuration(): Promise<number>;
  isPlaying(): Promise<boolean>;
  setPlaying(value: boolean): Promise<IItemPlayback>;
  getPlaybackStartPosition(): Promise<number>;
  setPlaybackStartPosition(value: number): Promise<IItemPlayback>;
  getPlaybackEndPosition(): Promise<number>;
  setPlaybackEndPosition(value: number): Promise<IItemPlayback>;
  getVolume(): Promise<number>;
  setVolume(value: number): Promise<IItemPlayback>;
  getActionAfterPlayback(): Promise<ActionAfterPlayback>;
  setActionAfterPlayback(value: ActionAfterPlayback): Promise<IItemPlayback>;
  isAudibleOnlyOnStream(): Promise<boolean>;
  setAudibleOnlyOnStream(value: boolean): Promise<IItemPlayback>;
  isAutostartOnSceneLoad(): Promise<boolean>;
  setAutostartOnSceneLoad(value: boolean): Promise<IItemPlayback>;
  isForceDeinterlace(): Promise<boolean>;
  setForceDeinterlace(value: boolean): Promise<IItemPlayback>;
  isRememberingPlaybackPosition(): Promise<boolean>;
  setRememberingPlaybackPosition(value: boolean): Promise<IItemPlayback>;
  isShowingPlaybackPosition(): Promise<boolean>;
  setShowingPlaybackPosition(value: boolean): Promise<IItemPlayback>;
  getCuePoints(): Promise<CuePoint[]>;
  setCuePoints(value: CuePoint[]): Promise<IItemPlayback>;

  getValue(): Promise<string>;
  setValue(value: string): Promise<any>;
  isAudio(): Promise<boolean>;
  isVideo(): Promise<boolean>;
}

export class ItemPlayback implements IItemPlayback {
  private _id: string;

  isSeekable(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('sync:syncable', this._id).then(val => {
        resolve(val === "1" ? true : false);
      });
    });
  }

  getPlaybackPosition(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('sync:position', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackPosition(value: number): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('sync:position', String(value * 10000000),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getPlaybackDuration(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('sync:duration', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  isPlaying(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('sync:state', this._id).then(val => {
        resolve(val === "running");
      });
    });
  }

  setPlaying(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('sync:state', value ? "running" : "stopped",
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getPlaybackStartPosition(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:InPoint', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackStartPosition(value: number): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:InPoint', String(value * 10000000), this._id).then(() => {
        resolve(this);
      });
    });
  }

  getPlaybackEndPosition(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:OutPoint', this._id).then(val => {
        resolve(Number(val) / 10000000);
      });
    });
  }

  setPlaybackEndPosition(value: number): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:OutPoint', String(value * 10000000),
        this._id).then(() => {
          resolve(this);
      });
    });
  }

  getActionAfterPlayback(): Promise<ActionAfterPlayback> {
    return new Promise(resolve => {
      iItem.get('prop:OpWhenFinished', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setActionAfterPlayback(value: ActionAfterPlayback): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:OpWhenFinished', String(value), this._id).then(() => {
        resolve(this);
      });
    });
  }

  getVolume(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:volume', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setVolume(value: number): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:volume', String(value), this._id).then(() => {
        resolve(this);
      });
    });
  }

  isAudibleOnlyOnStream(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:sounddev', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setAudibleOnlyOnStream(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:sounddev', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isAutostartOnSceneLoad(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:StartOnLoad', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setAutostartOnSceneLoad(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:StartOnLoad', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isForceDeinterlace(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:fdeinterlace', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setForceDeinterlace(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:fdeinterlace', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  isRememberingPlaybackPosition(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:RememberPosition', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setRememberingPlaybackPosition(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:RememberPosition', (value ? '1' : '0'),
        this._id).then(() => {
          resolve(this);
      });
    })
  }

  isShowingPlaybackPosition(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:ShowPosition', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setShowingPlaybackPosition(value: boolean): Promise<ItemPlayback> {
    return new Promise(resolve => {
      iItem.set('prop:ShowPosition', (value ? '1' : '0'), this._id).then(() => {
        resolve(this);
      });
    })
  }

  getCuePoints(): Promise<CuePoint[]> {
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
    return new Promise(resolve => {
      const cuePointString = cuePoints.map(point => point.toString()).join(',');
      resolve(this);
    });
  }

  isAudio(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(filename => {
        resolve(AUDIO_REGEX.test(filename));
      });
    });
  }

  isVideo(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(filename => {
        resolve(VIDEO_REGEX.test(filename));
      });
    });
  }

  getValue(): Promise<string> {
    return new Promise(resolve => {
      // we do not do any additional checking since we are assured of the type
      iItem.get('prop:item', this._id).then(val => {
        resolve(val);
      });
    });
  };

  setValue(filename: string): Promise<ItemPlayback> {
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
