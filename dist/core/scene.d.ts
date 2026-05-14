import { Source } from './source/source';
import { Item } from './items/item';
import { Transition } from './transition';
export declare class Scene {
    private _id;
    private _uid;
    private _refID;
    private _name;
    private static _maxScenes;
    private static _scenePool;
    private static _liveScene;
    constructor(sceneId: number | string, name?: string, uid?: string);
    private static _initializeScenePoolAsync;
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
    static getSceneCount(): Promise<number>;
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
    static getById(sceneNum: any): Promise<Scene>;
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
    static getBySceneIndex(sceneIndex: any): Promise<Scene>;
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
    static getBySceneUid(sceneUid: string): Promise<Scene>;
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
    static getByName(sceneName: string): Promise<Scene[]>;
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
    static getActiveScene(): Promise<Scene>;
    /**
     * param: scene<number|Scene>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Change active scene. Does not work on source plugins.
     */
    static setActiveScene(scene: any): Promise<boolean>;
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
    static searchItemsById(id: string): Promise<Item>;
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
    static searchScenesByItemId(id: string): Promise<Scene>;
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
    static searchItemsByName(param: string): Promise<Item[]>;
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
    static filterItems(func: any): Promise<Item[]>;
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
    static filterScenesByItems(func: any): Promise<Scene[]>;
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
    static searchSourcesById(srcId: string): Promise<Source[]>;
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
    static searchScenesBySourceId(srcId: string): Promise<Scene[]>;
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
    static searchSourcesByName(param: string): Promise<Source[]>;
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
    static filterSources(func: any): Promise<Source[]>;
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
    static filterScenesBySources(func: any): Promise<Scene[]>;
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
    static initializeScenes(): Promise<boolean>;
    /**
     * return: Scene
     *
     * Returns a special `liveScene` object that may be added as a source to the stage.
     * The Scene.liveScene object whenever called upon,
     * gives access to the current active scene.
     * This is made possible because the liveScene object does not pertain to a real scene
     * in the context of XBC, but the actual view,
     * or at least the scene which is currently loaded in that view.
     *
     * #### Usage
     *
     * ```javascript
     * var xjs = require('xjs');
     * xjs.Scene.liveScene().addAsSource();
     * ```
     */
    static liveScene(): Scene;
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Adds this scene as a source to the current scene by default.
     * Accepts an optional parameter value, which, when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addAsSource(value?: number | Scene): Promise<any>;
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
    getSources(): Promise<Source[]>;
    /**
     * return: Promise<number>
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
    getSceneNumber(): Promise<number>;
    /**
     * return: Promise<number>
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
    getSceneIndex(): Promise<number>;
    /**
     * return: Promise<string>
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
    getSceneUid(): Promise<string>;
    /**
     * return: Promise<string>
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
    getName(): Promise<string>;
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
    setName(name: string): Promise<boolean>;
    /**
     * return: Promise<string>
     *
     * Get the transition override of this scene object.
     * Transition overrides take priority over the more generic one from App.GetTransition
     * See also: {@link #core/Transition Core/Transition} and {@link #core/App#getTransition getTransition}
     *
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getTransitionOverride().then(function(transition) {
     *  // do something here
     * });
     * ```
     */
    getTransitionOverride(): Promise<Transition>;
    /**
     * param: (value: string)
     * Set the transition override of this scene object.
     * Transition overrides take priority over the more generic one from App.GetTransition
     * See also: {@link #core/Transition Core/Transition} and {@link #core/App#setTransition setTransition}
     *
     *
     * #### Usage
     *
     * ```javascript
     * myScene.setTransitionOverride('xjs.Transition.CLOCK');
     * ```
     */
    setTransitionOverride(value: any): Promise<boolean>;
    /**
     * return: Promise<number>
     *
     * Get the transition time override of this scene object.
     * The scene transition time override will only take effect
     * if the scene transition override itself is not equal to ''(Transition.NONE)
     *
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getTransitionTime().then(function(time) {
     *  // do something here
     * });
     * ```
     */
    getTransitionTime(): Promise<string>;
    /**
     * param: (value: string)
     *
     * Set the transition time override of this scene object.
     * The scene transition time override will only take effect
     * if the scene transition override itself is not equal to ''(Transition.NONE)
     *
     * #### Usage
     *
     * ```javascript
     * myScene.setTransitionTime(1000);
     * ```
     */
    setTransitionTime(time: number): Promise<boolean>;
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
    getItems(): Promise<Item[]>;
    /**
     * return: Promise<Item[]>
     *
     * Gets all non-child Items (not belonging to a group) in a specific scene
     * See also: {@link #core/Item Core/Item}
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getTopLevelItems().then(function(items) {
     *  // do something to each item in items array
     * });
     * ```
     */
    getTopLevelItems(): Promise<Item[]>;
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
    isEmpty(): Promise<boolean>;
    /**
     * param: Array<Item> | Array<string> (item IDs)
     * ```
     * return: Promise<Scene>
     * ```
     *
     * Sets the item order of the current scene. The first item in the array
     * will be on top (will cover items below it).
     */
    setItemOrder(items: Array<any>): Promise<Scene>;
    /**
     * return: Promise<string[]>
     *
     * Get all presets for the scene, returns an array of preset UIDs
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getPresets().then(function(presets) {
     *  // do something to each preset UID in UIDs array
     * });
     * ```
     */
    getPresets(): Promise<string>;
    /**
     * return: Promise<string>
     *
     * Get the UID of the active preset.
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getActivePreset().then(function(preset) {
     *  console.log('Active preset UID is ' + preset);
     * });
     * ```
     */
    getActivePreset(): Promise<string>;
    /**
     * param: (preset: string)
     * ```
     * return: Promise<boolean>
     * ```
     * Switch to the specified preset for the scene.
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     *
     * myScene.getPresets()
     * .then(presets => {
     *   const lastPreset = presets.pop()
     *   return myScene.switchToPreset(lastPreset);
     * })
     * .then(isSwitched => {
     *   console.log('switched to preset : ' + isSwitched)
     * });
     * ```
     */
    switchToPreset(preset: string): Promise<boolean>;
    /**
     * return: Promise<string>
     *
     * Add a new preset to the scene, returns the UID of the new preset
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     * myScene.addPreset().then(function(preset) {
     *  console.log('New preset UID is ' + preset);
     * });
     * ```
     */
    addPreset(): Promise<string>;
    /**
     * param: (preset: string)
     * ```
     * return: Promise<boolean>
     * ```
     * Remove the specified preset for the scene.
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     *
     * myScene.removePreset(lastPreset)
     * .then(isRemoved => {
     *   console.log('preset is removed : ' + isRemoved)
     * });
     * ```
     */
    removePreset(preset: string): Promise<boolean>;
    /**
     * return: Promise<string>
     *
     * Get the preset transition easing function for the scene.
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getPresetTransition().then(function(presetTransition) {
     *  console.log('Preset transition is ' + presetTransition);
     * });
     * ```
     */
    getPresetTransitionEasing(): Promise<string>;
    /**
     * param: (presetTransitionEasing: string)
     * ```
     * return: Promise<boolean>
     * ```
     * Switch to the specified preset transition easing function for the scene
     * Possible values ('' or 'none', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic')
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     *
     * myScene.setPresetTransitionEasing('easeInCubic');
     * ```
     */
    setPresetTransitionEasing(presetTransitionEasing: string): Promise<boolean>;
    /**
     * return: Promise<number>
     *
     * Get the preset transition time for the scene, in ms
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getPresetTransitionTime().then(function(presetTransitionTime) {
     *  console.log('Preset transition time is ' + presetTransitionTime);
     * });
     * ```
     */
    getPresetTransitionTime(): Promise<number>;
    /**
     * param: (presetTransitionTime: number)
     * ```
     * return: Promise<boolean>
     * ```
     * Set the preset transition time for the scene, in ms
     * Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     *
     * myScene.setPresetTransitionTime(500);
     * ```
     */
    setPresetTransitionTime(presetTransitionTime: number): Promise<boolean>;
}
