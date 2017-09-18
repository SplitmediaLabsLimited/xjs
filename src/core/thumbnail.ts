/// <reference path="../../defs/es6-promise.d.ts" />

import {Scene} from './scene';
import {App as iApp} from '../internal/app';
import {Render} from '../internal/render';

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
          scene.getSceneNumber()
          .then(num => innerResolve(num - 1))
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


  // Assign a canvas and create necessary webgl context
  static setTargetCanvas(canvas: HTMLCanvasElement,
                         fps: number = 30): Promise<any> {
    return new Promise((resolve, reject) => {
      if (canvas) {
        Render.setCanvas(canvas, fps).then(res => {
          resolve(res)
        })
      } else {
        reject(Error('No canvas selected'))
      }
    })
  }

  // Uses prepared canvas to dupworkspace
  // reject if no canvas was set
  static renderSceneToTexture(scene: number) {
    return new Promise((resolve, reject) => {
      Render.drawToTexture(scene)
      resolve()
    })
  }

  // If there's an active render, set rendering to true or false
  static toggleRender(state?: boolean) {
    return new Promise(resolve => {
      Render.startStopRender(state).then(res => {
        resolve(res)
      })
    })
  }
  // static setRenderFPS(fps: number) {
  //   return new Promise(resolve => {
  //     Render.setFPS(fps).then(() => {
  //       resolve(true)
  //     })
  //   })
  // }


}