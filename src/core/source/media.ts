
import {MediaItem} from '../items/media';


/**
 * > #### For Deprecation
 * This Class is deprecated and will be removed soon. Please use
 * {@link #core/MediaItem MediaItem} instead.
 *
 * *This Class extends {@link #core/MediaItem MediaItem} Class. Please check
 * MediaItem Class for the available methods.*
 */
export class MediaSource extends MediaItem {
  constructor(props: {}) {
    console.warn('Warning! This Class is deprecated and will be removed soon.' +
      ' Please use MediaItem Class instead');
    super(props);
  }
}
