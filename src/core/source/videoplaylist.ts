/// <reference path="../../../defs/es6-promise.d.ts" />
///
import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {IO} from '../../util/io';
import {ItemConfigurable, IItemConfigurable} from '../items/iconfig';

export class VideoPlaylistSource extends Source implements IItemConfigurable{
  /**
   * return: Promise<string>
   *
   * Gets the now playing video of this VideoPlaylist item.
   *
   */

  getVideoNowPlaying(): Promise<string> {
    return new Promise(resolve => {
      iItem.get('prop:item', this._id).then(playlist => {
        let _playlist = String(playlist).slice(0,playlist.indexOf('*'))
        resolve(_playlist)
      });
    });
  }

  /**
   * param: (value: string|number)
   *
   * return: Promise<VideoPlaylistSource>
   *
   * Sets the now playing video of this VideoPlaylist item.
   *
   * ## Possible Values
   * - STRING - file path
   * - NUMBER - number|within the range of fileplaylist array length
   *
   */

  setVideoNowPlaying(value:string|number): Promise<VideoPlaylistSource> {
    let file: string;
    let _playlist: string[];

    return new Promise((resolve, reject) => {
      iItem.get('prop:FilePlaylist', this._id).then(playlist => {
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
            iItem.set('prop:item', file, this._id)
            .then(fileplaylist => {
              resolve(this);
            });
          }
        } else if (typeof value === 'number' && value <= _playlist.length) {
          file = (_playlist[value] + '*' + value);
            iItem.set('prop:item', file, this._id)
              .then(function (fileplaylist) {
                resolve(this);
              });
        } else {
          reject(Error('Invalid value.'));
        };
      })
    });

  };

  /**
   * return: Promise<string[]>
   *
   * Gets the file paths of the playlist of this VideoPlaylist item.
   *
   */

  getVideoPlaylistSources(): Promise<string[]> {
    return new Promise(resolve => {
      iItem.get('prop:FilePlaylist', this._id).then(playlist => {
        let _playlist = String(playlist).split('|');
        for (var i = 0; i < _playlist.length; i++){
          _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf('*'));
        };
        resolve(_playlist);
      });
    });
  };

  /**
   * param: (file: string[])
   *
   * return: Promise<string>
   *
   * Sets the playlist of this VideoPlaylist item according to the specified
   * file paths.
   *
   * This call would replace all the items on the playlist.
   * The now playing item is also set to the first item of the new FilePlaylist.
   *
   */

  setVideoPlaylistSources(fileItems:string[]): Promise<VideoPlaylistSource> {
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
        iItem.set('prop:item', fileItems[0] + '*0', this._id);
        return fileString;
      }).then(fileString => {
        iItem.set('prop:FilePlaylist', fileString, this._id)
        .then(fileplaylist => {
          resolve(this);
        });
      });
    });
  };

  // ItemConfigurable

  /**
   * See: {@link #core/IItemConfigurable#loadConfig loadConfig}
   */
  loadConfig: () => Promise<any>;

  /**
   * See: {@link #core/IItemConfigurable#saveConfig saveConfig}
   */
  saveConfig: (configObj: any) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/IItemConfigurable#requestSaveConfig requestSaveConfig}
   */
  requestSaveConfig: (configObj: any) => Promise<VideoPlaylistSource>;

  /**
   * See: {@link #core/IItemConfigurable#applyConfig applyConfig}
   */
  applyConfig: (configObj: any) => Promise<VideoPlaylistSource>;
}

applyMixins(VideoPlaylistSource, [ItemConfigurable])