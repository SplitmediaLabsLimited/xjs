require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
var rectangle_1 = require('../util/rectangle');
var audio_1 = require('../system/audio');
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var internal_1 = require('../internal/internal');
var environment_1 = require('./environment');
var DEFAULT_SILENCE_DETECTION_THRESHOLD = 5;
var DEFAULT_SILENCE_DETECTION_PERIOD = 1000;
/**
 * The App Class provides you methods to get and set application-related
 * functionalities.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var App = new XJS.App();
 *
 * App.getFrameTime().then(function(frametime) {
 *   window.frametime = frametime;
 * });
 * ```
 */
var App = (function () {
    function App() {
    }
    /**
     * return: Promise<number>
     *
     * Gets application's frame time (duration per frame in 100ns unit)
     *
     * #### Usage
     *
     * ```javascript
     * var frameTimeP = App.getFrameTime();
     * frameTimeP.then(function(res) {
     *   var frameTime = res;
     * });
     * ```
     */
    App.prototype.getFrametime = function () {
        return new Promise(function (resolve) {
            app_1.App.get('frametime').then(function (val) {
                resolve(Number(val));
            });
        });
    };
    /**
     * return: Promise<Rectangle>
     *
     * Gets application default output resolution
     *
     * #### Usage
     *
     * ```javascript
     * var resolutionP = App.getResolution();
     * resolutionP.then(function(res) {
     *   var height = res.getHeight();
     *   var width = res.getWidth();
     * });
     * ```
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
     * return: Promise<Rectangle>
     *
     * Gets application viewport display resolution
     *
     * #### Usage
     *
     * ```javascript
     * var viewPortP = App.getViewport();
     * viewPortP.then(function(res) {
     *   var height = res.getHeight();
     *   var width = res.getWidth();
     * });
     * ```
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
     * return: Promise<string>
     *
     * Refers to XSplit Broadcaster DLL file version number
     *
     * #### Usage
     *
     * ```javascript
     * var versionP = App.getVersion();
     * versionP.then(function(res) {
     *   var version = res;
     * });
     * ```
     */
    App.prototype.getVersion = function () {
        return new Promise(function (resolve) {
            resolve(app_1.App.get('version'));
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets the total number of frames rendered
     *
     * #### Usage
     *
     * ```javascript
     * var framesrenderedP = App.getFramesRendered();
     * framesrenderedP.then(function(res) {
     *   var framesrendered = res;
     * });
     * ```
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
     * return: Promise<AudioDevice>
     *
     * Gets the primary microphone device used in the application
     *
     * ### Usage
     *
     * ```javascript
     * App.getPrimaryMic().then(function(audioDevice) {
     *   var primaryMic = audioDevice;
     * });
     * ```
     */
    App.prototype.getPrimaryMic = function () {
        return new Promise(function (resolve) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 0) {
                    resolve(audioDevices[0]);
                }
                else {
                    resolve(new audio_1.AudioDevice({ id: "empty" }));
                }
            });
        });
    };
    /**
     * return: Promise<AudioDevice>
     *
     * Gets the primary speaker/audio render device used in the application
     *
     * ### Usage
     *
     * ```javascript
     * App.getPrimarySpeaker().then(function(audioDevice) {
     *   var primarySpeaker = audioDevice;
     * });
     * ```
     */
    App.prototype.getPrimarySpeaker = function () {
        return new Promise(function (resolve) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 1) {
                    resolve(audioDevices[1]);
                }
                else {
                    resolve(new audio_1.AudioDevice({ id: "empty" }));
                }
            });
        });
    };
    /**
     * param: device<AudioDevice>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the primary microphone device to be used in the application
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMic(device).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimaryMic = function (device) {
        return new Promise(function (resolve) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                audioDevices[0] = device;
                var dev = '';
                if (Array.isArray(audioDevices)) {
                    for (var i = 0; i < audioDevices.length; ++i) {
                        dev += audioDevices[i].toString();
                    }
                }
                dev = '<devices>' + dev + '</devices>';
                app_1.App.set('microphonedev2', dev).then(function (setVal) {
                    resolve(setVal);
                });
            });
        });
    };
    /**
     * param: device<AudioDevice>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the primary speaker/audio render device to be used in the application
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeaker(device).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimarySpeaker = function (device) {
        return new Promise(function (resolve) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                audioDevices[1] = device;
                var dev = '';
                if (Array.isArray(audioDevices)) {
                    for (var i = 0; i < audioDevices.length; ++i) {
                        dev += audioDevices[i].toString();
                    }
                }
                dev = '<devices>' + dev + '</devices>';
                app_1.App.set('microphonedev2', dev).then(function (setVal) {
                    resolve(setVal);
                });
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Gets whether silence detection is enabled
     *
     * ### Usage
     *
     * ```javascript
     * App.isSilenceDetectionEnabled().then(function(val) {
     *   var isEnabled = val;
     * });
     * ```
     */
    App.prototype.isSilenceDetectionEnabled = function () {
        return new Promise(function (resolve) {
            app_1.App.get('microphonegain').then(function (val) {
                var micGainObj = json_1.JSON.parse(val);
                resolve(micGainObj['enable'] == '1');
            });
        });
    };
    /**
     * param: enabled<boolean>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Enables or disables silence detection
     *
     * ### Usage
     *
     * ```javascript
     * App.enableSilenceDetection(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.enableSilenceDetection = function (enabled) {
        return new Promise(function (resolve) {
            app_1.App.get('microphonegain').then(function (val) {
                var silenceDetectionObj = json_1.JSON.parse(decodeURIComponent(val));
                silenceDetectionObj['enable'] = (enabled ? '1' : '0');
                app_1.App.set('microphonegain', xml_1.XML.parseJSON(silenceDetectionObj).toString())
                    .then(function (setVal) {
                    resolve(setVal);
                });
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets silence detection period,
     * the length of time after voice detection before silence is again detected
     *
     * ### Usage
     *
     * ```javascript
     * App.getSilenceDetectionPeriod().then(function(val) {
     *   var silenceDetectionPeriod = val;
     * });
     * ```
     */
    App.prototype.getSilenceDetectionPeriod = function () {
        return new Promise(function (resolve) {
            app_1.App.get('microphonegain').then(function (val) {
                var micGainObj = json_1.JSON.parse(val);
                resolve(micGainObj['latency'] !== undefined ?
                    Number(micGainObj['latency']) : DEFAULT_SILENCE_DETECTION_PERIOD);
            });
        });
    };
    /**
     * param: sdPeriod<number>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets silence detection period (0-60000 ms),
     * the length of time after voice detection before silence is again detected
     *
     * ### Usage
     *
     * ```javascript
     * App.setSilenceDetectionPeriod(sdPeriod).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setSilenceDetectionPeriod = function (sdPeriod) {
        return new Promise(function (resolve, reject) {
            if (typeof sdPeriod !== 'number') {
                reject(Error('Silence detection period must be a number'));
            }
            else if (sdPeriod % 1 != 0) {
                reject(Error('Silence detection period must be an integer'));
            }
            else if (sdPeriod < 0 || sdPeriod > 60000) {
                reject(Error('Silence detection must be in the range 0-60000.'));
            }
            app_1.App.get('microphonegain').then(function (val) {
                var silenceDetectionObj = json_1.JSON.parse(decodeURIComponent(val));
                silenceDetectionObj['latency'] = (sdPeriod.toString());
                app_1.App.set('microphonegain', xml_1.XML.parseJSON(silenceDetectionObj).toString())
                    .then(function (setVal) {
                    resolve(setVal);
                });
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets silence detection threshold/silence amplitude
     *
     * ### Usage
     *
     * ```javascript
     * App.getSilenceDetectionThreshold().then(function(val) {
     *   var silenceDetectionTfhreshold = val;
     * });
     * ```
     */
    App.prototype.getSilenceDetectionThreshold = function () {
        return new Promise(function (resolve) {
            app_1.App.get('microphonegain').then(function (val) {
                var micGainObj = json_1.JSON.parse(val);
                resolve(micGainObj['gain'] !== undefined ?
                    Number(micGainObj['gain']) : DEFAULT_SILENCE_DETECTION_THRESHOLD);
            });
        });
    };
    /**
     * param: sdThreshold<number>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets silence detection threshold/silence amplitude (values from 0-128)
     *
     * ### Usage
     *
     * ```javascript
     * App.setSilenceDetectionThreshold(sdThreshold).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setSilenceDetectionThreshold = function (sdThreshold) {
        return new Promise(function (resolve, reject) {
            if (typeof sdThreshold !== 'number') {
                reject(Error('Silence detection threshold must be a number'));
            }
            else if (sdThreshold % 1 != 0) {
                reject(Error('Silence detection threshold must be an integer'));
            }
            else if (sdThreshold < 0 || sdThreshold > 128) {
                reject(Error('Silence detection threshold must be in the range 0-128.'));
            }
            app_1.App.get('microphonegain').then(function (val) {
                var silenceDetectionObj = json_1.JSON.parse(decodeURIComponent(val));
                silenceDetectionObj['gain'] = (sdThreshold.toString());
                app_1.App.set('microphonegain', xml_1.XML.parseJSON(silenceDetectionObj).toString())
                    .then(function (setVal) {
                    resolve(setVal);
                });
            });
        });
    };
    /**
     * param: url<string>[, width<number>[, height<number>[, flags<number>[, title<string>]]]]
     *
     * Creates a persistent modal dialog.<br/>
     * This method is not available for source
     *
     * #### Usage
     *
     * ```javascript
     * // you may use the following:
     * //     * App.BORDER_ENABLE (1)
     * //     * App.BORDER_ENABLE_CAPTION (2)
     * //     * App.BORDER_ENABLE_SIZING (4)
     * //     * App.BORDER_ENABLE_MINIMIZE (8)
     * //     * App.BORDER_ENABLE_MAXIMIZE (16)
     * App.newDialog(url, width, height, flags, title);
     * ```
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
     * param: url<string>[, width<number>[, height<number>]]
     *
     * Creates a dialog that automatically closes on outside click
     *
     * #### Usage
     *
     * ```javascript
     * App.newAutoDialog(url, width, height);
     * ```
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
     * return: Promise<string>
     *
     * Gets the transition for scene changes
     *
     * #### Usage
     *
     * ```javascript
     * var transitionP = App.getTransition();
     * transitionP.then(function(res) {
     *   var transitionid = res;
     * });
     * ```
     */
    App.prototype.getTransition = function () {
        return new Promise(function (resolve) {
            app_1.App.get('transitionid').then(function (val) {
                resolve(val);
            });
        });
    };
    /**
     * param: transition<string>
     * ```
     * return: Promise<string>
     * ```
     *
     * Sets the transition for scene changes
     *
     * #### Usage
     *
     * ```javascript
     * // you may use the following:
     * //     * App.TRANSITION_CLOCK
     * //     * App.TRANSITION_COLLAPSE
     * //     * App.TRANSITION_FADE
     * //     * App.TRANSITION_FAN
     * //     * App.TRANSITION_HOLE
     * //     * App.TRANSITION_MOVE_BOTTOM
     * //     * App.TRANSITION_MOVE_LEFT
     * //     * App.TRANSITION_MOVE_LEFT_RIGHT
     * //     * App.TRANSITION_MOVE_RIGHT
     * //     * App.TRANSITION_MOVE_TOP
     * //     * App.TRANSITION_MOVE_TOP_BOTTOM
     * //     * App.TRANSITION_WAVE
     * App.setTransition(App.TRANSITION_CLOCK).then(function(val) {
     *  var isSet = val;
     * });
     * ```
     */
    App.prototype.setTransition = function (transition) {
        return new Promise(function (resolve) {
            app_1.App.set('transitionid', transition).then(function (val) {
                resolve(val);
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets the scene transition duration in milliseconds
     *
     * #### Usage
     *
     * ```javascript
     * var transitionTimeP = App.getTransitionTime();
     * transitionTimeP.then(function(res) {
     *   var transitiontime = res;
     * });
     * ```
     */
    App.prototype.getTransitionTime = function () {
        return new Promise(function (resolve) {
            app_1.App.get('transitiontime').then(function (val) {
                resolve(Number(val));
            });
        });
    };
    /**
     * param: transition<number>
     * ```
     * return: Promise<string>
     * ```
     *
     * Sets the scene transition duration in milliseconds
     *
     * #### Usage
     *
     * ```javascript
     * App.setTransitionTime(time).then(function(val) {
     *  var isSet = val;
     * });
     * ```
     */
    App.prototype.setTransitionTime = function (time) {
        return new Promise(function (resolve) {
            app_1.App.set('transitiontime', time.toString()).then(function (val) {
                resolve(val);
            });
        });
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
},{"../internal/app":12,"../internal/internal":15,"../internal/util/json":17,"../internal/util/xml":19,"../system/audio":20,"../util/rectangle":25,"./environment":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mixin_1 = require('../../internal/util/mixin');
var item_1 = require('../../internal/item');
var ilayout_1 = require('./ilayout');
var icolor_1 = require('./icolor');
var ichroma_1 = require('./ichroma');
var itransition_1 = require('./itransition');
var item_2 = require('./item');
var CameraItem = (function (_super) {
    __extends(CameraItem, _super);
    function CameraItem() {
        _super.apply(this, arguments);
    }
    CameraItem.prototype.getDeviceId = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:value', slot).then(function (val) {
                resolve(val);
            });
        });
    };
    // special color options pinning
    /** Set this to true to share color settings across all instances of this
     *  camera device on the stage.
     */
    CameraItem.prototype.setColorOptionsPinned = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:cc_pin', value ? '1' : '0', slot);
    };
    /** Checks whether color settings are shared across all instances of
     *  this camera device on the stage.
     */
    CameraItem.prototype.getColorOptionsPinned = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:cc_pin', slot).then(function (val) {
                resolve(val === '1' ? true : false);
            });
        });
    };
    // special chroma options pinning
    /** Set this to true to share chroma keying settings across all instances of
     *  this camera device on the stage.
     */
    CameraItem.prototype.setKeyingOptionsPinned = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_pin', value ? '1' : '0', slot);
    };
    /** Checks whether chroma keying settings are shared across all instances of
     *  this camera device on the stage.
     */
    CameraItem.prototype.getKeyingOptionsPinned = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_pin', slot).then(function (val) {
                resolve(val === '1' ? true : false);
            });
        });
    };
    return CameraItem;
})(item_2.Item);
exports.CameraItem = CameraItem;
mixin_1.applyMixins(CameraItem, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition]);
},{"../../internal/item":16,"../../internal/util/mixin":18,"./ichroma":5,"./icolor":6,"./ilayout":7,"./item":8,"./itransition":9}],4:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mixin_1 = require('../../internal/util/mixin');
var item_1 = require('../../internal/item');
var ilayout_1 = require('./ilayout');
var icolor_1 = require('./icolor');
var ichroma_1 = require('./ichroma');
var item_2 = require('./item');
var json_1 = require('../../internal/util/json');
var xml_1 = require('../../internal/util/xml');
var item_3 = require('./item');
var environment_1 = require('../environment');
var GameItem = (function (_super) {
    __extends(GameItem, _super);
    function GameItem() {
        _super.apply(this, arguments);
    }
    /**
     * return: boolean
     *
     * Check if Game Special Optimization is currently enabled or not
     */
    GameItem.prototype.isSpecialOptimization = function () {
        return new Promise(function (resolve) {
            item_1.Item.get('GameCapSurfSharing').then(function (res) {
                resolve(res === '1');
            });
        });
    };
    /**
     * param: boolean
     *
     * Set Game Special Optimization to on or off
     */
    GameItem.prototype.setSpecialOptimization = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('GameCapSurfSharing', (value ? '1' : '0'), slot);
    };
    /**
     * return: boolean
     *
     * Check if Show Mouse is currently enabled or not
     */
    GameItem.prototype.isShowMouse = function () {
        return new Promise(function (resolve) {
            item_1.Item.get('GameCapShowMouse').then(function (res) {
                resolve(res === '1');
            });
        });
    };
    /**
     * param: boolean
     *
     * Set Show Mouse in game to on or off
     */
    GameItem.prototype.setShowMouse = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('GameCapShowMouse', (value ? '1' : '0'), slot);
    };
    /**
     * param: string
     *
     * Set the offline image of a game source
     */
    GameItem.prototype.setOfflineImage = function (path) {
        var _this = this;
        if (this.type !== item_3.ItemTypes.GAMESOURCE) {
            throw new Error('Current item should be a game source');
        }
        if (environment_1.Environment.isSourceHtml()) {
            new Error('Source plugins cannot update offline images of other sources');
        }
        if (!(this.value instanceof xml_1.XML)) {
            this.getValue().then(function () {
                _this.setOfflineImage(path);
            });
            return;
        }
        var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?' +
            '\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*))\.(png|gif|jpg|jpeg|tif)$');
        if (regExp.test(path)) {
            var valueObj = json_1.JSON.parse(this.value.toString());
            valueObj['replace'] = path;
            this.setValue(xml_1.XML.parseJSON(valueObj));
        }
    };
    /**
     * return: string
     *
     * Get the offline image of a game source
     */
    GameItem.prototype.getOfflineImage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.type !== item_3.ItemTypes.GAMESOURCE) {
                reject(Error('Current item should be a game source'));
            }
            if (!(_this.value instanceof xml_1.XML)) {
                _this.getValue().then(function () {
                    _this.getOfflineImage().then(function (val) {
                        resolve(val);
                    });
                });
            }
            else {
                var valueObj = json_1.JSON.parse(_this.value.toString());
                resolve(valueObj['replace']);
            }
        });
    };
    return GameItem;
})(item_2.Item);
exports.GameItem = GameItem;
mixin_1.applyMixins(GameItem, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma]);
},{"../../internal/item":16,"../../internal/util/json":17,"../../internal/util/mixin":18,"../../internal/util/xml":19,"../environment":2,"./ichroma":5,"./icolor":6,"./ilayout":7,"./item":8}],5:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var color_1 = require('../../util/color');
(function (KeyingType) {
    KeyingType[KeyingType["LEGACY"] = 0] = "LEGACY";
    KeyingType[KeyingType["COLORKEY"] = 1] = "COLORKEY";
    KeyingType[KeyingType["RGBKEY"] = 2] = "RGBKEY"; // Chroma Key RGB Mode
})(exports.KeyingType || (exports.KeyingType = {}));
var KeyingType = exports.KeyingType;
(function (ChromaPrimaryColors) {
    ChromaPrimaryColors[ChromaPrimaryColors["RED"] = 0] = "RED";
    ChromaPrimaryColors[ChromaPrimaryColors["GREEN"] = 1] = "GREEN";
    ChromaPrimaryColors[ChromaPrimaryColors["BLUE"] = 2] = "BLUE";
})(exports.ChromaPrimaryColors || (exports.ChromaPrimaryColors = {}));
var ChromaPrimaryColors = exports.ChromaPrimaryColors;
(function (ChromaAntiAliasLevel) {
    ChromaAntiAliasLevel[ChromaAntiAliasLevel["NONE"] = 0] = "NONE";
    ChromaAntiAliasLevel[ChromaAntiAliasLevel["LOW"] = 1] = "LOW";
    ChromaAntiAliasLevel[ChromaAntiAliasLevel["HIGH"] = 2] = "HIGH";
})(exports.ChromaAntiAliasLevel || (exports.ChromaAntiAliasLevel = {}));
var ChromaAntiAliasLevel = exports.ChromaAntiAliasLevel;
var ItemChroma = (function () {
    function ItemChroma() {
    }
    ItemChroma.prototype.isChromaEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromakey', slot).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemChroma.prototype.setChromaEnabled = function (value) {
        if (typeof value !== 'boolean') {
            throw new TypeError('Parameter should be boolean.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromakey', (value ? '1' : '0'), slot);
    };
    ItemChroma.prototype.getKeyingType = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromakeytype', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setKeyingType = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use a KeyingType value as the parameter.');
        }
        else if (value < 0 || value > 2) {
            throw new RangeError('Use a KeyingType value as the parameter.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromakeytype', String(value), slot);
    };
    // COMMON TO CHROMA LEGACY AND CHROMA RGB KEY
    ItemChroma.prototype.getChromaAntiAliasLevel = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_antialiasing', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaAntiAliasLevel = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use a ChromaAntiAliasLevel value as the parameter.');
        }
        else if (value < 0 || value > 2) {
            throw new RangeError('Use a ChromaAntiAliasLevel value as the parameter.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_antialiasing', String(value), slot);
    };
    // CHROMA LEGACY MODE FUNCTIONS
    ItemChroma.prototype.getChromaLegacyBrightness = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromabr', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyBrightness = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromabr', String(value), slot);
    };
    ItemChroma.prototype.getChromaLegacySaturation = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromasat', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacySaturation = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromasat', String(value), slot);
    };
    ItemChroma.prototype.getChromaLegacyHue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromahue', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyHue = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 180) {
            throw new RangeError('Valid value is an integer from 0-180.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromahue', String(value), slot);
    };
    ItemChroma.prototype.getChromaLegacyThreshold = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromarang', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyThreshold = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromarang', String(value), slot);
    };
    ItemChroma.prototype.getChromaLegacyAlphaSmoothing = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromaranga', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyAlphaSmoothing = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromaranga', String(value), slot);
    };
    // CHROMA RGB KEY FUNCTIONS
    ItemChroma.prototype.getChromaRGBKeyPrimaryColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromargbkeyprimary', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaRGBKeyPrimaryColor = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use a ChromaPrimaryColors value as the parameter.');
        }
        else if (value < 0 || value > 2) {
            throw new RangeError('Use a ChromaPrimaryColors value as the parameter.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromargbkeyprimary', String(value), slot);
    };
    ItemChroma.prototype.getChromaRGBKeyThreshold = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromargbkeythresh', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaRGBKeyThreshold = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromargbkeythresh', String(value), slot);
    };
    ItemChroma.prototype.getChromaRGBKeyExposure = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_chromargbkeybalance', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaRGBKeyExposure = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_chromargbkeybalance', String(value), slot);
    };
    // CHROMA COLOR KEY FUNCTIONS
    ItemChroma.prototype.getChromaColorKeyThreshold = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_colorrang', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaColorKeyThreshold = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_colorrang', String(value), slot);
    };
    ItemChroma.prototype.getChromaColorKeyExposure = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_colorranga', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaColorKeyExposure = function (value) {
        if (typeof value !== 'number') {
            throw new TypeError('Use an integer as the parameter.');
        }
        else if (value < 0 || value > 255) {
            throw new RangeError('Valid value is an integer from 0-255.');
        }
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_colorranga', String(value), slot);
    };
    ItemChroma.prototype.getChromaColorKeyColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:key_colorrgb', slot).then(function (val) {
                var color = color_1.Color.fromBGRString(val);
                resolve(color);
            });
        });
    };
    ItemChroma.prototype.setChromaColorKeyColor = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:key_colorrgb', value.getBgr(), slot);
    };
    return ItemChroma;
})();
exports.ItemChroma = ItemChroma;
},{"../../internal/item":16,"../../util/color":24}],6:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var color_1 = require('../../util/color');
var ItemColor = (function () {
    function ItemColor() {
    }
    ItemColor.prototype.getTransparency = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:alpha', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setTransparency = function (value) {
        if (value < 0 || value > 255) {
            throw new RangeError('Transparency may only be in the range 0 to 255.');
        }
        ;
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:alpha', String(value), slot);
    };
    ItemColor.prototype.getBrightness = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:cc_brightness', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setBrightness = function (value) {
        if (value < -100 || value > 100) {
            throw new RangeError('Brightness may only be in the range -100 to 100.');
        }
        else {
            var slot = item_1.Item.attach(this._id);
            item_1.Item.set('prop:cc_brightness', String(value), slot);
        }
    };
    ItemColor.prototype.getContrast = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:cc_contrast', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setContrast = function (value) {
        if (value < -100 || value > 100) {
            throw new RangeError('Contrast may only be in the range -100 to 100.');
        }
        else {
            var slot = item_1.Item.attach(this._id);
            item_1.Item.set('prop:cc_contrast', String(value), slot);
        }
    };
    ItemColor.prototype.getHue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:cc_hue', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setHue = function (value) {
        if (value < -180 || value > 180) {
            throw new RangeError('Contrast may only be in the range -180 to 180.');
        }
        else {
            var slot = item_1.Item.attach(this._id);
            item_1.Item.set('prop:cc_hue', String(value), slot);
        }
    };
    ItemColor.prototype.getSaturation = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:cc_saturation', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setSaturation = function (value) {
        if (value < -100 || value > 100) {
            throw new RangeError('Saturation may only be in the range -100 to 100');
        }
        else {
            var slot = item_1.Item.attach(this._id);
            item_1.Item.set('prop:cc_saturation', String(value), slot);
        }
    };
    ItemColor.prototype.getBorderColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:border', slot).then(function (val) {
                var bgr = Number(val) - 0x80000000;
                var color = color_1.Color.fromBGRInt(bgr);
                resolve(color);
            });
        });
    };
    ItemColor.prototype.setBorderColor = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:border', String(value.getIbgr() - 0x80000000), slot);
    };
    return ItemColor;
})();
exports.ItemColor = ItemColor;
},{"../../internal/item":16,"../../util/color":24}],7:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var rectangle_1 = require('../../util/rectangle');
var ItemLayout = (function () {
    function ItemLayout() {
    }
    ItemLayout.prototype.isKeepAspectRatio = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:keep_ar', slot).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemLayout.prototype.setKeepAspectRatio = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:keep_ar', value ? '1' : '0', slot);
    };
    ItemLayout.prototype.isPositionLocked = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:lockmove', slot).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemLayout.prototype.setPositionLocked = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:lockmove', value ? '1' : '0', slot);
    };
    ItemLayout.prototype.isEnhancedResizeEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:mipmaps', slot).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemLayout.prototype.setEnhancedResizeEnabled = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:mipmaps', value ? '1' : '0', slot);
    };
    ItemLayout.prototype.getPosition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:pos', slot).then(function (val) {
                var _a = decodeURIComponent(val).split(','), top = _a[0], left = _a[1], right = _a[2], bottom = _a[3];
                _this.position = rectangle_1.Rectangle.fromCoordinates(Number(top), Number(left), Number(right), Number(bottom));
                resolve(_this.position);
            });
        });
    };
    ItemLayout.prototype.setPosition = function (value) {
        var slot = item_1.Item.attach(this._id);
        this.position = value;
        item_1.Item.set('prop:pos', value.toString(), slot);
    };
    return ItemLayout;
})();
exports.ItemLayout = ItemLayout;
},{"../../internal/item":16,"../../util/rectangle":25}],8:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var environment_1 = require('../environment');
var json_1 = require('../../internal/util/json');
var xml_1 = require('../../internal/util/xml');
var scene_1 = require('../scene');
(function (ItemTypes) {
    ItemTypes[ItemTypes["UNDEFINED"] = 0] = "UNDEFINED";
    ItemTypes[ItemTypes["FILE"] = 1] = "FILE";
    ItemTypes[ItemTypes["LIVE"] = 2] = "LIVE";
    ItemTypes[ItemTypes["TEXT"] = 3] = "TEXT";
    ItemTypes[ItemTypes["BITMAP"] = 4] = "BITMAP";
    ItemTypes[ItemTypes["SCREEN"] = 5] = "SCREEN";
    ItemTypes[ItemTypes["FLASHFILE"] = 6] = "FLASHFILE";
    ItemTypes[ItemTypes["GAMESOURCE"] = 7] = "GAMESOURCE";
    ItemTypes[ItemTypes["HTML"] = 8] = "HTML";
})(exports.ItemTypes || (exports.ItemTypes = {}));
var ItemTypes = exports.ItemTypes;
/**
 * An Item represents an object that is used as a source on the stage.
 * Some possible sources are games, microphones, or a webpage.
 */
