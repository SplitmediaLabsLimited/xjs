/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';
import {App as iApp} from '../internal/app';
import {exec} from '../internal/internal';
import {Environment} from './environment';
import {Source, SourceTypes} from './source/source';
import {GameSource} from './source/game';
import {CameraSource} from './source/camera';
import {AudioSource} from './source/audio';
import {HtmlSource} from './source/html';
import {FlashSource} from './source/flash';
import {ScreenSource} from './source/screen';
import {ImageSource} from './source/image';
import {MediaSource} from './source/media';

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
            resolve(Scene.searchScenesBySourceId(curScene.children[0]['id']));
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
          scene.getId().then(id => {
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
   * return: Promise<Source>
   *
   * Searches all scenes for an source by ID. ID search will return exactly 1 result (IDs are unique) or null.
   *
   * See also: {@link #core/Source Core/Source}
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchSourcesById('{10F04AE-6215-3A88-7899-950B12186359}').then(function(source) {
   *   // result is either a Source or null
   * });
   * ```
   *
   */
  static searchSourcesById(id: string): Promise<Source> {
    let isID: boolean = /^{[A-F0-9\-]*}$/i.test(id);
    if (!isID) {
      throw new Error('Not a valid ID format for sources');
    } else {
      Scene._initializeScenePool();

      return new Promise(resolve => {

        let match = null;
        let found = false;
        Scene._scenePool.forEach((scene, idx, arr) => {
          if (match === null) {
            scene.getSources().then((function(sources) {
              found = sources.some(source => { // unique ID, so get first result
                if (source['_id'] === id.toUpperCase()) {
                  match = source;
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
   * Searches all scenes for one that contains the given source ID.
   *
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchScenesBySourceId('{10F04AE-6215-3A88-7899-950B12186359}').then(function(scene) {
   *   // scene contains the source
   * });
   * ```
   *
   */
  static searchScenesBySourceId(id: string): Promise<Scene> {
    let isID: boolean = /^{[A-F0-9-]*}$/i.test(id);
    if (!isID) {
      throw new Error('Not a valid ID format for sources');
    } else {
      Scene._initializeScenePool();

      return new Promise(resolve => {

        let match = null;
        let found = false;
        Scene._scenePool.forEach((scene, idx, arr) => {
          if (match === null) {
            scene.getSources().then(sources => {
              found = sources.some(source => { // unique ID, so get first result
                if (source['_id'] === id.toUpperCase()) {
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
   * param: function(source, resolve)
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
   *   // We'll only fetch Flash Sources by resolving 'true' if the source is an
   *   // instance of FlashSource
   *   resolve((source instanceof FlashSource));
   * }).then(function(sources) {
   *   // sources would either be an empty array if no Flash sources was found,
   *   // or an array of FlashSource objects
   * });
   * ```
   */
  static filterSources(func: any): Promise<Source[]> {
    Scene._initializeScenePool();
    let matches: Source[] = [];

    return new Promise((resolve, reject) => {
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
            });
          });
        })).then(() => {
          resolve(matches);
        });
      } else {
        reject(Error('Parameter is not a function'));
      }
    });
  }

  /**
   * param: function(source, resolve)
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
   *   // We'll only fetch the scenes with flash sources by resolving 'true' if
   *   // the source is an instance of FlashSource
   *   resolve((source instanceof FlashSource));
   * }).then(function(scenes) {
   *   // scenes would be an array of all scenes with FlashSources
   * });
   * ```
   */
  static filterScenesBySources(func: any): Promise<Scene[]> {
    Scene._initializeScenePool();
    let matches: Scene[] = [];

    return new Promise((resolve, reject) => {
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
    })
  }

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
   * return: Promise<Source[]>
   *
   * Gets all the sources in a specific scene.
   * See also: {@link #core/Source Core/Source}
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSources().then(function(sources) {
   *  // do something to each source in sources array
   * });
   * ```
   */
  getSources(): Promise<Source[]> {
    return new Promise(resolve => {
    iApp.getAsList('presetconfig:' + this._id).then(jsonArr => {
      var promiseArray: Promise<Source>[] = [];

      // type checking to return correct Source subtype
      let typePromise = index => new Promise(typeResolve => {
        let source = jsonArr[index];
        let type = Number(source['type']);
        if (type === SourceTypes.GAMESOURCE) {
          typeResolve(new GameSource(source));
        } else if (type === SourceTypes.HTML) {
          typeResolve(new HtmlSource(source));
        } else if (type === SourceTypes.SCREEN) {
          typeResolve(new ScreenSource(source));
        } else if (type === SourceTypes.BITMAP ||
            type === SourceTypes.FILE &&
            /\.gif$/.test(source['item'])) {
          typeResolve(new ImageSource(source));
        } else if (type === SourceTypes.FILE &&
            /\.(gif|xbs)$/.test(source['item']) === false &&
            /^(rtsp|rtmp):\/\//.test(source['item']) === false) {
          typeResolve(new MediaSource(source));
        } else if (Number(source['type']) === SourceTypes.LIVE &&
          source['item'].indexOf(
            '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
          typeResolve(new CameraSource(source));
        } else if (Number(source['type']) === SourceTypes.LIVE &&
          source['item'].indexOf(
            '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
          typeResolve(new AudioSource(source));
        } else if (Number(source['type']) === SourceTypes.FLASHFILE) {
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
   * param: Array<Source> | Array<string> (source IDs)
   * ```
   * return: Promise<Scene>
   * ```
   *
   * Sets the source order of the current scene. The first source in the array
   * will be on top (will cover sources below it).
   */
  setSourceOrder(sources: Array<any>): Promise<Scene> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('not available for source plugins'));
      } else {
        sources.reverse();
        let ids = [];
        Scene.getActiveScene().then(scene => {
          if (sources.every(el => { return el instanceof Source })) {
            return new Promise(resolve => {
              let promises = [];
              for (let i in sources) {
                promises.push((_i => {
                  return new Promise(resolve => {
                    sources[_i].getId().then(id => {
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
            ids = sources;
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
                reject(Error('Scene does not have any source'));
              }
            });
          }
        });
      }
    });
  }
}
