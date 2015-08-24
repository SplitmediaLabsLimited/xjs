(function()
{
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
	var MockExternal = 
	{
		/**
		 * source|config|script
		 */
		AppCallFuncAsync: function(name) {

		},

		/**
		 * source|config|window
		 */
		AppGetPropertyAsync: function(name) {
			
		},

		/**
		 * source|config|window
		 */
		AppSetPropertyAsync: function(name) {

		},

		/**
		 * source|config|window
		 */
		AttachVideoItem: function(name) {

		},

		/**
		 * source|config|window
		 */
		AttachVideoItem2: function(name) {

		},

		/**
		 * source|config|window
		 */
		CallDll: function(name) {

		},

		/**
		 * source|config|window
		 */
		CallDllEx: function(name) {

		},

		/**
		 * config|window
		 */
		CallHost: function(name) {

		},

		/**
		 * source|config|window
		 */
		CallInner: function(name) {

		},

		/**
		 * source|config|window
		 */
		CallInner2: function(name) {

		},

		/**
		 * source
		 */
		CallInnerAsync: function(name) {

		},

		/**
		 * source
		 */
		CallInnerAsync2: function(name) {

		},

		/**
		 * config|window
		 */
		Close: function(name) {

		},

		/**
		 * config|window
		 */
		CloseDialog: function(name) {

		},

		/**
		 * source|config|window
		 */
		CopyToClipboard: function(name) {

		},

		/**
		 * config|window
		 */
		DlgShow: function(name) {

		},

		/**
		 * config|window
		 */
		DlgShow2: function(name) {

		},

		/**
		 * config|window
		 */
		GetAutoCrop: function(name) {

		},

		/**
		 * config|window
		 */
		GetCompositionEnabled: function(name) {

		},

		/**
		 * config|window
		 */
		GetCursorPos: function(name) {

		},

		/**
		 * source |config|window
		 */
		GetFileContent: function(name) {

		},

		/**
		 * config|window
		 */
		GetFrame: function(name) {

		},

		/**
		 * config|window
		 */
		GetFrame2: function(name) {

		},

		/**
		 * source|config|window
		 */
		GetGlobalProperty: function(name) {

		},

		/**
		 * source|config|window
		 */
		GetLocalPropertyAsync: function(name) {

		},

		/**
		 * source|config|window
		 */
		GetLocalPropertyAsync2: function(name) {

		},

		/**
		 * config|window
		 */
		GetPresProperty: function(name) {

		},

		/**
		 * source|config|window
		 */
		GetProtectedProperty: function(name) {

		},

		/**
		 * config|window
		 */
		GetScreenPixel: function(name) {

		},

		/**
		 * config|window
		 */
		GetSwfSize: function(name) {

		},

		/**
		 * config|window
		 */
		GetVideoDuration: function(name) {

		},

		/**
		 * config|window
		 */
		GetViewId: function(name) {
			return '1';
		},

		/**
		 * source
		 */
		GetVolume: function(name) {

		},

		/**
		 * source|config|window
		 */
		GetWebContent: function(name) {

		},

		/**
		 * config|window
		 */
		GetWindowPos: function(name) {

		},

		/**
		 * source
		 */
		LoadDll: function(name) {

		},

		/**
		 * config|window
		 */
		LoadSwf: function(name) {

		},

		/**
		 * config|window
		 */
		MouseDownClient: function(name) {

		},

		/**
		 * config|window
		 */
		NewDialog: function(name) {

		},

		/**
		 * config|window
		 */
		NewAutoDialog: function(name) {

		},

		/**
		 * config|window
		 */
		OpenFileDialogAsync: function(name) {

		},

		/**
		 * config|window
		 */
		OpenFolderDialogAsync: function(name) {

		},

		/**
		 * config|window
		 */
		OpenUrl: function(name) {

		},

		/**
		 * config|window
		 */
		PinDialog: function(name) {

		},

		/**
		 * config|window
		 */
		PostMessageToParent: function(name) {

		},

		/**
		 * config|window
		 */
		ResetCapture: function(name) {

		},

		/**
		 * config|window
		 */
		SaveFileDialogAsync: function(name) {

		},

		/**
		 * config|window
		 */
		SaveScenes: function(name) {

		},

		/**
		 * config|window
		 */
		SearchVideoItem: function(name) {

		},

		/**
		 * config|window
		 */
		SearchVideoItem2: function(name) {

		},

		/**
		 * config|window
		 */
		SelScreenArea: function(name) {

		},

		/**
		 * source|config|window
		 */
		SetBrowserProperty: function(name) {

		},

		/**
		 * config|window
		 */
		SetCapture: function(name) {

		},

		/**
		 * config|window
		 */
		SetCursorPos: function(name) {

		},

		/**
		 * config|window
		 */
		SetDialogResult: function(name) {

		},

		/**
		 * config|window
		 */
		SetDialogSize: function(name) {

		},

		/**
		 * config|window
		 */
		SetFocus: function(name) {

		},

		/**
		 * source|config|window
		 */
		SetLocalPropertyAsync: function(name) {

		},

		/**
		 * source|config|window
		 */
		SetLocalPropertyAsync2: function(name) {

		},

		/**
		 * source
		 */
		SetParams: function(name) {

		},

		/**
		 * config|window
		 */
		SetPresProperty: function(name) {

		},

		/**
		 * config|window
		 */
		SetPropsDialogSize: function(name) {

		},

		/**
		 * source
		 */
		SetRenderParams: function(name) {

		},

		/**
		 * config|window
		 */
		SetSwfPos: function(name) {

		},

		/**
		 * config|window
		 */
		SourcesListHighlight: function(name) {

		},

		/**
		 * config|window
		 */
		SourcesListOrder: function(name) {

		},

		/**
		 * config|window
		 */
		SourcesListOrderSave: function(name) {

		},

		/**
		 * config|window
		 */
		SourcesListShowProps: function(name) {

		}
	};

	if (navigator.userAgent.indexOf("XSplit Broadcaster") < 0)
		window.external = MockExternal;

})();