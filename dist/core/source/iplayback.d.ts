import { CuePoint } from './cuepoint';
/**
 *  Used by sources that implement the Playback interface.
 */
export declare enum ActionAfterPlayback {
    NONE = 0,
    REWIND = 1,
    LOOP = 2,
    TRANSPARENT = 3,
    HIDE = 4
}
export declare const AUDIO_REGEX: RegExp;
export declare const VIDEO_REGEX: RegExp;
export interface ISourcePlayback {
    /**
     * return: Promise<boolean>
     *
     * Determines if it is possible to move the playback position of this media
     * source. It is possible for some video formats to not allow seeking of the
     * playback position.
     */
    isSeekable(): Promise<boolean>;
    /**
     * return: Promise<number>
     *
     * Gets the playback position of this source in seconds. The system can
     * store precision up to 100ns.
     */
    getPlaybackPosition(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets the playback position of this source. Parameter is in seconds, up to
     * a precision level of 100ns.
     *
     * *Chainable.*
     */
    setPlaybackPosition(value: number): Promise<ISourcePlayback>;
    /**
     * return: Promise<number>
     *
     * Gets the total playback duration of this source in seconds. Precision is up
     * to 100ns units.
     */
    getPlaybackDuration(): Promise<number>;
    /**
     * return: Promise<boolean>
     *
     * Checks if current source is playing.
     */
    isPlaying(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Plays (or pauses playback for) this source.
     *
     * *Chainable.*
     */
    setPlaying(value: boolean): Promise<ISourcePlayback>;
    /**
     * return: Promise<number>
     *
     * Gets the specified start position in seconds for this source, with precision
     * up to 100ns. If this source loops or is set to rewind, the playback position
     * will return to the start position.
     */
    getPlaybackStartPosition(): Promise<number>;
    /**
     * return: Promise<number>
     *
     * Sets the specified start position in seconds for this source, with precision
     * up to 100ns. If this source loops or is set to rewind, the playback position
     * will return to the start position.
     *
     * *Chainable.*
     */
    setPlaybackStartPosition(value: number): Promise<ISourcePlayback>;
    /**
     * return: Promise<number>
     *
     * Gets the specified end position in seconds for this source, with precision
     * up to 100ns. If playback reaches the end position, this source will then
     * execute the specified action after playback (rewind, loop, etc.)
     */
    getPlaybackEndPosition(): Promise<number>;
    /**
     * return: Promise<number>
     *
     * Sets the specified end position in seconds for this source, with precision
     * up to 100ns. If playback reaches the end position, this source will then
     * execute the specified action after playback (rewind, loop, etc.)
     *
     * *Chainable.*
     */
    setPlaybackEndPosition(value: number): Promise<ISourcePlayback>;
    /**
     * return: Promise<ActionAfterPlayback>
     *
     * Gets the specified action after playback for this source is done (either
     * playback reaches the end of the video, or the specified playback end
     * position.)
     *
     * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
     */
    getActionAfterPlayback(): Promise<ActionAfterPlayback>;
    /**
     * param: (value: ActionAfterPlayback)
     *
     * Sets the action to be executed on this source once playback is done (either
     * playback reaches the end of the video, or the specified playback end
     * position.)
     *
     * *Chainable.*
     *
     * See also: {@link #core/ActionAfterPlayback Core/ActionAfterPlayback}
     */
    setActionAfterPlayback(value: ActionAfterPlayback): Promise<ISourcePlayback>;
    /**
     * return: Promise<boolean>
     *
     * Checks whether this source is set to start playback when the application
     * switches to this source's scene.
     */
    isAutostartOnSceneLoad(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Specifies whether this source is set to start playback when the application
     * switches to this source's scene.
     *
     * *Chainable.*
     */
    setAutostartOnSceneLoad(value: boolean): Promise<ISourcePlayback>;
    /**
     * return: Promise<boolean>
     *
     * Checks whether Force Deinterlace is active.
     */
    isForceDeinterlace(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Sets the Force Deinterlace setting.
     *
     * *Chainable.*
     */
    setForceDeinterlace(value: boolean): Promise<ISourcePlayback>;
    /**
     * return: Promise<boolean>
     *
     * Check whether this source should retain its playback position when switching
     * scenes.
     */
    isRememberingPlaybackPosition(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Sets whether this source should retain its playback position when switching
     * scenes.
     *
     * *Chainable.*
     */
    setRememberingPlaybackPosition(value: boolean): Promise<ISourcePlayback>;
    /**
     * return: Promise<boolean>
     *
     * Checks if this source is set to display its playback position.
     */
    isShowingPlaybackPosition(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Sets whether this source should display its playback position.
     *
     * *Chainable.*
     */
    setShowingPlaybackPosition(value: boolean): Promise<ISourcePlayback>;
    /**
     * return: Promise<CuePoint[]>
     *
     * Gets the set of Cue Points created for this source.
     *
     * See also: {@link #core/CuePoint Core/CuePoint}
     */
    getCuePoints(): Promise<CuePoint[]>;
    /**
     * param: (value: CuePoint[])
     *
     * Assign the specified array of Cue Points for this source.
     *
     * *Chainable.*
     *
     * See also: {@link #core/CuePoint Core/CuePoint}
     */
    setCuePoints(value: CuePoint[]): Promise<ISourcePlayback>;
    /**
     * return: Promise<string>
     *
     * Gets the URL path of the media file used as a source
     *
     *
     * #### Usage
     *
     * ```javascript
     * source.getValue().then(function(value) {
     *   // Do something with the value
     * });
     * ```
     */
    getValue(): Promise<string>;
    /**
     * param: (value: string)
     * ```
     * return: Promise<ISourcePlayback>
     * ```
     *
     * Set the media file to be used as source
     *
     * #### Usage
     *
     * ```javascript
     * source.setValue('C:\\SomeFolder\\SomeFile.mp4')
     *   .then(function(source) {
     *   // Promise resolves with same Source instance
     * });
     * ```
     */
    setValue(value: string): Promise<any>;
    /**
     * return: Promise<boolean>
     *
     * Checks if this source's file type is an audio file type.
     */
    isAudio(): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Checks if this source's file type is a video file type.
     */
    isVideo(): Promise<boolean>;
}
export declare class SourcePlayback implements ISourcePlayback {
    private _id;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    isSeekable(): Promise<boolean>;
    getPlaybackPosition(): Promise<number>;
    setPlaybackPosition(value: number): Promise<SourcePlayback>;
    getPlaybackDuration(): Promise<number>;
    isPlaying(): Promise<boolean>;
    setPlaying(value: boolean): Promise<SourcePlayback>;
    getPlaybackStartPosition(): Promise<number>;
    setPlaybackStartPosition(value: number): Promise<SourcePlayback>;
    getPlaybackEndPosition(): Promise<number>;
    setPlaybackEndPosition(value: number): Promise<SourcePlayback>;
    getActionAfterPlayback(): Promise<ActionAfterPlayback>;
    setActionAfterPlayback(value: ActionAfterPlayback): Promise<SourcePlayback>;
    isAutostartOnSceneLoad(): Promise<boolean>;
    setAutostartOnSceneLoad(value: boolean): Promise<SourcePlayback>;
    isForceDeinterlace(): Promise<boolean>;
    setForceDeinterlace(value: boolean): Promise<SourcePlayback>;
    isRememberingPlaybackPosition(): Promise<boolean>;
    setRememberingPlaybackPosition(value: boolean): Promise<SourcePlayback>;
    isShowingPlaybackPosition(): Promise<boolean>;
    setShowingPlaybackPosition(value: boolean): Promise<SourcePlayback>;
    getCuePoints(): Promise<CuePoint[]>;
    setCuePoints(cuePoints: CuePoint[]): Promise<SourcePlayback>;
    isAudio(): Promise<boolean>;
    isVideo(): Promise<boolean>;
    getValue(): Promise<string>;
    setValue(filename: string): Promise<SourcePlayback>;
}
