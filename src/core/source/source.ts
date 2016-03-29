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
 * This method is deprecated and will be removed soon. Please use
 * {@link #core/Item Item} instead.
 */
export class Source extends Item {

}