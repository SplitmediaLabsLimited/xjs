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

  private pid: number;
  private handle: number;
  private hwnd: number;
  private gapitype: string;
  private width: number;
  private height: number;
  private flags: number;
  private wndname: string;
  private lastframets: number;

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
    return this.pid;
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
    return this.handle;
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
    return this.hwnd;
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
    return this.gapitype;
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
    return Rectangle.fromDimensions(this.width, this.height);
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
    return this.flags === 1 ? true: false;
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
    return this.wndname;
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
    return this.lastframets;
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

    g.pid = jxon['pid'] !== undefined ? parseInt(jxon['pid']) : undefined;
    g.handle = jxon['handle'] !== undefined ? parseInt(jxon['handle']) :
      undefined;
    g.hwnd = jxon['hwnd'] !== undefined ? parseInt(jxon['hwnd']) : undefined;
    g.gapitype = jxon['GapiType'];
    g.width = jxon['width'] !== undefined ? parseInt(jxon['width']) :
      undefined;
    g.height = jxon['height'] !== undefined ? parseInt(jxon['height']) :
      undefined;
    g.flags = jxon['flags'] !== undefined ? parseInt(jxon['flags']) :
      undefined;
    g.wndname = jxon['wndname'];
    g.lastframets = jxon['lastframets'] !== undefined ?
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
    gamesource['pid'] = this.pid;
    gamesource['handle'] = this.handle;
    gamesource['hwnd'] = this.hwnd;
    gamesource['gapitype'] = this.gapitype;
    gamesource['width'] = this.width;
    gamesource['height'] = this.height;
    gamesource['flags'] = this.flags;
    gamesource['wndname'] = this.wndname;
    gamesource['lastframets'] = this.lastframets;
    gamesource['selfclosing'] = true;

    return XML.parseJSON(gamesource);
  }
}