var Item = (function () {
    function Item(props) {
        props = props ? props : {};
        this.name = props['name'];
        this._id = props['id'];
        this.sceneID = props['sceneID'];
        this.value = props['value'];
        this.keepLoaded = props['keeploaded'];
        this.type = Number(props['type']);
        this.xmlparams = props;
    }
    /** Sets the name of the item */
    Item.prototype.setName = function (value) {
        var slot = item_1.Item.attach(this._id);
        this.name = value;
        item_1.Item.set('prop:name', this.name, slot);
    };
    /** Gets the current name of the item */
    Item.prototype.getName = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:name', slot).then(function (val) {
                _this.name = val;
                resolve(val);
            });
        });
    };
    /** Get the video item's main definition */
    Item.prototype.getValue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:item', slot).then(function (val) {
                val = (val === 'null') ? '' : val;
                if (val === '') {
                    _this.value = '';
                    resolve(val);
                }
                else {
                    try {
                        _this.value = xml_1.XML.parseJSON(json_1.JSON.parse(val));
                        resolve(_this.value);
                    }
                    catch (e) {
                        // value is not valid XML (it is a string instead)
                        _this.value = val;
                        resolve(val);
                    }
                }
            });
        });
    };
    /** Set the video item's main definition */
    Item.prototype.setValue = function (value) {
        var slot = item_1.Item.attach(this._id);
        var val = (typeof value === 'string') ?
            value : value.toString();
        if (typeof value !== 'string') {
            this.value = json_1.JSON.parse(val);
        }
        else {
            this.value = val;
        }
        item_1.Item.set('prop:item', val, slot);
    };
    /** Check if item is kept loaded in memory */
    Item.prototype.getKeepLoaded = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:keeploaded', slot).then(function (val) {
                _this.keepLoaded = (val === '1');
                resolve(_this.keepLoaded);
            });
        });
    };
    /** Set Keep loaded option to ON or OFF */
    Item.prototype.setKeepLoaded = function (value) {
        var slot = item_1.Item.attach(this._id);
        this.keepLoaded = value;
        item_1.Item.set('prop:keeploaded', (this.keepLoaded ? '1' : '0'), slot);
    };
    /** Get the type of the item */
    Item.prototype.getType = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:type', slot).then(function (val) {
                _this.type = ItemTypes[ItemTypes[Number(val)]];
                resolve(_this.type);
            });
        });
    };
    /** Get the ID of the item */
    Item.prototype.getID = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this._id);
        });
    };
    /** Get (1-indexed) Scene ID where the item is loaded */
    Item.prototype.getSceneID = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(Number(_this.sceneID) + 1);
        });
    };
    /** Convert the Item object to an XML string */
    Item.prototype.toXML = function () {
        var item = new json_1.JSON();
        item['tag'] = 'item';
        item['name'] = this.name;
        item['item'] = this.value;
        item['type'] = this.type;
        item['selfclosing'] = true;
        return xml_1.XML.parseJSON(item);
    };
    /** Get the current source (when function is called by sources), or the source
     * that was right-clicked to open the config window (when function is called
     * from the config window) */
    Item.getCurrentSource = function () {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isScriptPlugin()) {
                reject(Error('Script plugins do not have sources ' +
                    'associated with them.'));
            }
            else if (environment_1.Environment.isSourceHtml() || environment_1.Environment.isSourceConfig()) {
                scene_1.Scene.searchAllForItemId(item_1.Item.getBaseID()).then(function (items) {
                    resolve(items[0]); // this should always exist
                });
            }
        });
    };
    return Item;
})();
exports.Item = Item;
},{"../../internal/item":16,"../../internal/util/json":17,"../../internal/util/xml":19,"../environment":2,"../scene":10}],9:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var transition_1 = require('../transition');
var ItemTransition = (function () {
    function ItemTransition() {
    }
    ItemTransition.prototype.isVisible = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:visible', slot).then(function (val) {
                resolve(val === '1' ? true : false);
            });
        });
    };
    ItemTransition.prototype.setVisible = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:visible', value ? '1' : '0', slot);
    };
    ItemTransition.prototype.getTransition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:transitionid', slot).then(function (val) {
                if (val === '') {
                    resolve(transition_1.Transition.NONE);
                }
                else {
                    resolve(transition_1.Transition[val.toUpperCase()]);
                }
            });
        });
    };
    ItemTransition.prototype.setTransition = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:transitionid', value.toString(), slot);
    };
    ItemTransition.prototype.getTransitionTime = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            item_1.Item.get('prop:transitiontime', slot).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemTransition.prototype.setTransitionTime = function (value) {
        var slot = item_1.Item.attach(this._id);
        item_1.Item.set('prop:transitionid', String(value), slot);
    };
    return ItemTransition;
})();
exports.ItemTransition = ItemTransition;
},{"../../internal/item":16,"../transition":11}],10:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var json_1 = require('../internal/util/json');
var app_1 = require('../internal/app');
var environment_1 = require('./environment');
var item_1 = require('./item/item');
var game_1 = require('./item/game');
var camera_1 = require('./item/camera');
var Scene = (function () {
    function Scene(sceneNum) {
        this.id = sceneNum - 1;
    }
    ;
    Scene.initializeScenePool = function () {
        if (Scene.scenePool.length === 0) {
            for (var i = 0; i < Scene.maxScenes; i++) {
                Scene.scenePool[i] = new Scene(i + 1);
            }
        }
    };
    /**
     * Get a specific scene object given the scene number.
     *
     * #Return
     *
     * ```
     * Scene
     * ```
     *
     * #Usage
     *
     * ```
     * var scene1 = Scene.getById(1);
     * ```
     */
    Scene.getById = function (sceneNum) {
        // initialize if necessary
        Scene.initializeScenePool();
        return Scene.scenePool[sceneNum - 1];
    };
    /**
     * Asynchronous functon to get a list of scene objects with a specific name.
     *
     * #Return
     *
     * ```
     * Promise<Scene[]>
     * ```
     *
     * #Usage
     *
     * ```
     * var scenes = Scene.getByName('Game').then(function(scenes) {
     *    // manipulate scenes
     * });
     * ```
     */
    Scene.getByName = function (sceneName) {
        // initialize if necessary
        Scene.initializeScenePool();
        var namePromise = Promise.all(Scene.scenePool.map(function (scene, index) {
            return app_1.App.get('presetname:' + index).then(function (name) {
                if (sceneName === name) {
                    return Scene.scenePool[index];
                }
                else {
                    return null;
                }
            });
        }));
        return new Promise(function (resolve) {
            namePromise.then(function (results) {
                var returnArray = [];
                for (var j = 0; j < results.length; ++j) {
                    if (results[j] !== null) {
                        returnArray.push(results[j]);
                    }
                }
                ;
                resolve(returnArray);
            });
        });
    };
    /**
     * Get the currently active scene.
     *
     * #Return
     *
     * ```
     * Scene
     * ```
     *
     * #Usage
     *
     * ```
     * var myScene = Scene.getActiveScene();
     * ```
     */
    Scene.getActiveScene = function () {
        return new Promise(function (resolve) {
            if (environment_1.Environment.isSourceHtml()) {
                app_1.App.get('presetconfig:-1').then(function (sceneString) {
                    var curScene = json_1.JSON.parse(sceneString);
                    if (curScene.children.length > 0) {
                        resolve(Scene.searchSceneByItemId(curScene.children[0]['id']));
                    }
                    else {
                        throw new Error('presetconfig cannot fetch current scene');
                    }
                });
            }
            else {
                app_1.App.get('preset:0').then(function (id) {
                    resolve(Scene.getById(Number(id) + 1));
                });
            }
        });
    };
    /**
     * Searches all scenes for an item by ID. ID search
     * will return only a maximum of 1 result (IDs are unique).
     *
     * #Return
     * ```
     * Item
     * ```
     *
     * #Usage
     *
     * ```
     * Scene.searchAllForItemId('{10F04AE-6215-3A88-7899-950B12186359}').then(function(item) {
     *   // item is either an Item or null
     * });
     * ```
     *
     */
    Scene.searchAllForItemId = function (id) {
        var isID = /^{[A-F0-9-]*}$/i.test(id);
        if (!isID) {
            throw new Error('Not a valid ID format for items');
        }
        else {
            Scene.initializeScenePool();
            return new Promise(function (resolve) {
                var match = null;
                var found = false;
                Scene.scenePool.forEach(function (scene, idx, arr) {
                    if (match === null) {
                        scene.getItems().then((function (items) {
                            found = items.some(function (item) {
                                if (item['_id'] === id) {
                                    match = item;
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            if (found ||
                                Number(this) === arr.length - 1) {
                                resolve(match);
                            }
                        }).bind(idx));
                    }
                });
            });
        }
    };
    ;
    Scene.searchSceneByItemId = function (id) {
        var isID = /^{[A-F0-9-]*}$/i.test(id);
        if (!isID) {
            throw new Error('Not a valid ID format for items');
        }
        else {
            Scene.initializeScenePool();
            return new Promise(function (resolve) {
                var match = null;
                var found = false;
                Scene.scenePool.forEach(function (scene, idx, arr) {
                    if (match === null) {
                        scene.getItems().then(function (items) {
                            found = items.some(function (item) {
                                if (item['_id'] === id) {
                                    match = Scene.getById(idx + 1);
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            if (found ||
                                idx === arr.length - 1) {
                                resolve(match);
                            }
                        });
                    }
                });
            });
        }
    };
    ;
    /**
     * Searches all scenes for an item by name substring.
     *
     * #Return
     * ```
     * Item[]
     * ```
     *
     * #Usage
     *
     * ```
     * Scene.searchAllForItemName('camera').then(function(items) {
     *   // do something to each item in items array
     * });
     * ```
     *
     */
    Scene.searchAllForItemName = function (param) {
        Scene.initializeScenePool();
        var matches = [];
        return new Promise(function (resolve) {
            return Promise.all(Scene.scenePool.map(function (scene) {
                return new Promise(function (resolveScene) {
                    scene.getItems().then(function (items) {
                        if (items.length === 0) {
                            resolveScene();
                        }
                        else {
                            return Promise.all(items.map(function (item) {
                                return new Promise(function (resolveItem) {
                                    item.getName().then(function (name) {
                                        if (name.match(param)) {
                                            matches.push(item);
                                            return '';
                                        }
                                        else {
                                            return item.getValue();
                                        }
                                    }).then(function (value) {
                                        if (value.toString().match(param)) {
                                            matches.push(item);
                                        }
                                        resolveItem();
                                    });
                                });
                            })).then(function () {
                                resolveScene();
                            });
                        }
                    });
                });
            })).then(function () {
                resolve(matches);
            });
        });
    };
    ;
    /**
     * Get the 1-indexed scene number of this scene object.
     *
     * #Return
     *
     * ```
     * number
     * ```
     *
     * #Usage
     *
     * ```
     * myScene.getSceneNumber().then(function(num) {
     *  console.log('My scene is scene number ' + num);
     * });
     * ```
     */
    Scene.prototype.getSceneNumber = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.id + 1);
        });
    };
    /**
     * Get the name of this scene object.
     *
     * #Return
     *
     * ```
     * number
     * ```
     *
     * #Usage
     *
     * ```
     * myScene.getSceneName().then(function(name) {
     *  console.log('My scene is named ' + name);
     * });
     * ```
     */
    Scene.prototype.getName = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.get('presetname:' + _this.id).then(function (val) {
                resolve(val);
            });
        });
    };
    /**
     * Set the name of this scene object. Cannot be set by source plugins.
     *
     * #Usage
     *
     * ```
     * myScene.setName('Gameplay');
     * ```
     */
    Scene.prototype.setName = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourceHtml()) {
                reject(Error('Scene names are readonly for source plugins.'));
            }
            else {
                app_1.App.set('presetname:' + _this.id, name).then(function (value) {
                    resolve(value);
                });
            }
        });
    };
    /**
     * Gets all the items in a specific scene.
     *
     * #Return
     *
     * ```
     * Item[]
     * ```
     * #Usage
     *
     * ```
     * myScene.getItems().then(function(items) {
     *  // do something to each item in items array
     * });
     * ```
     */
    Scene.prototype.getItems = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.getAsList('presetconfig:' + _this.id).then(function (jsonArr) {
                var promiseArray = [];
                // type checking to return correct Item subtype
                var typePromise = function (index) { return new Promise(function (typeResolve) {
                    if (Number(jsonArr[index]['type']) === item_1.ItemTypes.GAMESOURCE) {
                        typeResolve(new game_1.GameItem(jsonArr[index]));
                    }
                    else if (Number(jsonArr[index]['type']) === item_1.ItemTypes.LIVE &&
                        jsonArr[index]['sounddev'] === '0') {
                        typeResolve(new camera_1.CameraItem(jsonArr[index]));
                    }
                    else {
                        typeResolve(new item_1.Item(jsonArr[index]));
                    }
                }); };
                if (Array.isArray(jsonArr)) {
                    for (var i = 0; i < jsonArr.length; i++) {
                        jsonArr[i]['sceneID'] = _this.id;
                        promiseArray.push(typePromise(i));
                    }
                }
                Promise.all(promiseArray).then(function (results) {
                    resolve(results);
                });
            });
        });
    };
    /**
    * Checks if a scene is empty.
    *
    * #Usage
    *
    * ```
    * myScene.isEmpty().then(function(empty) {
    *   if (empty === true) {
    *     console.log("My scene is empty.");
    *   }
    * });
    * ```
    */
    Scene.prototype.isEmpty = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.get('presetisempty:' + _this.id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    Scene.maxScenes = 12;
    Scene.scenePool = [];
    return Scene;
})();
exports.Scene = Scene;
},{"../internal/app":12,"../internal/util/json":17,"./environment":2,"./item/camera":3,"./item/game":4,"./item/item":8}],11:[function(require,module,exports){
var Transition = (function () {
    function Transition(key) {
        this.key = key; // retain key so that NONE is readable
        this.value = Transition._transitionMap[key];
    }
    // should only be used internally when setting a property
    Transition.prototype.toString = function () {
        return this.value;
    };
    /** Converts this transition object to a easily identifiable string such as
     *  'NONE'.
     */
    Transition.prototype.toTransitionKey = function () {
        return this.key;
    };
    Transition._transitionMap = {
        NONE: '',
        CLOCK: 'clock',
        COLLAPSE: 'collapse',
        FADE: 'fade',
        FAN: 'fan',
        HOLE: 'hole',
        MOVE_BOTTOM: 'move_bottom',
        MOVE_LEFT: 'move_left',
        MOVE_LEFT_RIGHT: 'move_left_right',
        MOVE_RIGHT: 'move_right',
        MOVE_TOP: 'move_top',
        MOVE_TOP_BOTTOM: 'move_top_bottom',
        WAVE: 'wave'
    };
    Transition.NONE = new Transition('NONE');
    Transition.CLOCK = new Transition('CLOCK');
    Transition.COLLAPSE = new Transition('COLLAPSE');
    Transition.FADE = new Transition('FADE');
    Transition.FAN = new Transition('FAN');
    Transition.HOLE = new Transition('HOLE');
    Transition.MOVE_BOTTOM = new Transition('MOVE_BOTTOM');
    Transition.MOVE_LEFT = new Transition('MOVE_LEFT');
    Transition.MOVE_LEFT_RIGHT = new Transition('MOVE_LEFT_RIGHT');
    Transition.MOVE_RIGHT = new Transition('MOVE_RIGHT');
    Transition.MOVE_TOP = new Transition('MOVE_TOP');
    Transition.MOVE_TOP_BOTTOM = new Transition('MOVE_TOP_BOTTOM');
    Transition.WAVE = new Transition('WAVE');
    return Transition;
})();
exports.Transition = Transition;
},{}],12:[function(require,module,exports){
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
},{"./internal":15,"./util/json":17}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var environment_1 = require('../core/environment');
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
},{"../core/environment":2,"./global":13,"./internal":15,"./item":16}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var internal_1 = require('./internal');
var environment_1 = require('../core/environment');
var Item = (function () {
    function Item() {
    }
    /** Prepare an item for manipulation */
    Item.attach = function (itemID) {
        var slot = Item.itemSlotMap.indexOf(itemID);
        if (slot === -1) {
            slot = ++Item.lastSlot % Item.MAX_SLOTS;
            if (Item.islockedSourceSlot && slot === 0) {
                ++slot; // source cannot attach to first slot
            }
            Item.lastSlot = slot;
            Item.itemSlotMap[slot] = itemID;
            if (environment_1.Environment.isScriptPlugin()) {
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
    /** used for source plugins. lock an id to slot 0 */
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
},{"../core/environment":2,"./internal":15}],17:[function(require,module,exports){
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
        if (xmlDocument.getElementsByTagName('parsererror').length > 0) {
            throw new Error('XML parsing error. Invalid XML string');
        }
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
},{"./xml":19}],18:[function(require,module,exports){
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name === 'constructor') {
                return;
            }
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
exports.applyMixins = applyMixins;
},{}],19:[function(require,module,exports){
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
                attributes += [' ', key, '="', json[key], '"'].join('');
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
            this.xml = ['<', json.tag, attributes, '/>'].join('');
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
},{}],20:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
/**
 * The AudioDevice Class is the object returned by
 * {@link #system/System System Class'} getAudioDevices method. It provides you
 * with methods to fetch the audio device object's attributes, and also provides
 * methods to convert it back to an XML object that is compatible with XBC
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getAudioDevices().then(function(audios) {
 *   for (var i in audios) {
 *     // Do not include the imaginary xsplit audio device if that ever exist
 *     if (audios[i].getName().indexOf('xsplit') === -1) {
 *       xml = audios[i].toXML();
 *       // do something with the XML here
 *     }
 *   }
 * });
 * ```
 */
var AudioDevice = (function () {
    function AudioDevice(props) {
        this._defaultConsole = false;
        this._defaultMultimedia = false;
        this._defaultCommunication = false;
        props = props || {};
        this._id = props['id'];
        this._name = props['name'];
        this._adapter = props['adapter'];
        this._adapterdev = props['adapterdev'];
        this._dSoundGuid = props['dSoundGuid'];
        this._dataFlow = props['dataFlow'];
        this._state = props['state'];
        this._defaultConsole = props['defaultConsole'];
        this._defaultMultimedia = props['defaultMultimedia'];
        this._defaultCommunication = props['defaultCommunication'];
        this._level = props['level'] !== undefined ? props['level'] : 1.000000;
        this._enable = props['enable'] !== undefined ? props['enable'] : true;
        this._hwlevel = props['hwlevel'] !== undefined ? props['hwlevel'] : -1.000000;
        this._hwenable = props['hwenable'] !== undefined ? props['hwenable'] : 255;
        this._delay = props['delay'] !== undefined ? props['delay'] : 0;
        this._mix = props['mix'] !== undefined ? props['mix'] : 0;
    }
    /**
     * return: string
     *
     * Gets the device ID
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceID = device.getID();
     * ```
     */
    AudioDevice.prototype.getId = function () {
        return this._id;
    };
    /**
     * return: string
     *
     * Gets the device name
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceName = device.getName();
     * ```
     */
    AudioDevice.prototype.getName = function () {
        return this._name;
    };
    /**
     * return: string
     *
     * Gets whether device is capturing or rendering audio
     *
     * #### Usage
     *
     * ```javascript
     * var audioDataFlow = device.getDataFlow();
     *   //where possible values are "render" or "capture"
     * ```
     */
    AudioDevice.prototype.getDataFlow = function () {
        return this._dataFlow;
    };
    /**
     * return: boolean
     *
     * Gets whether audio device is the system default
     *
     * #### Usage
     *
     * ```javascript
     * var audioIsDefaultDevice = audioDevice.isDefaultDevice();
     * ```
     */
    AudioDevice.prototype.isDefaultDevice = function () {
        return (this._defaultConsole && this._defaultMultimedia);
    };
    /**
     * return: number
     *
     * Gets the device audio level in the application
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceVolumeLevel = audioDevice.getLevel();
     * ```
     */
    AudioDevice.prototype.getLevel = function () {
        return this._level;
    };
    /**
     * param: level<number>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Sets the device audio level in the application
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice.setLevel(100);
     * ```
     */
    AudioDevice.prototype.setLevel = function (level) {
        this._level = level;
        return this;
    };
    /**
     * return: boolean
     *
     * Gets whether audio device is the system default
     *
     * #### Usage
     *
     * ```javascript
     * var isAudioDeviceEnabled = audioDevice.isEnabled();
     * ```
     */
    AudioDevice.prototype.isEnabled = function () {
        return this._enable;
    };
    /**
     * param: enabled<boolean>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Enables audio device/sets software mute
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice.setEnabled(true);
     * ```
     */
    AudioDevice.prototype.setEnabled = function (enabled) {
        this._enable = enabled;
        return this;
    };
    /**
     * return: number
     *
     * Gets the device system volume
     *
     * #### Usage
     *
     * ```javascript
     * var systemVolumeLevel = audioDevice.getSystemLevel();
     * ```
     */
    AudioDevice.prototype.getSystemLevel = function () {
        return this._hwlevel;
    };
    /**
     * param: volume<number>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Sets the device system volume
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice.setSystemLevel(100);
     * ```
     */
    AudioDevice.prototype.setSystemLevel = function (hwlevel) {
        this._hwlevel = hwlevel;
        return this;
    };
    /**
     * return: number
     *
     * Gets whether audio device is enabled/muted in the system
     *
     * #### Usage
     *
     * ```javascript
     * var systemAudioDeviceEnabled = audioDevice.getSystemEnabled();
     * ```
     */
    AudioDevice.prototype.getSystemEnabled = function () {
        return this._hwenable;
    };
    /**
     * param: systemEnabled<number>
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Enables audio device/sets software mute
     *
     * #### Usage
     *
     * ```javascript
     * // you may use the following:
     * //     * AudioDevice.SYSTEM_LEVEL_MUTE (0)
     * //     * AudioDevice.SYSTEM_LEVEL_ENABLE (1)
     * //     * AudioDevice.SYSTEM_MUTE_CHANGE_NOT_ALLOWED (255)
     * audioDevice.setSystemEnabled(AudioDevice.SYSTEM_LEVEL_MUTE);
     * ```
     */
    AudioDevice.prototype.setSystemEnabled = function (hwenabled) {
        this._hwenable = hwenabled;
        return this;
    };
    /**
     * return: number (100 nanoseconds in units)
     *
     * Get the loopback capture delay value
     *
     * #### Usage
     *
     * ```javascript
     * var audioDelay = audioDevice.getDelay();
     * ```
     */
    AudioDevice.prototype.getDelay = function () {
        return this._delay;
    };
    /**
     * param: delay<number> (100 nanoseconds in units)
     * ```
     * return: AudioDevice (used for chaining)
     * ```
     *
     * Sets the loopback capture delay value
     *
     * #### Usage
     *
     * ```javascript
     * audioDevice.setDelay(100);
     * ```
     */
    AudioDevice.prototype.setDelay = function (delay) {
        this._delay = delay;
        return this;
    };
    /**
     * return: string
     *
     * Converts the AudioDevice item to XML-formatted string
     *
     * #### Usage
     *
     * ```javascript
     * var audioDeviceXMLString = AudioDevice.toString();
     * ```
     */
    AudioDevice.prototype.toString = function () {
        var device = new json_1.JSON();
        device.tag = 'dev';
        device.selfclosing = true;
        device['id'] = this.getId();
        device['level'] = this.getLevel().toFixed(6);
        device['enable'] = this.isEnabled() ? 1 : 0;
        device['hwlevel'] = this.getSystemLevel().toFixed(6);
        device['hwenable'] = this.getSystemEnabled();
        device['delay'] = this.getDelay();
        device['mix'] = this._mix;
        return xml_1.XML.parseJSON(device).toString();
    };
    /**
     * param: deviceJXON<JSON>
     * ```
     * return: AudioDevice
     * ```
     *
     * Converts a JSON object into an AudioDevice object
     *
     * #### Usage
     *
     * ```javascript
     * var newAudioDevice = AudioDevice.parse(deviceJSONObj);
     * ```
     */
    AudioDevice.parse = function (deviceJXON) {
        var audio = new AudioDevice({
            id: deviceJXON['id'],
            name: deviceJXON['name'],
            adapter: deviceJXON['adapter'],
            adapterdev: deviceJXON['adapterdev'],
            dataFlow: deviceJXON['DataFlow'],
            state: deviceJXON['State'],
            dSoundGuid: deviceJXON['DSoundGuid'],
            defaultCommunication: (deviceJXON['DefaultCommunication'] === '1'),
            defaultConsole: (deviceJXON['DefaultConsole'] === '1'),
            defaultMultimedia: (deviceJXON['DefaultMultimedia'] === '1')
        });
        audio.setLevel(Number(deviceJXON['level'] !== undefined ? deviceJXON['level'] : 1))
            .setEnabled(deviceJXON['enable'] !== undefined ? deviceJXON['enable'] === '1' : true)
            .setSystemLevel(Number(deviceJXON['hwlevel'] !== undefined ? deviceJXON['hwlevel'] : -1))
            .setSystemEnabled(deviceJXON['hwenable'] !== undefined ? deviceJXON['hwenable'] : 255)
            .setDelay(Number(deviceJXON['delay'] !== undefined ? deviceJXON['delay'] : 0));
        return audio;
    };
    AudioDevice.STATE_ACTIVE = 'Active';
    AudioDevice.DATAFLOW_RENDER = 'Render';
    AudioDevice.DATAFLOW_CAPTURE = 'Capture';
    AudioDevice.SYSTEM_LEVEL_MUTE = 0;
    AudioDevice.SYSTEM_LEVEL_ENABLE = 1;
    AudioDevice.SYSTEM_MUTE_CHANGE_NOT_ALLOWED = 255;
    return AudioDevice;
})();
exports.AudioDevice = AudioDevice;
},{"../internal/util/json":17,"../internal/util/xml":19}],21:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
/**
 * The CameraDevice Class is the object returned by
 * {@link #system/System System Class'} getCameraDevices method. It provides
 * you with methods to fetch the Camera Device's id, name, and convert it to
 * an XML object that is compatible with XBC
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getCameraDevices().then(function(cameras) {
 *   for (var i in cameras) {
 *     // Do not include the imaginary xsplit camera if that ever exist
 *     if (cameras[i].getName().indexOf('xsplit') === -1) {
 *       xml = cameras[i].toXML();
 *       // do something with the XML here
 *     }
 *   }
 * });
 * ```
 */
