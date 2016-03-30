/// <reference path="../../../defs/es6-promise.d.ts" />
import {Item} from '../items/item'

export enum SourceTypes {
  UNDEFINED,
  FILE,
  LIVE,
  TEXT,
  BITMAP,
  SCREEN,
  FLASHFILE,
  GAMESOURCE,
  HTML
}

export enum ViewTypes {
  MAIN,
  PREVIEW,
  THUMBNAIL
}

/**
 * > #### For Deprecation
 * This Class is deprecated and will be removed soon. Please use
 * {@link #core/Item Item} instead.
 *
 * *This Class extends {@link #core/Item Item} Class. Please check Item Class for
 * the available methods.*
 */
export class Source extends Item {

}
