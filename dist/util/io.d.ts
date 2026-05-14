export declare class IO {
    /**
     * param: (path: string)
     * ```
     * return: Promise<string>
     * ```
     *
     * Returns a base-64 encoded string of the target file's contents.
     * UTF-8 encoded files may be decoded through:
     * ```javascript
     * IO.getFileContent('C:\\text.txt').then(function(base64Content) {
     *   var actualContent = decodeURIComponent(escape(window.atob(base64Content));
     * });
     * ```
     */
    static getFileContent(path: string): Promise<string>;
    /**
     * param: (url: string)
     * ```
     * return: Promise<string>
     * ```
     *
     * Returns a base-64 encoded string of the target endpoint's contents.
     * Redirects are resolved, and this bypasses access-control-allow-origin.
     *
     * UTF-8 encoded content may be decoded through:
     * ```javascript
     * IO.getWebContent('http://example.com').then(function(base64Content) {
     *   var actualContent = decodeURIComponent(escape(window.atob(base64Content));
     * });
     * ```
     */
    static getWebContent(url: string): Promise<string>;
    /**
     * param: (url: string)
     *
     * Opens a URL in the user's default browser. URL must specify HTTP or HTTPS.
     *
     */
    static openUrl(url: string): Promise<string>;
    private static _ALLOW_MULTI_SELECT;
    private static _FILE_MUST_EXIST;
    private static _FORCE_SHOW_HIDDEN;
    /**
     * param: ([options] [, filter]) -- see below
     * ```
     * return: Promise<string[]>
     * ```
     * Opens a file dialog for the user to select a file (or multiple files).
     * Resolves with an array of strings, each of which contains the full path
     * and filename of a selected file. Rejects when the dialog is canceled.
     *
     * The first (optional) argument is a JSON object that can be used to indicate
     * that certain flags should be true. These are documented as follows:
     * - `allowMultiSelect`: allows users to select multiple files.
     * - `fileMustExist`: prevents users from typing a name of a nonexistent file
     * - `forceShowHidden`: lets the dialog show files marked as System or Hidden
     *  (but not both)
     *
     * The second argument (also optional) is a JSON object used to specify the
     * filter for items to be displayed. It takes two members:
     * - `name`: the description of the filter (for example: Image Files)
     * - `extensions`: an array of file extensions (for example: `['jpg','bmp']`);
     */
    static openFileDialog(optionBag?: {
        allowMultiSelect?: boolean;
        fileMustExist?: boolean;
        forceShowHidden?: boolean;
    }, filter?: {
        name: boolean;
        extensions: String[];
    }): Promise<string[]>;
    static _callback: {};
    static _remoteCallback: {};
    static _proxyCallback: {};
    /**
     * param: (file: string)
     *
     * return: Promise<number>
     *
     * Returns the duration of a video file on the local system, specified in
     * units of 10^-7 seconds.
     */
    static getVideoDuration(file: any): Promise<unknown>;
    static _finalCallback(message: string): Promise<unknown>;
}