var CameraDevice = (function () {
    function CameraDevice(props) {
        this._id = props['id'];
        this._name = props['name'];
    }
    /**
     * return: string
     *
     * Get the ID of the device. The ID of the device is based on the `disp`
     * attribute of the devices XML
     *
     * #### Usage
     *
     * ```javascript
     * var cameraID = device.getID();
     * ```
     */
    CameraDevice.prototype.getId = function () {
        return this._id;
    };
    /**
     * return: string
     *
     * Get the Name of the device.
     *
     * #### Usage
     *
     * ```javascript
     * var cameraName = device.getName();
     * ```
     */
    CameraDevice.prototype.getName = function () {
        return this._name;
    };
    /**
     * return: XML
     *
     * Convert the current CameraDevice object to XML
     *
     * #### Usage
     *
     * ```javascript
     * var xml = device.toXML();
     * ```
     */
    CameraDevice.prototype.toXML = function () {
        var json = new json_1.JSON();
        json['disp'] = this._id;
        json['name'] = this._name;
        return xml_1.XML.parseJSON(json);
    };
    /**
     * param: deviceJSON<JXON>
     * ```
     * return: CameraDevice
     * ```
     *
     * Create a CameraDevice object based on a JXON object
     *
     * #### Usage
     *
     * ```javascript
     * var camera = CameraDevice.parse(JSONObj);
     * ```
     */
    CameraDevice.parse = function (deviceJSON) {
        var cam = new CameraDevice({
            id: deviceJSON['disp'],
            name: deviceJSON['name']
        });
        return cam;
    };
    return CameraDevice;
})();
exports.CameraDevice = CameraDevice;
},{"../internal/util/json":17,"../internal/util/xml":19}],22:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var rectangle_1 = require('../util/rectangle');
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var app_1 = require('../internal/app');
/**
 * The Game Class is the object returned by {@link #system/System System Class'}
 * getGames method. It provides you with methods to fetch the game object's
 * attributes, and also provides methods to convert it back to an XML object
 * that is compatible with XBC
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 * var xml;
 *
 * System.getGames().then(function(games) {
 * 	for (var i in games) {
 * 		if(games[i].isFullscreen()) {
 * 			xml = games[i].toXML();
 * 			// Do something with the xml here. Probably add it to the current scene
 * 		}
 * 	}
 * });
 * ```
 */
