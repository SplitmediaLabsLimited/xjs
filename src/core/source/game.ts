/// <reference path="../../../defs/es6-promise.d.ts" />

import {GameItem} from '../items/game';


/**
 * > #### For Deprecation
 * This Class is deprecated and will be removed soon. Please use
 * {@link #core/GameItem GameItem} instead.
 *
 * *This Class extends {@link #core/GameItem GameItem} Class. Please check
 * GameItem Class for the available methods.*
 */
export class GameSource extends GameItem {
  constructor(props: {}) {
    console.warn('Warning! This Class is deprecated and will be removed soon.' +
      ' Please use GameItem Class instead');
    super(props);
  }
}
