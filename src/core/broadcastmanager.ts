import {exec} from '../internal/internal';
import {EventManager} from '../internal/eventmanager';

export class BroadcastManager {
  static _callback = {}

  static getBroadcastChannels(id:string) {
    return new Promise(resolve => {
      exec('CallHost', 'getBroadcastChannelList:'+id)
      BroadcastManager._callback[id].push({resolve})
    })
  }
}

window.SetBroadcastChannelList = function(channels: string) {
  console.log('Channels::', channels)
  BroadcastManager._callback[channels].resolve(channels);
}

