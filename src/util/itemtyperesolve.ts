import { AudioItem } from '../core/items/audio';
import { CameraItem } from '../core/items/camera';
import { FlashItem } from '../core/items/flash';
import { GameItem } from '../core/items/game';
import { GenericItem } from '../core/items/genericitem';
import { GroupItem } from '../core/items/group';
import { HtmlItem } from '../core/items/html';
import { ImageItem } from '../core/items/image';
import type { Item } from '../core/items/item';
import { MediaItem } from '../core/items/media';
import { ReplayItem } from '../core/items/replay';
import { SceneItem } from '../core/items/sceneitem';
import { ScreenItem } from '../core/items/screen';
import { VideoPlaylistItem } from '../core/items/videoplaylist';
import { AUDIO_REGEX, VIDEO_REGEX } from '../core/source/iplayback';
import { ItemTypes } from '../core/source/isource';

export function ItemTypeResolve(item: Object): Item {
  let itemType;
  const type = Number(item['type']);
  const itemValue = item['item'];
  const uppercaseValue = itemValue.toUpperCase();

  if (type === ItemTypes.GAMESOURCE) {
    itemType = new GameItem(item);
  } else if (
    (type === ItemTypes.HTML || type === ItemTypes.FILE) &&
    item['name'].indexOf('Video Playlist') === 0 &&
    item['FilePlaylist'] !== ''
  ) {
    itemType = new VideoPlaylistItem(item);
  } else if (type === ItemTypes.HTML) {
    itemType = new HtmlItem(item);
  } else if (type === ItemTypes.SCREEN) {
    itemType = new ScreenItem(item);
  } else if (type === ItemTypes.BITMAP || (type === ItemTypes.FILE && /\.gif$/i.test(itemValue))) {
    itemType = new ImageItem(item);
  } else if (
    type === ItemTypes.FILE &&
    /\.(gif|xbs)$/i.test(itemValue) === false &&
    /^(rtsp|rtmp):\/\//i.test(itemValue) === false &&
    (VIDEO_REGEX.test(itemValue.split('*')[0]) || AUDIO_REGEX.test(itemValue.split('*')[0]))
  ) {
    itemType = new MediaItem(item);
  } else if (
    type === ItemTypes.LIVE &&
    uppercaseValue.indexOf('{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1
  ) {
    itemType = new CameraItem(item);
  } else if (
    type === ItemTypes.LIVE &&
    uppercaseValue.indexOf('{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1
  ) {
    itemType = new AudioItem(item);
  } else if (type === ItemTypes.FLASHFILE) {
    itemType = new FlashItem(item);
  } else if (type === ItemTypes.SCENE || type === ItemTypes.VIEW) {
    itemType = new SceneItem(item);
  } else if (type === ItemTypes.GROUP) {
    itemType = new GroupItem(item);
  } else if (type === ItemTypes.REPLAY) {
    itemType = new ReplayItem(item);
  } else {
    itemType = new GenericItem(item);
  }
  return itemType;
}
