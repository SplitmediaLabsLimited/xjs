export declare var DEBUG: boolean;
/**
 * Executes an external function, and main callback handler for the XJS Framework.
 *
 * Since 2.9, this is exposed to provide an alternative way
 * of handling new XBC properties, methods and item/source properties
 * without having to wait for a new update.
 * This requires some knowledge on the needed native XBC calls.
 *
 * Usage:
 * (This sample is basically the same as
 * {@link #core/App#getFrameTime getFrameTime})
 *
 * ```
 * XJS.exec('AppGetPropertyAsync', 'frametime')
 * .then(function(frametime) {
 *   // do something here
 * });
 * ```
 *
 */
export declare function exec(funcName: string, ...args: any[]): Promise<any>;
export declare function finalCallback(message: any): Promise<unknown>;
