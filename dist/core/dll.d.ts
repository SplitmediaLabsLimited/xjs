import { EventEmitter } from '../util/eventemitter';
/**
 *  The Dll class allows access to functions in DLL files that are placed within
 *  the Scriptdlls folder.
 *
 *  The class also emits two events for developers to know when the user
 *  changes the DLL permission setting for the plugin through the permissions
 *  window.
 *
 *  The following events are emitted.
 *    - `access-granted`
 *    - `access-revoked`
 *
 *
 *  Use the `on(event: string, handler: Function)` function to listen to events.
 *
 *  For more detailed information about using DLLs in XSplit, please see the
 *  {@link tutorials.html#/dll DLL tutorial}. That link also includes a list of
 *  methods exposed by the DLLs that ship with XSplit.
 *
 */
export declare class Dll extends EventEmitter {
    /**
     *  param: (path: string)
     *
     *  Loads one or more DLLs for the plugin to use. Currently, only Xjs.dll is
     *  auto-loaded and does not require loading. Loading DLLs will trigger a
     *  notification for the user, requesting access to be granted to DLL files.
     *  Your plugin should only call this once, at the beginning of execution.
     *
     *  Paths are relative to the main XBC application folder, so sample usage is:
     *
     *  ```javascript
     *  Dll.load(['Scriptdlls\\SplitMediaLabs\\XjsEx.dll']);
     *  ```
     */
    static load(path: string[]): Promise<any>;
    static _emitter: Dll;
    /**
     *  param: (event: string, handler: Function)
     *
     *  Allows listening to events that this class emits. Currently there are two:
     *  `access-granted` and `access-revoked`.
     */
    static on(event: string, handler: Function): void;
    /**
     *  param: (event: string, ...params: any[])
     *
     *  Allows this class to emit an event. Generally only useful for testing.
     */
    static emit(event: string, ...params: any[]): void;
    /**
     *  param: (funcName: string, ...params: string[])
     *
     *  return: Promise<string> (see {@link tutorials.html#/dll DLL documentation})
     *
     *  Calls a function from a loaded "safe" DLL. The only safe DLL we are
     *  currently exposing is `Xjs.dll`.
     */
    static call(func: string, ...params: string[]): Promise<string>;
    /**
     *  param: (funcName: string, ...params: string[])
     *
     *  return: Promise<string> (see {@link tutorials.html#/dll DLL documentation})
     *
     *  Calls a function from a loaded "unsafe" DLL. The first DLL containing
     *  the function name will be called, so you need to ensure there are no
     *  function name collisions among DLLs for functions you require.
     *
     *  Some DLLs have callbacks. Assign a handler function to that callback in
     *  the global namespace (`window.callbackName = ...`), and the DLL will call
     *  that function accordingly.
     *
     *  See the documentation of your specific DLL for more details.
     */
    static callEx(func: string, ...params: string[]): Promise<string>;
    /**
     *  return: Promise<boolean>
     *
     *  Determines if user has granted DLL access for this plugin. This also
     *  resolves to true if DLL security is disabled altogether.
     */
    static isAccessGranted(): Promise<boolean>;
}
