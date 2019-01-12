/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {App as iApp} from '../internal/app';
import {exec} from '../internal/internal';
import {Environment} from './environment';
import {Source} from './source/source';
import {ItemTypes} from './source/isource';
import {GameSource} from './source/game';
import {CameraSource} from './source/camera';
import {AudioSource} from './source/audio';
import {VideoPlaylistSource} from './source/videoplaylist'
import {HtmlSource} from './source/html';
import {FlashSource} from './source/flash';
import {ScreenSource} from './source/screen';
import {ImageSource} from './source/image';
import {MediaSource, MediaTypes} from './source/media';

import {Item, ViewTypes} from './items/item';
import {GameItem} from './items/game';
import {CameraItem} from './items/camera';
import {AudioItem} from './items/audio';
import {VideoPlaylistItem} from './items/videoplaylist'
import {HtmlItem} from './items/html';
import {FlashItem} from './items/flash';
import {ScreenItem} from './items/screen';
import {ImageItem} from './items/image';
import {MediaItem} from './items/media';
import {GenericItem} from './items/genericitem';

import {
  minVersion,
  versionCompare,
  getVersion,
  sceneUidMinVersion
} from '../internal/util/version';


export class Scene {
  private _id: number | string;
  private _uid: string;
  private _name: string;


  private static _maxScenes: number = 12;
  private static _scenePool: Scene[] = [];

  constructor(sceneId: number | string, name?: string, uid?: string) {
    this._id = sceneId;
    if (!versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
      this._uid = uid;
      this._name = name;
    }
  };

  private static _initializeScenePoolAsync(): Promise<number> {
    return new Promise(resolve => {
      Scene._scenePool = [];
      iApp.getAsList('sceneconfig')
      .then(jsonArr => {
        if (versionCompare(getVersion()).is.lessThan(minVersion)) {
          const count = jsonArr.length;
          (count > 12) ? Scene._maxScenes = count : Scene._maxScenes = 12;
          for (var i = 0; i < Scene._maxScenes; i++) {
            Scene._scenePool[i] = new Scene(i);
          }
          // Add special scene for preview editor (i12)
          Scene._scenePool.push(new Scene('i12'));
          resolve(Scene._maxScenes);
        } else {
          let count = 0
          jsonArr
          .filter(json => json['tag'] === 'placement')
          .map((scene, index) => {
            count++
            Scene._scenePool[index] = new Scene(index, scene['name'], scene['id'] );
          })
          // Add special scene for preview editor (i12)
          Scene._scenePool.push(new Scene('i12', 'i12', 'i12'));
          resolve(count);
        }
      })
    });
  }

  /**
   * return: Promise<number>
   *
   * Get the specific number of scenes loaded.
   * ```javascript
   * var sceneCount;
   * Scene.getSceneCount().then(function(count) {
   *   sceneCount = count;
   * });
   * ```
   */

  static getSceneCount(): Promise<number> {
    return new Promise(resolve => {
      Scene._initializeScenePoolAsync().then(count => {
        resolve(count)
      })
    })
  }

  /**
   * return: Promise<Scene>
   *
   * Get a specific scene object given the scene number.
   *
   * #### Usage
   *
   * ```javascript
   * var scene1;
   * Scene.getById(1).then(function(scene) {
   *   scene1 = scene;
   * });
   * ```
   * ** For deprecation, please use getBySceneIndex instead.
   */
  static getById(sceneNum: any): Promise<Scene> {
    return new Promise((resolve, reject) => {
      Scene._initializeScenePoolAsync().then(cnt => {
        if (sceneNum === 'i12') {
          if (Scene._scenePool[cnt]._id === 'i12') {
            resolve(Scene._scenePool[cnt]);
          } else {
            reject(Error('Invalid parameter. Valid range is 1 to total number of available scenes.'));
          }
        } else {
          try {
            if (sceneNum > cnt || typeof Scene._scenePool[sceneNum - 1] === 'undefined'){
              reject(Error('Invalid parameter. Valid range is 1 to total number of available scenes.'));
            } else {
              resolve(Scene._scenePool[sceneNum - 1]);
            }
          } catch(e) {
            reject(Error('Parameter must be a number'));
          }
        }
      });
    });
  }

