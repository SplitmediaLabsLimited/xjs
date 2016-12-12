import {exec} from '../internal/internal';
import {EventManager} from '../internal/eventmanager';

export class BroadcastManager {
  static _callback = {};
  static _id:string

  static getBroadcastChannels(id:string) {
    BroadcastManager._id = id;
    return new Promise((resolve, reject) => {
      let isID: boolean = /^{[A-F0-9\-]*}$/i.test(BroadcastManager._id);
      if (!isID) {
        reject(Error('Not a valid ID format for items'));
      } else {
        if (BroadcastManager._callback[BroadcastManager._id] === undefined){
          BroadcastManager._callback[BroadcastManager._id] = [];
        }
        BroadcastManager._callback[BroadcastManager._id].push({resolve,reject});
        exec('CallHost', 'getBroadcastChannelList:'+BroadcastManager._id)
      }
    })
  }
}

window.SetBroadcastChannelList = function(channels) {
  console.log('Channels::', channels)
  BroadcastManager._callback[BroadcastManager._id].resolve(channels)
}
