/// <reference path="../../defs/es6-promise.d.ts" />

import {Source} from '../core/source/source';
import {GameSource} from '../core/source/game';
import {CameraSource} from '../core/source/camera';
import {AudioSource} from '../core/source/audio';
import {VideoPlaylistSource} from '../core/source/videoplaylist';
import {HtmlSource} from '../core/source/html';
import {FlashSource} from '../core/source/flash';
import {ScreenSource} from '../core/source/screen';
import {ImageSource} from '../core/source/image';
import {ItemTypes} from '../core/source/isource';
import {MediaSource, MediaTypes} from '../core/source/media';

export function SourceTypeResolve(source: Object): any {
	let srcType;
  let type = Number(source['type']);
  if (type === ItemTypes.GAMESOURCE) {
    srcType = new GameSource(source);
  } else if ((type === ItemTypes.HTML || type === ItemTypes.FILE) &&
    source['name'].indexOf('Video Playlist') === 0 &&
    source['FilePlaylist'] !== ''){
    srcType = new VideoPlaylistSource(source);
  } else if (type === ItemTypes.HTML) {
    srcType = new HtmlSource(source);
  } else if (type === ItemTypes.SCREEN) {
    srcType = new ScreenSource(source);
  } else if (type === ItemTypes.BITMAP ||
      type === ItemTypes.FILE &&
      /\.gif$/.test(source['item'])) {
    srcType = new ImageSource(source);
  } else if (type === ItemTypes.FILE &&
      /\.(gif|xbs)$/.test(source['item']) === false &&
      /^(rtsp|rtmp):\/\//.test(source['item']) === false &&
      new RegExp(MediaTypes.join('|')).test(source['item']) === true) {
    srcType = new MediaSource(source);
  } else if (Number(source['type']) === ItemTypes.LIVE &&
    source['item'].indexOf(
      '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
    srcType = new CameraSource(source);
  } else if (Number(source['type']) === ItemTypes.LIVE &&
    source['item'].indexOf(
      '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
    srcType = new AudioSource(source);
  } else if (Number(source['type']) === ItemTypes.FLASHFILE) {
    srcType = new FlashSource(source);
  } else {
    srcType = new Source(source);
  }
  return srcType;
}