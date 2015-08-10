/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Environment} from './environment';

export class Scene {
  private id: number;

  private static maxScenes = 12;
  private static scenePool: Scene[] = [];

  constructor(sceneNum: number) {
    this.id = sceneNum - 1;
  };


  /**
   * Get a specific scene object given the scene number.
   *
   * #Return
   *
   * ```
   * Scene
   * ```
   *
   * #Usage
   *
   * ```
   * var scene1 = Scene.get(1);
   * ```
   */
  static get(sceneNum: number): Scene {
    if (Scene.scenePool.length === 0) {
      for (var i = 0; i < Scene.maxScenes; i++) {
        Scene.scenePool[i] = new Scene(i + 1);
      }
    }

    return Scene.scenePool[sceneNum - 1];
  }

  /**
   * Get the currently active scene.
   *
   * #Return
   *
   * ```
   * Scene
   * ```
   *
   * #Usage
   *
   * ```
   * var myScene = Scene.getActiveScene();
   * ```
   */
  static getActiveScene(): Promise<Scene> {
    return new Promise(resolve => {
      iApp.get('preset:0').then(id => {
        resolve(Scene.get(Number(id) + 1));
      });
    });
  }

  /**
   * Get the 1-indexed scene number of this scene object.
   *
   * #Return
   *
   * ```
   * number
   * ```
   *
   * #Usage
   *
   * ```
   * myScene.getSceneNumber().then(function(num) {
   *  console.log('My scene is scene number ' + num);
   * });
   * ```
   */
  getSceneNumber(): Promise<number> {
    return new Promise(resolve => {
      resolve(this.id + 1);
    });
  }

  /**
   * Get the name of this scene object.
   *
   * #Return
   *
   * ```
   * number
   * ```
   *
   * #Usage
   *
   * ```
   * myScene.getSceneName().then(function(name) {
   *  console.log('My scene is named ' + name);
   * });
   * ```
   */
  getName(): Promise<string> {
    return new Promise(resolve => {
      iApp.get('presetname:' + this.id).then(val => {
        resolve(val);
      });
    });
  }

  /**
   * Set the name of this scene object. Cannot be set by source plugins.
   *
   * #Usage
   *
   * ```
   * myScene.setName('Gameplay');
   * ```
   */
  setName(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourceHtml()) {
        reject(Error('Scene names are readonly for source plugins.'));
      } else {
        iApp.set('presetname:' + this.id, name).then(value => {
          resolve(value);
        });
      }
    });
  }
}
