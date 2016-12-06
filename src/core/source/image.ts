import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {XML} from '../../internal/util/xml';

/**
 * The ImageSource class represents the sources of the audio device items that
 * has been added to the stage.
 *
 * Each item is represented by the AudioItem class.
 * See: {@link: #core/ImageItem Core/ImageItem}
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
 *         // Manipulate your audio device Source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   })
 * })
 */
export class ImageSource extends Source {
  /**
   * See: {@link #core/Source#getValue getValue}
   */
  getValue: () => Promise<string | XML>

  /**
   * See: {@link #core/Source#setValue setValue}
   */
  setValue: (value: string | XML) => Promise<ImageSource>
}