var Game = (function () {
    function Game() {
    }
    /**
     * return: number
     *
     * Gets the game's process ID.
     *
     * #### Usage
     *
     * ```javascript
     * var processId = game.getPid();
     * ```
     */
    Game.prototype.getPid = function () {
        return this._pid;
    };
    /**
     * return: number
     *
     * Gets the Graphics API handle.
     *
     * #### Usage
     *
     * ```javascript
     * var handle = game.getHandle();
     * ```
     */
    Game.prototype.getHandle = function () {
        return this._handle;
    };
    /**
     * return: number
     *
     * Gets the window handle.
     *
     * #### Usage
     *
     * ```javascript
     * var windowHandle = game.getWindowHandle();
     * ```
     */
    Game.prototype.getWindowHandle = function () {
        return this._hwnd;
    };
    /**
     * return: string
     *
     * Gets the Graphics API type.
     *
     * #### Usage
     *
     * ```javascript
     * var gApiType = game.getGapiType();
     * ```
     *
     * #### Possible Values
     *
     * ```
     * OGL, DX8, DX8_SwapChain, DX9, DX9Ex, DX9_SwapChain,
     * DX9_PresentEx, DX10, DX11, DX11.1, DX11.1_Present1
     * ```
     */
    Game.prototype.getGapiType = function () {
        return this._gapitype;
    };
    /**
     * return: Rectangle
     *
     * Gets the game resolution.
     *
     * #### Usage
     *
     * ```javascript
     * var resolution = game.getResolution();
     * ```
     */
    Game.prototype.getResolution = function () {
        return rectangle_1.Rectangle.fromDimensions(this._width, this._height);
    };
    /**
     * return: boolean
     *
     * Checks if game has exclusive full screen.
     *
     * #### Usage
     *
     * ```javascript
     * var isFullscreen = game.isFullscreen();
     * ```
     */
    Game.prototype.isFullscreen = function () {
        return this._flags === 1 ? true : false;
    };
    /**
     * return: string
     *
     * Gets the window title
     *
     * #### Usage
     *
     * ```javascript
     * var windowName = game.getWindowName();
     * ```
     */
    Game.prototype.getWindowName = function () {
        return this._wndname;
    };
    /**
     * return: number
     *
     * Gets timestamp of last frame in milliseconds.
     *
     * #### Usage
     *
     * ```javascript
     * var lastFrameTimestamp = game.getLastFrameTimestamp();
     * ```
     */
    Game.prototype.getLastFrameTimestamp = function () {
        return this._lastframets;
    };
    /**
     * Get the FPS Render of the game
     */
    Game.prototype.getFpsRender = function () {
        return this.fpsRender;
    };
    /**
     * Get the Captured FPS of the game
     */
    Game.prototype.getFpsCapture = function () {
        return this.fpsCapture;
    };
    /**
     * Get the image name of the game
     */
    Game.prototype.getImageName = function () {
        return this.imagename;
    };
    /**
     * Get the replace image value of the game
     */
    Game.prototype.getReplace = function () {
        return this.replace;
    };
    /**
     * param: gameJSON<JXON>
     * ```
     * return: Game
     * ```
     *
     * Converts a JSON object into a Game object
     *
     * #### Usage
     *
     * ```javascript
     * var XJS = require('xjs');
     * var game = XJS.Game.parse(jsonObj);
     * ```
     */
    Game.parse = function (jxon) {
        var g = new Game();
        g._pid = jxon['pid'] !== undefined ? parseInt(jxon['pid']) : undefined;
        g._handle = jxon['handle'] !== undefined ? parseInt(jxon['handle']) :
            undefined;
        g._hwnd = jxon['hwnd'] !== undefined ? parseInt(jxon['hwnd']) : undefined;
        g._gapitype = jxon['GapiType'];
        g._width = jxon['width'] !== undefined ? parseInt(jxon['width']) :
            undefined;
        g._height = jxon['height'] !== undefined ? parseInt(jxon['height']) :
            undefined;
        g._flags = jxon['flags'] !== undefined ? parseInt(jxon['flags']) :
            undefined;
        g._wndname = jxon['wndname'];
        g._lastframets = jxon['lastframets'] !== undefined ?
            parseInt(jxon['lastframets']) : undefined;
        g.fpsRender = jxon['fpsRender'] !== undefined ? Number(jxon['fpsRender']) :
            undefined;
        g.fpsCapture = jxon['fpsCapture'] !== undefined ?
            Number(jxon['fpsCapture']) : undefined;
        g.imagename = jxon['imagename'];
        g.replace = jxon['replace'];
        return g;
    };
    /**
     * return: XML
     *
     * Converts Game object into an XML object
     *
     * #### Usage
     *
     * ```javascript
     * var gameXML = game.toXML();
     * ```
     */
    Game.prototype.toXML = function () {
        var gamesource = new json_1.JSON();
        gamesource.tag = 'src';
        gamesource['pid'] = this._pid;
        gamesource['handle'] = this._handle;
        gamesource['hwnd'] = this._hwnd;
        gamesource['gapitype'] = this._gapitype;
        gamesource['width'] = this._width;
        gamesource['height'] = this._height;
        gamesource['flags'] = this._flags;
        gamesource['wndname'] = this._wndname;
        gamesource['lastframets'] = this._lastframets;
        gamesource['selfclosing'] = true;
        return xml_1.XML.parseJSON(gamesource);
    };
    Game.prototype.addToScene = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.callFunc('addgamesource', 'dev:' + _this.toXML()).then(function () {
                resolve(true);
            });
        });
    };
    return Game;
})();
exports.Game = Game;
},{"../internal/app":12,"../internal/util/json":17,"../internal/util/xml":19,"../util/rectangle":25}],23:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
var audio_1 = require('./audio');
var camera_1 = require('./camera');
var game_1 = require('./game');
/**
 * This enum is used for {@link #system/System System Class'} getAudioDevices
 * method's first parameter.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XML = require('xml');
 * XML.getAudioDevices(XML.AudioDeviceDataflow.CAPTURE, ...);
 * ```
 */
