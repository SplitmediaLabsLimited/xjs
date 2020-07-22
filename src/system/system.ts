/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {AudioDevice as AudioDevice} from './audio';
import {MicrophoneDevice} from './microphone';
import {CameraDevice} from './camera';
import {Game as Game} from './game';
import {Screen} from './screen';
import {JSON as JXON} from '../internal/util/json';
import {Environment} from '../core/environment';
import {exec} from '../internal/internal';
import {Scene} from '../core/scene';
import {Dll} from '../core/dll';

/**
 * This enum is used for {@link #system/System System Class} getAudioDevices
 * method's first parameter.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * XJS.System.getAudioDevices(XJS.AudioDeviceDataflow.CAPTURE, ...);
 * ```
 */
export enum AudioDeviceDataflow {
  RENDER = 1,
  CAPTURE = 2,
  ALL = 3
}

/**
 * This enum is used for {@link #system/System System Class} getAudioDevices
 * method's second parameter.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * XJS.System.getAudioDevices(..., XJS.AudioDeviceState.ACTIVE);
 * ```
 */
export enum AudioDeviceState {
  ACTIVE = 1,
  DISABLED = 2,
  UNPLUGGED = 4,
  NOTPRESENT = 8,
  ALL = 15
}

/**
 * The System class provides you methods to fetch audio devices to manipulate
 * the application's audio settings. It also allows you to fetch games,
 * microphone devices and camera devices to add to scenes. Finally, some
 * system-level functionality such as cursor position is exposed.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getCameraDevices().then(function(cameras) {
 *   window.cameras = cameras;
 * });
 * ```
 */
export class System{
  /**
   * return: Promise<AudioDevice[]>
   *
   * Gets audio devices, both input and output
   * See also: {@link #system/AudioDevice System/AudioDevice}
   *
   * #### Usage
   *
   * ```javascript
   * System.getAudioDevices(
   *   XML.AudioDeviceDataflow.ALL,
   *   XML.AudioDeviceState.ACTIVE
   * ).then(function(devices) {
   *   // devices is an array of AudioDevice object
   *   window.audios = devices;
   * });
   * ```
   */
  static getAudioDevices(dataflow = AudioDeviceDataflow.ALL,
      state = AudioDeviceState.ACTIVE): Promise<AudioDevice[]> {
    return new Promise(resolve => {
      iApp.getAsList('wasapienum').then(devicesJXON => {
        let devices: AudioDevice[] = [];
        if (devicesJXON !== undefined) {
          var devicesJXONLength = devicesJXON.length;
          for (var i = 0; i < devicesJXONLength; ++i) {
            let device = devicesJXON[i];
            let bitsState = AudioDeviceState[String(device['State'])
              .toUpperCase().replace(/\s+/g, '')];
            if ((bitsState & state) !== bitsState) {
                continue;
            }
            let bitsFlow = AudioDeviceDataflow[String(device['DataFlow'])
              .toUpperCase()];
            if ((bitsFlow & dataflow) !== bitsFlow) {
                continue;
            }
            if (device['name'].toLowerCase().indexOf('xsplit') > -1) {
              continue;
            }
            devices.push(AudioDevice.parse(device));
          }
        }
        resolve(devices);
      });
    });
  }

  /**
   * return: Promise<CameraDevice[]>
   *
   * Gets all camera devices
   * See also: {@link #system/CameraDevice System/CameraDevice}
   *
   * #### Usage
   *
   * ```javascript
   * System.getCameraDevices().then(function(devices) {
   *   // devices is an array of CameraDevice object
   *   window.cameras = devices;
   * });
   * ```
   */
  static getCameraDevices(): Promise<CameraDevice[]> {
    return new Promise(resolve => {
      iApp.getAsList('dshowenum:vsrc').then(devicesJSON => {
        let devices: CameraDevice[] = [];
        if (devicesJSON !== undefined) {
          for(let device of devicesJSON) {
            const dispUpperCase = String(device['disp']).toUpperCase();
            if (dispUpperCase.indexOf('XSPLIT') === -1 &&
              dispUpperCase !== '@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\{778ABFB2-E87B-48A2-8D33-675150FCF8A2}' &&
              String(device['name']).toLowerCase().indexOf(('Intel(R) RealSense(TM) 3D Camera Virtual Driver').toLowerCase()) === -1 &&
              String(device['name']).toLowerCase().indexOf(('Intel(R) RealSense(TM) Camera SR300 Virtual Driver').toLowerCase()) === -1 &&
              dispUpperCase.indexOf(('@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0AA5&MI_02#')) === -1 &&
              dispUpperCase.indexOf(('@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0A66&MI_02#')) === -1
              ) {
              devices.push(CameraDevice.parse(device));
            }
          }

          resolve(devices);
        }
      });
    });
  }

  /**
   * return: Promise<Game[]>
   *
   * Gets all currently running games
   * See also: {@link #system/Game System/Game}
   *
   * #### Usage
   *
   * ```javascript
   * System.getGames().then(function(games) {
   *   // games is an array of Game object
   *   window.games = games;
   * });
   * ```
   */
  static getGames(): Promise<Game[]> {
    return new Promise(resolve => {
      iApp.getAsList('gsenum').then(gamesJXON => {
        let games: Game[] = [];
        if (gamesJXON !== undefined) {
          var gamesJXONLength = gamesJXON.length;
          for (var i = 0; i < gamesJXONLength; ++i) {
            games.push(Game.parse(gamesJXON[i]));
          }
        }
        resolve(games);
      });
    });
  }

