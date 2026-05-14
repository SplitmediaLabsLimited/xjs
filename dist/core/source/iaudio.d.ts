export interface IAudio {
    /**
     * return: Promise<number>
     *
     * Get source's volume level expressed as an integer from 0 to 100
     */
    getVolume(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Set volume level of source as an integer from 0 (muted) to 100 (maximum)
     *
     * *Chainable.*
     */
    setVolume(value: number): Promise<IAudio>;
    /**
     * return: Promise<boolean>
     *
     * Check if source's mute option is active
     */
    isMute(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Set source's Mute property to ON or OFF
     *
     * *Chainable.*
     */
    setMute(value: boolean): Promise<IAudio>;
    /**
     * return: Promise<boolean>
     *
     * Check if source is automatically being muted when hiding
     */
    isAutoMute(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Set source to automatically mute when hiding
     *
     * *Chainable.*
     */
    setAutoMute(value: boolean): Promise<IAudio>;
    /**
     * return: Promise<boolean>
     *
     * Checks if audio is also output to system sound
     */
    isStreamOnlyAudio(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Sets whether audio should also be output to system sound
     *
     * *Chainable.*
     */
    setStreamOnlyAudio(value: boolean): Promise<IAudio>;
    /**
     * return: Promise<boolean>
     *
     * Checks if audio is available
     */
    isAudioAvailable(): Promise<boolean>;
}
export declare class Audio implements IAudio {
    private _id;
    private _srcId;
    protected _isItemCall: boolean;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    getVolume(): Promise<number>;
    setVolume(value: number): Promise<Audio>;
    isMute(): Promise<boolean>;
    setMute(value: boolean): Promise<Audio>;
    isAutoMute(): Promise<boolean>;
    setAutoMute(value: boolean): Promise<Audio>;
    isStreamOnlyAudio(): Promise<boolean>;
    setStreamOnlyAudio(value: boolean): Promise<Audio>;
    isAudioAvailable(): Promise<boolean>;
}
