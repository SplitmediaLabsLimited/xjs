import {App as iApp} from '../internal/app';
import {JSON as JXON} from '../internal/util/json';

export class Channel {
  name: string;
  stat: JXON;
  channel: JXON;

  /** Channel constructor (only used internally) */
  constructor(props: {name: string, stat: JXON, channel: JXON}) {
    this.name = props.name;
    this.stat = props.stat;
    this.channel = props.channel;
  }

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
              stat: activeStreams[i].children[0],
              channel: activeStreams[i].children[1]
            }));
          }
          resolve(channels);
        }
      });
    });
  }

  /** return: Promise<Channel[]>
   *
   *  Gets the list of active stream channels.
   */

  /**
   * return: Promise<number>
   *
   * Gets the number of frames dropped */
  getStreamDrops(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('streamdrops:' + this.name).then(val => {
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
      iApp.get('streamdrops:' + this.name).then(val => {
        var drops: string[] = val.split(','),
        rendered: number = Number(drops[1]) || 0;

        resolve(rendered);
      });
    });
  }

  /**
   *
   * Gets the current duration of the stream in microseconds  */
  getStreamTime(): Promise<number> {
    return new Promise(resolve => {
      iApp.get('streamtime:' + this.name).then(val => {
         var duration: number = Number(val) / 10;

         resolve(duration);
      });
    });
  }
}
