import {exec} from '../internal/internal';
import {EventManager} from '../internal/eventmanager';

/**
 *   The BroadcastManager clss allows limited access to getting available
 *   boradcast channels that is set in Xsplit Broadcaster.
 */

export class BroadcastManager {
  static _callback = {};
  static _id:string

  /**
   *   param: (id: string)
   *
   *   id refers to the item id of the source/extension caller
   *
   *   Get broadcast channels
   *
   *   #### Usage
   *
   *   ```javascript
   *   var xjs = require('xjs')
   *
   *   xjs.BroadcastManager.getBroadcastChannels('{AAAAAAAA-AAAA-1A1A-1111-AAAAAAAAAAAA}')
   *   ```
   */
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
        BroadcastManager._callback[BroadcastManager._id] = ({resolve});
        exec('CallHost', 'getBroadcastChannelList:'+BroadcastManager._id)
      }
    })
  }
}

window.SetBroadcastChannelList = function(channels) {
  BroadcastManager._callback[BroadcastManager._id].resolve(channels)
}
