/// <reference path="../../defs/es6-promise.d.ts" />

import {Scene} from './scene';
import {Item} from './items/item';
import {Source} from './source/source';
import {App as iApp} from '../internal/app';
import {Render as iRender} from '../internal/render';
import { exec } from '../internal/internal';

export class Render {

  /**
   * param: (canvas: number | HTMLCanvasElement, state?: boolean)
   *
   * If there's an active render, set rendering to true or false, provided
   * a canvasIndex.
   */
  static toggleRender(canvas: any, state?: boolean) {
    return new Promise(resolve => {
      iRender.startStopRender(canvas, state).then(res => {
          resolve(res)
        })
      })
    }

    /**
     * params: (canvas: HTMLCanvasElement, scene: any, fps?: number)
     * `return: canvasIndex`
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
                resolve(sceneIndex);
              })
            })
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/scene is correct.'));
        }
      })
    }

    /**
     * params: (canvas: HTMLCanvasElement, item: any, fps?: number)
     * `return: canvasIndex`
     *
     * Renders the specified item into the provided canvas element.
     * item parameter can be Item instance, or item id.
     *
     */
    static renderVideoItem(canvas: HTMLCanvasElement, item: any, fps: number = 30) {
      return new Promise((resolve, reject) => {
        let itemIndex;
        if ((item instanceof Item ||  typeof item === 'string') && canvas) {
          iRender.initializeCanvas(canvas, fps).then(indx => {
            itemIndex = indx;
            let scenePromise = new Promise(sceneResolve => {
              if (item instanceof Item) {
                item.getId().then(itemId => {
                  sceneResolve(itemId)
                })
              } else if (typeof item === 'string' && (/^{[A-F0-9\-]*}$/i.test(item))) {
                sceneResolve(item)
              }
            })

            scenePromise.then(itemId => {
              iRender.drawToTexture(itemIndex, itemId, 'dupvideoitem').then(res => {
                resolve(res);
              })
            })
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/item is correct.'));
        }
      })
    }

    /**
     * params: (canvas: HTMLCanvasElement, source: any, fps?: number)
     * `return: canvasIndex`
     *
     * Renders the specified source into the provided canvas element.
     * source parameter can be Source instance, or source id.
     *
     */
    static renderVideoSource(canvas: HTMLCanvasElement, source: any, fps: number = 30) {
      return new Promise((resolve, reject) => {
        let index;
        if ((source instanceof Source ||  typeof source === 'string') && canvas) {
          iRender.initializeCanvas(canvas, fps).then(indx => {
            index = indx;
            let scenePromise = new Promise(sceneResolve => {
              if (source instanceof Source) {
                source.getItemList().then(items => {
                  return items[0].getId();
                }).then(id => {
                  sceneResolve(id);
                })
              } else if (typeof source === 'string' && (/^{[A-F0-9\-]*}$/i.test(source))) {
                Scene.searchSourcesById(source).then(src => {
                  src[0].getItemList().then(items => {
                    return items[0].getId();
                  }).then(id => {
                    sceneResolve(id);
                  })
                })
              }
            })

            scenePromise.then(itemId => {
              iRender.drawToTexture(index, itemId, 'dupvideosource').then(res => {
                resolve(res);
              })
            })
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/source is correct.'));
        }
      })
    }

    /**
     * params: (canvas: HTMLCanvasElement, view: 0|1, fps?: number)
     * `return: canvasIndex`
     *
     * Renders the specified view into the provided canvas element.
     * view parameter can be 0 (Main view) or 1 (Preview).
     *
     */
    static renderWorkspace(canvas: HTMLCanvasElement, view: number = 0, fps: number = 30) {
      return new Promise((resolve, reject) => {
        if (typeof view === 'number' && canvas) {
          iRender.initializeCanvas(canvas, fps).then(indx => {
            iRender.drawToTexture(indx, view, 'dupworkspace').then(res => {
              resolve(res);
            })
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/view is correct.'));
        }
      })
    }
}
