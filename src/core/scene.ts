/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {App as iApp} from '../internal/app';
import {exec} from '../internal/internal';
import {Environment} from './environment';
import {Item, ItemTypes} from './item/item';
import {GameItem} from './item/game';
import {CameraItem} from './item/camera';
import {AudioItem} from './item/audio';
import {HTMLItem} from './item/html';

export class Scene {
  private _id: number;

  private static _maxScenes = 12;
  private static _scenePool: Scene[] = [];

  constructor(sceneNum: number) {
    this._id = sceneNum - 1;
  };

  private static _initializeScenePool() {
    if (Scene._scenePool.length === 0) {
      for (var i = 0; i < Scene._maxScenes; i++) {
        Scene._scenePool[i] = new Scene(i + 1);
      }
    }
  }


  /**
   * return: Scene
   *
   * Get a specific scene object given the scene number.
   *
   *
   * #### Usage
   *
   * ```javascript
   * var scene1 = Scene.getById(1);
   * ```
   */
  static getById(sceneNum: number): Scene {
    // initialize if necessary
    Scene._initializeScenePool();

    return Scene._scenePool[sceneNum - 1];
  }

  /**
   * return: Promise<Scene[]>
   *
   * Asynchronous functon to get a list of scene objects with a specific name.
   *
   *
   * #### Usage
   *
   * ```javascript
   * var scenes = Scene.getByName('Game').then(function(scenes) {
   *    // manipulate scenes
   * });
   * ```
   */
  static getByName(sceneName: string): Promise<Scene[]> {
    // initialize if necessary
    Scene._initializeScenePool();

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
   * return: Promise<Scene>
   *
   * Get the currently active scene.
   *
   *
   * #### Usage
   *
   * ```javascript
   * var myScene = Scene.getActiveScene();
   * ```
   */
  static getActiveScene(): Promise<Scene> {
    return new Promise(resolve => {
      if (Environment.isSourcePlugin()) {
        iApp.get('presetconfig:-1').then(sceneString => {
          let curScene = JXON.parse(sceneString);
          if (curScene.children.length > 0) {
            resolve(Scene.searchSceneWithItemId(curScene.children[0]['id']));
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
   * param: scene<number|Scene>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Change active scene. Does not work on source plugins.
   */
  static setActiveScene(scene: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Not supported on source plugins'));
      } else {
        if (scene instanceof Scene) {
          scene.getID().then(id => {
            iApp.set('preset', String(id)).then(res => {
              resolve(res);
            });
          });
        } else if (typeof scene === 'number') {
          if (scene < 1 || scene > 12) {
            reject(Error('Invalid parameters. Valid range is 1 to 12.'));
          } else {
            iApp.set('preset', String(scene - 1)).then(res => {
              resolve(res);
            });
          }
        } else {
          reject(Error('Invalid parameters'));
        }
      }
    });
  }

  /**
   * return: Promise<Item>
   *
   * Searches all scenes for an item by ID. ID search will return exactly 1 result (IDs are unique) or null.
   *
   * See also: {@link #core/Item Core/Item}
   *
   * #### Usage
   *
   * ```javascript
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
      Scene._initializeScenePool();

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

  /**
   * return: Promise<Scene>
   *
   * Searches all scenes for one that contains the given item ID.
   *
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchSceneWithItemId('{10F04AE-6215-3A88-7899-950B12186359}').then(function(scene) {
   *   // scene contains the item
   * });
   * ```
   *
   */
  static searchSceneWithItemId(id: string): Promise<Scene> {
    let isID: boolean = /^{[A-F0-9-]*}$/i.test(id);
    if (!isID) {
      throw new Error('Not a valid ID format for items');
    } else {
      Scene._initializeScenePool();

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
   * return: Promise<Item[]>
   *
   * Searches all scenes for an item by name substring. This function compares
   * against custom name first (recommended) before falling back to the name
   * property of the source.
   *
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchAllForItemName('camera').then(function(items) {
   *   // do something to each item in items array
   * });
   * ```
   *
   */
  static searchAllForItemName(param: string): Promise<Item[]> {
    Scene._initializeScenePool();
    let matches: Item[] = [];

    return new Promise(resolve => {
      return Promise.all(Scene._scenePool.map(scene => {
        return new Promise(resolveScene => {
          scene.getItems().then(items => {
            if (items.length === 0) {
              resolveScene();
            } else {
              return Promise.all(items.map(item => {
                return new Promise((resolveItem, rejectItem) => {
                  item.getCustomName().then(name => {
                    if (name.match(param)) {
                      matches.push(item);
                      return '';
                    } else {
                      return item.getName();
                    }
                  }).then(name => {
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

   * Load scenes that are not yet initialized in XSplit Broadcaster.
   *
   * Note: For memory saving purposes, this is not called automatically.
   * If your extension wants to manipulate multiple scenes, it is imperative that you call this function.
   * This function is only available to extensions.
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
   * return: number
   *
   * Get the 1-indexed scene number of this scene object.
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSceneNumber().then(function(num) {
   *  console.log('My scene is scene number ' + num);
   * });
   * ```
   */
  getSceneNumber(): Promise<number> {
    return new Promise(resolve => {
      resolve(this._id + 1);
    });
  }

  /**
   * return: number
   *
   * Get the name of this scene object.
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSceneName().then(function(name) {
   *  console.log('My scene is named ' + name);
   * });
   * ```
   */
  getName(): Promise<string> {
    return new Promise(resolve => {
      iApp.get('presetname:' + this._id).then(val => {
        resolve(val);
      });
    });
  }

  /**
   *
   * Set the name of this scene object. Cannot be set by source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.setName('Gameplay');
   * ```
   */
  setName(name: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Scene names are readonly for source plugins.'));
      } else {
        iApp.set('presetname:' + this._id, name).then(value => {
          resolve(value);
        });
      }
    });
  }

  /**
   * return: Promise<Item[]>
   *
   * Gets all the items (sources) in a specific scene.
   * See also: {@link #core/Item Core/Item}
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getItems().then(function(items) {
   *  // do something to each item in items array
   * });
   * ```
   */
  getItems(): Promise<Item[]> {
    return new Promise(resolve => {
    iApp.getAsList('presetconfig:' + this._id).then(jsonArr => {
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
              jsonArr[i]['sceneID'] = this._id;
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
  * #### Usage
  *
  * ```javascript
  * myScene.isEmpty().then(function(empty) {
  *   if (empty === true) {
  *     console.log('My scene is empty.');
  *   }
  * });
  * ```
  */
  isEmpty(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.get('presetisempty:' + this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  /**
   * param: Array<Item> | Array<string> (item IDs)
   * ```
   * return: Promise<Scene>
   * ```
   *
   * Sets the item order of the current scene. The first item in the array will
   * be on top (will cover items below it).
   */
  setItemOrder(items: Array<any>): Promise<Scene> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('not available for source plugins'));
      } else {
        items.reverse();
        let ids = [];
        Scene.getActiveScene().then(scene => {
          if (items.every(el => { return el instanceof Item })) {
            return new Promise(resolve => {
              let promises = [];
              for (let i in items) {
                promises.push((_i => {
                  return new Promise(resolve => {
                    items[_i].getID().then(id => {
                      ids[_i] = id;
                      resolve(this);
                    });
                  });
                })(i));
              }

              Promise.all(promises).then(() => {
                  return scene.getSceneNumber();
                }).then(id => {
                  resolve(id);
                });
            });
          } else {
            ids = items;
            return scene.getSceneNumber();
          }
        }).then(id => {
          if ((Number(id) - 1) === this._id && Environment.isSourceConfig()) {
            exec('SourcesListOrderSave', ids.join(','));
            resolve(this);
          } else {
            let sceneName: string;
            this.getName().then(name => {
              sceneName = name;
              return iApp.getAsList('presetconfig:' + this._id);
            }).then(jsonArr => {
              let newOrder = new JXON();
              newOrder.children = [];
              newOrder['tag'] = 'placement';
              newOrder['name'] = sceneName;
              if (Array.isArray(jsonArr)) {
                let attrs = ['name', 'cname', 'item'];
                for (let i = 0; i < jsonArr.length; i++) {
                  for (let a = 0; a < attrs.length; a++) {
                    jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]]
                      .replace(/([^\\])(\\)([^\\])/g, '$1\\\\$3');
                    jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]]
                      .replace(/"/g, '&quot;');
                  }
                  newOrder.children[ids.indexOf(jsonArr[i]['id'])] = jsonArr[i];
                }

                iApp.set(
                  'presetconfig:' + this._id,
                  XML.parseJSON(newOrder).toString()
                ).then(() => {
                    resolve(this);
                });
              } else {
                reject(Error('Scene does not have any items'));
              }
            });
          }
        });
      }
    });
  }
}
