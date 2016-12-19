import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {XML} from '../../internal/util/xml';

/**
 * The ImageSource class represents the sources of the image items that
 * has been added to the stage. A single source could have multiple items linked
 * into it and any changes to the source would affect all items linked to it.
 *
 * Each item is represented by the ImageItem class.
 * See: {@link #core/ImageItem Core/ImageItem}
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
 *       if (sources[i] instanceof XJS.ImageSource) {
 *         // Manipulate your image source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 * ```
 *
 * All methods marked as *Chainable* resolve with the original `ImageSource`
 * instance.
 */
export class ImageSource extends Source {
  /**
   * Gets a special string that refers to the image's main definition.
   *
   * See: {@link #core/Source#getValue getValue}
   */
  getValue: () => Promise<string | XML>

  /**
   * Sets the image's main definition.
   *
   * See: {@link #core/Source#setValue setValue}
   */
  setValue: (value: string | XML) => Promise<ImageSource>
}