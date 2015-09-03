/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {App as iApp} from '../internal/app';
import {Environment} from './environment';
import {Item, ItemTypes} from './item/item';
import {GameItem} from './item/game';
import {CameraItem} from './item/camera';
import {AudioItem} from './item/audio';
import {HTMLItem} from './item/html';

export class Scene {
  private id: number;

  private static _maxScenes = 12;
  private static _scenePool: Scene[] = [];

  constructor(sceneNum: number) {
    this.id = sceneNum - 1;
  };

  private static initializeScenePool() {
    if (Scene._scenePool.length === 0) {
      for (var i = 0; i < Scene._maxScenes; i++) {
        Scene._scenePool[i] = new Scene(i + 1);
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

    return Scene._scenePool[sceneNum - 1];
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

    let namePromise = Promise.all(Scene._scenePool.map((scene, index) => {
      return iApp.get('presetname:' + index).then(name => {
        if (sceneName === name) {
          return Scene._scenePool[index];
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
      if (Environment.isSourcePlugin()) {
        iApp.get('presetconfig:-1').then(sceneString => {
          let curScene = JXON.parse(sceneString);
          if (curScene.children.length > 0) {
            resolve(Scene.searchSceneByItemId(curScene.children[0]['id']));
          } else {
            throw new Error('presetconfig cannot fetch current scene');
          }
        });
      } else {
        iApp.get('preset:0').then(id => {
          resolve(Scene.getById(Number(id) + 1));
        });
      }
    });
  }

  /**
   * Searches all scenes for an item by ID. ID search
   * will return only a maximum of 1 result (IDs are unique).
   *
   * #Return
   * ```
   * Item
   * ```
   *
   * #Usage
   *
   * ```
   * Scene.searchAllForItemId('{10F04AE-6215-3A88-7899-950B12186359}').then(function(item) {
   *   // item is either an Item or null
   * });
   * ```
   *
   */
  static searchAllForItemId(id: string): Promise<Item> {
    let isID: boolean = /^{[A-F0-9-]*}$/i.test(id);
    if (!isID) {
      throw new Error('Not a valid ID format for items');
    } else {
      Scene.initializeScenePool();

      return new Promise(resolve => {

        let match = null;
        let found = false;
        Scene._scenePool.forEach((scene, idx, arr) => {
          if (match === null) {
            scene.getItems().then((function(items) {
              found = items.some(item => { // unique ID, so get first result
                if (item['_id'] === id) {
                  match = item;
                  return true;
                } else {
                  return false;
                }
              });
              if (found ||
                Number(this) === arr.length - 1) { // last scene, no match
                resolve(match);
              }
            }).bind(idx));
          }
        });
      });
    }
  };

  static searchSceneByItemId(id: string): Promise<Scene> {
    let isID: boolean = /^{[A-F0-9-]*}$/i.test(id);
    if (!isID) {
      throw new Error('Not a valid ID format for items');
    } else {
      Scene.initializeScenePool();

      return new Promise(resolve => {

        let match = null;
        let found = false;
        Scene._scenePool.forEach((scene, idx, arr) => {
          if (match === null) {
            scene.getItems().then(items => {
              found = items.some(item => { // unique ID, so get first result
                if (item['_id'] === id) {
                  match = Scene.getById(idx + 1);
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
   * Searches all scenes for an item by name substring.
   *
   * #Return
   * ```
   * Item[]
   * ```
   *
   * #Usage
   *
   * ```
   * Scene.searchAllForItemName('camera').then(function(items) {
   *   // do something to each item in items array
   * });
   * ```
   *
   */
  static searchAllForItemName(param: string): Promise<Item[]> {
    Scene.initializeScenePool();
    let matches: Item[] = [];

    return new Promise(resolve => {
      return Promise.all(Scene._scenePool.map(scene => {
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
   * return: Promise<boolean>
   *
   * Load scenes that isn't yet initialized in XSplit Broadcaster
   *
   * #### Usage
   *
   * ```javascript
   * Scene.initializeScenes().then(function(val) {
   *   if (val === true) {
   *     // Now you know that all scenes are loaded :)
   *   }
   * })
   * ```
   */
  static initializeScenes(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('function is not available for source'));
      }

      iApp.get('presetcount').then(cnt => {
        if (Number(cnt) !== 12) {
          // Insert an empty scene for scene #12
          iApp
            .set('presetconfig:11', '<placement name="Scene 12" defpos="0" />')
            .then(res => {
              resolve(res);
            });
        } else {
          resolve(true);
        }
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
      if (Environment.isSourcePlugin()) {
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
      var promiseArray: Promise<Item>[] = [];

      // type checking to return correct Item subtype
      let typePromise = index => new Promise(typeResolve => {
        let item = jsonArr[index];
        let type = Number(item['type']);
        if (type === ItemTypes.GAMESOURCE) {
          typeResolve(new GameItem(item));
          } else if (type === ItemTypes.HTML) {
            typeResolve(new HTMLItem(item));
        } else if (Number(jsonArr[index]['type']) === ItemTypes.LIVE &&
          jsonArr[index]['item'].indexOf(
            '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
            typeResolve(new CameraItem(jsonArr[index]));
        } else if (Number(jsonArr[index]['type']) === ItemTypes.LIVE &&
          jsonArr[index]['item'].indexOf(
            '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
            typeResolve(new AudioItem(jsonArr[index]));
        } else {
            typeResolve(new Item(jsonArr[index]));
          }
        });


          if (Array.isArray(jsonArr)) {
            for (var i = 0; i < jsonArr.length; i++) {
              jsonArr[i]['sceneID'] = this.id;
              promiseArray.push(typePromise(i));
            }
          }

          Promise.all(promiseArray).then(results => {
            resolve(results);
          });
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
