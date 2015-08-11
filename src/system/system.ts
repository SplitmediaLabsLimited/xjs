/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {AudioDevice as AudioDevice} from './audio';
import {CameraDevice} from './camera';
import {Game as Game} from './game';
import {JSON as JXON} from '../internal/util/json';

export enum AudioDeviceDataflow {
    RENDER = 1,
    CAPTURE = 2,
    ALL = 3
}

export enum AudioDeviceState {
    ACTIVE = 1,
    DISABLED = 2,
    UNPLUGGED = 4,
    NOTPRESENT = 8,
    ALL = 15
}

export class System{

  /**
   * Gets audio devices, both input and output
   *
   * @return {Promise<AudioDevice[]>}
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
            if (device['name'].toLowerCase().indexOf('xsplit') > -1)
            {
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
   * Gets all camera devices
   *
   * #Return
   *
   * ```
   * Promise<CameraDevice[]>
   * ```
   *
   * #Usage
   *
   * ```
   * var promise = System.getCameraDevices();
   * promise.then(function(devices) {
   * 	 // devices is an array of CameraDevice object
   * });
   * ```
   */
  static getCameraDevices(): Promise<CameraDevice[]> {
    return new Promise(resolve => {
      iApp.getAsList('dshowenum:vsrc').then(devicesJSON => {
        let devices: CameraDevice[] = [];
        if (devicesJSON !== undefined) {
          for(let device of devicesJSON) {
            if (String(device['disp']).toLowerCase().indexOf('xsplit') === -1 &&
              String(device['disp']).toLowerCase() !==
              ("@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\" +
              "{778abfb2-e87b-48a2-8d33-675150fcf8a2}").toLowerCase()) {
              devices.push(CameraDevice.parse(device));
            }
          }

          resolve(devices);
        }
      });
    });
  }
  
  /**
   * Gets all currently running games
   *
   * @return {Promise<Game>}
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
}
