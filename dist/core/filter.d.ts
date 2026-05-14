/**
 * The Filter class represents a post-processing shader used within XSplit Broadcaster.
 * This can be used to apply effects to videoitems.
 *
 * Simply use one of the available Filter objects such as Filter.BLUR or
 * Filter.SKETCHPENCILSTROKE as the parameter to the `setFilter()` method of an Item instance
 */
export declare class Filter {
    private _value;
    private _key;
    static _filterMap: {
        NONE: string;
        COOL: string;
        WARM: string;
        BLOOM: string;
        MONOCHROME: string;
        INVERTCOLOR: string;
        OLDMOVIE: string;
        SKETCHPENCILSTROKE: string;
        MAGNIFYSMOOTH: string;
        BLUR: string;
        LUT: string;
    };
    static NONE: Filter;
    static COOL: Filter;
    static WARM: Filter;
    static BLOOM: Filter;
    static MONOCHROME: Filter;
    static INVERTCOLOR: Filter;
    static OLDMOVIE: Filter;
    static SKETCHPENCILSTROKE: Filter;
    static MAGNIFYSMOOTH: Filter;
    static BLUR: Filter;
    static LUT: Filter;
    constructor(key: string);
    /**
     * Converts this transition object to the underlying string representation to be read by XSplit Broadcaster.
     */
    toString(): string;
    /**
     * Converts this transition object to a easily identifiable string such as 'NONE'.
     */
    toFilterKey(): string;
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
    static getFilters(): Promise<Filter[]>;
}
