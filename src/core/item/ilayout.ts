/// <reference path="../../../defs/es6-promise.d.ts" />

import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';


export interface IItemLayout {
  isKeepAspectRatio(): Promise<boolean>;
  setKeepAspectRatio(value: boolean): Promise<IItemLayout>;
  isPositionLocked(): Promise<boolean>;
  setPositionLocked(value: boolean): Promise<IItemLayout>;
  isEnhancedResizeEnabled(): Promise<boolean>;
  setEnhancedResizeEnabled(value: boolean): Promise<IItemLayout>;
  getPosition(): Promise<Rectangle>;
  setPosition(value: Rectangle): Promise<IItemLayout>;
}

export class ItemLayout implements IItemLayout {
  private _id: string;
  private position: Rectangle;

  isKeepAspectRatio(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:keep_ar', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setKeepAspectRatio(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:keep_ar', value ? '1' : '0', slot).then(() => {
        resolve(this);
      });
    });
  }

  isPositionLocked(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:lockmove', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setPositionLocked(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:lockmove', value ? '1' : '0', slot).then(() => {
        resolve(this);
      });
    });
  }

  isEnhancedResizeEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:mipmaps', slot).then(val => {
        resolve(val === '1');
      });
    });
  }

  setEnhancedResizeEnabled(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.set('prop:mipmaps', value ? '1' : '0', slot).then(() => {
        resolve(this);
      });
    });
  }

  getPosition():Promise<Rectangle> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:pos', slot).then(val => {
        var [left, top, right, bottom] = decodeURIComponent(val).split(',');
        this.position = Rectangle.fromCoordinates(Number(left), Number(top),
          Number(right), Number(bottom));
        resolve(this.position);
      });
    });
  }

  setPosition(value: Rectangle): Promise<ItemLayout> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      this.position = value;
      iItem.set('prop:pos', value.toCoordinateString(), slot).then(() => {
        resolve(this);
      });
    });
  }

  getRotateY(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:rotate_y', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateY(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:rotate_y', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateX(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:rotate_x', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateX(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:rotate_x', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateZ(): Promise<number> {
    return new Promise(resolve => {
      let slot = iItem.attach(this._id);
      iItem.get('prop:rotate_z', slot).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateZ(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        let slot = iItem.attach(this._id);
        iItem.set('prop:rotate_z', String(value), slot).then(() => {
          resolve(this);
        });
      }
    });
  }
}
