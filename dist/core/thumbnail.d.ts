export declare class Thumbnail {
    /**
     * param?: scene<id|Scene|undefined>
     * ```
     * return: Promise<string>
     * ```
     *
     * Returns a base64 png url of a specified or current scene.
     *
     * #### Usage
     *
     * ```javascript
     * var sceneThumbnail
     *
     * Thumbnail.getSceneThumbnail().then(function(image) {
     *   sceneThumbnail = image;
     *   // can be used as:
     *   // div.style.backgroundImage = 'url(data:image/png;base64, image)'
     * })
     */
    static getSceneThumbnail(scene?: any): Promise<string>;
}
