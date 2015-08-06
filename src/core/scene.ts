/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Environment} from '../internal/environment';

export class Scene {
  private id: number;

  private static maxScenes = 12;
  private static scenePool: Scene[] = [];

  constructor(sceneNum: number) {
    this.id = sceneNum - 1;
  };

  static get(sceneNum: number): Scene {
    if (Scene.scenePool === []) {
      for (var i = 0; i < Scene.maxScenes; i++) {
        Scene.scenePool[i] = new Scene(i + 1);
      }
    }

    return Scene.scenePool[sceneNum - 1];
  }

  static getActiveScene(): Promise<Scene> {
    return new Promise(resolve => {
      iApp.get('preset:0').then(id => {
        resolve(Scene.get(Number(id) + 1));
      });
    });
  }

  getSceneNumber(): Promise<number> {
    return new Promise(resolve => {
      resolve(this.id + 1);
    });
  }

  getName(): Promise<string> {
    return new Promise(resolve => {
      iApp.get('presetname:' + this.id).then(val => {
        resolve(val);
      });
    });
  }

  setName(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourceHtml()) {
        reject(new Error('Scene names are readonly for source plugins.'));
      } else {
        iApp.set('presetname:' + this.id, name).then(value => {
          resolve(value);
        });
      }
    });
  }
}
