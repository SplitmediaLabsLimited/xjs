/// <reference path="../../defs/es6-promise.d.ts" />

import {Rectangle as Rectangle} from '../internal/util/rectangle';
import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';

/**
 * The Game Class is the object returned by {@link #system/System System Class'}
 * getGames method. It provides you with methods to fetch the game object's
 * attributes, and also provides methods to convert it back to an XML object
 * that is compatible with XBC
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var App = new XJS.App();
 * var xml;
 *
 * App.getGames().then(function(games) {
 * 	for (var i in games) {
 * 		if(games[i].isFullscreen()) {
 * 			xml = games[i].toXML();
 * 			// Do something with the xml here. Probably add it to the current scene
 * 		}
 * 	}
 * });
 * ```
 */
export class Game{

  private _pid: number;
  private _handle: number;
  private _hwnd: number;
  private _gapitype: string;
  private _width: number;
  private _height: number;
  private _flags: number;
  private _wndname: string;
  private _lastframets: number;

  /**
   * return: number
   *
   * Gets the game's process ID.
   *
   * ### Usage
   *
   * ```javascript
   * var processId = game.getPid();
   * ```
   */
  getPid() {
    return this._pid;
  }

  /**
   * return: number
   *
   * Gets the Graphics API handle.
   *
   * ### Usage
   *
   * ```javascript
   * var handle = game.getHandle();
   * ```
   */
  getHandle() {
    return this._handle;
  }

  /**
   * return: number
   *
   * Gets the window handle.
   *
   * ### Usage
   *
   * ```javascript
   * var windowHandle = game.getWindowHandle();
   * ```
   */
  getWindowHandle() {
    return this._hwnd;
  }

  /**
   * return: string
   *
   * Gets the Graphics API type.
   *
   * ### Usage
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
  getGapiType() {
    return this._gapitype;
  }

  /**
   * return: Rectangle
   *
   * Gets the game resolution.
   *
   * ### Usage
   *
   * ```javascript
   * var resolution = game.getResolution();
   * ```
   */
  getResolution() {
    return Rectangle.fromDimensions(this._width, this._height);
  }

  /**
   * return: boolean
   *
   * Checks if game has exclusive full screen.
   *
   * ### Usage
   *
   * ```javascript
   * var isFullscreen = game.isFullscreen();
   * ```
   */
  isFullscreen() {
    return this._flags === 1 ? true: false;
  }

  /**
   * return: string
   *
   * Gets the window title
   *
   * ### Usage
   *
   * ```javascript
   * var windowName = game.getWindowName();
   * ```
   */
  getWindowName() {
    return this._wndname;
  }

  /**
   * return: number
   *
   * Gets timestamp of last frame in milliseconds.
   *
   * ### Usage
   *
   * ```javascript
   * var lastFrameTimestamp = game.getLastFrameTimestamp();
   * ```
   */
  getLastFrameTimestamp() {
    return this._lastframets;
  }

  /**
   * param: JSON
   * ```
   * return: Game
   * ```
   *
   * Converts a JSON object into a Game object
   *
   * ### Usage
   *
   * ```javascript
   * var XJS = require('xjs');
   * var game = XJS.Game.parse(jsonObj);
   * ```
   */
  static parse(jxon: JXON): Game {
    var g = new Game();

    g._pid = jxon['pid'] !== undefined ? parseInt(jxon['pid']) : undefined;
    g._handle = jxon['handle'] !== undefined ? parseInt(jxon['handle']) :
      undefined;
    g._hwnd = jxon['hwnd'] !== undefined ? parseInt(jxon['hwnd']) : undefined;
    g._gapitype = jxon['GapiType'];
    g._width = jxon['width'] !== undefined ? parseInt(jxon['width']) :
      undefined;
    g._height = jxon['height'] !== undefined ? parseInt(jxon['height']) :
      undefined;
    g._flags = jxon['flags'] !== undefined ? parseInt(jxon['flags']) :
      undefined;
    g._wndname = jxon['wndname'];
    g._lastframets = jxon['lastframets'] !== undefined ?
      parseInt(jxon['lastframets']) : undefined;

    return g;
  }

  /**
   * return: XML
   *
   * Converts Game object into an XML object
   *
   * ### Usage
   *
   * ```javascript
   * var gameXML = game.toXML();
   * ```
   */
  toXML() : XML {
    var gamesource = new JXON();

    gamesource.tag = 'src';
    gamesource['pid'] = this._pid;
    gamesource['handle'] = this._handle;
    gamesource['hwnd'] = this._hwnd;
    gamesource['gapitype'] = this._gapitype;
    gamesource['width'] = this._width;
    gamesource['height'] = this._height;
    gamesource['flags'] = this._flags;
    gamesource['wndname'] = this._wndname;
    gamesource['lastframets'] = this._lastframets;
    gamesource['selfclosing'] = true;

    return XML.parseJSON(gamesource);
  }
}