  /**
   * return: Promise<Scene>
   *
   * Get a specific scene object given the scene index.
   *
   * #### Usage
   *
   * ```javascript
   * var scene1;
   * Scene.getBySceneIndex(0).then(function(scene) {
   *   scene1 = scene;
   * });
   * ```
   */
  static getBySceneIndex(sceneIndex: any): Promise<Scene> {
    return new Promise((resolve, reject) => {
      Scene._initializeScenePoolAsync().then(cnt => {
        if (sceneIndex === 'i12') {
          if (Scene._scenePool[cnt]._id === 'i12') {
            resolve(Scene._scenePool[cnt]);
          } else {
            reject(Error('Invalid parameter'));
          }
        } else {
          try {
            if (sceneIndex > cnt || typeof Scene._scenePool[sceneIndex] === 'undefined'){
              reject(Error('Invalid parameter'));
            } else {
              resolve(Scene._scenePool[sceneIndex]);
            }
          } catch(e) {
            reject(Error('Parameter must be a number'));
          }
        }
      });
    });
  }

  /**
   * return: Promise<Scene>
   *
   * Get a specific scene object given the scene unique Id.
   *
   * #### Usage
   *
   * ```javascript
   * var scene1;
   * Scene.getBySceneUid('{056936DD-DFAA-4148-9D08-21C8E83CE37C}')
   * .then(function(scene) {
   *   scene1 = scene;
   * });
   * ```
   */
  static getBySceneUid(sceneUid: string): Promise<Scene> {
    return new Promise((resolve, reject) => {
      let isID: boolean = /^{[A-F0-9-]*}$/i.test(sceneUid);
      if (!isID) {
        reject(Error('Not a valid Unique ID format for a Scene'))
      } else {
        this._initializeScenePoolAsync().then(() => {
          const sceneLength = this._scenePool.length;
          this._scenePool.map((scene, idx) => {
            scene.getSceneUid().then(uid => {
              if(uid === sceneUid){
                resolve(scene)
              }
              if (sceneLength - 1 === idx) {
                reject(Error('No matching Scene with the Unique ID provided.'))
              }
            })
          })
        })
      }
    })
  }

  /**
   * return: Promise<Scene[]>
   *
   * Asynchronous function to get a list of scene objects with a specific name.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.getByName('Game').then(function(scenes) {
   *   // manipulate scenes
   * });
   * ```
   */
  static getByName(sceneName: string): Promise<Scene[]> {
    return new Promise(resolve => {
      let sceneArr = [];
      this._initializeScenePoolAsync().then(count => {
        this._scenePool.map((scene, idx) => {
          scene.getName().then(name => {
            if(name === sceneName) {
              sceneArr.push(scene)
            }
            if ((idx + 1) === count) {
              resolve(sceneArr)
            }
          })
        })
      })
    });
  }

