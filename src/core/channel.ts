import {App as iApp} from '../internal/app';
import {JSON as JXON} from '../internal/util/json';
import {BroadcastManager} from './broadcastmanager';

export class Channel {
  private _name: string;
  private _stat: JXON;
  private _channel: JXON;

  /** Channel constructor (only used internally) */
  constructor(props: {name: string, stat: JXON, channel: JXON}) {
    this._name = props.name;
    this._stat = props.stat;
    this._channel = props.channel;
  }

  /**
   *  return: Promise<Channel[]>
   *
   *  Gets the list of currently active channels.
   */
  static getActiveStreamChannels(): Promise<Channel[]> {
    return new Promise(resolve => {
      iApp.getAsList('recstat').then(activeStreams => {
        if (activeStreams.length === 0) {
          resolve([]);
        } else {
          let channels = [];
          for (var i = 0; i < activeStreams.length; ++i) {
            channels.push(new Channel({
              name: activeStreams[i]['name'],
              stat: activeStreams[i].children.filter(child => {
                return child.tag.toLowerCase() === 'stat';
              })[0],
              channel: activeStreams[i].children.filter(child => {
                return child.tag.toLowerCase() === 'channel';
              })[0]
            }));
          }
          resolve(channels);
        }
      });
    });
  }

  /**
   *  return: Promise<string>
   *
   *  Gets the name of the channel.
   */
  getName(): Promise<string> {
    return new Promise(resolve => {
      resolve(this._name);
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets the number of frames dropped */
  getStreamDrops(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('streamdrops:' + this._name).then(val => {
        var drops: string[] = val.split(','),
        dropped: number = Number(drops[0]) || 0

        resolve(dropped);
      });
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets the number of frames rendered  */
  getStreamRenderedFrames(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('streamdrops:' + this._name).then(val => {
        var drops: string[] = val.split(','),
        rendered: number = Number(drops[1]) || 0;

        resolve(rendered);
      });
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets the current duration of the stream in microseconds  */
  getStreamTime(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('streamtime:' + this._name).then(val => {
         var duration: number = Number(val) / 10;

         resolve(duration);
      });
    });
  }

  /**
   * param: (id: string)
   * id refers to the item id of the source/extension caller
   *
   * Fetch all available Channels you can broadcast on based on your installed
   * Broadcast plugin.
   *
   * #### Usage:
   *
   * ```javascript
   * ChannelManager.getBroadcastChannelList('{AAAAAAAA-AAAA-1A1A-1111-AAAAAAAAAAAA}')
   * .then(function(channels) {
   *   // Use channels to Start Broadcast
   *   Broadcast.startBroadcast(channels[0], '{AAAAAAAA-AAAA-1A1A-1111-AAAAAAAAAAAA}')
   * })
   * ```
   *
   */
  static getBroadcastChannelList(id: string): Promise<Channel[]> {
    return new Promise(resolve => {
      BroadcastManager.getBroadcastChannels(id).then(result => {
        var resultArr = String(result).match(/"(?:[^"\\]|\\.)*"/g)
        for (var i = 0; i<resultArr.length; i++) {
          resultArr[i] = resultArr[i].replace(/["]+/g, '')
        }
        resolve(resultArr)
      })
    })
  }
}
