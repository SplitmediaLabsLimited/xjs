export interface ISourceVideoPlaylist {
    /**
     * return: Promise<string>
     *
     * Gets the now playing video of this VideoPlaylist item.
     */
    getVideoNowPlaying(): Promise<string>;
    /**
     * param: (value: string|number)
     *
     * return: Promise<VideoPlaylistSource>
     *
     * Sets the now playing video of this VideoPlaylist item.
     */
    setVideoNowPlaying(value: string | number): Promise<SourceVideoPlaylist>;
    /**
     * return: Promise<string[]>
     *
     * Gets the file paths of the playlist of this VideoPlaylist item.
     *
     */
    getVideoPlaylistSources(): Promise<string[]>;
    /**
     * param: (file: string[])
     *
     * return: Promise<string>
     *
     * Sets the playlist of this VideoPlaylist item according to the specified
     * file paths.
     */
    setVideoPlaylistSources(fileItems: string[]): Promise<SourceVideoPlaylist>;
    /**
     * return: Promise<boolean>
     *
     * Check if file used as source is available
     *
     * #### Usage
     *
     * ```javascript
     * item.isSourceAvailable().then(function(isAvail) {
     *   // The rest of your code here
     * });
     * ```
     */
    isSourceAvailable(): Promise<boolean>;
}
export declare class SourceVideoPlaylist implements ISourceVideoPlaylist {
    private _id;
    private _isItemCall;
    private _srcId;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    getVideoNowPlaying(): Promise<string>;
    setVideoNowPlaying(value: string | number): Promise<SourceVideoPlaylist>;
    getVideoPlaylistSources(): Promise<string[]>;
    setVideoPlaylistSources(fileItems: string[]): Promise<SourceVideoPlaylist>;
    isSourceAvailable(): Promise<boolean>;
}