  /**
   * return: Promise<Scene>
   *
   * Get the currently active scene. Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * var myScene;
   * Scene.getActiveScene().then(function(scene) {
   *   myScene = scene;
   * });
   * ```
   */
  static getActiveScene(): Promise<Scene> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('Not supported on source plugins'));
      } else {
        iApp.getGlobalProperty('splitmode').then(res => {
          const preset = res === '1' ? 'scene:1' : 'scene:0'
          iApp.get(preset).then(id => {
            return Scene.getBySceneIndex(Number(id));
          }).then(scene => {
            resolve(scene);
          });
        })
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
        iApp.getGlobalProperty('splitmode').then(res => {
          const preset = res === '1' ? 'scene:1' : 'scene:0'
          if (scene instanceof Scene) {
              iApp.set(preset, String(scene._id)).then(res => {
                resolve(res);
              });
          } else if (typeof scene === 'number') {
            if (scene < 1 || !Number['isInteger'](Number(scene))) {
            reject(Error('Invalid parameters. Valid range is greater than 0.'));
            } else {
              iApp.set(preset, String(scene - 1)).then(res => {
                resolve(res);
              });
            }
          } else {
          reject(Error('Invalid parameters. Valid range is greater than 0 or a Scene object.'));
          }
        })
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
   * Scene.searchItemsById('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(item) {
   *   // result is either an Item or null
   * });
   * ```
   *
   */
  static searchItemsById(id: string): Promise<Item> {
    return new Promise((resolve, reject) => {
      let isID: boolean = /^{[A-F0-9\-]*}$/i.test(id);
      if (!isID) {
        reject(Error('Not a valid ID format for items'));
      } else {
        Scene._initializeScenePoolAsync().then(cnt => {
          let match = null;
          let found = false;
          let promiseArray = []

          let scenePromise = (scene, idx, arr) => new Promise(sceneResolve => {
            if (match === null) {
              scene.getItems().then(items => {
                found = items.some(item => {
                  if (item['_id'] === id.toUpperCase()) {
                    match = item;
                    return true
                  } else {
                    return false
                  }
                })
                if (found ||
                    Number(idx) === arr.length - 1) { // last scene, no match
                    sceneResolve(match);
                  } else {
                    sceneResolve(null);
                  }
              }).catch(err => {
                sceneResolve(null);
              })
            }
          })

          Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr))
          })

          Promise.all(promiseArray).then(results => {
            resolve(match)
          })
        });
      }
    });
  }

  /**
   * return: Promise<Scene>
   *
   * Searches all scenes for one that contains the given item ID.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchScenesByItemId('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(scene) {
   *   // scene contains the item
   * });
   * ```
   *
   */
  static searchScenesByItemId(id: string): Promise<Scene> {
    return new Promise((resolve, reject) => {
      let isID: boolean = /^{[A-F0-9-]*}$/i.test(id);
      if (!isID) {
        reject(Error('Not a valid ID format for items'));

      } else {
        Scene._initializeScenePoolAsync().then(cnt => {
          let match = null;
          let found = false;
          let promiseArray = []

          let scenePromise = (scene, idx, arr) => new Promise(sceneResolve => {
            if (match === null) {
              scene.getItems().then(items => {
                found = items.some(item => {
                  if (item['_id'] === id.toUpperCase()) {
                    match = scene;
                    return true
                  } else {
                    return false
                  }
                })
                if (found ||
                    Number(idx) === arr.length - 1) { // last scene, no match
                    sceneResolve(match);
                  } else {
                    sceneResolve(null);
                  }
              }).catch(err => {
                sceneResolve(null);
              })
            }
          })

          Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr))
          })

          Promise.all(promiseArray).then(results => {
            resolve(match)
          })

        });
      }
    });
  };

  /**
   * return: Promise<Items[]>
   *
   * Searches all items for an item by name substring. This function
   * compares against custom name first (recommended) before falling back to the
   * name property of the item.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchItemsByName('camera')
   * .then(function(items) {
   *   // do something to each item in items array
   * });
   * ```
   *
   * Note: With the XBC 2.9 change, linked items would have the same
   * Name and Custom Name. Changes made on an item would reflect on all
   * linked items.
   *
   */
  static searchItemsByName(param: string): Promise<Item[]> {
    return new Promise(resolve => {
      this.filterItems((item: Item, filterResolve: any) => {
        if (item['_cname'] === param) {
          filterResolve(true)
        } else if (item['_name'] === param) {
          filterResolve(true)
        } else if (item['_value'] === param) {
          filterResolve(true)
        } else {
          filterResolve(false)
        }
      }).then(items => {
        resolve(items);
      });
    });
  };

  /**
   * param: (func: function)
   * ```
   * return: Promise<Item[]>
   * ```
   *
   * Searches all scenes for items that satisfies the provided testing function.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterItems(function(item, resolve) {
   *   // We'll only fetch Flash Items by resolving 'true' if the item is an
   *   // instance of FlashItem
   *   resolve((item instanceof FlashItem));
   * }).then(function(items) {
   *   // items would either be an empty array if no Flash items was found,
   *   // or an array of FlashItem objects
   * });
   * ```
   */
  static filterItems(func: any): Promise<Item[]> {
    return new Promise((resolve, reject) => {
      Scene._initializeScenePoolAsync().then(cnt => {
        let matches: Item[] = [];

        if (typeof func === 'function') {
          return Promise.all(Scene._scenePool.map(scene => {
            return new Promise(resolveScene => {
              scene.getItems().then(items => {
                if (items.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(items.map(item => {
                    return new Promise(resolveItem => {
                      func(item, (checker: boolean) => {
                        if (checker) {
                          matches.push(item);
                        }
                        resolveItem();
                      });
                    });
                  })).then(() => {
                    resolveScene();
                  });
                }
              }).catch(() => {
                resolveScene();
              });
            });
          })).then(() => {
            resolve(matches);
          });
        } else {
          reject(Error('Parameter is not a function'));
        }
      });
    });
  }

  /**
   * param: (func: function)
   * ```
   * return: Promise<Scene[]>
   * ```
   *
   * Searches all scenes for items that satisfies the provided testing
   * function, and then return the scene that contains the item.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterScenesByItems(function(item, resolve) {
   *   // We'll only fetch the scenes with flash items by resolving 'true' if
   *   // the item is an instance of FlashItem
   *   resolve((item instanceof FlashItem));
   * }).then(function(scenes) {
   *   // scenes would be an array of all scenes with FlashItem
   * });
   * ```
   */
  static filterScenesByItems(func: any): Promise<Scene[]> {
    return new Promise((resolve, reject) => {
      Scene._initializeScenePoolAsync().then(cnt => {
        let matches: Scene[] = [];
        if (typeof func === 'function') {
          return Promise.all(Scene._scenePool.map(scene => {
            return new Promise(resolveScene => {
              scene.getItems().then(items => {
                if (items.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(items.map(item => {
                    return new Promise(resolveItem => {
                      func(item, (checker: boolean) => {
                        if (checker) {
                          matches.push(scene);
                        }
                        resolveItem();
                      });
                    });
                  })).then(() => {
                    resolveScene();
                  });
                }
              }).catch(() => resolveScene());
            });
          })).then(() => {
            resolve(matches);
          });
        } else {
          reject(Error('Parameter is not a function'));
        }
      });
    });
  }

  /**
   * return: Promise<Source>
   *
   * Searches all scenes for a source by ID. ID search will return exactly 1
   * result (IDs are unique) or null.
   *
   * See also: {@link #core/Source Core/Source}
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchSourcesById('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(sources) {
   *   // result would return one instance of the source per scene
   * });
   * ```
   *
   */
  static searchSourcesById(srcId: string): Promise<Source[]> {
    return new Promise((resolve, reject) => {
      let isID: boolean = /^{[A-F0-9\-]*}$/i.test(srcId);
      if (!isID) {
        reject(Error('Not a valid ID format for sources'));
      } else {
        Scene._initializeScenePoolAsync().then(cnt => {
          let match = null;
          let found = false;
          let promiseArray = []

          let scenePromise = (scene, idx, arr) => new Promise(sceneResolve => {
            if (match === null) {
              scene.getSources().then(sources => {
                found = sources.some(source => {
                  if (source['_srcId'] === srcId.toUpperCase()) {
                    match = source;
                    return true
                  } else {
                    return false
                  }
                })
                if (found ||
                    Number(idx) === arr.length - 1) { // last scene, no match
                    sceneResolve(match);
                  } else {
                    sceneResolve(null);
                  }
              }).catch(err => {
                sceneResolve(null);
              })
            }
          })
          Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr))
          })
          Promise.all(promiseArray).then(results => {
            let finalResults = []
            for (var i = 0; i < results.length; i++) {
              if(results[i] !== null) {
                finalResults.push(results[i])
              }
            }
            resolve(finalResults)
          })
        });
      }
    });
  };

  /**
   * return: Promise<Scene>
   *
   * Searches all scenes for one that contains the given source ID.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchScenesBySourceId('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(scenes) {
   *   // scenes that contains the source with matching source id
   * });
   * ```
   *
   */
  static searchScenesBySourceId(srcId: string): Promise<Scene[]> {
    return new Promise((resolve, reject) => {
      let isID: boolean = /^{[A-F0-9-]*}$/i.test(srcId);
      if (!isID) {
        reject(Error('Not a valid ID format for sources'));

      } else {
        Scene._initializeScenePoolAsync().then(cnt => {
          let match = null;
          let found = false;
          let promiseArray = []

          let scenePromise = (scene, idx, arr) => new Promise(sceneResolve => {
            if (match === null) {
              scene.getSources().then(sources => {
                found = sources.some(source => {
                  if (source['_srcId'] === srcId.toUpperCase()) {
                    match = scene;
                    return true
                  } else {
                    return false
                  }
                })
                if (found ||
                    Number(idx) === arr.length - 1) { // last scene, no match
                    sceneResolve(match);
                  } else {
                    sceneResolve(null);
                  }
              }).catch(err => {
                sceneResolve(null);
              })
            }
          })
          Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr))
          })
          Promise.all(promiseArray).then(results => {
            let finalResults = []
            for (var i = 0; i < results.length; i++) {
              if(results[i] !== null) {
                finalResults.push(results[i])
              }
            }
            resolve(finalResults)
          })

        });
      }
    });
  };

  /**
   * return: Promise<Source[]>
   *
   * Searches all scenes for a source by name substring. This function
   * compares against custom name first (recommended) before falling back to the
   * name property of the source.
   *
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchSourcesByName('camera').then(function(sources) {
   *   // do something to each source in sources array
   * });
   * ```
   *
   */
  static searchSourcesByName(param: string): Promise<Source[]> {
    return new Promise(resolve => {
      this.filterSources((source: Source, filterResolve: any) => {
        source.getCustomName().then(cname => {
          if (cname.match(param)) {
            filterResolve(true);
          } else {
            return source.getName();
          }
        }).then(name => {
          if (name !== undefined) {
            if (name.match(param)) {
              filterResolve(true);
            } else {
              return source.getValue();
            }
          }
        }).then(value => {
          if (value !== undefined) {
            if (value.toString().match(param)) {
              filterResolve(true);
            } else {
              filterResolve(false);
            }
          }
        });
      }).then(sources => {
        resolve(sources);
      });
    });
  };

  /**
   * param: (func: function)
   * ```
   * return: Promise<Source[]>
   * ```
   *
   * Searches all scenes for sources that satisfies the provided testing function.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterSources(function(source, resolve) {
   *   // We'll only fetch Flash Sources by resolving 'true' if the source is
   *   // an instance of FlashSource
   *   resolve((source instanceof FlashSource));
   * }).then(function(sources) {
   *   // sources would either be an empty array if no Flash sources was
   *   // found, or an array of FlashSource objects
   * });
   * ```
   */
  static filterSources(func: any): Promise<Source[]> {
    return new Promise((resolve, reject) => {
      Scene._initializeScenePoolAsync().then(cnt => {
        let matches: Source[] = [];

        if (typeof func === 'function') {
          return Promise.all(Scene._scenePool.map(scene => {
            return new Promise(resolveScene => {
              scene.getSources().then(sources => {
                if (sources.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(sources.map(source => {
                    return new Promise(resolveSource => {
                      func(source, (checker: boolean) => {
                        if (checker) {
                          matches.push(source);
                        }
                        resolveSource();
                      });
                    });
                  })).then(() => {
                    resolveScene();
                  });
                }
            }).catch(() => {
              resolveScene();
              });
            });
          })).then(() => {
            resolve(matches);
          });
        } else {
          reject(Error('Parameter is not a function'));
        }
      });
    });
  }

  /**
   * param: (func: function)
   * ```
   * return: Promise<Scene[]>
   * ```
   *
   * Searches all scenes for sources that satisfies the provided testing
   * function, and then return the scene that contains the source.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterScenesBySources(function(source, resolve) {
   *   // We'll only fetch the scenes with flash sources by resolving 'true'
   *   // if the source is an instance of FlashSource
   *   resolve((source instanceof FlashSource));
   * }).then(function(scenes) {
   *   // scenes would be an array of all scenes with FlashSources
   * });
   * ```
   */
  static filterScenesBySources(func: any): Promise<Scene[]> {
    return new Promise((resolve, reject) => {
      Scene._initializeScenePoolAsync().then(cnt => {
        let matches: Scene[] = [];
        if (typeof func === 'function') {
          return Promise.all(Scene._scenePool.map(scene => {
            return new Promise(resolveScene => {
              scene.getSources().then(sources => {
                if (sources.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(sources.map(source => {
                    return new Promise(resolveSource => {
                      func(source, (checker: boolean) => {
                        if (checker) {
                          matches.push(scene);
                        }
                        resolveSource();
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
        } else {
          reject(Error('Parameter is not a function'));
        }
      });
    });
  }

  /**
   * return: Promise<boolean>

   * Load scenes that are not yet initialized in XSplit Broadcaster.
   *
   * Note: This is only necessary for XSplit version 2.7 and below.
   * Also, for memory saving purposes, this is not called automatically.
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
      } else {
        if (versionCompare(getVersion()).is.lessThan(minVersion)) {
          iApp.get('scenecount').then(cnt => {
            if (Number(cnt) < 12) {
              // Insert an empty scene for scene #12
              iApp
                .set('sceneconfig:11', '<placement name="Scene 12" defpos="0" />')
                .then(res => {
                  resolve(res);
                });
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      }
    });
  }

  /**
   * return: Promise<Source[]>
   *
   * Get all unique Sources from the current scene.
   * Total number of Sources returned may be less that total number of Items on
   * the scenes due to `Linked` items only having a single Source.
   * See also: {@link #core/Source Core/Source}
   *
   * #### Usage
   * ```javascript
   * scene.getSources().then(function(sources) {
   *   for(var i = 0 ; i < sources.length ; i++) {
   *      if(sources[i] instanceof xjs.HtmlSource) {
   *        // Manipulate HTML Source here
   *      }
   *   }
   * })
   * ```
   */
  getSources(): Promise<Source[]> {
    return new Promise((resolve, reject) => {
      let _sceneId = versionCompare(getVersion()).is.lessThan(sceneUidMinVersion) ? this._id : this._uid;
      iApp.getAsItemList('sceneconfig:' + _sceneId).then(jsonArr => {
        var promiseArray: Promise<Source>[] = [];
        let uniqueObj = {};
        let uniqueSrc = [];

        // type checking to return correct Source subtype
        let typePromise = index => new Promise(typeResolve => {
          let source = jsonArr[index];
          let type = Number(source['type']);
          if (type === ItemTypes.GAMESOURCE) {
            typeResolve(new GameSource(source));
          } else if ((type === ItemTypes.HTML || type === ItemTypes.FILE) &&
            source['name'].indexOf('Video Playlist') === 0 &&
            source['FilePlaylist'] !== ''){
            typeResolve(new VideoPlaylistSource(source));
          } else if (type === ItemTypes.HTML) {
            typeResolve(new HtmlSource(source));
          } else if (type === ItemTypes.SCREEN) {
            typeResolve(new ScreenSource(source));
          } else if (type === ItemTypes.BITMAP ||
              type === ItemTypes.FILE &&
              /\.gif$/.test(source['item'])) {
            typeResolve(new ImageSource(source));
          } else if (type === ItemTypes.FILE &&
              /\.(gif|xbs)$/.test(source['item']) === false &&
              /^(rtsp|rtmp):\/\//.test(source['item']) === false &&
              new RegExp(MediaTypes.join('|')).test(source['item']) === true) {
            typeResolve(new MediaSource(source));
          } else if (Number(source['type']) === ItemTypes.LIVE &&
            source['item'].indexOf(
              '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
            typeResolve(new CameraSource(source));
          } else if (Number(source['type']) === ItemTypes.LIVE &&
            source['item'].indexOf(
              '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
            typeResolve(new AudioSource(source));
          } else if (Number(source['type']) === ItemTypes.FLASHFILE) {
            typeResolve(new FlashSource(source));
          } else {
              typeResolve(new Source(source));
          }
        });

        if (Array.isArray(jsonArr)) {
          for (var i = 0; i < jsonArr.length; i++) {
            jsonArr[i]['sceneId'] = this._id;
            promiseArray.push(typePromise(i));
          }
        }
        Promise.all(promiseArray).then(results => {
          for(var h = 0; h< results.length; h++) {
            for(var key in results[h]){
              if(key === '_srcId'){
                uniqueObj[results[h][key]] = results[h]
              }
            }
          }
          for(var j in uniqueObj) {
            if(uniqueObj.hasOwnProperty(j)) {
              uniqueSrc.push(uniqueObj[j])
            }
          }
          resolve(uniqueSrc);
        });
      }).catch(err => {
        reject(err)
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
   *
   * ** For deprecation, please use getSceneIndex instead.
   */
  getSceneNumber(): Promise<number> {
    return new Promise(resolve => {
      let curUid = this._uid;
      if (versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
        if (typeof this._id === 'number') {
          resolve(Number(this._id) + 1)
        } else {
          resolve(this._id)
        }
      } else {
        Scene._initializeScenePoolAsync().then(() => {
          return Scene.getBySceneUid(curUid)
        }).then(curScene => {
          if (typeof curScene !== 'number') {
            resolve(Number(curScene._id) + 1)
          } else {
            resolve(curScene._id)
          }
        })
      }

    });
  }

  /**
   * return: number
   *
   * Get the 0-indexed scene number of this scene object.
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSceneIndex().then(function(num) {
   *  console.log('Scene index is ' + num);
   * });
   * ```
   */
  getSceneIndex(): Promise<number> {
    return new Promise(resolve => {
      let curUid = this._uid;
      if (versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
        if (typeof this._id !== 'number') {
          resolve(Number(this._id))
        } else {
          resolve(this._id)
        }
      } else {
        Scene._initializeScenePoolAsync().then(() => {
          return Scene.getBySceneUid(curUid)
        }).then(curScene => {
          resolve(curScene._id)
        })
      }
    });
  }

  /**
   * return: string
   *
   * Get the unique id of this scene object.
   * Scenes unique id is only available for XBC v.3.0.1704.2101 or higher.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSceneUid().then(function(res) {
   *  console.log('Scene unique id is  ' + res);
   * });
   * ```
   */
  getSceneUid(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
        resolve(this._uid);
      } else {
        reject(Error('Scenes unique id is only available for XBC v.3.0.1704.2101 or higher'));
      }
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
   * myScene.getName().then(function(name) {
   *  console.log('My scene is named ' + name);
   * });
   * ```
   */
  getName(): Promise<string> {
    return new Promise(resolve => {
      let _sceneId = versionCompare(getVersion()).is.lessThan(sceneUidMinVersion) ? this._id : this._uid;
      iApp.get('scenename:' + _sceneId).then(val => {
        resolve(val);
      });
    });
  }

  /**
   * param: (value: string)
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
        let _sceneId = versionCompare(getVersion()).is.lessThan(sceneUidMinVersion) ? this._id : this._uid;
        iApp.set('scenename:' + _sceneId, name).then(value => {
          resolve(value);
        });
      }
    });
  }

  /**
   * return: Promise<Item[]>
   *
   * Gets all the items in a specific scene.
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
    return new Promise((resolve, reject) => {
      let _sceneId = versionCompare(getVersion()).is.lessThan(sceneUidMinVersion) ? this._id : this._uid;
      iApp.getAsItemList('sceneconfig:' + _sceneId).then(jsonArr => {
        var promiseArray: Promise<Source>[] = [];

        // type checking to return correct Source subtype
        let typePromise = index => new Promise(typeResolve => {
          let item = jsonArr[index];
          let type = Number(item['type']);
          if (type === ItemTypes.GAMESOURCE) {
            typeResolve(new GameItem(item));
          } else if ((type === ItemTypes.HTML || type === ItemTypes.FILE) &&
            item['name'].indexOf('Video Playlist') === 0 &&
            item['FilePlaylist'] !== '') {
            typeResolve(new VideoPlaylistItem(item));
          } else if (type === ItemTypes.HTML) {
            typeResolve(new HtmlItem(item));
          } else if (type === ItemTypes.SCREEN) {
            typeResolve(new ScreenItem(item));
          } else if (type === ItemTypes.BITMAP ||
            type === ItemTypes.FILE &&
            /\.gif$/.test(item['item'])) {
            typeResolve(new ImageItem(item));
          } else if (type === ItemTypes.FILE &&
              /\.(gif|xbs)$/.test(item['item']) === false &&
              /^(rtsp|rtmp):\/\//.test(item['item']) === false &&
              new RegExp(MediaTypes.join('|')).test(item['item']) === true) {
            typeResolve(new MediaItem(item));
          } else if (Number(item['type']) === ItemTypes.LIVE &&
            item['item'].indexOf(
              '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
            typeResolve(new CameraItem(item));
          } else if (Number(item['type']) === ItemTypes.LIVE &&
            item['item'].indexOf(
              '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
            typeResolve(new AudioItem(item));
          } else if (Number(item['type']) === ItemTypes.FLASHFILE) {
            typeResolve(new FlashItem(item));
          } else {
            typeResolve(new GenericItem(item));
          }
        });

        if (Array.isArray(jsonArr)) {
          for (var i = 0; i < jsonArr.length; i++) {
            jsonArr[i]['sceneId'] = this._id;
            promiseArray.push(typePromise(i));
          }
        }

        Promise.all(promiseArray).then(results => {
          resolve(results);
        });
      }).catch(err => {
        reject(err)
      });
    });
  }

 /**
  * return: Promise<boolean>
  *
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
      let _sceneId = versionCompare(getVersion()).is.lessThan(sceneUidMinVersion) ? this._id : this._uid;
      iApp.get('sceneisempty:' + _sceneId).then(val => {
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
 * Sets the item order of the current scene. The first item in the array
 * will be on top (will cover items below it).
 */
  setItemOrder(items: Array<any>): Promise<Scene> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('not available for source plugins'));
      } else {
        items.reverse();
        let _sceneId = versionCompare(getVersion()).is.lessThan(sceneUidMinVersion) ? this._id : this._uid;
        let ids = [];
        Scene.getActiveScene().then(scene => {
          if (items.every(el => { return (el instanceof Source || el instanceof Item) })) {
            return new Promise(resolve => {
              let promises = [];
              for (let i in items) {
                promises.push((_i => {
                  return new Promise(resolve => {
                    items[_i].getId().then(id => {
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
          if ((Number(id) - 1) === this._id &&
            (Environment.isSourceProps() || (Environment.isExtension)) ) {
            exec('SourcesListOrderSave', String(ViewTypes.MAIN), ids.join(','));
            resolve(this);
          } else {
            let sceneName: string;
            this.getName().then(name => {
              sceneName = name;
              return iApp.getAsList('sceneconfig:' + _sceneId);
            }).then(jsonArr => {
              let newOrder = new JXON();
              newOrder.children = [];
              newOrder['tag'] = 'placement';
              newOrder['name'] = sceneName;
              if (Array.isArray(jsonArr)) {
                let attrs = ['name', 'cname', 'item'];
                for (let i = 0; i < jsonArr.length; i++) {
                  for (let a = 0; a < attrs.length; a++) {
                    //This formatting is for json
                    jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]]
                      .replace(/\\/g, '\\\\');
                    jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]]
                      .replace(/"/g, '&quot;');
                  }
                  newOrder.children[ids.indexOf(jsonArr[i]['id'])] = jsonArr[i];
                }

                iApp.set(
                  'sceneconfig:' + _sceneId,
                  //Revert back the formatting from json when transforming to xml
                  XML.parseJSON(newOrder).toString().replace(/\\\\/g, '\\')
                ).then(() => {
                  resolve(this);
                });
              } else {
                reject(Error('Scene does not have any source'));
              }
            });
          }
        });
      }
    });
  }
}
