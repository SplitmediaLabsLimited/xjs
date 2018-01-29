/// <reference path="../../defs/es6-promise.d.ts" />

import {Scene} from './scene';
import {App as iApp} from '../internal/app';
import {Render as iRender} from '../internal/render';
import { exec } from '../internal/internal';

export class Render {


  // Assign a canvas and create necessary webgl context
  static setTargetCanvas(canvas: HTMLCanvasElement,
    fps: number = 30): Promise<any> {
      return new Promise((resolve, reject) => {
        if (canvas) {
          iRender.setCanvas(canvas, fps).then(res => {
            resolve(res)
          })
        } else {
          reject(Error('No canvas selected'))
        }
      })
    }

    // Uses prepared canvas to dupworkspace
    // reject if no canvas was set
    // static renderSceneToTexture(scene: number) {
    //   return new Promise((resolve, reject) => {
    //     Render.drawToTexture(scene)
    //     resolve()
    //   })
    // }

    // If there's an active render, set rendering to true or false
    static toggleRender(state?: boolean) {
      return new Promise(resolve => {
        iRender.startStopRender(state).then(res => {
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

    // use dupscene
    static renderScene(canvasIndex, sceneId) {
      return new Promise(resolve => {
        iRender.drawToTexture(canvasIndex, sceneId).then(res => {
          resolve()
        })
      })
    }

    // use dupvideoitem
    static renderVideoItem(canvasIndex, sceneId) {
      return new Promise(resolve => {
        iRender.drawToTexture(canvasIndex, sceneId).then(res => {
          resolve()
        })
      })
    }

    // use dupsource
    static renderSource(canvasIndex, sceneId) {
      return new Promise(resolve => {
        iRender.drawToTexture(canvasIndex, sceneId).then(res => {
          resolve()
        })
      })
    }

    // use dupworkspace
    static renderWorkspace(canvasIndex, sceneId) {
      return new Promise(resolve => {
        iRender.drawToTexture(canvasIndex, sceneId).then(res => {
          resolve()
        })
      })
    }
}
