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
import {ReplaySource} from '../core/source/replay';
import {SceneSource} from '../core/source/scenesource';
import {ItemTypes} from '../core/source/isource';
import {MediaSource} from '../core/source/media';
import {VIDEO_REGEX, AUDIO_REGEX} from '../core/source/iplayback';

export function SourceTypeResolve(source: Object): any {
	let srcType;
  const type = Number(source['type']);
  const sourceValue = source['item'];
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
      /\.gif$/.test(sourceValue)) {
    srcType = new ImageSource(source);
  } else if (type === ItemTypes.FILE &&
      /\.(gif|xbs)$/.test(sourceValue) === false &&
      /^(rtsp|rtmp):\/\//.test(sourceValue) === false &&
      (VIDEO_REGEX.test(sourceValue.split('*')[0]) ||
        AUDIO_REGEX.test(sourceValue.split('*')[0]))
    ) {
    srcType = new MediaSource(source);
  } else if (type === ItemTypes.LIVE &&
    sourceValue.indexOf(
      '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
    srcType = new CameraSource(source);
  } else if (type === ItemTypes.LIVE &&
    sourceValue.indexOf(
      '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
    srcType = new AudioSource(source);
  } else if (type === ItemTypes.FLASHFILE) {
    srcType = new FlashSource(source);
  } else if (type === ItemTypes.REPLAY) {
    srcType = new ReplaySource(source);
  } else if (type === ItemTypes.SCENE || type === ItemTypes.VIEW) {
    srcType = new SceneSource(source);
  } else {
    srcType = new Source(source);
  }
  return srcType;
}