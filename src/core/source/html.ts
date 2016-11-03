/// <reference path="../../../defs/es6-promise.d.ts" />

import {applyMixins} from '../../internal/util/mixin';
import {Source} from '../source/source';
import {Item as iItem} from '../../internal/item';
import {Rectangle} from '../../util/rectangle';
import {exec} from '../../internal/internal';
import {Environment} from '../environment';
import {Item} from '../items/item';
import {ItemConfigurable, IItemConfigurable} from '../items/iconfig';

export class HtmlSource extends Source implements IItemConfigurable {
  // ItemConfigurable

  /**
   * See: {@link #core/IItemConfigurable#loadConfig loadConfig}
   */
  loadConfig: () => Promise<any>;

  /**
   * See: {@link #core/IItemConfigurable#saveConfig saveConfig}
   */
  saveConfig: (configObj: any) => Promise<HtmlSource>;

  /**
   * See: {@link #core/IItemConfigurable#requestSaveConfig requestSaveConfig}
   */
  requestSaveConfig: (configObj: any) => Promise<HtmlSource>;

  /**
   *
   * See: {@link #core/IItemConfigurable#applyConfig applyConfig}
   */
  applyConfig: (configObj: any) => Promise<HtmlSource>;

}

applyMixins(HtmlSource, [ItemConfigurable])