(function (AudioDeviceDataflow) {
    AudioDeviceDataflow[AudioDeviceDataflow["RENDER"] = 1] = "RENDER";
    AudioDeviceDataflow[AudioDeviceDataflow["CAPTURE"] = 2] = "CAPTURE";
    AudioDeviceDataflow[AudioDeviceDataflow["ALL"] = 3] = "ALL";
})(exports.AudioDeviceDataflow || (exports.AudioDeviceDataflow = {}));
var AudioDeviceDataflow = exports.AudioDeviceDataflow;
/**
 * This enum is used for {@link #system/System System Class'} getAudioDevices
 * method's second parameter.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XML = require('xml');
 * XML.getAudioDevices(..., XML.AudioDeviceState.ACTIVE);
 * ```
 */
(function (AudioDeviceState) {
    AudioDeviceState[AudioDeviceState["ACTIVE"] = 1] = "ACTIVE";
    AudioDeviceState[AudioDeviceState["DISABLED"] = 2] = "DISABLED";
    AudioDeviceState[AudioDeviceState["UNPLUGGED"] = 4] = "UNPLUGGED";
    AudioDeviceState[AudioDeviceState["NOTPRESENT"] = 8] = "NOTPRESENT";
    AudioDeviceState[AudioDeviceState["ALL"] = 15] = "ALL";
})(exports.AudioDeviceState || (exports.AudioDeviceState = {}));
var AudioDeviceState = exports.AudioDeviceState;
/**
 * The System class provides you methods to fetch games, audio devices, and
 * camera devices.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getCameraDevices().then(funciton(cameras) {
 *   window.cameras = cameras;
 * });
 * ```
 */
