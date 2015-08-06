/// <reference path="../../defs/es6-promise.d.ts" />

import {App as iApp} from '../internal/app';
import {CameraDevice} from './camera';

export class System {
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
            if (String(device['disp']).toLowerCase().indexOf('xsplit') === -1) {
              devices.push(CameraDevice.parse(device));
            }
          }

          resolve(devices);
        }
      });
    });
  }
}
