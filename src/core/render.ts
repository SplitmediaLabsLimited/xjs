/// <reference path="../../defs/es6-promise.d.ts" />

import {Scene} from './scene';
import {App as iApp} from '../internal/app';
import {Render as iRender} from '../internal/render';
import { exec } from '../internal/internal';

export class Render {


  // If there's an active render, set rendering to true or false
  // static toggleRender(state?: boolean) {
    //   return new Promise(resolve => {
      //     iRender.startStopRender(state).then(res => {
        //       resolve(res)
        //     })
        //   })
        // }

  // Assign a canvas and create necessary webgl context
  static setTargetCanvas(canvas: HTMLCanvasElement,
    fps: number = 30): Promise<any> {
      return new Promise((resolve, reject) => {
        if (canvas) {
          iRender.initializeCanvas(canvas, fps).then(res => {
            res
          })
        } else {
          reject(Error('No canvas selected'))
        }
      })
    }

    // use dupscene
    // static renderScene(canvasIndex, sceneId) {
    //   return new Promise(resolve => {
    //     iRender.drawToTexture(canvasIndex, sceneId, 'dupscene').then(res => {
    //       resolve()
    //     })
    //   })
    // }

    /**
     * params: (canvas: HTMLCanvasElement, scene: any, fps: number)
     *
     * Renders the specified scene into the provided canvas element.
     * scene parameter can be Scene instance, scene index, or scene uid.
     *
     *
     * Note: Reimplement on all other renders
     */
    static renderScene(canvas: HTMLCanvasElement, scene: any, fps: number = 30) {
      return new Promise((resolve, reject) => {
        let sceneIndex;
        if ((scene instanceof Scene || typeof scene === 'number' || typeof scene === 'string') && canvas) {
          iRender.initializeCanvas(canvas, fps).then(indx => {
            sceneIndex = indx;
            let scenePromise = new Promise(sceneResolve => {
              if (scene instanceof Scene) {
                scene.getSceneUid().then(uid => {
                  sceneResolve(uid)
                })
              } else if (typeof scene === 'number' && scene >= 0) {
                Scene.getBySceneIndex(scene).then(scene => {
                  scene.getSceneUid().then(uid => {
                    sceneResolve(uid)
                  })
                })
              } else if (typeof scene === 'string' && (/^{[A-F0-9\-]*}$/i.test(scene))) {
                Scene.getBySceneUid(scene).then(scene => {
                  scene.getSceneUid().then(uid => {
                    sceneResolve(uid)
                  })
                })
              }
            })

            scenePromise.then(finalScene => {
              iRender.drawToTexture(sceneIndex, finalScene, 'dupscene').then(res => {
                resolve();
              })
            })
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/scene is correct.'));
        }
      })
    }

    // use dupvideoitem
    static renderVideoItem(canvasIndex, videoItem) {
      return new Promise(resolve => {
        iRender.drawToTexture(canvasIndex, videoItem, 'dupvideoitem').then(res => {
          resolve()
        })
      })
    }

    // use dupsource
    static renderVideoSource(canvasIndex, sourceId) {
      return new Promise(resolve => {
        iRender.drawToTexture(canvasIndex, sourceId, 'dupvideosource').then(res => {
          resolve()
        })
      })
    }

    // use dupworkspace
    static renderWorkspace(canvasIndex, sceneId) {
      return new Promise(resolve => {
        iRender.drawToTexture(canvasIndex, sceneId, 'dupworkspace').then(res => {
          resolve()
        })
      })
    }
}
