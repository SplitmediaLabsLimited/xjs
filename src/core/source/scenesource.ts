/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {ISourceScene, SourceScene} from '../source/iscene';
import {Scene} from '../scene';

/**
 * The SceneSource class represents the sources of the scene items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the SceneItem class.
 * See: {@link #core/SceneItem Core/SceneItem}
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *   for (var i in sources) {
 *       if (sources[i] instanceof XJS.SceneSource) {
 *         // Manipulate your scene source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
  */
export class SceneSource extends Source implements ISourceScene {
  /**
   * Gets the scene that is being displayed by the source
   *
   * See: {@link #core/SceneSource#getScene getScene}
   */
	getScene: () => Promise<Scene>

  /**
   * Sets the scene to be displayed displayed by the source
   *
   * See: {@link #core/SceneSource#setScene setScene}
   */
	setScene: (scene?: number | Scene) => Promise<SourceScene>
}

applyMixins(SceneSource, [SourceScene])