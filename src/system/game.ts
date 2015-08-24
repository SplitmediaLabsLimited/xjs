/// <reference path="../../defs/es6-promise.d.ts" />

import {Rectangle as Rectangle} from '../util/rectangle';
import {JSON as JXON} from '../internal/util/json';
import {XML as XML} from '../internal/util/xml';
import {Addable} from './iaddable';
import {App as iApp} from '../internal/app';

export class Game implements Addable {

  private pid: number;
  private handle: number;
  private hwnd: number;
  private gapitype: string;
  private width: number;
  private height: number;
  private flags: number;
  private wndname: string;
  private lastframets: number;
  private fpsRender: number;
  private fpsCapture: number;
  private imagename: string;
  private replace: string;

  /**
   * Gets the game's process ID.
   *
   * @return {number}
   */
  getPid() {
    return this.pid;
  }

  /**
   * Gets the Graphics API handle.
   *
   * @returns {number}
   */
  getHandle() {
    return this.handle;
  }

  /**
   * Gets the window handle.
   *
   * @returns {number}
   */
  getWindowHandle() {
    return this.hwnd;
  }

  /**
   * Gets the Graphics API type.
   *
   * @returns {string}, possible values:
   * OGL, DX8, DX8_SwapChain, DX9, DX9Ex, DX9_SwapChain,
   * DX9_PresentEx, DX10, DX11, DX11.1, DX11.1_Present1
   */
  getGapiType() {
    return this.gapitype;
  }

  /**
   * Gets the game resolution.
   *
   * @returns {Rectangle}
   */
  getResolution() {
    return Rectangle.fromDimensions(this.width, this.height);
  }

  /**
   * Checks if game has exclusive full screen.
   *
   * @returns {boolean}
   */
  isFullscreen() {
    return this.flags === 1 ? true: false;
  }

  /**
   * Gets the window title
   *
   * @returns {string}
   */
  getWindowName() {
    return this.wndname;
  }

  /**
   * Gets timestamp of last frame in milliseconds.
   *
   * @returns {number}
   */
  getLastFrameTimestamp() {
    return this.lastframets;
  }

  /**
   * Get the FPS Render of the game
   */
  getFpsRender() {
    return this.fpsRender;
  }

  /**
   * Get the Captured FPS of the game
   */
  getFpsCapture() {
    return this.fpsCapture;
  }

  /**
   * Get the image name of the game
   */
  getImageName() {
    return this.imagename;
  }

  /**
   * Get the replace image value of the game
   */
  getReplace() {
    return this.replace;
  }

  /**
   * Converts a JSON object into a Game object
   *
   * @param {JSON} jxon
   * @returns {Game}
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
    g.fpsRender = jxon['fpsRender'] !== undefined ? Number(jxon['fpsRender']) :
      undefined;
    g.fpsCapture = jxon['fpsCapture'] !== undefined ?
      Number(jxon['fpsCapture']) : undefined;
    g.imagename = jxon['imagename'];
    g.replace = jxon['replace'];

    return g;
  }

  /**
   * Converts Game object into an XML object
   *
   * @returns {XML}
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

  addToScene(): Promise<boolean> {
    return new Promise(resolve => {
      iApp.callFunc('addgamesource', 'dev:' + this.toXML()).then(() => {
        resolve(true);
      });
    });
  }
}
