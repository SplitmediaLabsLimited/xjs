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
 * A `Source` represents an object that is used as a source on the stage.
 * Some possible sources are games, microphones, or a webpage.
 *
 * Implements: {@link #core/IItemLayout Core/IItemLayout}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Scene = xjs.Scene.getById(0);
 *
 * Scene.getSources().then(function(sources) {
 *   if (sources.length === 0) return;
 *
 *   // There's a valid source, let's use that
 *   var source = sources[sources.length - 1];
 *   return source.setCustomName('SourceTesting');
 * }).then(function(source) {
 *   // Do something else here
 * });
 * ```
 * All methods marked as *Chainable* resolve with the original `Source` instance.
 * This allows you to perform sequential operations correctly:
 * ```javascript
 * var xjs = require('xjs');
 * var Source = xjs.Source;
 *
 * // a source that sets its own properties on load
 * xjs.ready()
 *    .then(Source.getCurrentSource)
 *    .then(function(source) {
 *     return source.setCustomName('MyCustomName');
 *  }).then(function(source) {
 *     return source.setKeepLoaded(true);
 *  }).then(function(source) {
 *     // set more properties here
 *  });
 * ```
 */
export class Source extends Item {

}