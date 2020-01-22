/// <reference path="../../defs/es6-promise.d.ts" />

/**
 * The Filter class represents a post-processing shader used within XSplit Broadcaster.
 * This can be used to apply effects to videoitems.
 *
 * Simply use one of the available Filter objects such as Filter.BLUR or
 * Filter.SKETCHPENCILSTROKE as the parameter to the `setFilter()` method of an Item instance
 */
export class Filter {
  private _value: string;
  private _key: string;

  static _filterMap = {
    NONE: 'none',
    COOL: 'cool',
    WARM: 'warm',
    BLOOM: 'bloom',
    MONOCHROME: 'monochrome',
    INVERTCOLOR: 'invertcolor',
    OLDMOVIE: 'oldmovie',
    SKETCHPENCILSTROKE: 'sketchpencilstroke',
    MAGNIFYSMOOTH: 'magnifysmooth',
    BLUR: 'blur',
    LUT: 'lut',
  }

  static NONE: Filter =  new Filter('NONE');
  static COOL: Filter =  new Filter('COOL');
  static WARM: Filter =  new Filter('WARM');
  static BLOOM: Filter =  new Filter('BLOOM');
  static MONOCHROME: Filter =  new Filter('MONOCHROME');
  static INVERTCOLOR: Filter =  new Filter('INVERTCOLOR');
  static OLDMOVIE: Filter =  new Filter('OLDMOVIE');
  static SKETCHPENCILSTROKE: Filter =  new Filter('SKETCHPENCILSTROKE');
  static MAGNIFYSMOOTH: Filter =  new Filter('MAGNIFYSMOOTH');
  static BLUR: Filter =  new Filter('BLUR');
  static LUT: Filter =  new Filter('LUT');

  constructor(key: string) {
    var value = Filter._filterMap[key];

    if (typeof value !== 'undefined') {
      this._key = key; // retain key so that NONE is readable
      this._value = value;
    } else {
      this._key = key; // retain key so that NONE is readable
      this._value = key.toLowerCase();
    }
  }

  /**
   * Converts this transition object to the underlying string representation to be read by XSplit Broadcaster.
   */
  toString(): string {
    return this._value;
  }

  /**
   * Converts this transition object to a easily identifiable string such as 'NONE'.
   */
  toFilterKey(): string {
    return this._key;
  }

  /**
   * return: Promise<Filter[]>
   *
   * Get all available filters for use in videoitems
   *
   * ** MINIMUM XBC REQUIREMENT **
   * requires XBC v.3.9.1912.1002 and above
   *
   * #### Usage
   *
   * ```javascript
   * Filter.getFilters()
   * .then(function(filters) {
   *   for (var i = 0; i < filters.length; i++) {
   *     console.log(filters[i].toString(); // Returns the value of the filter
   *   }
   * })
   * ```
   */
  static getFilters(): Promise<Filter[]> {
    return new Promise(resolve => {
      var filters: Filter[] = [];
      let transitionString;
      // pending a core change,
      // we should override hardcoded filter list from a listing from core
      const filterKeys = Object.keys(Filter._filterMap);
      for (var i = 0; i < filterKeys.length; ++i) {
        filters.push(new Filter(Filter._filterMap[filterKeys[i]]))
      }
      resolve(filters);
    });
  }
}
