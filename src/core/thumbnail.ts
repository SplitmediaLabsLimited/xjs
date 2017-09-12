/// <reference path="../../defs/es6-promise.d.ts" />

import {Scene} from './scene';
import {App as iApp} from '../internal/app';

export class Thumbnail {

  /**
   * param?: scene<number|Scene>
   * ```
   * return: Promise<string>
   * ```
   *
   * Returns a base64 png url of a specified or current scene.
   *
   * #### Usage
   *
   * ```javascript
   * var sceneThumbnail
   *
   * Thumbnail.getSceneThumbnail().then(function(image) {
   *   sceneThumbnail = image;
   *   // can be used as:
   *   // div.style.backgroundImage = 'url(data:image/png;base64, image)'
   * })
   */
  static getSceneThumbnail(scene?: any): Promise<string> {
    let scenePromise
    return new Promise((resolve, reject) => {
      scenePromise = new Promise(innerResolve => {
        if (scene instanceof Scene) {
          innerResolve(scene._id)
        } else if (typeof scene === 'number') {
          if (scene < 0) {
            reject(Error('Invalid parameters. Valid range is 0 or higher'))
          } else {
            innerResolve(scene)
          }
        } else if (!scene) {
          Scene.getActiveScene().then(currScene => {
            return currScene.getSceneNumber() //replace with getSceneIndex
          }).then(sceneNum => {
            innerResolve(sceneNum - 1)
          })
        } else {
          reject(Error('Invalid parameters. Valid parameter is scene or scene index'))
        }
      })

      scenePromise.then(finalScene => {
        iApp.get(`presetthumbnail:${String(finalScene)}`)
        .then(thumb => {
          resolve(thumb)
        })
      })
    })
  }

}