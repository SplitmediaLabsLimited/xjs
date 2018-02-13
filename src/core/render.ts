/// <reference path="../../defs/es6-promise.d.ts" />

import {Scene} from './scene';
import {Item} from './items/item';
import {Source} from './source/source';
import {App as iApp} from '../internal/app';
import {Render as iRender} from '../internal/render';
import { exec } from '../internal/internal';

export class Render {
  private static _canvasCounter: number = 0;
  private _index: number;
  private _fps: number;
  private _canvas: HTMLCanvasElement;
  private _rendering: boolean;
  private static _canvasPool: Render[] = [];

  constructor(props?) {
    this._index = props.canvasIndex;
    this._fps = props.fps;
    this._canvas = props.canvas;
    this._rendering = props.rendering;
  }

  static getPreparedCanvases() {
    return new Promise(resolve => {
      resolve(Render._canvasPool)
    })
  }

  /**
   * param: (canvas: HTMLCanvasElement, fps?: number)
   *
   * Prepare a canvas for rendering.
   *
   */
  static prepareCanvas(canvas: HTMLCanvasElement, fps: number = 30, includeToPool: boolean = true) {
    return new Promise((resolve, reject) => {
      const canvasProps = {
        'canvas': canvas,
        'fps': fps,
        'canvasIndex': Render._canvasCounter,
        'rendering': false
      };
      if (includeToPool) {
        Render._canvasPool.push(new Render(canvasProps))
      }
      iRender.initializeCanvas(canvas, Render._canvasCounter, fps).then(() => {
        resolve(true);
      })
      Render._canvasCounter = Render._canvasCounter + 1;
    })
  }

  /**
   * param: (canvas: HTMLCanvasElement)
   *
   * Array list of Render object of prepared canvases and their fps.
   *
   */

  static cleanCanvas(canvas: HTMLCanvasElement) {
    return new Promise(resolve => {
      const match  = Render._canvasPool.filter(renObj => renObj['_canvas'] === canvas)
      Render._canvasPool = Render._canvasPool.filter(renObj => renObj['_canvas'] !== canvas)
      if (match.length === 1) {
        iRender.stopCanvasToUseView(match[0]['_index']).then(res => {
          Render.prepareCanvas(canvas, 30, false)
          resolve(true);
        })
      }
    })
  }

  /**
   * param: (canvas: HTMLCanvasElement, state?: boolean)
   *
   * If there's an active render, set rendering to true or false.
   */
  static toggleRender(canvas: HTMLCanvasElement, state: boolean) {
    return new Promise(resolve => {
      const match  = Render._canvasPool.filter(renObj => renObj['_canvas'] === canvas)
      if (match.length === 1) {
        match[0]._rendering = state;
        iRender.startStopRender(match[0]['_index'], state).then(res => {
          resolve(res)
        })
      }
    })
  }

    /**
     * params: (canvas: HTMLCanvasElement, scene: any)
     *
     * scene parameter can be Scene instance, scene index, or scene uid.
     *
     */
    static renderScene(canvas: HTMLCanvasElement, scene: any) {
      return new Promise((resolve, reject) => {
        if ((scene instanceof Scene || typeof scene === 'number' || typeof scene === 'string')) {
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
            const match  = Render._canvasPool.filter(renObj => renObj['_canvas'] === canvas)
            if (match.length === 1) {
              match[0]._rendering = true;
              iRender.drawToTexture(match[0]['_index'], finalScene, 'dupscene').then(res => {
                resolve(true);
              })
            }
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/scene is correct.'));
        }
      })
    }

    /**
     * params: (canvas: HTMLCanvasElement, item: any)
     *
     * item parameter can be Item instance, or item id.
     *
     */
    static renderVideoItem(canvas: HTMLCanvasElement, item: any) {
      return new Promise((resolve, reject) => {
        let itemIndex;
        if ((item instanceof Item ||  typeof item === 'string')) {
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
            const match  = Render._canvasPool.filter(renObj => renObj['_canvas'] === canvas)
            if (match.length === 1) {
              match[0]._rendering = true;
              iRender.drawToTexture(match[0]['_index'], itemId, 'dupvideoitem').then(res => {
                resolve(true);
              })
            }
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/item is correct.'));
        }
      })
    }

    /**
     * params: (canvas: HTMLCanvasElement, source: any)
     *
     * source parameter can be Source instance, or source id.
     *
     */
    static renderVideoSource(canvas: HTMLCanvasElement, source: any) {
      return new Promise((resolve, reject) => {
        let index;
        if ((source instanceof Source ||  typeof source === 'string')) {
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
            const match  = Render._canvasPool.filter(renObj => renObj['_canvas'] === canvas)
            if (match.length === 1) {
              match[0]._rendering = true;
              iRender.drawToTexture(match[0]['_index'], itemId, 'dupvideosource').then(res => {
                resolve(true);
              })
            }
          })
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/source is correct.'));
        }
      })
    }

    /**
     * params: (view: 0|1)
     *
     * view parameter can be 0 (Main view) or 1 (Preview).
     *
     */
    static renderWorkspace(canvas: HTMLCanvasElement, view: number = 0) {
      return new Promise((resolve, reject) => {
        if (typeof view === 'number') {
          const match  = Render._canvasPool.filter(renObj => renObj['_canvas'] === canvas)
          if (match.length === 1) {
            match[0]._rendering = true;
            iRender.drawToTexture(match[0]['_index'], view, 'dupworkspace').then(res => {
              resolve(true);
            })
          }
        } else {
          reject(Error('Invalid parameters provided. Please check if the canvas/view is correct.'));
        }
      })
    }
}
