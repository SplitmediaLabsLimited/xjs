/// <reference path="../../defs/es6-promise.d.ts" />

import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';

export class CameraDevice {
  private id: string;
  private name: string;

  constructor(props?: {}) {
    this.id   = props['id'];
    this.name = props['name'];
  }

  /**
   * Get the ID of the device. The ID of the device is based on the `disp`
   * attribute of the devices XML
   *
   * #Return
   *
   * ```
   * string
   * ```
   *
   * #Usage
   *
   * ```
   * var cameraID = device.getID();
   * ```
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get the Name of the device.
   *
   * #Return
   *
   * ```
   * string
   * ```
   *
   * #Usage
   *
   * ```
   * var cameraName = device.getName();
   * ```
   */
  getName(): string {
    return this.name;
  }

  /**
   * Convert the current CameraDevice object to XML
   *
   * #Return
   *
   * ```
   * XML
   * ```
   *
   * #Usage
   *
   * ```
   * var xml = device.toXML();
   * ```
   */
  toXML(): XML {
    var json = new JXON();
    json['disp'] = this.id;
    json['name'] = this.name;
    return XML.parseJSON(json);
  }

  /**
   * Create a CameraDevice object based on a JXON object
   *
   * #Parameter
   *
   * ```
   * deviceJSON: JXON
   * ```
   *
   * #Return
   *
   * ```
   * CameraDevice
   * ```
   *
   * #Usage
   *
   * ```
   * var camera = CameraDevice.parse(JSONObj);
   * ```
   */
  static parse(deviceJSON: JXON): CameraDevice {
    var cam = new CameraDevice({
      id:   deviceJSON['disp'],
      name: deviceJSON['name']
    });

    return cam;
  }
}
