import {Item} from '../core/items/item';
import {GameItem} from '../core/items/game';
import {CameraItem} from '../core/items/camera';
import {AudioItem} from '../core/items/audio';
import {VideoPlaylistItem} from '../core/items/videoplaylist';
import {HtmlItem} from '../core/items/html';
import {FlashItem} from '../core/items/flash';
import {ScreenItem} from '../core/items/screen';
import {ImageItem} from '../core/items/image';
import {MediaItem} from '../core/items/media';
import {GenericItem} from '../core/items/genericitem';
import {GroupItem} from '../core/items/group';
import {ItemTypes} from '../core/source/isource';
import {MediaTypes} from '../core/source/media';

export function ItemTypeResolve(item: Object): any {
	let itemType;
  let type = Number(item['type']);
  if (type === ItemTypes.GAMESOURCE) {
    itemType = new GameItem(item);
  } else if ((type === ItemTypes.HTML || type === ItemTypes.FILE) &&
    item['name'].indexOf('Video Playlist') === 0 &&
    item['FilePlaylist'] !== '') {
    itemType = new VideoPlaylistItem(item);
  } else if (type === ItemTypes.HTML) {
    itemType = new HtmlItem(item);
  } else if (type === ItemTypes.SCREEN) {
    itemType = new ScreenItem(item);
  } else if (type === ItemTypes.BITMAP ||
    type === ItemTypes.FILE &&
    /\.gif$/.test(item['item'])) {
    itemType = new ImageItem(item);
  } else if (type === ItemTypes.FILE &&
      /\.(gif|xbs)$/.test(item['item']) === false &&
      /^(rtsp|rtmp):\/\//.test(item['item']) === false &&
      new RegExp(MediaTypes.join('|')).test(item['item']) === true) {
    itemType = new MediaItem(item);
  } else if (Number(item['type']) === ItemTypes.LIVE &&
    item['item'].indexOf(
      '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
    itemType = new CameraItem(item);
  } else if (Number(item['type']) === ItemTypes.LIVE &&
    item['item'].indexOf(
      '{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
    itemType = new AudioItem(item);
  } else if (Number(item['type']) === ItemTypes.FLASHFILE) {
    itemType = new FlashItem(item);
  } else if (Number(item['type']) === ItemTypes.GROUP) {
    itemType = new GroupItem(item);
  } else {
  	itemType = new GenericItem(item);
  }
  return itemType;
}