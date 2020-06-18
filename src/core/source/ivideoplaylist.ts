/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {IO} from '../../util/io';
import {Logger} from '../../internal/util/logger';

export interface ISourceVideoPlaylist {
  /**
   * return: Promise<string>
   *
   * Gets the now playing video of this VideoPlaylist item.
   */
  getVideoNowPlaying(): Promise<string>

  /**
   * param: (value: string|number)
   *
   * return: Promise<VideoPlaylistSource>
   *
   * Sets the now playing video of this VideoPlaylist item.
   */
  setVideoNowPlaying(value:string|number): Promise<SourceVideoPlaylist>

  /**
   * return: Promise<string[]>
   *
   * Gets the file paths of the playlist of this VideoPlaylist item.
   *
   */
  getVideoPlaylistSources(): Promise<string[]>

  /**
   * param: (file: string[])
   *
   * return: Promise<string>
   *
   * Sets the playlist of this VideoPlaylist item according to the specified
   * file paths.
   */
  setVideoPlaylistSources(fileItems:string[]): Promise<SourceVideoPlaylist>

  /**
   * return: Promise<boolean>
   *
   * Check if file used as source is available
   *
   * #### Usage
   *
   * ```javascript
   * item.isSourceAvailable().then(function(isAvail) {
   *   // The rest of your code here
   * });
   * ```
   */
  isSourceAvailable(): Promise<boolean>
}

export class SourceVideoPlaylist implements ISourceVideoPlaylist {
  private _id: string;
  private _isItemCall: boolean;
  private _srcId: string;
  private _checkPromise;
  private _sceneId: string;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  getVideoNowPlaying(): Promise<string> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getVideoNowPlaying', true)
        this._checkPromise = iItem.get('prop:srcitem', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:srcitem', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(playlist => {
        let _playlist = String(playlist).slice(0,playlist.indexOf('*'))
        resolve(_playlist)
      });
    });
  }

  setVideoNowPlaying(value:string|number): Promise<SourceVideoPlaylist> {
    let file: string;
    let _playlist: string[];

    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'setVideoNowPlaying', true)
        this._checkPromise = iItem.get('prop:FilePlaylist', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:FilePlaylist', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(playlist => {
        _playlist = String(playlist).split('|');
        for (var i = 0; i < _playlist.length; i++){
          _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf('*'));
        };
        return _playlist;
      }).then(list => {
        if (typeof value === 'string') {
          if(_playlist.indexOf(value) === -1){
            reject(Error('File not found on Playlist.'))
          } else {
            let index = _playlist.indexOf(value);
            file = _playlist[index] + '*' + index;
            iItem.set('prop:srcitem', file, this._id)
            .then(fileplaylist => {
              resolve(this);
            });
          }
        } else if (typeof value === 'number' && value <= _playlist.length) {
          file = (_playlist[value] + '*' + value);
            iItem.set('prop:srcitem', file, this._id)
              .then(function (fileplaylist) {
                resolve(this);
              });
        } else {
          reject(Error('Invalid parameter. Value can only be either filename string or its index equivalent in the VideoPlaylist files array'));
        };
      })
    });

  };

  getVideoPlaylistSources(): Promise<string[]> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getVideoPlaylistSources', true)
        this._checkPromise = iItem.get('prop:FilePlaylist', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:FilePlaylist', this._srcId,
          this._id, this._updateId.bind(this))
      }
      this._checkPromise.then(playlist => {
        let _playlist = String(playlist).split('|');
        for (var i = 0; i < _playlist.length; i++){
          _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf('*'));
        };
        resolve(_playlist);
      });
    });
  };

  setVideoPlaylistSources(fileItems:string[]): Promise<SourceVideoPlaylist> {
    if(this._isItemCall){
      Logger.warn('sourceWarning', 'setVideoPlaylistSources', true)
    }
    let fileString: string;

    let filePromises = fileItems.map((filename) => {
      return IO.getVideoDuration(filename);
    });

    return new Promise((resolve, reject) => {
      Promise.all(filePromises).then(duration => {
        for (var i = 0; i < fileItems.length; i++) {
          if(fileString === undefined){
            fileString = fileItems[i] + '*' + i + '*1*'
            + duration[i] + '*100*0*0*0*0*0|';
          } else {
            fileString += fileItems[i] + '*' + i + '*1*'
            + duration[i] + '*100*0*0*0*0*0';
            if (i+1 < fileItems.length) {
              fileString += '|';
            };
          };
        };
        if(this._isItemCall) {
          iItem.set('prop:srcitem', fileItems[0] + '*0', this._id);
        } else {
          iItem.wrapSet('prop:srcitem', fileItems[0] + '*0', this._srcId,
          this._id, this._updateId.bind(this));
        }
        return fileString;
      }).then(fileString => {
        iItem.set('prop:FilePlaylist', fileString, this._id)
        .then(fileplaylist => {
          resolve(this);
        });
      }).catch(err => {
        reject(err);
      })      ;
    });
  };

  isSourceAvailable(): Promise<boolean> {
    return new Promise(resolve => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'isSourceAvailable', true)
        iItem.get('prop:itemavail', this._id).then(val => {
          resolve(val === '1');
        });
      } else {
        iItem.wrapGet('prop:itemavail', this._srcId, this._id, this._updateId.bind(this)).then(val => {
          resolve(val === '1');
        });
      }
    });
  }
}
