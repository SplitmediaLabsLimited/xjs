/**
 * Check if splitmode is active
 */

import {App as iApp} from '../app';
import {Scene} from '../../core/scene';

/**
 * return: value<number>
 *
 * Returns splitmode value
 */
export function splitMode() {
  return new Promise(resolve => {
    iApp.getGlobalProperty('splitmode').then(mode => {
      resolve(mode === '1' ? 1 : 0)
    })
  })
}

/**
 * Used on addToScene methods
 */
export function checkSplitmode(value?: number | Scene): any {
  let scenePrefix = '';
  let scenePromise;
  return new Promise((resolve,reject) => {
    scenePromise = new Promise(sceneResolve => {
      iApp.getGlobalProperty('splitmode').then(res => {
      if (res === '1' && !value) {
        Scene.getActiveScene().then(val => {
          value = val
          sceneResolve(value)
        })
      } else {
        sceneResolve(value)
      }
    })
    })

    scenePromise.then(val => {
      if (typeof val === 'number' || val instanceof Scene) {
        Scene.getSceneCount().then(sceneCount => {
          if (typeof val === 'number') {
            let int = Math.floor(val);
            if (int > sceneCount || int === 0) {
              reject(Error('Scene does not exist.'));
            } else {
              scenePrefix = 's:' + (int - 1) + '|';
              resolve(scenePrefix);
            }
          } else {
            val.getSceneNumber().then(int => {
              if (int > sceneCount || int === 0) {
                reject(Error('Scene does not exist.'));
              } else {
                scenePrefix = 's:' + (int - 1) + '|';
                resolve(scenePrefix);
              }
            });
          }
        });
      } else if (typeof val === 'undefined') {
        resolve('')
      } else {
        reject(Error('Optional parameter \'scene\' only accepts integers or an XJS.Scene object'))
      }
    })
  })
}
