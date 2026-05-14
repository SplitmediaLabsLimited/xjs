(() => {
  /**
   * Provides the mock external class
   *
   * Each individual method are just declared
   * for use when spying via Jasmine
   * (returns an error if undefined)
   *
   * @class MockExternal
   * @static
   */
  var MockExternal = {
    /**
     * source|config|script
     */
    AppCallFuncAsync: (name) => {},

    /**
     * source|config|window
     */
    AppGetPropertyAsync: (name) => {},

    /**
     * source|config|window
     */
    AppSetPropertyAsync: (name) => {},

    /**
     * config|window
     */
    AppSubscribeEvents: (name) => {},

    /**
     * config|window
     */
    AppUnsubscribeEvents: (name) => {},

    /**
     * config|window
     */
    AttachVideoItem: (name) => {},

    /**
     * source
     */
    AttachVideoItem1: (name) => {},

    /**
     * source|config|window
     */
    AttachVideoItem2: (name) => {},

    /**
     * source|config|window
     */
    CallDll: (name) => {},

    /**
     * source|config|window
     */
    CallDllEx: (name) => {},

    /**
     * config|window
     */
    CallHost: (name) => {},

    /**
     * source|config|window
     */
    CallHostFunc: (name) => {},

    /**
     * source|config|window
     */
    CallInner: (name) => {},

    /**
     * source|config|window
     */
    CallInner2: (name) => {},

    /**
     * source
     */
    CallInnerAsync: (name) => {},

    /**
     * source
     */
    CallInnerAsync2: (name) => {},

    /**
     * source|config|window
     */
    CheckDllGrant: (name) => {},

    /**
     * config|window
     */
    Close: (name) => {},

    /**
     * config|window
     */
    CloseDialog: (name) => {},

    /**
     * source|config|window
     */
    CopyToClipboard: (name) => {},

    /**
     * config|window
     */
    DlgShow: (name) => {},

    /**
     * config|window
     */
    DlgShow2: (name) => {},

    /**
     * config|window
     */
    GetAutoCrop: (name) => {},

    /**
     * config|window
     */
    GetCompositionEnabled: (name) => {},

    /**
     * config|window
     */
    GetCursorPos: (name) => {},

    /**
     * source |config|window
     */
    GetFileContent: (name) => {},

    /**
     * config|window
     */
    GetFrame: (name) => {},

    /**
     * config|window
     */
    GetFrame2: (name) => {},

    /**
     * source|config|window
     */
    GetGlobalProperty: (name) => {},

    /**
     * source|config|window
     */
    GetLocalPropertyAsync: (name) => {},

    /**
     * source|config|window
     */
    GetLocalPropertyAsync1: (name) => {},

    /**
     * source|config|window
     */
    GetLocalPropertyAsync2: (name) => {},

    /**
     * config|window
     */
    GetPresProperty: (name) => {},

    /**
     * source|config|window
     */
    GetProtectedProperty: (name) => {},

    /**
     * config|window
     */
    GetScreenPixel: (name) => {},

    /**
     * config|window
     */
    GetSwfSize: (name) => {},

    /**
     * config|window
     */
    GetVideoDuration: (name) => {},

    /**
     * config|window
     */
    GetViewId: (name) => '1',

    /**
     * source
     */
    GetVolume: (name) => {},

    /**
     * source|config|window
     */
    GetWebContent: (name) => {},

    /**
     * config|window
     */
    GetWindowPos: (name) => {},

    /**
     * source
     */
    LoadDll: (name) => {},

    /**
     * config|window
     */
    LoadSwf: (name) => {},

    /**
     * config|window
     */
    MouseDownClient: (name) => {},

    /**
     * config|window
     */
    NewDialog: (name) => {},

    /**
     * config|window
     */
    NewAutoDialog: (name) => {},

    /**
     * config|window
     */
    OpenFileDialogAsync: (name) => {},

    /**
     * config|window
     */
    OpenFolderDialogAsync: (name) => {},

    /**
     * config|window
     */
    OpenUrl: (name) => {},

    /**
     * config|window
     */
    PinDialog: (name) => {},

    /**
     * config|window
     */
    PostMessageToParent: (name) => {},

    /**
     * config|window
     */
    ResetCapture: (name) => {},

    /**
     * config|window
     */
    SaveFileDialogAsync: (name) => {},

    /**
     * config|window
     */
    SaveScenes: (name) => {},

    /**
     * config|window
     */
    SearchVideoItem: (name) => {},

    /**
     * config|window
     */
    SearchVideoItem2: (name) => {},

    /**
     * config|window
     */
    SelScreenArea: (name) => {},

    /**
     * source|config|window
     */
    SetBrowserProperty: (name) => {},

    /**
     * config|window
     */
    SetCapture: (name) => {},

    /**
     * config|window
     */
    SetCursorPos: (name) => {},

    /**
     * config|window
     */
    SetDialogResult: (name) => {},

    /**
     * config|window
     */
    SetDialogSize: (name) => {},

    /**
     * config|window
     */
    SetFocus: (name) => {},

    /**
     * source|config|window
     */
    SetLocalPropertyAsync: (name) => {},

    /**
     * source|config|window
     */
    SetLocalPropertyAsync1: (name) => {},

    /**
     * source|config|window
     */
    SetLocalPropertyAsync2: (name) => {},

    /**
     * source
     */
    SetParams: (name) => {},

    /**
     * config|window
     */
    SetPresProperty: (name) => {},

    /**
     * config|window
     */
    SetPropsDialogSize: (name) => {},

    /**
     * source
     */
    SetRenderParams: (name) => {},

    /**
     * config|window
     */
    SetSwfPos: (name) => {},

    /**
     * config|window
     */
    SourcesListHighlight: (name) => {},

    /**
     * config|window
     */
    SourcesListOrder: (name) => {},

    /**
     * config|window
     */
    SourcesListOrderSave: (name) => {},

    /**
     * config|window
     */
    SourcesListShowProps: (name) => {},

    /**
     * config|window
     */
    SourcesListSubscribeEvents: (name) => {},

    /**
     * config|window
     */
    SourcesListUnsubscribeEvents: (name) => {},
  };

  if (navigator.userAgent.indexOf('XSplit Broadcaster') < 0) window.external = MockExternal;
})();

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}

window.global_asyncId = 0;

window.randomWord = (length) => {
  var rand;
  var str = '';

  for (var i = 0; i < length; i++) {
    rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
    str += String.fromCharCode(rand);
  }

  return str;
};

window.randomBoolean = () => Math.random() >= 0.5;

window.randomColor = () =>
  '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6).toUpperCase();

window.randomInt = (min, max) => {
  if (typeof min === 'undefined') {
    min = 0;
  }
  if (typeof max === 'undefined') {
    max = 100;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.randomSignMultiplier = () => Math.round(Math.random()) * 2 - 1;
