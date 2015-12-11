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
      iItem.get('prop:keep_ar', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setKeepAspectRatio(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      iItem.set('prop:keep_ar', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  isPositionLocked(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:lockmove', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setPositionLocked(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      iItem.set('prop:lockmove', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  isEnhancedResizeEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      iItem.get('prop:mipmaps', this._id).then(val => {
        resolve(val === '1');
      });
    });
  }

  setEnhancedResizeEnabled(value: boolean): Promise<ItemLayout> {
    return new Promise(resolve => {
      iItem.set('prop:mipmaps', value ? '1' : '0', this._id).then(() => {
        resolve(this);
      });
    });
  }

  getPosition():Promise<Rectangle> {
    return new Promise(resolve => {
      iItem.get('prop:pos', this._id).then(val => {
        var [left, top, right, bottom] = decodeURIComponent(val).split(',');
        this.position = Rectangle.fromCoordinates(Number(left), Number(top),
          Number(right), Number(bottom));
        resolve(this.position);
      });
    });
  }

  setPosition(value: Rectangle): Promise<ItemLayout> {
    return new Promise(resolve => {
      this.position = value;
        iItem.set('prop:pos', value.toCoordinateString(), this._id).then(() => {
          resolve(this);
      });
    });
  }

  getRotateY(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:rotate_y', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateY(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        iItem.set('prop:rotate_y', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateX(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:rotate_x', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateX(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        iItem.set('prop:rotate_x', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }

  getRotateZ(): Promise<number> {
    return new Promise(resolve => {
      iItem.get('prop:rotate_z', this._id).then(val => {
        resolve(Number(val));
      });
    });
  }

  setRotateZ(value: number): Promise<ItemLayout> {
    return new Promise((resolve, reject) => {
      if (value < -360 || value > 360) {
        reject(Error('Invalid value. Min: -360, Max: 360'));
      } else {
        iItem.set('prop:rotate_z', String(value), this._id).then(() => {
          resolve(this);
        });
      }
    });
  }
}
