import {Addable} from './iaddable';
import {exec} from '../internal/internal';
import {App as iApp} from '../internal/app';
import {Scene} from '../core/scene';

/**
 *  This class serves to allow developers to add new screen regions or window
 *  regions to the stage in XSplit Broadcaster.
 */
export class Screen implements Addable {

  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Initializes the screen region selector crosshair
   * so user may select a desktop region or a window to add to the stage in the current scene.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   */
  addToScene(value?: number | Scene ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let scenePrefix = '';
      let scenePromise;
      let checkSplitMode;

      checkSplitMode = new Promise(splitPromise => {
        iApp.getGlobalProperty('splitmode').then(res => {
          if (res === '1' && !value) {
            Scene.getActiveScene().then(val => {
              value = val
              splitPromise(value)
            })
          } else {
            splitPromise(value)
          }
        })
      })

      checkSplitMode.then(value => {
        if (typeof value === 'number' || value instanceof Scene) {
          scenePromise = new Promise((innerResolve, innerReject) => {
            Scene.getSceneCount().then(sceneCount => {
              if (typeof value === 'number') {
                let int = Math.floor(value);
                if (int > sceneCount || int === 0) {
                  innerReject(new Error('Scene not existing.'));
                } else {
                  scenePrefix = 's:' + (int - 1) + '|';
                  innerResolve();
                }
              } else {
                value.getSceneNumber().then(int => {
                  if (int > sceneCount || int === 0) {
                    innerReject(new Error('Scene not existing.'));
                  } else {
                    scenePrefix = 's:' + (int - 1) + '|';
                    innerResolve();
                  }
                });
              }
            });
          });
        } else if (typeof value === 'undefined') {
          scenePromise = Promise.resolve();
        } else {
          scenePromise = Promise.reject(new Error('Optional parameter \'scene\' only accepts integers or an XJS.Scene object'))
        }

        scenePromise.then(() => {
          exec('AppCallFunc', scenePrefix + 'addscreen');
          resolve(true);
        }).catch(err => {
          reject(err);
        });
      })
    });
  }
}
