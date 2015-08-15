/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
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

  private static initializeScenePool() {
    if (Scene.scenePool.length === 0) {
      for (var i = 0; i < Scene.maxScenes; i++) {
        Scene.scenePool[i] = new Scene(i + 1);
      }
    }
  }


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
   * var scene1 = Scene.getById(1);
   * ```
   */
  static getById(sceneNum: number): Scene {
    // initialize if necessary
    Scene.initializeScenePool();

    return Scene.scenePool[sceneNum - 1];
  }

  /**
   * Asynchronous functon to get a list of scene objects with a specific name.
   *
   * #Return
   *
   * ```
   * Promise<Scene[]>
   * ```
   *
   * #Usage
   *
   * ```
   * var scenes = Scene.getByName('Game').then(function(scenes) {
   *    // manipulate scenes
   * });
   * ```
   */
  static getByName(sceneName: string): Promise<Scene[]> {
    // initialize if necessary
    Scene.initializeScenePool();

    let namePromise = Promise.all(Scene.scenePool.map((scene, index) => {
      return iApp.get('presetname:' + index).then(name => {
        if (sceneName === name) {
          return Scene.scenePool[index];
        } else {
          return null;
        }
      });
    }));

    return new Promise(resolve => {
      namePromise.then(results => {
        let returnArray = [];
        for (var j = 0; j < results.length; ++j) {
          if (results[j] !== null) {
            returnArray.push(results[j]);
          }
        };
        resolve(returnArray);
      });
    });
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
      if (Environment.isSourceHtml()) {
        iApp.get('presetconfig:-1').then(sceneString => {
          let curScene = JXON.parse(sceneString);
          Scene.getByName(curScene['name']).then(scene => {
            resolve(scene);
          });
        });
      } else {
        iApp.get('preset:0').then(id => {
          resolve(Scene.getById(Number(id) + 1));
        });
      }
    });
  }

  static searchAllForItemId(id: string): Promise<Item> {
    let isID: boolean = /^{[A-F0-9-]*}$/i.test(id);
    if (!isID) {
      throw new Error('Not a valid ID format for items');
    } else {
      Scene.initializeScenePool();

      return new Promise(resolve => {

        let match = null;
        let found = false;
        Scene.scenePool.forEach((scene, idx, arr) => {
          if (match === null) {
            scene.getItems().then(items => {
              found = items.some(item => { // unique ID, so get first result
                if (item['id'] === id) {
                  match = item;
                  return true;
                } else {
                  return false;
                }
              });
              if (found ||
                idx === arr.length - 1) { // last scene, no match
                resolve(match);
              }
            });
          }
        });
      });
    }
  };

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
      Scene.initializeScenePool();
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
        Scene.initializeScenePool();

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

  static searchAllForItemName(param: string): Promise<Item[]> {
    Scene.initializeScenePool();
    let matches: Item[] = [];

    return new Promise(resolve => {
      return Promise.all(Scene.scenePool.map(scene => {
        return new Promise(resolveScene => {
          scene.getItems().then(items => {
            if (items.length === 0) {
              resolveScene();
            } else {
              return Promise.all(items.map(item => {
                return new Promise(resolveItem => {
                  item.getName().then(name => {
                    if (name.match(param)) {
                      matches.push(item);
                      return '';
                    } else {
                      return item.getValue();
                    }
                  }).then(value => {
                    if (value.toString().match(param)) {
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
  };

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
}
