import { Rectangle } from '../../util/rectangle';
import { MicrophoneDevice as MicrophoneDevice } from '../../system/microphone';
import { CameraSource } from '../source/camera';
import { XML } from '../../internal/util/xml';
export interface ISourceCamera {
    /**
     * return: Promise<string>
     *
     * Gets the device ID of the underlying camera device.
     */
    getDeviceId(): Promise<string>;
    /**
     * return: Promise<Rectangle>
     *
     * Gets the camera's native resolution.
     */
    getResolution(): Promise<Rectangle>;
    /**
     * return: Promise<number>
     *
     * Gets audio delay with respect to video feed in milliseconds
     */
    getAudioOffset(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets audio delay with respect to video feed in milliseconds
     */
    setAudioOffset(value: number): Promise<ISourceCamera>;
    /**
     * return: Promise<MicrophoneDevice>
     *
     * Gets the microphone device tied as an audio input,
     * rejected if no microphone device is used
     */
    getAudioInput(): Promise<MicrophoneDevice>;
    /**
     * param: (value: number)
     *
     * Sets the microphone device to be tied as an audio input
     */
    setAudioInput(value: MicrophoneDevice): Promise<ISourceCamera>;
    /**
     * return: Promise<boolean>
     *
     * Checks if camera feed is paused
     */
    isStreamPaused(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Sets whether camera feed is paused or not
     */
    setStreamPaused(value: boolean): Promise<CameraSource>;
    /**
     * return: Promise<boolean>
     *
     * Checks if camera device is a hardware encoder or not. This check may fail
     * if camera device is reinitializing or not present (value defaults to false)
     *
     */
    isHardwareEncoder(): Promise<boolean>;
    /**
     * return: Promise<boolean>
     *
     * Checks if camera device is active and present.
     *
     */
    isActive(): Promise<boolean>;
    /**
     * return: Promise<number>
     *
     * Gets feed capture delay in milliseconds
     */
    getDelay(): Promise<number>;
    /**
     * param: (value: number)
     *
     * Sets feed capture delay in milliseconds, accepts only positive delay
     */
    setDelay(value: number): Promise<CameraSource>;
    /**
     * return: Promise<boolean>
     *
     * Checks whether deinterlacing is enforced
     */
    isForceDeinterlace(): Promise<boolean>;
    /**
     * param: (value: boolean)
     *
     * Enables or disables forcing of deinterlacing
     */
    setForceDeinterlace(value: boolean): Promise<CameraSource>;
    /**
     * return: Promise<string>
     *
     * Gets the camera device used as a source
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
    getValue(): Promise<string | XML>;
    /**
     * param: (value: string)
     * ```
     * return: Promise<CameraSource>
     * ```
     *
     * Set the camera device to be used as source
     *
     * #### Usage
     *
     * ```javascript
     * source.setValue('<camera device>')
     *   .then(function(source) {
     *   // Promise resolves with same Source instance
     * });
     * ```
     */
    setValue(value: string): Promise<any>;
}
export declare class SourceCamera implements ISourceCamera {
    private _id;
    private _srcId;
    private _isItemCall;
    private _checkPromise;
    private _sceneId;
    private _updateId;
    getDeviceId(): Promise<string>;
    getResolution(): Promise<Rectangle>;
    getAudioOffset(): Promise<number>;
    setAudioOffset(value: number): Promise<SourceCamera>;
    getAudioInput(): Promise<MicrophoneDevice>;
    setAudioInput(value: MicrophoneDevice): Promise<SourceCamera>;
    isStreamPaused(): Promise<boolean>;
    setStreamPaused(value: boolean): Promise<CameraSource>;
    isHardwareEncoder(): Promise<boolean>;
    isActive(): Promise<boolean>;
    getDelay(): Promise<number>;
    setDelay(value: number): Promise<CameraSource>;
    isForceDeinterlace(): Promise<boolean>;
    setForceDeinterlace(value: boolean): Promise<CameraSource>;
    isAudioAvailable: () => Promise<boolean>;
    getValue(): Promise<string>;
    setValue(camDevice: any): Promise<SourceCamera>;
}
