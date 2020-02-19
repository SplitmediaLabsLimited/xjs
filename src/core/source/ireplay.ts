/// <reference path="../../../defs/es6-promise.d.ts" />

import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Scene} from '../scene';
import {XML} from '../../internal/util/xml';
import {Logger} from '../../internal/util/logger';

export interface ISourceReplay {

  getChannelName(): Promise<string> 

  setChannelName(channel: string): Promise<ISourceReplay>

  getHotkey(): Promise<number> 

  setHotkey(hotkey: number): Promise<ISourceReplay>

  getReplaytime(): Promise<number> 

  setReplaytime(buffer: number): Promise<ISourceReplay>

  startReplay(): Promise<ISourceReplay>

  stopReplay(): Promise<ISourceReplay>

  getReplayState(): Promise<string>
}

export class SourceReplay implements ISourceReplay {
  private _id: string;
  private _srcId: string;
  private _isItemCall: boolean;
  private _sceneId: string;
  protected _checkPromise;

  private _updateId(id?: string, sceneId?: string) {
    this._id = id;
    this._sceneId = sceneId;
  }

  getChannelName(): Promise<string> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getChannelName', true)
        this._checkPromise = iItem.get('prop:presproperty:channelName', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:presproperty:channelName', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise
      .then(channel => {
        resolve(channel);
      }).catch(err => reject(err));
    })
  }

  setChannelName(channel: string): Promise<SourceReplay> {
    return new Promise((resolve, reject) => {
      if (typeof channel === 'string') {
        if(this._isItemCall){
          Logger.warn('sourceWarning', 'setChannelName', true)
          iItem.set('prop:presproperty:channelName', channel, this._id)
            .then(val => {
              resolve(this);
            });
        } else {
          iItem.wrapSet('prop:presproperty:channelName', channel,
            this._srcId, this._id, this._updateId.bind(this))
            .then(val => {
              resolve(this);
            });
        }
      } else {
        reject(Error('Invalid parameter. setChannelName method only accepts channel name as a string.'));
      }
    })
  }

  getHotkey(): Promise<number> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getHotkey', true)
        this._checkPromise = iItem.get('prop:presproperty:hotkey', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:presproperty:hotkey', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise
      .then(hotkey => {
        resolve(Number(hotkey));
      }).catch(err => reject(err));
    })
  }

  setHotkey(hotkey: number): Promise<SourceReplay> {
    return new Promise((resolve, reject) => {
      if (typeof hotkey === 'number') {
        if(this._isItemCall){
          Logger.warn('sourceWarning', 'setHotkey', true)
          iItem.set('prop:presproperty:hotkey', String(hotkey), this._id)
            .then(val => {
              resolve(this);
            });
        } else {
          iItem.wrapSet('prop:presproperty:hotkey', String(hotkey),
            this._srcId, this._id, this._updateId.bind(this))
            .then(val => {
              resolve(this);
            });
        }
      } else {
        reject(Error('Invalid parameter. setHotkey method only accepts hotkey as a number.'));
      }
    })
  }

  getReplaytime(): Promise<number> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getReplaytime', true)
        this._checkPromise = iItem.get('prop:presproperty:buffer', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:presproperty:buffer', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise
      .then(buffer => {
        resolve(Number(buffer));
      }).catch(err => reject(err));
    })
  }

  setReplaytime(buffer: number): Promise<SourceReplay> {
    return new Promise((resolve, reject) => {
      if (typeof buffer === 'number') {
        if(this._isItemCall){
          Logger.warn('sourceWarning', 'setReplaytime', true)
          iItem.set('prop:presproperty:buffer', String(buffer), this._id)
            .then(val => {
              resolve(this);
            });
        } else {
          iItem.wrapSet('prop:presproperty:buffer', String(buffer),
            this._srcId, this._id, this._updateId.bind(this))
            .then(val => {
              resolve(this);
            });
        }
      } else {
        reject(Error('Invalid parameter. setReplaytime method only accepts buffer as a number.'));
      }
    })
  }

  startReplay(): Promise<SourceReplay> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'startReplay', true)
        iItem.set('prop:ReplayActive', '1', this._id)
          .then(val => {
            resolve(this);
          });
      } else {
        iItem.wrapSet('prop:ReplayActive', '1',
          this._srcId, this._id, this._updateId.bind(this))
          .then(val => {
            resolve(this);
          });
      }
    })
  }

  stopReplay(): Promise<SourceReplay> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'stopReplay', true)
        iItem.set('prop:ReplayActive', '0', this._id)
          .then(val => {
            resolve(this);
          });
      } else {
        iItem.wrapSet('prop:ReplayActive', '0',
          this._srcId, this._id, this._updateId.bind(this))
          .then(val => {
            resolve(this);
          });
      }
    })
  }

  getReplayState(): Promise<string> {
    return new Promise((resolve, reject) => {
      if(this._isItemCall){
        Logger.warn('sourceWarning', 'getReplayState', true)
        this._checkPromise = iItem.get('prop:ReplayActive', this._id)
      } else {
        this._checkPromise = iItem.wrapGet('prop:ReplayActive', this._srcId, this._id,
          this._updateId.bind(this))
      }
      this._checkPromise
      .then(activeState => resolve(activeState))
      .catch(err => reject(err));
    })
  }
}