  /**
   * return: Promise<MicrophoneDevice[]>
   *
   * Gets all audio capture devices that may be added to the stage
   * See also: {@link #system/MicrophoneDevice System/MicrophoneDevice}
   *
   * #### Usage
   *
   * ```javascript
   * System.getMicrophones().then(function(microphones) {
   *   microphones[0].addToScene(); // add first microphone to stage
   * });
   * ```
   */
  static getMicrophones(): Promise<MicrophoneDevice[]> {
    return new Promise(resolve => {
      iApp.getAsList('dshowenum:asrc').then(micsJXON => {
        let mics: MicrophoneDevice[] = [];
        if (micsJXON !== undefined) {
          let micsJXONLength = micsJXON.length;
          for (var i = 0; i < micsJXONLength; ++i) {
            if (micsJXON[i]['WaveInId'] !== undefined) {
              mics.push(MicrophoneDevice.parse(micsJXON[i]));
            }
          }
        }
        resolve(mics);
      });
    });
  }

  /**
   * return: Promise<Screen[]>
   *
   * Gets all available screen/windows that may be added to the stage
   * See also: {@link #system/Screen System/Screen}
   *
   * #### Usage
   *
   * ```javascript
   * System.getAvailableScreens().then(function(screens) {
   *   screens[0].addToScene(); // add first screen to stage
   * });
   * ```
   */
  static getAvailableScreens(): Promise<any> {
    return new Promise(resolve => {
      let screens: Screen[] = [];
      let devices = []
      const getParentWindows = Dll.call('xsplit.EnumParentWindows')
      getParentWindows.then(list => {
        let processArray = list.split(',')
        return Promise.all(processArray.map(process => {
          return Promise.all([
            Dll.call('xsplit.GetWindowTitle', process),
            Dll.call('xsplit.GetWindowClassName', process),
            Dll.call('xsplit.GetWindowProcessId', process),
            Promise.resolve(process)
          ])
        }))
      }).then(windowDetailsArr => {
        let devices = windowDetailsArr
          .filter(windowDetail => windowDetail[0] !== '')
          .filter(windowDetail => windowDetail[0].toUpperCase().indexOf('XSPLIT BROADCASTER') !== 0)
          .filter(windowDetail => windowDetail[1].toUpperCase().indexOf('SHELL_TRAYWND') !== 0)
          .filter(windowDetail => windowDetail[1].toUpperCase().indexOf('BUTTON') !== 0)
          .filter(windowDetail => windowDetail[1].toUpperCase().indexOf('WINDOWS.UI.CORE.COREWINDOW') !== 0)
          .map(windowDetail => {
            Dll.call('xsplit.GetProcessDetailsKernel', windowDetail[2])
            .then(detail => {
              let dev = {
                'title': windowDetail[0],
                'class': windowDetail[1],
                'processDetail': detail.toLocaleLowerCase(),
                'hwnd': windowDetail[3]
              }
              return screens.push(Screen.parse(dev))
            })
          })
          return devices
      }).then(res => {
        resolve(screens)
      })
    })
  }


  /**
   * return: Promise<string[]>
   *
   * Gets array of system-installed fonts
   *
   * #### Usage
   *
   * ```javascript
   * var mySelect = document.getElementById("mySelect");
   *
   * System.getSystemFonts().then(function(fontsArray) {
   *   var fontsArrayLength = fontsArray.length;
   *   for (var i = 0; i < fontsArrayLength; ++i) {
   *     var option = document.createElement('option');
   *     option.text = fontsArray[i];
   *     mySelect.add(option);
   *   }
   * });
   * ```
   */
  static getFonts(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('function is not available for source'));
      } else {
        iApp.get('html:fontlist').then(fontlist => {
          if (typeof fontlist === 'string' && fontlist !== '') {
            var fontArray = fontlist.split(',');
            resolve(fontArray);
          } else {
            reject(Error('cannot fetch list of available system fonts'));
          }
        });
      }
    });
  }

  /**
   * return: Promise<JSON>
   *
   * Gets the position of the cursor. Does not work on Source Plugins.
   *
   * #### Usage
   *
   * ```javascript
   * System.getCursorPosition().then(function(pos) {
   *   var x = pos.x; // X Axis
   *   var y = pos.y; // Y Axis
   * });
   * ```
   */
  static getCursorPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('function is not available for source'));
      } else {
        let res;
        exec('GetCursorPos').then(result => {
          res = result
          if (typeof res === 'string') {
            var posArr = res.split(',');
            var pos = {};
            pos['x'] = Number(posArr[0]);
            pos['y'] = Number(posArr[1]);
            resolve(pos)
          } else {
            reject(Error('cannot fetch current cursor position'));
          }
        });
      }
    });
  }

  /**
   * param: JSON: {x: number, y: number}
   *
   * Sets the position of the cursor. Does not work on Source Plugins.
   *
   * #### Usage
   *
   * ```javascript
   * System.setCursorPosition({x:0, y:0});
   * ```
   */
  static setCursorPosition(pos: {x: number, y: number}) {
    return new Promise((resolve, reject) => {
      if (Environment.isSourcePlugin()) {
        reject(Error('function is not available for source'));
      } else if (typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        reject(Error('Invalid parameters. Valid format is:: "JSON: {x: number, y: number}"'));
      } else {
        exec('SetCursorPos', String(pos.x), String(pos.y));
        resolve(true);
      }
    });
  }
}
