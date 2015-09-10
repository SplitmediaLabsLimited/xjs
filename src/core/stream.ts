/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from './environment';
import {App as iApp} from '../internal/app';
import {JSON as JXON} from '../internal/util/json';
import {XML} from '../internal/util/xml';

var streamStack = [];

/**
 * The Stream Class provides methods to start streaming or recording based
 * on the parameters passed to its constructor.
 *
 * ### Basic Usage (Recording)
 *
 * ```javascript
 * var xjs = require('xjs');
 * var rec = new xjs.Stream({ filename: 'myfile.mp4', filepath: 'D:\\MyVids' });
 * rec.start();
 * setTimeout(function() { rec.pause(); }, 10000);
 * setTimeout(function() { rec.stop(); }, 20000);
 * ```
 *
 * You'll notice that we just have to specify the filename and filepath and
 * then call the `start` method to start recording. Please make sure that
 * you call `stop` when you're done recording.
 *
 * ### Basic Usage (Streaming)
 *
 * ```javascript
 * var xjs = require('xjs');
 * var rec = new xjs.Stream({
 *   rtmpUrl: 'rtmp://somestreamurl',
 *   streamName: 'My Awesome Stream'
 * });
 * rec.start();
 * setTimeout(function() { rec.stop(); }, 20000);
 * ```
 *
 * That should get you started with streaming. Please do note that while it
 * would actually get you streaming, it will not update your XSplit Broadcaster's
 * titlebar to reflect that you are currently streaming. This is currently
 * a limitation.
 *
 * ### Basic Usage (Streaming with Carbon Copy)
 *
 * ```javascript
 * var xjs = require('xjs');
 * var rec = new xjs.Stream({
 *   filename: 'myfile.mp4',
 *   filepath: 'D:\\MyVids'
 *   rtmpUrl: 'rtmp://somestreamurl',
 *   streamName: 'My Awesome Stream'
 * });
 * rec.start();
 * setTimeout(function() { rec.stop(); }, 20000);
 * ```
 *
 * That would allow you to stream and at the same time, record your stream
 * locally.
 *
 * You can create multiple instances of the Stream class in case you want to
 * stream to multiple different rtmp urls.
 */
export class Stream {
  private _filename: string;
  private _filepath: string;
  private _rtmpUrl: string;
  private _streamName: string;
  private _id: string;

  // Extra Configuration options
  private _rtmp2Ch: number = 0;
  private _rtmpBuf: number = -1;
  private _rtmpOpt: number = -1;
  private _rtmpMaxLat: number = -1;
  private _optFastStart: number = 1;
  private _mux: number = 16777216;

  // Video Configuration options
  private _videoCodec: string = 'libx264ext';
  private _videoQuality: string = 'standard';
  private _videoBitrate: number = 2100;
  private _videoFramerate: number = 30;
  private _videoFrametime: number = Math.ceil(10000000 / this._videoFramerate);
  private _videoAdaptiveBitrate: number;
  private _videoMaxBitrate: string;
  private _videoUseMixerFPS: number = 0;

  // Audio Configuration options
  private _audioCodec: string = 'libw7aac';
  private _audioBitrate: number = 96000;
  private _audioFormat: string = '44100/1';
  private _audioFormat2: string = '44100/1';

  // Supported codecs
  private static _supportedCodecs = {
    x264: 'libx264ext',
    quickSync: 'libh264qsext',
    vce: 'libh264vceext',
    openh264: 'libh264openext',
    nvenc: 'libh264nvext',
    h264aver: 'libh264aver'
  };

  // Video Quality
  static recordQuality = {
    STANDARD: 'standard',
    HIGH: 'high',
    VERY_HIGH: 'very_high',
    ULTRA_HIGH: 'ultra_high'
  }

  constructor(options: {
    filename?: string,
    filepath?: string,
    rtmpUrl?: string,
    streamName?: string
  }) {
    if (Environment.isSourcePlugin()) {
      throw new Error('Cannot start/stop stream or recording on source plugins');
    }

    this._filename = options.filename || '';
    this._filepath = options.filepath || '';
    this._rtmpUrl = options.rtmpUrl || 'rtmp://nomaster';
    this._streamName = options.streamName || '';

    // Change the file extension depending on the rtmp url (if record or stream)
    let fileExt = /\.[a-z0-9]+$/ig.exec(this._filename);
    if (fileExt.length > 0 && this._rtmpUrl !== 'rtmp://nomaster') {
      let extRegex = new RegExp(fileExt[0] + '$', 'ig');
      this._filename = this._filename.replace(extRegex, '.flv');
    } else if (this._rtmpUrl !== 'rtmp://nomaster') {
      this._filename += '.flv';
    }

    // Add Trailing backslash on the filepath
    if (this._filepath.trim() !== '' && this._filepath.substr(-1) !== '\\') {
      this._filepath += '\\';
    }

    this._id = this.generateID();
  }

