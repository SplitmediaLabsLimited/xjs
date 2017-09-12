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
   * Returns a data:image/png;base64, url of a specified scene
   * or the current scene.
   *
   * #### Usage
   *
   * ```javascript
   * var sceneThumbnail
   *
   * Thumbnail.getSceneThumbnail().then(function(image) {
   *   sceneThumbnail = image;
   * })
   */
  static getSceneThumbnail(scene?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (scene instanceof Scene) {
        iApp.get(`presetthumbnail:${String(scene._id)}`)
        .then(thumb => {
          resolve('data:image/png;base64, '+ thumb)
        })
      } else if (typeof scene === 'number') {
        if (scene < 0) {
          reject(Error('Invalid parameters. Valid range is 0 or higher'))
        } else {
          iApp.get(`presetthumbnail:${String(scene)}`)
          .then(thumb => {
            resolve('data:image/png;base64, '+ thumb)
          })
        }
      } else if (!scene) {
        Scene.getActiveScene().then(currScene => {
          return currScene.getSceneNumber() //replace with getSceneIndex
        }).then(sceneNum => {
          iApp.get(`presetthumbnail:${String(sceneNum - 1)}`)
          .then(thumb => {
            resolve('data:image/png;base64, '+ thumb)
          })
        })
      } else {
        reject(Error('Invalid parameters. Valid parameter is scene or scene index'))
      }
    })
  }
}