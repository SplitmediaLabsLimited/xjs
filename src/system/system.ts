/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {AudioDevice as AudioDevice} from './audio';

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
}