  /**
   * param: { rtmp2Ch: boolean, rtmpBuf: number, rtmpOpt: boolean, rtmpMaxLat: number}
   *
   * Set Streaming configuration.
   */
  setStreamConfiguration(obj: {
    rtmp2Ch?: boolean,
    rtmpBuf?: number,
    rtmpOpt?: boolean,
    rtmpMaxLat?: number
  }) {
    for (let i in obj) {
      if (this.hasOwnProperty('_' + i)) {
        this['_' + i] = typeof obj[i] === 'boolean' ? (obj[i] ? 1 : 0) : obj[i];
      }
    }
  }

  /**
   * param: { codec: string, framerate: number, adaptiveBitrate: boolean, maxBitrate: string, useMixerFPS: boolean }
   *
   * Set Video Configuration (advanced usage)
   */
  setVideoConfiguration(obj: {
    codec?: string,
    framerate?: number,
    frametime?: number,
    adaptiveBitrate?: boolean,
    maxBitrate?: string,
    useMixerFPS?: boolean
  }) {
    let attr = '';
    for (let i in obj) {
      attr = i.charAt(0).toUpperCase() + i.slice(1);
      if (this.hasOwnProperty('_video' + attr)) {
        this['_video' + attr] = typeof obj[i] === 'boolean' ?
          (obj[i] ? 1 : 0) : obj[i];
        if (i === 'framerate') {
          this._videoFrametime = Math.ceil(10000000 / this._videoFramerate);
        } else if (i === 'frametime') {
          this._videoFramerate = Math.ceil(10000000 / this._videoFrametime)
        }
      }
    }
  }

  /**
   * param: { codec: string, bitrate: number, format: number, format2: number }
   *
   * Set Audio Configuration (advanced usage)
   */
  setAudioConfiguration(obj: {
    codec?: string,
    bitrate?: number,
    format?: number,
    format2?: number
  }) {
    let attr = '';
    for (let i in obj) {
      attr = i.charAt(0).toUpperCase() + i.slice(1);
      if (this.hasOwnProperty('_audio' + attr)) {
        this['_audio' + attr] = typeof obj[i] === 'boolean' ?
          (obj[i] ? 1 : 0) : obj[i];
      }
    }
  }

  /**
   * param: codec<string>
   *
   * Set the video codec, currently we only support x264.
   */
  setVideoCodec(codec: string) {
    if (Stream._supportedCodecs[codec.toLowerCase()] === undefined) {
      return;
    }

    this._videoCodec = codec.toLowerCase();
  }

  /**
   * param: quality<string>
   *
   * Set the video quality. Valid qualities:
   *
   * - STANDARD
   * - HIGH
   * - VERY_HIGH
   * - ULTRA_HIGH
   */
  setRecordingQuality(quality: string) {
    if (Stream.recordQuality[quality] === undefined) {
      return;
    }

    this._videoQuality = quality;
  }

  /**
   * param: bitrate<number>
   *
   * Set streaming bitrate
   */
  setStreamingBitrate(bitrate: number) {
    this._videoBitrate = bitrate;
  }

