/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {Environment} from './environment';
import {Item} from './item/item';

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
   * Searches all scenes for an item by ID or name substring. ID search
   * will return only 1 result.
   *
   * #Return
   * ```
   * Item[]
   * ```
   *
   * #Usage
   *
   * ```
   * Scene.searchAllForItem('camera').then(function(items) {
   *   // do something to each item in items array
   * });
   * ```
   *
   */
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

  /**
   * Gets all the items in a specific scene.
   *
   * #Return
   *
   * ```
   * Item[]
   * ```
   * #Usage
   *
   * ```
   * myScene.getItems().then(function(items) {
   *  // do something to each item in items array
   * });
   * ```
   */
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

 /**
 * Checks if a scene is empty.
 *
 * #Usage
 *
 * ```
 * myScene.isEmpty().then(function(empty) {
 *   if (empty === true) {
 *     console.log("My scene is empty.");
 *   }
 * });
 * ```
 */
  isEmpty(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.get('presetisempty:' + this.id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * Adds an item to a scene. Currently, this is only limited to adding items
   * to the current scene.
   *
   * Promise should resolve if item was successfully added.
   *
   */
  addItem(item: Item): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Scene.getActiveScene().then(active => {
        if (this === active) {
          item.addToScene(this).then(() => {
            resolve();
          }).catch(error => {
            reject(error);
          });
        } else {
          reject(Error('At the moment, items may only be added to the current ' +
            'scene. This limitation will be addressed in the future.'));
        }
      });
    });

  }
}
