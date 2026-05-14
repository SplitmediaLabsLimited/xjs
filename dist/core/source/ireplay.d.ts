export interface ISourceReplay {
    /**
     * return: Promise<string>
     *
     * Gets the name of the stream/channel tied to the replay.
     */
    getChannel(): Promise<string>;
    /**
     * param: (channel: string)
     * ```
     * return: Promise<ISourceReplay>
     * ```
     *
     * Sets the stream/channel tied to the replay via its name.
     */
    setChannel(channel: string): Promise<ISourceReplay>;
    /**
     * return: Promise<number>
     *
     * Gets the hotkey, in numerical value, used to toggle start/stop of the replay.
     *
     * See conversion from keycode: {@link #system/Replay Replay Class}
     */
    getHotkey(): Promise<number>;
    /**
     * param: (hotkey: number)
     * ```
     * return: Promise<ISourceReplay>
     * ```
     *
     * Sets the hotkey, in numerical value, used to toggle start/stop of the replay.
     *
     * See conversion from keycode: {@link #system/Replay Replay Class}
     */
    setHotkey(hotkey: number): Promise<ISourceReplay>;
    /**
     * return: Promise<number>
     *
     * Gets the duration, or buffer time for the replay
     */
    getReplayTime(): Promise<number>;
    /**
     * param: (time: number)
     * ```
     * return: Promise<ISourceReplay>
     * ```
     *
     * Sets the duration, or buffer time for the replay
     */
    setReplayTime(buffer: number): Promise<ISourceReplay>;
    /**
     * return: Promise<ISourceReplay>
     *
     * Start playing of the buffered replay
     */
    startReplay(): Promise<ISourceReplay>;
    /**
     * return: Promise<ISourceReplay>
     *
     * Stop playing of the buffered replay
     */
    stopReplay(): Promise<ISourceReplay>;
    /**
     * return: Promise<number>
     *
     * Gets the replay state, may return any of the following:
     * 0 - playing
     * 1 - not playing
     * -1 - no stream exists
     * -2 - stream exists but cannot be tied to a replay
     */
    getReplayState(): Promise<number>;
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
    setAutostartOnSceneLoad(value: boolean): Promise<ISourceReplay>;
}
export declare class SourceReplay implements ISourceReplay {
    private _id;
    private _srcId;
    private _isItemCall;
    private _sceneId;
    protected _checkPromise: any;
    private _updateId;
    getChannel(): Promise<string>;
    setChannel(channel: string): Promise<SourceReplay>;
    getHotkey(): Promise<number>;
    setHotkey(hotkey: number): Promise<SourceReplay>;
    getReplayTime(): Promise<number>;
    setReplayTime(buffer: number): Promise<SourceReplay>;
    startReplay(): Promise<SourceReplay>;
    stopReplay(): Promise<SourceReplay>;
    getReplayState(): Promise<number>;
    isAutostartOnSceneLoad(): Promise<boolean>;
    setAutostartOnSceneLoad(value: boolean): Promise<SourceReplay>;
}
