/**
 *  This class is used to spawn new browser processes that can be used to open
 *  other URLs. Source plugins do not have this functionality (but their
 *  properties windows may use this.)
 *
 *  Note that opening a new dialog replaces the old one. Also, dialogs are
 *  considered to be the same type of window as their parent windows: e.g.,
 *  dialogs from extension windows are considered by the framework to have
 *  access to the same functions as extensions.
 *
 *  Most of the methods are chainable.
 *
 *  Sample usage:
 *
 *  ```javascript
 *  var xjs = require('xjs');
 *  var Dialog = xjs.Dialog;
 *
 *  xjs.ready().then(function() {
 *    var button = document.getElementById('openDialogButton');
 *    button.addEventListener('click', function() {
 *      xjs.Dialog.createDialog('your.url/here.html')
 *      .setSize(500, 800)
 *      .setTitle('ThisDialogReturnsAString')
 *      .setBorderOptions(true, false)
 *      .setButtons(true, true)
        .setCookiePath('cookiePath')
 *      .show(function(dialog) {
 *        dialog.getResult().then(function(result) {
 *          document.getElementById('input').value = result;
 *        });
 *      })
 *    });
 *  });
 *
 *  // in the opened dialog, call Dialog.return() to return a value
 *  //
 *  // see documentation below for more details
 *  ```
 */
export declare class Dialog {
    private _result;
    private _resultListener;
    private _size;
    private _title;
    private _url;
    private _showBorder;
    private _resizable;
    private _autoclose;
    private _minimize;
    private _maximize;
    private _cookiePath;
    constructor();
    /**
     *  param: (url: string)
     *
     *  return: Dialog
     *
     *  Creates a Dialog object pointing to a URL. Call the other methods to
     *  modify the dialog's properties, and `show()` to spawn the dialog.
     *
     * *Chainable.*
     */
    static createDialog(url: string): Dialog;
    /**
     *  param: (url: string)
     *
     *  return: Dialog
     *
     *  Creates a Dialog object pointing to a URL, that autocloses on an outside
     *  click. AutoDialogs only have access to the `setSize` and `show` methods.
     *
     * *Chainable.*
     */
    static createAutoDialog(url: string): Dialog;
    /**
     *  param: (result ?: string)
     *
     *  Closes this dialog with an optional string result. For more complex
     *  return values, try JSON.stringify. (Call this method from the dialog.)
     *
     *  As an alternative, lightweight dialogs that do not want to include xjs.js
     *  may simply call native XBC methods to return a value.
     *  ```javascript
     *  external.SetDialogResult(stringResult);
     *  external.Close();
     *  ```
     */
    static return(result?: string): Promise<any>;
    /**
     *  param: (width: number, height: number)
     *
     *  return: Dialog
     *
     *  Sets the size in pixels of the dialog to be displayed.
     *
     * *Chainable.*
     */
    setSize(width?: number, height?: number): Dialog;
    /**
     *  param: (title: string)
     *
     *  return: Dialog
     *
     *  Sets the title of the dialog to be displayed.
     *
     * *Chainable.*
     */
    setTitle(title: string): Dialog;
    /**
     *  param: (showBorder: boolean, resizable: boolean)
     *
     *  return: Dialog
     *
     *  Specifies the border and resizable flags for the dialog to be displayed.
     *
     * *Chainable.*
     */
    setBorderOptions(showBorder?: boolean, resizable?: boolean): Dialog;
    /**
     *  param: (isMinimizeActive: boolean, isMaximizeActive: boolean)
     *
     *  return: Dialog
     *
     *  Specifies if the window buttons (minimize and maximize) should be active.
     *
     * *Chainable.*
     */
    setButtons(isMinimizeActive?: boolean, isMaximizeActive?: boolean): Dialog;
    /**
     *  param: (cookiePath: string)
     *
     *  return: Dialog
     *
     *  Sets the cookie Path of the dialog.
     *
     * *Chainable.*
     */
    setCookiePath(cookiePath: string): Dialog;
    /**
     *  return: Promise<Dialog>
     *
     *  After configuring the dialog, call this function to spawn it.
     *
     * *Chainable.*
     */
    show(): Promise<Dialog>;
    /**
     *  param: (script: string)
  
     *  return: Promise<Dialog>
     *
     *  After configuring the dialog, call this function to spawn it.
     *  A javascript string parameter can be passed to have more control over the dialog
     *
     * *Chainable.*
     */
    showWithJS(script: string): Promise<Dialog>;
    /**
     *  return: Promise<string>
     *
     *  Gets the string result returned from the spawned dialog.
     */
    getResult(): Promise<string>;
    /**
     *  Closes the dialog that this window spawned.
     */
    close(): Promise<any>;
    private _calculateFlags;
}
