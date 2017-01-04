import {App as iApp} from '../internal/app';
import {JSON as JXON} from '../internal/util/json';


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
}
