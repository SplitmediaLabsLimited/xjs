import {App as iApp} from '../internal/app';
import {JSON as JXON} from '../internal/util/json';
import {exec} from '../internal/internal';
import {XML} from '../internal/util/xml';

/**
 * The StreamInfo class provides methods to monitor the current active streams
 *  activity and other details.
 *
 * This can be used together with {@link #core/Output Output Class} and check
 * the details of the currently live outputs.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 *
 * xjs.ready()
 * .then(xjs.StreamInfo.getActiveStreamChannels)
 * .then(function(channels) {
 *   var stream = []
 *   channels.forEach(function(channel){
 *     channel.getName()
 *     .then(name => {
 *       if(name.includes('Twitch')) {
 *         stream.push(channel)
 *       }
 *     })
 *   })
 *   return stream
 * }).then(function(stream) {
 *   // Get any stream information you need here
 *   return stream[0].getStreamRenderedFrames()
 * })
 * ```
 */

export class StreamInfo {
  private _name: string;
  private _stat: JXON;
  private _channel: JXON;

  /** StreamInfo constructor (only used internally) */
  constructor(props: {name: string, stat: JXON, channel: JXON}) {
    this._name = props.name;
    this._stat = props.stat;
    this._channel = props.channel;
  }

  /**
   *  return: Promise<StreamInfo[]>
   *
   *  Gets the list of currently active channels.
   */
  static getActiveStreamChannels(): Promise<StreamInfo[]> {
    return new Promise(resolve => {
      iApp.getAsList('recstat').then(activeStreams => {
        if (activeStreams.length === 0) {
          resolve([]);
        } else {
          let channels = [];
          for (var i = 0; i < activeStreams.length; ++i) {
            channels.push(new StreamInfo({
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
      resolve(this._name
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&'));
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets the number of frames dropped
   */
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
   * Gets the number of GOP frames dropped
   */
  getGOPDrops(): Promise<number> {
    return new Promise(resolve => {
      let usage;
      iApp.getGlobalProperty('bandwidthusage-all').then(result => {
        usage = JSON.parse(result);
        for (var i = 0; i < usage.length; i++) {
          if (usage[i].ChannelName === this._name) {
            resolve(usage[i].Dropped)
          }
        }
      });
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets the number of frames rendered
   */
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
   * Gets the current duration of the stream in microseconds
   */
  getStreamTime(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('streamtime:' + this._name).then(val => {
         var duration: number = Number(val) / 10;
         resolve(duration);
      });
    });
  }

  /**
   * return: Promise<number>
   *
   * Gets the current bandwidth usage of the stream
   */
  getBandwidthUsage(): Promise<number> {
    return new Promise(resolve => {
      let usage;
      if (this._name !== 'Local Recording') {
        iApp.getGlobalProperty('bandwidthusage-all').then(result => {
          usage = JSON.parse(result);
          for (var i = 0; i < usage.length; i++) {
            if (usage[i].ChannelName === this._name) {
              resolve(usage[i].AvgBitrate)
            }
          }
        });
      } else {
        resolve(0)
      }
    });
  }
}
