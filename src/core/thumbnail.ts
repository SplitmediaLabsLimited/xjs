/// <reference path="../../defs/es6-promise.d.ts" />

import {Scene} from './scene';
import {App as iApp} from '../internal/app';

export class Thumbnail {
  /**
   * param?: scene<id|Scene|undefined>
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
          scene.getSceneUid()
          .then(sceneUid => innerResolve(sceneUid))
        } else if (typeof scene === 'number') {
          if (scene < 0) {
            reject(Error('Invalid parameters. Valid range is 0 or higher'))
          } else {
            Scene.getBySceneIndex(scene).then(curScene => {
              return curScene.getSceneUid()
            }).then(sceneUid => {
              innerResolve(sceneUid)
            })
          }
        } else if (!scene) {
          Scene.getActiveScene().then(curScene => {
            return curScene.getSceneUid() //replace with getSceneIndex
          }).then(sceneUid => {
            innerResolve(sceneUid)
          })
        } else {
          reject(Error('Invalid parameters. Valid parameter is scene or scene index'))
        }
      })

      scenePromise.then(sceneUid => {
        iApp.get(`scenethumbnail:${sceneUid}`)
        .then(thumb => {
          resolve(thumb)
        })
      })
    })
  }
}