/// <reference path="../../../defs/es6-promise.d.ts" />

import {FlashItem} from '../items/flash';


/**
 * > #### For Deprecation
 * This Class is deprecated and will be removed soon. Please use
 * {@link #core/FlashItem FlashItem} instead.
 *
 * *This Class extends {@link #core/FlashItem FlashItem} Class. Please check
 * FlashItem Class for the available methods.*
 */
export class FlashSource extends FlashItem {
  constructor(props: {}) {
    console.warn('Warning! This Class is deprecated and will be removed soon.' +
      ' Please use FlashItem Class instead');
    super(props);
  }
}
