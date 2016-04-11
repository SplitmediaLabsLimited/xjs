/// <reference path="../../../defs/es6-promise.d.ts" />


import {HtmlItem} from '../items/html';

/**
 * > #### For Deprecation
 * This Class is deprecated and will be removed soon. Please use
 * {@link #core/HtmlItem HtmlItem} instead.
 *
 * *This Class extends {@link #core/HtmlItem HtmlItem} Class. Please check
 * HtmlItem Class for the available methods.*
 */
export class HtmlSource extends HtmlItem {
  constructor(props: {}) {
    console.warn('Warning! This Class is deprecated and will be removed soon.' +
      ' Please use HtmlItem Class instead');
    super(props);
  }
}
