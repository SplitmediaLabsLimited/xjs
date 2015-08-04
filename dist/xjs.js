require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
var rectangle_1 = require('../internal/util/rectangle');
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var internal_1 = require('../internal/internal');
var environment_1 = require('../internal/environment');
var App = (function () {
    function App() {
    }
    /**
     * Gets application's frame time (duration per frame in 100ns unit)
     *
     * @return {Promise<number>}
     */
    App.prototype.getFrametime = function () {
        return new Promise(function (resolve) {
            app_1.App.get('frametime').then(function (val) {
                resolve(Number(val));
            });
        });
    };
    /**
     * Gets application default output resolution
     *
     * @return {Promise<Rectangle>}
     */
    App.prototype.getResolution = function () {
        return new Promise(function (resolve) {
            app_1.App.get('resolution').then(function (val) {
                var dimensions = val.split(",");
                resolve(rectangle_1.Rectangle.fromDimensions(parseInt(dimensions[0]), parseInt(dimensions[1])));
            });
        });
    };
    /**
     * Gets application viewport display resolution
     *
     * @return {Promise<Rectangle>}
     */
    App.prototype.getViewport = function () {
        return new Promise(function (resolve) {
            app_1.App.get('viewport').then(function (val) {
                var dimensions = val.split(",");
                resolve(rectangle_1.Rectangle.fromDimensions(parseInt(dimensions[0]), parseInt(dimensions[1])));
            });
        });
    };
    /**
     * Refers to XSplit Broadcaster DLL file version number
     *
     * @return {Promise<string>}
     */
    App.prototype.getVersion = function () {
        return new Promise(function (resolve) {
            resolve(app_1.App.get('version'));
        });
    };
    /**
     * Gets the total number of frames rendered
     *
     * @return {Promise<number>}
     */
    App.prototype.getFramesRendered = function () {
        return new Promise(function (resolve) {
            app_1.App.get('framesrendered').then(function (val) {
                resolve(Number(val));
            });
        });
    };
    // Audio Services
    /**
     * Gets the configuration for silence detection
     *
     * @return {Promise<JSON>}
     */
    App.prototype.getAudioGain = function () {
        return new Promise(function (resolve) {
            app_1.App.get('microphonegain').then(function (val) {
                resolve(json_1.JSON.parse(val));
            });
        });
    };
    /**
     * Sets the configuration for silence detection
     *
     * @param {JSON} config
     * @return {Promise<JSON>}
     */
    App.prototype.setAudioGain = function (config) {
        config.tag = 'configuration';
        app_1.App.set('microphonegain', xml_1.XML.parseJSON(config).toString());
    };
    /**
     * Creates a persistent modal dialog.
     * This method is not available for source
     *
     * @param {string} url
     */
    App.prototype.newDialog = function (url, width, height, flags, title) {
        if (width === void 0) { width = 300; }
        if (height === void 0) { height = 300; }
        if (environment_1.Environment.isSourceHtml()) {
            throw new TypeError('function is not available for source');
        }
        else if (url !== undefined && url !== '') {
            var params = ['NewDialog', url, '', width + ',' + height];
            for (var i = 3; i < arguments.length; i++) {
                if (arguments[i] !== undefined)
                    params.push(String(arguments[i]));
            }
            internal_1.exec.apply(this, params);
        }
        else {
            throw new Error('URL parameter expected');
        }
    };
    /**
     * Creates a dialog that automatically closes on outside click
     *
     * @param {string} url
     */
    App.prototype.newAutoDialog = function (url, width, height) {
        if (width === void 0) { width = 300; }
        if (height === void 0) { height = 300; }
        if (environment_1.Environment.isSourceHtml()) {
            throw new TypeError('function is not available for source');
        }
        else if (url !== undefined && url !== '') {
            internal_1.exec('NewAutoDialog', url, width + ',' + height);
        }
        else {
            throw new Error('URL parameter expected');
        }
    };
    /**
     * Close a created dialog
     */
    App.prototype.closeDialog = function () {
        if (environment_1.Environment.isSourceHtml()) {
            throw new TypeError('function is not available for source');
        }
        else {
            internal_1.exec('CloseDialog');
        }
    };
    /**
     * Gets the transition for scene changes.
     *
     * @return {Promise<string>}
     */
    App.prototype.getTransition = function () {
        return new Promise(function (resolve) {
            app_1.App.get('transitionid').then(function (val) {
                resolve(val);
            });
        });
    };
    /** Sets the transition for scene changes.
     *
     * @param {string} transition
     */
    App.prototype.setTransition = function (transition) {
        app_1.App.set('transitionid', transition);
    };
    /** Gets the scene transition duration in milliseconds.
     *
     * @return {Promise<Number>}
     */
    App.prototype.getTransitionTime = function () {
        return new Promise(function (resolve) {
            app_1.App.get('transitiontime').then(function (val) {
                resolve(Number(val));
            });
        });
    };
    /** Sets the scene transition duration in milliseconds.
     *
     * @param {Number} time
     */
    App.prototype.setTransitionTime = function (time) {
        app_1.App.set('transitiontime', time.toString());
    };
    // Dialog Services
    App.BORDER_ENABLE = 1;
    App.BORDER_ENABLE_CAPTION = 2;
    App.BORDER_ENABLE_SIZING = 4;
    App.BORDER_ENABLE_MINIMIZE = 8;
    App.BORDER_ENABLE_MAXIMIZE = 16;
    // Transition Services
    App.TRANSITION_CLOCK = 'clock';
    App.TRANSITION_COLLAPSE = 'collapse';
    App.TRANSITION_FADE = 'fade';
    App.TRANSITION_FAN = 'fan';
    App.TRANSITION_HOLE = 'hole';
    App.TRANSITION_MOVE_BOTTOM = 'move_bottom';
    App.TRANSITION_MOVE_LEFT = 'move_left';
    App.TRANSITION_MOVE_LEFT_RIGHT = 'move_left_right';
    App.TRANSITION_MOVE_RIGHT = 'move_right';
    App.TRANSITION_MOVE_TOP = 'move_top';
    App.TRANSITION_MOVE_TOP_BOTTOM = 'move_top_bottom';
    App.TRANSITION_WAVE = 'wave';
    return App;
})();
exports.App = App;
},{"../internal/app":2,"../internal/environment":3,"../internal/internal":6,"../internal/util/json":8,"../internal/util/rectangle":9,"../internal/util/xml":10}],2:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var internal_1 = require('./internal');
var json_1 = require('./util/json');
var POSTMESSAGE_CLOSE = '1';
var POSTMESSAGE_SIZE = '2';
var App = (function () {
    function App() {
    }
    /** Get the value of the given property */
    App.get = function (name) {
        return new Promise(function (resolve) {
            internal_1.exec('AppGetPropertyAsync', name, resolve);
        });
    };
    /** Sets the value of a property */
    App.set = function (name, value) {
        return new Promise(function (resolve) {
            internal_1.exec('AppSetPropertyAsync', name, value, function (ret) {
                resolve(ret === '0' ? false : true);
            });
        });
    };
    /** Gets the value of the given property as list */
    App.getAsList = function (name) {
        return new Promise(function (resolve) {
            App.get(name).then(function (xml) {
                var propsJSON = json_1.JSON.parse(xml), propsArr = [];
                if (propsJSON.children && propsJSON.children.length > 0) {
                    propsArr = propsJSON.children;
                }
                resolve(propsArr);
            });
        });
    };
    /** Get the value of the given global property */
    App.getGlobalProperty = function (name) {
        return internal_1.exec('GetGlobalProperty', name);
    };
    /** Calls a DLL function synchronously */
    App.callDll = function (func) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var args = [].slice.call(arguments);
        args.unshift('CallDll');
        return internal_1.exec.apply(this, args);
    };
    /** Calls an application method asynchronously */
    App.callFunc = function (func, arg) {
        return new Promise(function (resolve) {
            internal_1.exec('AppCallFuncAsync', func, arg, function (ret) {
                resolve(ret);
            });
        });
    };
    App.postMessage = function (key) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve) {
            args.unshift(key);
            args.unshift('PostMessageToParent');
            args.push(function (val) {
                resolve(val);
            });
            internal_1.exec.apply(_this, args);
        });
    };
    return App;
})();
exports.App = App;
},{"./internal":6,"./util/json":8}],3:[function(require,module,exports){
var Environment = (function () {
    function Environment() {
    }
    Environment.initialize = function () {
        if (Environment._initialized) {
            return;
        }
        Environment._isHtml = (window.external &&
            window.external['GetConfiguration'] !== undefined);
        Environment._isConfig = (window.external &&
            window.external['GetConfiguration'] === undefined &&
            window.external['GetViewId'] !== undefined &&
            window.external['GetViewId']() !== undefined);
        Environment._isScript = (window.external &&
            window.external['GetConfiguration'] === undefined &&
            window.external['GetViewId'] !== undefined &&
            window.external['GetViewId']() === undefined);
        Environment._initialized = true;
    };
    Environment.isSourceHtml = function () {
        return Environment._isHtml;
    };
    Environment.isSourceConfig = function () {
        return Environment._isConfig;
    };
    Environment.isScriptPlugin = function () {
        return Environment._isScript;
    };
    return Environment;
})();
exports.Environment = Environment;
Environment.initialize();
},{}],4:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var Global = (function () {
    function Global() {
    }
    Global.addInitializationPromise = function (promise) {
        Global.initialPromises.push(promise);
    };
    Global.getInitializationPromises = function () {
        return Global.initialPromises;
    };
    Global.setPersistentConfig = function (config) {
        console.log('setting persistent config: ' + JSON.stringify(config));
        Global.persistedConfig = config;
    };
    Global.getPersistentConfig = function () {
        return Global.persistedConfig;
    };
    Global.persistedConfig = {};
    Global.initialPromises = [];
    return Global;
})();
exports.Global = Global;
},{}],5:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var environment_1 = require('./environment');
var item_1 = require('./item');
var internal_1 = require('./internal');
var global_1 = require('./global');
function resolveRelativePath(path, base) {
    // ABSOLUTE PATHS
    if (path.substring(0, 7) === 'http://' ||
        path.substring(0, 8) === 'https://') {
        return path;
    }
    else if (path.substring(0, 2) === '//') {
        // get current protocol
        return base.split('://')[0] + ':' + path;
    }
    else if (path.substring(0, 3) === '../') {
        // RELATIVE PATHS
        var upDirectoryCount = 0;
        // count ../ segments
        while (path.substring(0, 3) === '../') {
            path = path.substring(3);
            ++upDirectoryCount;
        }
        var baseDirectories = base.split('/');
        baseDirectories = baseDirectories.slice(0, length - 1 - upDirectoryCount);
        baseDirectories.push(path);
        return baseDirectories.join('/');
    }
    else {
        if (path.substring(0, 2) === './') {
            path = path.substring(2);
        }
        var baseSegments = base.split('/');
        baseSegments[baseSegments.length - 1] = path;
        return baseSegments.join('/');
    }
}
function readMetaConfigUrl() {
    return new Promise(function (resolve) {
        if (environment_1.Environment.isSourceHtml()) {
            // initialize config URL if necessary
            internal_1.exec('GetLocalPropertyAsync', 'prop:BrowserConfiguration', function (result) {
                var configObj = JSON.parse(decodeURIComponent(result));
                if (configObj === null) {
                    configObj = {};
                }
                var metas = document.getElementsByTagName("meta");
                for (var i = metas.length - 1; i >= 0; i--) {
                    if (metas[i].name === 'config-url') {
                        var url = resolveRelativePath(metas[i].content, window.location.href);
                        configObj.configUrl = url;
                        internal_1.exec('SetBrowserProperty', 'Configuration', JSON.stringify(configObj));
                        var persist = {
                            configUrl: url
                        };
                        global_1.Global.setPersistentConfig(persist);
                        break;
                    }
                }
                resolve();
            });
        }
        else {
            resolve();
        }
    });
}
function getCurrentSourceID() {
    return new Promise(function (resolve) {
        if (environment_1.Environment.isSourceHtml() || environment_1.Environment.isSourceConfig()) {
            // initialize Item.getSource() functions
            internal_1.exec('GetLocalPropertyAsync', 'prop:id', function (result) {
                var id = decodeURIComponent(result);
                item_1.Item.setBaseID(id);
                if (environment_1.Environment.isSourceHtml()) {
                    item_1.Item.lockSourceSlot(id);
                }
                resolve();
            });
        }
        else {
            resolve();
        }
    });
}
function init() {
    global_1.Global.addInitializationPromise(readMetaConfigUrl());
    global_1.Global.addInitializationPromise(getCurrentSourceID());
    Promise.all(global_1.Global.getInitializationPromises()).then(function () {
        document.dispatchEvent(new CustomEvent('xjs-ready', {
            bubbles: true
        }));
    });
}
init();
},{"./environment":3,"./global":4,"./internal":6,"./item":7}],6:[function(require,module,exports){
/// <reference path="../../defs/window.d.ts" />
exports.DEBUG = false;
var _callbacks = {};
/**
* Executes an external function
*/
function exec(funcName) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var callback = null, ret = false;
    if (args.length > 0) {
        callback = args[args.length - 1];
        if (callback instanceof Function) {
            args.pop();
        }
        else {
            callback = null;
        }
    }
    if (exports.DEBUG) {
        console.log([
            'internal.exec("', funcName, '") ', JSON.stringify(args)
        ].join(' '));
    }
    if (window.external &&
        window.external[funcName] &&
        window.external[funcName] instanceof Function) {
        ret = window.external[funcName].apply(this, args);
    }
    // register callback if present
    if (callback !== null) {
        _callbacks[ret] = callback;
    }
    return ret;
}
exports.exec = exec;
window.OnAsyncCallback = function (asyncID, result) {
    var callback = _callbacks[asyncID];
    if (callback instanceof Function) {
        callback.call(this, decodeURIComponent(result));
    }
};
window.OnSceneLoad = function (view, scene) {
    document.dispatchEvent(new CustomEvent('scene-load', { detail: { view: view, scene: scene } }));
};
window.SetConfiguration = function (config) {
    document.dispatchEvent(new CustomEvent('set-configuration', { config: config }));
};
window.SetBackGroundColor = function (color) {
    document.dispatchEvent(new CustomEvent('set-background-color', { color: color }));
};
window.SetVolume = function (volume) {
    document.dispatchEvent(new CustomEvent('set-volume', { volume: volume }));
};
window.OnDialogResult = function (result) {
    document.dispatchEvent(new CustomEvent('dialog-result', { detail: { result: result } }));
};
},{}],7:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var internal_1 = require('./internal');
var environment_1 = require('./environment');
var Item = (function () {
    function Item(props) {
        var props = props || {};
        this.name = props.name;
        this.value = props.item;
        this.id = props.id;
        this.sceneID = props.sceneID;
        this.viewID = props.viewID;
    }
    /** Prepare an item for manipulation */
    Item.attach = function (itemID, view) {
        if (environment_1.Environment.isScriptPlugin()) {
            return Item.cacheItemID(itemID);
        }
        else {
            return Item.cacheItemID(itemID, view);
        }
    };
    // returns 0-indexed slot where item ID is cached/attached
    Item.cacheItemID = function (itemID, viewID) {
        var slot = Item.itemSlotMap.indexOf(itemID);
        if (slot === -1) {
            slot = ++Item.lastSlot % Item.MAX_SLOTS;
            if (Item.islockedSourceSlot && slot === 0) {
                ++slot; // source cannot attach to first slot
            }
            Item.lastSlot = slot;
            Item.itemSlotMap[slot] = itemID;
            if (viewID === undefined) {
                internal_1.exec('SearchVideoItem' +
                    (String(slot) === '0' ? '' : (slot + 1)), itemID);
            }
            else {
                internal_1.exec('AttachVideoItem' +
                    (String(slot) === '0' ? '' : (slot + 1)), itemID);
            }
        }
        return slot;
    };
    Item.lockSourceSlot = function (itemID) {
        if (itemID !== undefined) {
            Item.islockedSourceSlot = true;
            Item.itemSlotMap[0] = itemID;
        }
        else {
            Item.islockedSourceSlot = false;
            Item.itemSlotMap[0] = '';
        }
    };
    /** Get an item's local property asynchronously */
    Item.get = function (name, slot) {
        if (slot === void 0) { slot = 0; }
        return new Promise(function (resolve) {
            internal_1.exec('GetLocalPropertyAsync' +
                (String(slot) === '0' ? '' : slot + 1), name, function (val) {
                resolve(val);
            });
        });
    };
    /** Sets an item's local property */
    Item.set = function (name, value, slot) {
        if (slot === void 0) { slot = 0; }
        internal_1.exec('SetLocalPropertyAsync' +
            (String(slot) === '0' ? '' : slot + 1), name, value);
    };
    /** Calls a function defined in an item/source */
    Item.callFunc = function (func, arg) {
        internal_1.exec('CallInner', func, arg);
    };
    /** helper function to get current source on init */
    Item.setBaseID = function (id) {
        Item.baseID = id;
    };
    /** helper function for Item.getCurrentSource() */
    Item.getBaseID = function () {
        return Item.baseID;
    };
    Item.MAX_SLOTS = 2;
    Item.lastSlot = Item.MAX_SLOTS - 1;
    Item.itemSlotMap = [];
    Item.islockedSourceSlot = false;
    return Item;
})();
exports.Item = Item;
},{"./environment":3,"./internal":6}],8:[function(require,module,exports){
var xml_1 = require('./xml');
var JSON = (function () {
    function JSON(xml) {
        if (xml === undefined || xml === '') {
            return;
        }
        var sxml = xml;
        if (xml instanceof xml_1.XML) {
            sxml = xml.toString();
        }
        var openingRegex = /<([^\s>\/]+)/g;
        var selfCloseRegex = /(\/>)/g;
        var openResult = openingRegex.exec(sxml);
        var selfCloseResult = selfCloseRegex.exec(sxml);
        var xmlDocument = (new DOMParser()).parseFromString(sxml, 'application/xml');
        var processNode = function (node) {
            var obj = new JSON();
            obj.tag = node.tagName;
            // FIXME: optimize complex condition
            // every time we process a new node, we advance the opening tag regex
            openResult = openingRegex.exec(sxml);
            if (openResult === null && selfCloseRegex.lastIndex === 0) {
            }
            else if (openResult === null && selfCloseRegex.lastIndex > 0) {
                // no more opening tags, so by default the self-closing belongs to this
                obj.selfclosing = true;
                selfCloseResult = selfCloseRegex.exec(sxml);
            }
            else if (openResult !== null &&
                selfCloseRegex.lastIndex > openingRegex.lastIndex) {
            }
            else if (openResult !== null &&
                selfCloseRegex.lastIndex < openingRegex.lastIndex &&
                selfCloseRegex.lastIndex === openingRegex.lastIndex -
                    openResult[0].length // make sure self-closing pattern belongs to
            ) {
                obj.selfclosing = true;
                selfCloseResult = selfCloseRegex.exec(sxml);
            }
            for (var i = 0; i < node.attributes.length; i++) {
                var att = node.attributes[i];
                obj[att.name] = att.value;
            }
            obj.children = [];
            // FIXME: self-closing nodes do not have children, maybe optimize then?
            for (var j = 0; j < node.childNodes.length; j++) {
                var child = node.childNodes[j];
                if (child instanceof Element) {
                    obj.children.push(processNode(child));
                }
            }
            // process text value
            if (obj.value === undefined && obj.children.length === 0) {
                delete obj.children;
                obj.value = node.textContent;
            }
            return obj;
        };
        return processNode(xmlDocument.childNodes[0]);
    }
    JSON.parse = function (xml) {
        return new JSON(xml);
    };
    return JSON;
})();
exports.JSON = JSON;
},{"./xml":10}],9:[function(require,module,exports){
var Rectangle = (function () {
    function Rectangle() {
    }
    /** Gets the top value */
    Rectangle.prototype.getTop = function () {
        return this.top;
    };
    /** Sets the top value */
    Rectangle.prototype.setTop = function (top) {
        this.top = top;
        if (this.bottom !== undefined) {
            this.setHeight(Math.abs(this.top - this.bottom));
        }
        else if (this.height !== undefined) {
            this.setBottom(this.top + this.height);
        }
    };
    /** Gets the left value */
    Rectangle.prototype.getLeft = function () {
        return this.left;
    };
    /** Sets the left value */
    Rectangle.prototype.setLeft = function (left) {
        this.left = left;
        if (this.right !== undefined) {
            this.setWidth(Math.abs(this.right - this.left));
        }
        else if (this.width !== undefined) {
            this.setRight(this.left + this.width);
        }
    };
    /** Gets the right value */
    Rectangle.prototype.getRight = function () {
        return this.right;
    };
    /** Sets the right value */
    Rectangle.prototype.setRight = function (right) {
        this.right = right;
        if (this.left !== undefined) {
            this.setWidth(Math.abs(this.right - this.left));
        }
        else if (this.width !== undefined) {
            this.setLeft(this.right - this.width);
        }
    };
    /** Gets the bottom value */
    Rectangle.prototype.getBottom = function () {
        return this.bottom;
    };
    /** Sets the bottom value */
    Rectangle.prototype.setBottom = function (bottom) {
        this.bottom = bottom;
        if (this.top !== undefined) {
            this.setHeight(Math.abs(this.top - this.bottom));
        }
        else if (this.height !== undefined) {
            this.setTop(this.bottom - this.height);
        }
    };
    /** Gets the width value */
    Rectangle.prototype.getWidth = function () {
        return this.width;
    };
    /** Sets the width value */
    Rectangle.prototype.setWidth = function (width) {
        this.width = width;
        if (this.right !== undefined) {
            this.setLeft(this.right - this.width);
        }
        else if (this.left !== undefined) {
            this.setRight(this.left + this.width);
        }
    };
    /** Gets the height value */
    Rectangle.prototype.getHeight = function () {
        return this.height;
    };
    /** Sets the height value */
    Rectangle.prototype.setHeight = function (height) {
        this.height = height;
        if (this.top !== undefined) {
            this.setBottom(this.top + this.height);
        }
        else if (this.bottom !== undefined) {
            this.setTop(this.bottom - this.height);
        }
    };
    Rectangle.fromDimensions = function (width, height) {
        if (width < 0 || height < 0) {
            throw new Error('Rectangle dimensions cannot be negative.');
        }
        var rect = new Rectangle();
        rect.width = width;
        rect.height = height;
        return rect;
    };
    Rectangle.fromCoordinates = function (top, left, right, bottom) {
        if (top > bottom) {
            throw new Error('Top coordinate must be smaller than bottom.');
        }
        else if (left > right) {
            throw new Error('Right coordinate must be smaller than left.');
        }
        var rect = new Rectangle();
        rect.top = top;
        rect.left = left;
        rect.setRight(right); // calculates width
        rect.setBottom(bottom); // calculates height
        return rect;
    };
    Rectangle.prototype.toDimensionString = function () {
        return this.width + ',' + this.height;
    };
    Rectangle.prototype.toCoordinateString = function () {
        if (this.left === undefined) {
            throw new Error('This Rectangle instance does not have coordinates.');
        }
        else {
            return this.left + ',' + this.top + ',' + this.right + ',' + this.bottom;
        }
    };
    Rectangle.prototype.toString = function (value) {
        if (value === undefined) {
            return this.toDimensionString(); // all rectangles have dimensions
        }
        else {
            var format = value;
            format = format.replace(':left', String(this.left));
            format = format.replace(':top', String(this.top));
            format = format.replace(':right', String(this.right));
            format = format.replace(':bottom', String(this.bottom));
            format = format.replace(':width', String(this.width));
            format = format.replace(':height', String(this.height));
            return format;
        }
    };
    return Rectangle;
})();
exports.Rectangle = Rectangle;
},{}],10:[function(require,module,exports){
var XML = (function () {
    function XML(json) {
        var attributes = '';
        var value = '';
        if (json.value === undefined) {
            json.value = '';
        }
        for (var key in json) {
            if (!XML.RESERVED_ATTRIBUTES.test(key) &&
                json[key] !== undefined) {
                attributes += [' ', key, '=\'', json[key], '\''].join('');
            }
        }
        if (json.children === undefined) {
            json.children = [];
        }
        for (var _i = 0, _a = json.children; _i < _a.length; _i++) {
            var child = _a[_i];
            json.value += new XML(child).toString();
        }
        if (json.selfclosing === true) {
            this.xml = ['<', json.tag, attributes, ' />'].join('');
        }
        else if (value !== '') {
            this.xml = ['<', json.tag, attributes, '>',
                value, '</', json.tag, '>'].join('');
        }
        else {
            // json actually contains text content
            this.xml = ['<', json.tag, attributes, '>',
                json.value, '</', json.tag, '>'].join('');
        }
    }
    XML.prototype.toString = function () {
        return this.xml;
    };
    XML.parseJSON = function (json) {
        return new XML(json);
    };
    XML.encode = function (str) {
        return str.replace(/[&<>'']/g, function ($0) {
            return '&' + {
                '&': 'amp',
                '<': 'lt',
                '>': 'gt',
                '\'': 'quot',
                '"': '#39'
            }[$0] + ';';
        });
    };
    XML.RESERVED_ATTRIBUTES = /^(children|tag|value|selfclosing)$/i;
    return XML;
})();
exports.XML = XML;
},{}],"xjs":[function(require,module,exports){
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require('../internal/init');
__export(require('./app'));
},{"../internal/init":5,"./app":1}]},{},["xjs"]);
