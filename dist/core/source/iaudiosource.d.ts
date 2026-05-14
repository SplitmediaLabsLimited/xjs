export interface ISourceAudio {
    /**
     * return: Promise<boolean>
     *
     * Check if silence detection is on or off
     */
    isSilenceDetectionEnabled(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Set silence detection to ON or OFF
     */
    setSilenceDetectionEnabled(value: boolean): Promise<ISourceAudio>;
    /**
     * return: Promise<number>
     *
     * Gets silenced detection threshold.
     * Amplitude less than threshold will be detected as silence.
     */
    getSilenceThreshold(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets silence detection threshold, min of 0, max of 128
     */
    setSilenceThreshold(value: number): Promise<ISourceAudio>;
    /**
     * return: Promise<number>
     *
     * Gets silenced detection period in ms time unit.
     * Reaction time before filter removes noice/sound less than threshold
     */
    getSilencePeriod(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets silence detection period, min of 0, max of 10000
     */
    setSilencePeriod(value: number): Promise<ISourceAudio>;
    /**
     * return: Promise<number>
     *
     * Gets audio delay (1 unit = 100ns)
     */
    getAudioOffset(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets audio delay, accepts only positive delay
     */
    setAudioOffset(value: number): Promise<ISourceAudio>;
    /**
     * return: Promise<string>
     *
     * Gets the microphone device used as a source
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
     * return: Promise<AudioSource>
     * ```
     *
     * Set the microphone device to be used as source
     *
     * #### Usage
     *
     * ```javascript
     * source.setValue('<microphone device>')
     *   .then(function(source) {
     *   // Promise resolves with same Source instance
     * });
     * ```
     */
    setValue(value: string): Promise<any>;
}
export declare class SourceAudio implements ISourceAudio {
    private _id;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    isSilenceDetectionEnabled(): Promise<boolean>;
    setSilenceDetectionEnabled(value: boolean): Promise<SourceAudio>;
    getSilenceThreshold(): Promise<number>;
    setSilenceThreshold(value: number): Promise<SourceAudio>;
    getSilencePeriod(): Promise<number>;
    setSilencePeriod(value: number): Promise<SourceAudio>;
    getAudioOffset(): Promise<number>;
    setAudioOffset(value: number): Promise<SourceAudio>;
    getValue(): Promise<string>;
    setValue(micDevice: any): Promise<SourceAudio>;
}
