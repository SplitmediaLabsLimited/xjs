import {Addable} from './iaddable';
import {exec} from '../internal/internal';

/**
 *  This class servers to allow developers to add new screen regions or window
 *  regions to the stage in XSplit Broadcaster.
 */
export class Screen implements Addable {


  /**
   * Initializes the screen region selector crosshair so user may select
   * a desktop region or a window to add to the stage in the current scene.
   */
  addToScene(): Promise<boolean> {
    return new Promise(resolve => {
      exec('AppCallFunc', 'addscreen');
      resolve(true);
    });
  }
}