  /**
   * return: Promise<boolean>
   *
   * Start recording or streaming
   */
  start(): Promise<boolean> {
    let fileType = this._rtmpUrl === 'rtmp://nomaster' ? 'mp4' : 'flv';
    let file = this._filepath ? this._filepath + this._filename : this._filename;

    // Configure the extra config value
    let extraConfig = '\\rtmp_2ch:' + (fileType === 'mp4' ? 1 : this._rtmp2Ch);
    let configKeys = {
      _rtmpBuf: 'rtmp_buf',
      _rtmpOpt: 'rtmp_h264opt',
      _rtmpMaxLat: 'rtmp_maxlat',
      _optFastStart: 'opt_faststart',
      _mux: 'mux:movflags:frag_keyframe+empty_moov&amp;frag_size'
    };

    for (let i in configKeys) {
      if (this[i] !== -1) {
        extraConfig += '\\' + '' + configKeys[i] + ':' + this[i];
      }
    }

    // Actual streaming JSON object
    let jsonObj = new JXON();
    jsonObj['tag'] = 'channel';
    jsonObj['name'] = this._id;
    jsonObj['rtmpUrl'] = this._rtmpUrl;
    jsonObj['streamName'] = this._streamName;
    jsonObj['filetype'] = fileType;
    jsonObj['file'] = fileType === 'mp4' ? 'mp4:' + file : file;
    jsonObj['watermark'] = 0;
    jsonObj['extraConfig'] = extraConfig;
    jsonObj.children = [];

    // Configuration tag
    let configTag = new JXON();
    configTag['tag'] = 'configuration';
    configTag.children = [];

    // Video tag
    let videoTag = new JXON();
    videoTag['tag'] = 'video';
    videoTag['selfclosing'] = true;
    // Recordings are automatically set to mp4 if mode is recording
    videoTag['codec'] = this.generateCodecString(fileType === 'mp4');
    videoTag['frametime'] = this._videoFrametime;
    videoTag['adaptivebr'] = this._videoAdaptiveBitrate;
    videoTag['maxBitrate'] = this._videoMaxBitrate ? this._videoMaxBitrate : '';
    videoTag['dontUseDefaultMixerFPS'] = this._videoUseMixerFPS === 0 ? 1 : 0;

    // Audio tag
    let audioTag = new JXON();
    audioTag['tag'] = 'audio';
    audioTag['selfclosing'] = true;
    audioTag['bitrate'] = this._audioBitrate;
    audioTag['codec'] = this._audioCodec + '&amp;b:' + this._audioBitrate;
    audioTag['format'] = this._audioFormat;
    audioTag['format2'] = this._audioFormat2;

    // Set children tags
    configTag.children.push(videoTag, audioTag);
    jsonObj.children.push(configTag);

    // Send to XBC
    let streamStr = XML.parseJSON(jsonObj).toString();
    return new Promise(resolve => {
      iApp.callFunc('startstream', streamStr).then(res => {
        resolve(Number(res) === 0);
      });
    })
  }

  /**
   * return: Promise<number>
   *
   * Pause recording
   */
  pause(): Promise<number> {
    let configTag = new JXON();
    configTag['tag'] = 'configuration';
    configTag['name'] = this._id;
    configTag['run'] = 2;
    return new Promise(resolve => {
      iApp.callFunc('changestream', XML.parseJSON(configTag).toString())
        .then(res => {
          resolve(res);
        });
    });
  }

  /**
   * return: Promise<number>
   *
   * Resume recording
   */
  resume(): Promise<number> {
    let configTag = new JXON();
    configTag['tag'] = 'configuration';
    configTag['name'] = this._id;
    configTag['run'] = 1;
    return new Promise(resolve => {
      iApp.callFunc('changestream', XML.parseJSON(configTag).toString())
        .then(res => {
          resolve(res);
        });
    });
  }

  /**
   * return: Promise<number>
   *
   * Stop recording or streaming
   */
  stop(): Promise<number> {
    return new Promise(resolve => {
      iApp.callFunc('stopstream', this._id).then(res => {
        resolve(res);
      });
    });
  }

  private generateID(): string {
    let rand = Math.floor(Math.random() * 10000);
    let name = 'stream-' + rand;

    if (streamStack.indexOf(name) !== -1) {
      name = this.generateID();
    } else {
      streamStack.push(name);
    }

    return name;
  }

  private generateCodecString(isRecording: boolean): string {
    let codeStr = this._videoCodec;
    switch (this._videoCodec) {
      // For now, we'll only support x264 codecs, since we have no way for
      // checking if the codec is available on the current machine.
      // We're only sure that x264 is always available on any machine that
      // supports XSplit
      case 'libx264ext':
      default:
        let crfs = { standard: 23, high: 21, very_high: 18, ultra_high: 16 };
        if (isRecording) {
          codeStr += '&amp;ex:preset:veryfast&amp;ex:crf:'
          + crfs[this._videoQuality] + '&amp;ex:fps:' + '10000000/'
          + this._videoFrametime;
        } else {
          codeStr += '&amp;ex:preset:veryfast&amp;ex:vbv-maxrate:'
          + this._videoBitrate + '&amp;ex:vbv-bufsize:' + this._videoBitrate
          + '&amp;ex:keyint:' + (this._videoFramerate * 2) + '&amp;ex:fps:'
          + '10000000/' + this._videoFrametime;
        }
        break;
    }

    return codeStr;
  }
}
