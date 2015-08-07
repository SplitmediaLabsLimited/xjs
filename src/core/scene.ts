/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Environment} from '../internal/environment';
import {Item} from './item/item';

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

  /** Searches all scenes for */
  static searchAllForItem(key: string): Promise<Item[]> {
    // detect if UUID or keyword
    let isID: boolean = /^{[A-F0-9-]*}$/i.test(key);
    let matches: Item[] = [];

    if (isID) {
    // search by ID (only one match should be found)
    let found = false;
    return new Promise(resolve => {
      if (Scene.scenePool.length === 0) {
        Scene.get(1); // initialize scene items first
      }
      Scene.scenePool.forEach((scene, idx, arr) => {
        if (!found) {
          scene.getItems().then(items => {
            found = items.some(item => { // unique ID
              if (item['id'] === key) {
                matches.push(item);
                return true;
              } else {
                return false;
              }
            });
            if (found || idx === arr.length - 1) {
              resolve(matches);
            }
          });
        }
      });
    });
    } else {
    // search by name substring
      return new Promise(resolve => {
        if (Scene.scenePool.length === 0) {
          Scene.get(1); // initialize scene items first
        }

        return Promise.all(Scene.scenePool.map(scene => {
          return new Promise(resolveScene => {
            scene.getItems().then(items => {
              if (items.length === 0) {
                resolveScene();
              } else {
                return Promise.all(items.map(item => {
                  return new Promise(resolveItem => {
                    item.getName().then(name => {
                      if (name.match(key)) {
                        matches.push(item);
                        return '';
                      } else {
                        return item.getValue();
                      }
                    }).then(value => {
                      if (value.toString().match(key)) {
                        matches.push(item);
                      }
                      resolveItem();
                    });
                  });
                })).then(() => {
                  resolveScene();
                });
              }
            });
          });
        })).then(() => {
          resolve(matches);
        });
      });
    }
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

  getItems(): Promise<Item[]> {
    return new Promise(resolve => {
      iApp.getAsList('presetconfig:' + this.id).then(jsonArr => {
        var retArray = [];
        if (Array.isArray(jsonArr)) {
          for (var i = 0; i < jsonArr.length; i++) {
            jsonArr[i]['sceneID'] = this.id;
            var item = new Item(jsonArr[i]);
            retArray.push(item);
          }
        }
        resolve(retArray);
      });
    });
  }
}
