/// <reference path="../../../defs/es6-promise.d.ts" />
///
import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {IO} from '../../util/io';
import {ItemConfigurable, IItemConfigurable} from './iconfig';

export class VideoPlaylistSource extends Source implements IItemConfigurable{
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