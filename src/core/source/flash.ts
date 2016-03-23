/// <reference path="../../../defs/es6-promise.d.ts" />

import {FlashItem} from '../items/flash';


/**
 * The FlashSource class represents a flash source, which is any SWF file
 * loaded to XSplit Broadcaster.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio}
 *
 *  All methods marked as *Chainable* resolve with the original `FlashSource`
 * instance. Also, any audio setting, i.e. volume, mute, stream only
 * may not be properly reflected in the source unless native flash audio support
 * is enabled. (Tools menu > General Settings > Advanced tab)
 */
export class FlashSource extends FlashItem {
  
}