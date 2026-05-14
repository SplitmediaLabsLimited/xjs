import { Rectangle } from '../util/rectangle';
import { JSON as JXON } from '../internal/util/json';
import { XML } from '../internal/util/xml';
import { Addable } from './iaddable';
import { Scene } from '../core/scene';
/**
 * The Game Class is the object returned by {@link #system/System System Class}
 * getGames method. It provides you with methods to fetch the game object's
 * attributes, as well as methods to add any game to the current scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 * var xml;
 *
 * System.getGames().then(function(games) {
 *  for (var i in games) {
 *    if(games[i].isFullscreen()) {
 *      games[i].addToScene();
 *    }
 *  }
 * });
 * ```
 */
export declare class Game implements Addable {
    private _pid;
    private _handle;
    private _hwnd;
    private _gapitype;
    private _width;
    private _height;
    private _flags;
    private _wndname;
    private _lastframets;
    private _fpsRender;
    private _fpsCapture;
    private _imagename;
    private _replace;
    private _gameTrack;
    /**
     * return: number
     *
     * Gets the game's process ID.
     *
     * #### Usage
     *
     * ```javascript
     * var processId = game.getPid();
     * ```
     */
    getPid(): number;
    /**
     * return: number
     *
     * Gets the Graphics API handle.
     *
     * #### Usage
     *
     * ```javascript
     * var handle = game.getHandle();
     * ```
     */
    getHandle(): number;
    /**
     * return: number
     *
     * Gets the window handle.
     *
     * #### Usage
     *
     * ```javascript
     * var windowHandle = game.getWindowHandle();
     * ```
     */
    getWindowHandle(): number;
    /**
     * return: string
     *
     * Gets the Graphics API type.
     *
     * #### Usage
     *
     * ```javascript
     * var gApiType = game.getGapiType();
     * ```
     *
     * #### Possible Values
     *
     * ```
     * OGL, DX8, DX8_SwapChain, DX9, DX9Ex, DX9_SwapChain,
     * DX9_PresentEx, DX10, DX11, DX11.1, DX11.1_Present1
     * ```
     */
    getGapiType(): string;
    /**
     * return: Rectangle
     *
     * Gets the game resolution in pixels.
     *
     * #### Usage
     *
     * ```javascript
     * var resolution = game.getResolution();
     * ```
     */
    getResolution(): Rectangle;
    /**
     * return: boolean
     *
     * Checks if game has exclusive full screen.
     *
     * #### Usage
     *
     * ```javascript
     * var isFullscreen = game.isFullscreen();
     * ```
     */
    isFullscreen(): boolean;
    /**
     * return: string
     *
     * Gets the window title
     *
     * #### Usage
     *
     * ```javascript
     * var windowName = game.getWindowName();
     * ```
     */
    getWindowName(): string;
    /**
     * return: number
     *
     * Gets timestamp of last frame in milliseconds.
     *
     * #### Usage
     *
     * ```javascript
     * var lastFrameTimestamp = game.getLastFrameTimestamp();
     * ```
     */
    getLastFrameTimestamp(): number;
    /**
     * return: number
     *
     * Get the FPS Render of the game
     */
    getFpsRender(): number;
    /**
     * return: number
     *
     * Get the Captured FPS of the game
     */
    getFpsCapture(): number;
    /**
     * return: string
     *
     * Get the image name of the game
     */
    getImageName(): string;
    /**
     * return: string
     *
     * Get the replace image value of the game
     */
    getReplace(): string;
    /**
     * param: gameJSON<JXON>
     * ```
     * return: Game
     * ```
     *
     * Converts a JSON object into a Game object
     *
     * #### Usage
     *
     * ```javascript
     * var XJS = require('xjs');
     * var game = XJS.Game.parse(jsonObj);
     * ```
     */
    static parse(jxon: JXON): Game;
    /**
     * return: XML
     *
     * Converts Game object into an XML object
     *
     * #### Usage
     *
     * ```javascript
     * var gameXML = game.toXML();
     * ```
     */
    toXML(): XML;
    /**
     * param: (value?: number | Scene)
     * ```
     * return: Promise<any>
     * ```
     *
     * Adds this game to the current scene by default.
     * Accepts an optional parameter value, which, when supplied,
     * points to the scene where item will be added instead.
     * If ready config {listenToItemAdd: true} it returns item id,
     * else returns boolean.
     *
     * Note: There is yet no way to detect error responses for this action.
     */
    addToScene(value?: number | Scene): Promise<any>;
    static _autoDetect: Game;
    /**
     *  return: Game
     *
     *  Returns a special Game object that may be added to the stage. This
     *  object automatically detects any compatible games that are running
     *  and focused, and changes the displayed game on the stage accordingly.
     *
     *  #### Usage
     *
     * ```javascript
     * var xjs = require('xjs');
     * xjs.Game.autoDetect().addToScene();
     * ```
     */
    static autoDetect(): Game;
}