var System = (function () {
    function System() {
    }
    /**
     * return: Promise<AudioDevice[]>
     *
     * Gets audio devices, both input and output
     *
     * #### Usage
     *
     * ```javascript
     * System.getAudioDevices(
     *   XML.AudioDeviceDataflow.ALL,
     *   XML.AudioDeviceState.ACTIVE
     * ).then(funciton(devices) {
     *   // devices is an array of AudioDevice object
     *   window.audios = devices;
     * });
     * ```
     */
    System.getAudioDevices = function (dataflow, state) {
        if (dataflow === void 0) { dataflow = AudioDeviceDataflow.ALL; }
        if (state === void 0) { state = AudioDeviceState.ACTIVE; }
        return new Promise(function (resolve) {
            app_1.App.getAsList('wasapienum').then(function (devicesJXON) {
                var devices = [];
                if (devicesJXON !== undefined) {
                    var devicesJXONLength = devicesJXON.length;
                    for (var i = 0; i < devicesJXONLength; ++i) {
                        var device = devicesJXON[i];
                        var bitsState = AudioDeviceState[String(device['State'])
                            .toUpperCase().replace(/\s+/g, '')];
                        if ((bitsState & state) !== bitsState) {
                            continue;
                        }
                        var bitsFlow = AudioDeviceDataflow[String(device['DataFlow'])
                            .toUpperCase()];
                        if ((bitsFlow & dataflow) !== bitsFlow) {
                            continue;
                        }
                        if (device['name'].toLowerCase().indexOf('xsplit') > -1) {
                            continue;
                        }
                        devices.push(audio_1.AudioDevice.parse(device));
                    }
                }
                resolve(devices);
            });
        });
    };
    /**
     * return: Promise<CameraDevice[]>
     *
     * Gets all camera devices
     *
     * #### Usage
     *
     * ```javascript
     * System.getCameraDevices().then(funciton(devices) {
     *   // devices is an array of CameraDevice object
     *   window.cameras = devices;
     * });
     * ```
     */
    System.getCameraDevices = function () {
        return new Promise(function (resolve) {
            app_1.App.getAsList('dshowenum:vsrc').then(function (devicesJSON) {
                var devices = [];
                if (devicesJSON !== undefined) {
                    for (var _i = 0; _i < devicesJSON.length; _i++) {
                        var device = devicesJSON[_i];
                        if (String(device['disp']).toLowerCase().indexOf('xsplit') === -1 &&
                            String(device['disp']).toLowerCase() !==
                                ("@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\" +
                                    "{778abfb2-e87b-48a2-8d33-675150fcf8a2}").toLowerCase()) {
                            devices.push(camera_1.CameraDevice.parse(device));
                        }
                    }
                    resolve(devices);
                }
            });
        });
    };
    /**
     * return: Promise<Game[]>
     *
     * Gets all camera devices
     *
     * #### Usage
     *
     * ```javascript
     * System.getGames().then(funciton(games) {
     *   // games is an array of Game object
     *   window.games = games;
     * });
     * ```
     */
    System.getGames = function () {
        return new Promise(function (resolve) {
            app_1.App.getAsList('gsenum').then(function (gamesJXON) {
                var games = [];
                if (gamesJXON !== undefined) {
                    var gamesJXONLength = gamesJXON.length;
                    for (var i = 0; i < gamesJXONLength; ++i) {
                        games.push(game_1.Game.parse(gamesJXON[i]));
                    }
                }
                resolve(games);
            });
        });
    };
    return System;
})();
exports.System = System;
},{"../internal/app":12,"./audio":20,"./camera":21,"./game":22}],24:[function(require,module,exports){
var Color = (function () {
    function Color(props) {
        if (props['rgb'] !== undefined) {
            this.setRgb(props['rgb']);
        }
        else if (props['irgb'] !== undefined) {
            this.setIrgb(props['irgb']);
        }
        else if (props['bgr'] !== undefined) {
            this.setBgr(props['bgr']);
        }
        else if (props['ibgr'] !== undefined) {
            this.setIbgr(props['ibgr']);
        }
        else {
            throw new Error('Do not call Color constructor without parameters.');
        }
    }
    Color.fromRGBString = function (rgb) {
        return new Color({ rgb: rgb });
    };
    Color.fromRGBInt = function (irgb) {
        return new Color({ irgb: irgb });
    };
    Color.fromBGRString = function (bgr) {
        return new Color({ bgr: bgr });
    };
    Color.fromBGRInt = function (ibgr) {
        return new Color({ ibgr: ibgr });
    };
    Color.prototype.getRgb = function () {
        return this.rgb;
    };
    Color.prototype.setRgb = function (rgb) {
        this.rgb = rgb.replace(/^#/, '');
        this.irgb = parseInt(this.rgb, 16);
        this.bgr = [this.rgb.substring(4, 6), this.rgb.substring(2, 4),
            this.rgb.substring(0, 2)].join('');
        this.ibgr = parseInt(this.bgr, 16);
    };
    Color.prototype.getBgr = function () {
        return this.bgr;
    };
    Color.prototype.setBgr = function (bgr) {
        this.setRgb([bgr.substring(4, 6), bgr.substring(2, 4),
            bgr.substring(0, 2)
        ].join(''));
    };
    Color.prototype.getIrgb = function () {
        return this.irgb;
    };
    Color.prototype.setIrgb = function (irgb) {
        var rgb = irgb.toString(16);
        while (rgb.length < 6) {
            rgb = '0' + rgb;
        }
        this.setRgb(rgb);
    };
    Color.prototype.getIbgr = function () {
        return this.ibgr;
    };
    Color.prototype.setIbgr = function (ibgr) {
        var bgr = ibgr.toString(16);
        while (bgr.length < 6) {
            bgr = '0' + bgr;
        }
        this.setBgr(bgr);
    };
    return Color;
})();
exports.Color = Color;
},{}],25:[function(require,module,exports){
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
},{}],"xjs":[function(require,module,exports){
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require('./internal/init');
__export(require('./util/color'));
__export(require('./util/rectangle'));
__export(require('./core/environment'));
__export(require('./core/app'));
__export(require('./core/scene'));
__export(require('./core/transition'));
__export(require('./core/item/item'));
__export(require('./core/item/camera'));
__export(require('./core/item/game'));
__export(require('./system/system'));
__export(require('./system/audio'));
__export(require('./system/game'));
__export(require('./system/camera'));
},{"./core/app":1,"./core/environment":2,"./core/item/camera":3,"./core/item/game":4,"./core/item/item":8,"./core/scene":10,"./core/transition":11,"./internal/init":14,"./system/audio":20,"./system/camera":21,"./system/game":22,"./system/system":23,"./util/color":24,"./util/rectangle":25}]},{},["xjs"]);
