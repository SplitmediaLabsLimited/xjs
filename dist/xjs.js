/**
 * XSplit JS Framework
 * version: 1.3.0
 *
 * XSplit Extensibility Framework and Plugin License
 *
 * Copyright (c) 2015, SplitmediaLabs Limited
 * All rights reserved.
 *
 * Redistribution and use in source, minified or binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in minified or binary form must reproduce the above
 *    copyright notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * 3. This software, in source, minified and binary forms, and any derivatives
 *    hereof, may be used only with the purpose to extend the functionality of the
 *    XSplit products, developed and published by SplitmediaLabs Limited. It may
 *    specifically not be used for extending the functionality of any other software
 *    products which enables live streaming and/or recording functions.
 *
 * 4. This software may not be used to circumvent paid feature restrictions for
 *    free and personal licensees of the XSplit products.
 *
 * THIS SOFTWARE IS PROVIDED BY SPLITMEDIALABS LIMITED ''AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL SPLITMEDIALABS LIMITED BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 * BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
 * OF SUCH DAMAGE.
 *
 */


require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
var rectangle_1 = require('../util/rectangle');
var audio_1 = require('../system/audio');
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var internal_1 = require('../internal/internal');
var environment_1 = require('./environment');
var transition_1 = require('./transition');
var DEFAULT_SILENCE_DETECTION_THRESHOLD = 5;
var DEFAULT_SILENCE_DETECTION_PERIOD = 1000;
/**
 * The App Class provides you methods to get and set application-related
 * functionalities.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var App = new xjs.App();
 *
 * App.getFrameTime().then(function(frametime) {
 *   window.frametime = frametime;
 * });
 * ```
 *
 * For methods referring to application audio
 * (i.e. mic and speaker settings, silence detection, etc.).
 * This will affect XBC settings
 * but will not be reflected in the General Settings Window
 * (also will not be persistent after logging out of/exiting the application).
 *
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
     * App.getFrameTime().then(function(res) {
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
     * Gets application default output resolution in pixels.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     *
     * #### Usage
     *
     * ```javascript
     * App.getResolution().then(function(res) {
     *   var height = res.getHeight();
     *   var width = res.getWidth();
     * });
     * ```
     */
    App.prototype.getResolution = function () {
        return new Promise(function (resolve) {
            app_1.App.get('resolution').then(function (val) {
                var dimensions = val.split(',');
                resolve(rectangle_1.Rectangle.fromDimensions(parseInt(dimensions[0]), parseInt(dimensions[1])));
            });
        });
    };
    /**
     * return: Promise<Rectangle>
     *
     * Gets application viewport display resolution
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     *
     * #### Usage
     *
     * ```javascript
     * App.getViewport().then(function(res) {
     *   var height = res.getHeight();
     *   var width = res.getWidth();
     * });
     * ```
     */
    App.prototype.getViewport = function () {
        return new Promise(function (resolve) {
            app_1.App.get('viewport').then(function (val) {
                var dimensions = val.split(',');
                resolve(rectangle_1.Rectangle.fromDimensions(parseInt(dimensions[0]), parseInt(dimensions[1])));
            });
        });
    };
    /**
     * return: Promise<string>
     *
     * Refers to XSplit Broadcaster version number
     *
     * #### Usage
     *
     * ```javascript
     * App.getVersion().then(function(res) {
     *   var version = res;
     * });
     * ```
     */
    App.prototype.getVersion = function () {
        return new Promise(function (resolve, reject) {
            var xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
            var xbcMatch = navigator.appVersion.match(xbcPattern);
            if (xbcMatch !== null) {
                resolve(xbcMatch[1]);
            }
            else {
                reject(Error('not loaded in XSplit Broadcaster'));
            }
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
     * App.getFramesRendered().then(function(res) {
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
     * return: Promise<AudioDevice[]>
     *
     * Gets the primary microphone device used in the application
     *
     * See also: {@link #system/AudioDevice System/AudioDevice}
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
        return new Promise(function (resolve, reject) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 0) {
                    resolve(audioDevices[0]);
                }
                else {
                    reject(Error('No audio device is set as primary microphone'));
                }
            });
        });
    };
    /**
     * return: Promise<AudioDevice[]>
     *
     * Gets the primary speaker/audio render device used in the application
     *
     * See also: {@link #system/AudioDevice System/AudioDevice}
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
        return new Promise(function (resolve, reject) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 1) {
                    resolve(audioDevices[1]);
                }
                else {
                    reject(Error('No audio device is set as primary speaker'));
                }
            });
        });
    };
    /**
     * param: volume<number> (0 to 100 normal range, > 100 will boost volume level)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the application audio level of the primary microphone set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimaryMicLevel = function (volume) {
        return new Promise(function (resolve, reject) {
            if (volume < 0) {
                reject(Error('Volume can only be positive'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 0) {
                    var micDevice = audioDevices[0];
                    micDevice._setLevel(volume);
                    audioDevices[0] = micDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary microphone'));
                }
            });
        });
    };
    /**
     * param: enabled<boolean>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary microphone set is enabled or disabled in the applicaation
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimaryMicEnabled = function (enabled) {
        return new Promise(function (resolve, reject) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 0) {
                    var micDevice = audioDevices[0];
                    micDevice._setEnabled(enabled);
                    audioDevices[0] = micDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary microphone'));
                }
            });
        });
    };
    /**
     * param: volume<number> (0 to 100)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the system audio level of the primary microphone set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicSystemLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimaryMicSystemLevel = function (volume) {
        return new Promise(function (resolve, reject) {
            if (volume < 0) {
                reject(Error('Volume can only be positive'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 0) {
                    var micDevice = audioDevices[0];
                    micDevice._setSystemLevel(volume);
                    audioDevices[0] = micDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary microphone'));
                }
            });
        });
    };
    /**
     * param: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary microphone set is enabled or disabled in the system
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicSystemEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimaryMicSystemEnabled = function (hwenabled) {
        return new Promise(function (resolve, reject) {
            if (hwenabled !== 0 && hwenabled !== 1 && hwenabled !== 255) {
                reject(Error('Value can only be 0, 1 or 255'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 0) {
                    var micDevice = audioDevices[0];
                    micDevice._setSystemEnabled(hwenabled);
                    audioDevices[0] = micDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary microphone'));
                }
            });
        });
    };
    /**
     * param: delay<number> (100 nanoseconds in units)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the loopback capture delay of the primary microphone set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimaryMicDelay(delay).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimaryMicDelay = function (delay) {
        return new Promise(function (resolve, reject) {
            if (delay < 0) {
                reject(Error('Delay can only be positive'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 0) {
                    var micDevice = audioDevices[0];
                    micDevice._setDelay(delay);
                    audioDevices[0] = micDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary microphone'));
                }
            });
        });
    };
    /**
     * param: volume<number> (0 to 100 normal range, > 100 will boost volume level)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the application audio level of the primary speaker/audio render device
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimarySpeakerLevel = function (volume) {
        return new Promise(function (resolve, reject) {
            if (volume < 0) {
                reject(Error('Volume can only be positive'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 1) {
                    var speakerDevice = audioDevices[1];
                    speakerDevice._setLevel(volume);
                    audioDevices[1] = speakerDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary speaker/audio render device'));
                }
            });
        });
    };
    /**
     * param: enabled<boolean>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary speaker/audio render device set is enabled or disabled in the applicaation
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimarySpeakerEnabled = function (enabled) {
        return new Promise(function (resolve, reject) {
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 1) {
                    var speakerDevice = audioDevices[1];
                    speakerDevice._setEnabled(enabled);
                    audioDevices[1] = speakerDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary speaker/audio render device'));
                }
            });
        });
    };
    /**
     * param: volume<number> (0 to 100)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the system audio level of the primary speaker/audio render device set
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerSystemLevel(volume).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimarySpeakerSystemLevel = function (volume) {
        return new Promise(function (resolve, reject) {
            if (volume < 0) {
                reject(Error('Volume can only be positive'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 1) {
                    var speakerDevice = audioDevices[1];
                    speakerDevice._setSystemLevel(volume);
                    audioDevices[1] = speakerDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary speaker/audio render device'));
                }
            });
        });
    };
    /**
     * param: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets whether the primary speaker/audio render device set is enabled or disabled in the system
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerSystemEnabled(enabled).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimarySpeakerSystemEnabled = function (hwenabled) {
        return new Promise(function (resolve, reject) {
            if (hwenabled !== 0 && hwenabled !== 1 && hwenabled !== 255) {
                reject(Error('Value can only 0, 1 or 255'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 1) {
                    var speakerDevice = audioDevices[1];
                    speakerDevice._setSystemEnabled(hwenabled);
                    audioDevices[1] = speakerDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary speaker/audio render device'));
                }
            });
        });
    };
    /**
     * param: delay<number> (100 nanoseconds in units)
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the loopback capture delay of the primary speaker/audio render device
     *
     * ### Usage
     *
     * ```javascript
     * App.setPrimarySpeakerDelay(delay).then(function(val) {
     *   var isSet = val;
     * });
     * ```
     */
    App.prototype.setPrimarySpeakerDelay = function (delay) {
        return new Promise(function (resolve, reject) {
            if (delay < 0) {
                reject(Error('Delay can only be positive'));
            }
            app_1.App.getAsList('microphonedev2').then(function (arr) {
                var audioDevices = arr.map(function (val) {
                    return audio_1.AudioDevice.parse(val);
                });
                if (audioDevices.length && audioDevices.length > 1) {
                    var speakerDevice = audioDevices[1];
                    speakerDevice._setDelay(delay);
                    audioDevices[1] = speakerDevice;
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
                }
                else {
                    reject(Error('No audio device is set as primary speaker/audio render device'));
                }
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
                var silenceDetectionObj = json_1.JSON.parse(val);
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
                var silenceDetectionObj = json_1.JSON.parse(val);
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
                var silenceDetectionObj = json_1.JSON.parse(val);
                silenceDetectionObj['gain'] = (sdThreshold.toString());
                app_1.App.set('microphonegain', xml_1.XML.parseJSON(silenceDetectionObj).toString())
                    .then(function (setVal) {
                    resolve(setVal);
                });
            });
        });
    };
    // Transition Services
    /**
     * return: Promise<Transition>
     *
     * Gets the transition for scene changes
     *
     * See also: {@link #core/Transition Core/Transition}
     *
     * #### Usage
     *
     * ```javascript
     * App.getTransition().then(function(res) {
     *   var transitionid = res;
     * });
     * ```
     */
    App.prototype.getTransition = function () {
        return new Promise(function (resolve) {
            app_1.App.get('transitionid').then(function (val) {
                if (val === '') {
                    resolve(transition_1.Transition.NONE);
                }
                else {
                    var currTransition = transition_1.Transition[val.toUpperCase()];
                    if (typeof currTransition !== 'undefined') {
                        resolve(currTransition);
                    }
                    else {
                        transition_1.Transition.getSceneTransitions().then(function (transitions) {
                            var inTransition = false;
                            var transitionObj;
                            var i;
                            for (i = 0; i < transitions.length; i++) {
                                transitionObj = transitions[i];
                                if (transitionObj.toString() === val) {
                                    inTransition = true;
                                    break;
                                }
                            }
                            if (inTransition) {
                                resolve(transitionObj);
                            }
                            else {
                                resolve(new transition_1.Transition(val));
                            }
                        }).catch(function (err) {
                            resolve(new transition_1.Transition(val));
                        });
                    }
                }
            });
        });
    };
    /**
     * param: transition<Transition>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the transition for scene changes
     *
     * See also: {@link #core/Transition Core/Transition}
     *
     * #### Usage
     *
     * ```javascript
     * var xjs = require('xjs'),
     *     Transition = xjs.Transition,
     *     App = new xjs.App();
  
     * App.setTransition(Transition.CLOCK).then(function(val) {
     *  var isSet = val;
     * });
     * ```
     */
    App.prototype.setTransition = function (transition) {
        return new Promise(function (resolve) {
            app_1.App.set('transitionid', transition.toString()).then(function (val) {
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
     * App.getTransitionTime().then(function(res) {
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
     * param: time<number>
     * ```
     * return: Promise<boolean>
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
    /**
     * return: Promise<boolean>
     *
     *  Clears all cookies across all browser instances. Not available to
     *  source plugins (call this from the source properties window instead.)
     *
     * #### Usage
     *
     * ```javascript
     * App.clearBrowserCookies().then(function(val) {
     *  var isCleared = val;
     * });
     * ```
     */
    App.prototype.clearBrowserCookies = function () {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(new Error('This method is not available to source plugins.'));
            }
            else {
                internal_1.exec('CallHost', 'deletecookie:videoitemprop');
                resolve(true);
            }
        });
    };
    /**
     * return: Promise<string>
     *
     * Returns a hashed string that may be used to differentiate among logged-in
     * users. This will be useful in such cases as persisting data to be used by
     * certain XSplit users only.
     */
    App.prototype.getUserIdHash = function () {
        return new Promise(function (resolve) {
            resolve(app_1.App.getGlobalProperty('userid'));
        });
    };
    return App;
})();
exports.App = App;
},{"../internal/app":27,"../internal/internal":30,"../internal/util/json":32,"../internal/util/xml":34,"../system/audio":35,"../util/rectangle":48,"./environment":4,"./transition":26}],2:[function(require,module,exports){
var app_1 = require('../internal/app');
var Channel = (function () {
    /** Channel constructor (only used internally) */
    function Channel(props) {
        this._name = props.name;
        this._stat = props.stat;
        this._channel = props.channel;
    }
    /**
     *  return: Promise<Channel[]>
     *
     *  Gets the list of currently active channels.
     */
    Channel.getActiveStreamChannels = function () {
        return new Promise(function (resolve) {
            app_1.App.getAsList('recstat').then(function (activeStreams) {
                if (activeStreams.length === 0) {
                    resolve([]);
                }
                else {
                    var channels = [];
                    for (var i = 0; i < activeStreams.length; ++i) {
                        channels.push(new Channel({
                            name: activeStreams[i]['name'],
                            stat: activeStreams[i].children[0],
                            channel: activeStreams[i].children[1]
                        }));
                    }
                    resolve(channels);
                }
            });
        });
    };
    /**
     *  return: Promise<string>
     *
     *  Gets the name of the channel.
     */
    Channel.prototype.getName = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this._name);
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets the number of frames dropped */
    Channel.prototype.getStreamDrops = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.get('streamdrops:' + _this._name).then(function (val) {
                var drops = val.split(','), dropped = Number(drops[0]) || 0;
                resolve(dropped);
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets the number of frames rendered  */
    Channel.prototype.getStreamRenderedFrames = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.get('streamdrops:' + _this._name).then(function (val) {
                var drops = val.split(','), rendered = Number(drops[1]) || 0;
                resolve(rendered);
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets the current duration of the stream in microseconds  */
    Channel.prototype.getStreamTime = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.get('streamtime:' + _this._name).then(function (val) {
                var duration = Number(val) / 10;
                resolve(duration);
            });
        });
    };
    return Channel;
})();
exports.Channel = Channel;
},{"../internal/app":27}],3:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var internal_1 = require('../internal/internal');
var eventemitter_1 = require('../util/eventemitter');
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
 *  Use the `on(event: string, handler: Function)` function to listen to events.
 *
 */
var Dll = (function (_super) {
    __extends(Dll, _super);
    function Dll() {
        _super.apply(this, arguments);
    }
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
    Dll.load = function (path) {
        internal_1.exec('LoadDll', path.join(','));
    };
    /**
     *  param: (event: string, ...params: any[])
     *
     *  Allows this class to emit an event.
     */
    Dll.emit = function (event) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        params.unshift(event);
        Dll._emitter.emit.apply(Dll._emitter, params);
    };
    /**
     *  param: (event: string, handler: Function)
     *
     *  Allows listening to events that this class emits. Currently there are two:
     *  `access-granted` and `access-revoked`.
     */
    Dll.on = function (event, handler) {
        Dll._emitter.on(event, handler);
    };
    /**
     *  param: (funcName: string, ...params: string[])
     *
     *  return: string (see DLL documentation)
     *
     *  Calls a function from a loaded "safe" DLL. The only safe DLL we are
     *  currently exposing is `Xjs.dll`.
     */
    Dll.call = function (func) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            var funcCall = 'CallDll';
            params.unshift(func);
            params.unshift(funcCall);
            var retValue = internal_1.exec.apply(_this, params);
            if (retValue !== undefined) {
                resolve(retValue);
            }
            else {
                reject('DLL call not accessible.');
            }
        });
    };
    /**
     *  param: (funcName: string, ...params: string[])
     *
     *  return: string (see DLL documentation)
     *
     *  Calls a function from a loaded "unsafe" DLL. The first DLL containing
     *  the function name will be called, so you need to ensure there are no
     *  function name collisions among DLLs for functions you require.
     *
     *  Some DLLs have callbacks. Assign a handler function to that callback in
     *  the global namespace, and the DLL will call that function accordingly.
     *
     *  See the documentation of your specific DLL for more details.
     */
    Dll.callEx = function (func) {
        var _this = this;
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            var funcCall = 'CallDllEx';
            params.unshift(func);
            params.unshift(funcCall);
            var retValue = internal_1.exec.apply(_this, params);
            if (retValue !== undefined) {
                resolve(retValue);
            }
            else {
                reject('DLL call not accessible.');
            }
        });
    };
    /**
     *  return: Promise<boolean>
     *
     *  Determines if user has granted DLL access for this plugin, or whether
     *  DLL security is disabled altogether.
     */
    Dll.isAccessGranted = function () {
        return new Promise(function (resolve) {
            resolve(internal_1.exec('CheckDllGrant') === '1');
        });
    };
    Dll._emitter = new Dll();
    return Dll;
})(eventemitter_1.EventEmitter);
exports.Dll = Dll;
window.UpdateLocalProperty = function (prop, value) {
    if (prop === 'prop:dlldogrant') {
        var granted = value === '1';
        if (granted) {
            Dll.emit('access-granted');
        }
        else {
            Dll.emit('access-revoked');
        }
    }
};
window.Setdlldogrant = function (value) {
    var granted = value === '1';
    if (granted) {
        Dll.emit('access-granted');
    }
    else {
        Dll.emit('access-revoked');
    }
};
},{"../internal/internal":30,"../util/eventemitter":45}],4:[function(require,module,exports){
/**
 * This class allows detection of the context in which the HTML is located.
 */
var Environment = (function () {
    function Environment() {
    }
    /**
     * This method is only used internally.
     */
    Environment.initialize = function () {
        if (Environment._initialized) {
            return;
        }
        Environment._isSourcePlugin = (window.external &&
            window.external['GetConfiguration'] !== undefined);
        Environment._isSourceProps = (window.external &&
            window.external['GetConfiguration'] === undefined &&
            window.external['GetViewId'] !== undefined &&
            window.external['GetViewId']() !== undefined);
        Environment._isExtension = (window.external &&
            window.external['GetConfiguration'] === undefined &&
            window.external['GetViewId'] !== undefined &&
            window.external['GetViewId']() === undefined);
        Environment._initialized = true;
    };
    /**
     * return: boolean
     *
     * Determines if this HTML is running as a source.
     */
    Environment.isSourcePlugin = function () {
        return Environment._isSourcePlugin;
    };
    /**
     * return: boolean
     *
     * > #### For Deprecation
     * This method is deprecated and will be removed soon. Please use
     * {@link #core/Environment#isSourceProps isSourceProps} instead.
     *
     * Determines if this HTML is running within the source properties window.
     */
    Environment.isSourceConfig = function () {
        return Environment._isSourceProps;
    };
    /**
     * return: boolean
     *
     * Determines if this HTML is running within the source properties window.
     */
    Environment.isSourceProps = function () {
        return Environment._isSourceProps;
    };
    /**
     * return: boolean
     *
     * Determines if this HTML is running as an extension plugin.
     */
    Environment.isExtension = function () {
        return Environment._isExtension;
    };
    return Environment;
})();
exports.Environment = Environment;
Environment.initialize();
},{}],5:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var environment_1 = require('../core/environment');
var internal_1 = require('../internal/internal');
var Extension = (function () {
    function Extension() {
        if (environment_1.Environment.isExtension()) {
            this._presName = window.location.href;
        }
        else {
            throw new Error('Extension class can only be used on Extension Plugins');
        }
    }
    /**
     *  Gets the instance of the Extension class. Use this instead of the constructor.
     */
    Extension.getInstance = function () {
        if (Extension._instance === undefined) {
            Extension._instance = new Extension();
        }
        return Extension._instance;
    };
    /**
     * param: (configObj: JSON)
     * ```
     * return: Promise<ExtensionWindow|Error>
     * ```
     *
     * Save the configuration object to the presentation
     */
    Extension.prototype.saveConfig = function (configObj) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if ({}.toString.call(configObj) === '[object Object]') {
                internal_1.exec('SetPresProperty', _this._presName, JSON.stringify(configObj));
                resolve(_this);
            }
            else {
                reject(Error('Configuration object should be in JSON format'));
            }
        });
    };
    /**
     * return: Promise<JSON>
     *
     * Get the saved configuration from the presentation
     */
    Extension.prototype.loadConfig = function () {
        var _this = this;
        return new Promise(function (resolve) {
            internal_1.exec('GetPresProperty', _this._presName, function (config) {
                var configObj = config === '' ? {} : JSON.parse(config);
                resolve(configObj);
            });
        });
    };
    return Extension;
})();
exports.Extension = Extension;
},{"../core/environment":4,"../internal/internal":30}],6:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var app_1 = require('../internal/app');
var internal_1 = require('../internal/internal');
var environment_1 = require('./environment');
var source_1 = require('./source/source');
var game_1 = require('./source/game');
var camera_1 = require('./source/camera');
var audio_1 = require('./source/audio');
var videoplaylist_1 = require('./source/videoplaylist');
var html_1 = require('./source/html');
var flash_1 = require('./source/flash');
var screen_1 = require('./source/screen');
var image_1 = require('./source/image');
var media_1 = require('./source/media');
var Scene = (function () {
    function Scene(sceneNum) {
        this._id = sceneNum - 1;
    }
    ;
    Scene._initializeScenePool = function () {
        if (Scene._scenePool.length === 0) {
            for (var i = 0; i < Scene._maxScenes; i++) {
                Scene._scenePool[i] = new Scene(i + 1);
            }
        }
    };
    Scene._initializeScenePoolAsync = function () {
        return new Promise(function (resolve) {
            app_1.App.get('presetcount').then(function (cnt) {
                var count = Number(cnt);
                (count > 12) ? Scene._maxScenes = count : Scene._maxScenes = 12;
                for (var i = 0; i < Scene._maxScenes; i++) {
                    Scene._scenePool[i] = new Scene(i + 1);
                }
                resolve(Scene._maxScenes);
            });
        });
    };
    /**
     * return: Scene
     *
     * Get a specific scene object given the scene number.
     *
     * ** FOR DEPRECATION **
     * This method doesn't account for scenes greater than 12,
     * which is needed to support for the scene in the XBC preview editor.
     *
     *
     * #### Usage
     *
     * ```javascript
     * var scene1 = Scene.getById(1);
     * ```
     */
    Scene.getById = function (sceneNum) {
        // initialize if necessary
        Scene._initializeScenePool();
        return Scene._scenePool[sceneNum - 1];
    };
    /**
     * return: Promise<Scene>
     *
     * Get a specific scene object given the scene number.
     *
     *
     * #### Usage
     *
     * ```javascript
     * var scene1;
     * Scene.getByIdAsync(1).then(function(scene) {
     *   scene1 = scene;
     * });
     * ```
     */
    Scene.getByIdAsync = function (sceneNum) {
        return new Promise(function (resolve) {
            Scene._initializeScenePoolAsync().then(function (cnt) {
                resolve(Scene._scenePool[sceneNum - 1]);
            });
        });
    };
    /**
     * return: Promise<Scene[]>
     *
     * Asynchronous functon to get a list of scene objects with a specific name.
     *
     *
     * #### Usage
     *
     * ```javascript
     * Scene.getByName('Game').then(function(scenes) {
     *   // manipulate scenes
     * });
     * ```
     */
    Scene.getByName = function (sceneName) {
        return new Promise(function (resolve) {
            Scene._initializeScenePoolAsync().then(function (cnt) {
                var namePromise = Promise.all(Scene._scenePool.map(function (scene, index) {
                    return app_1.App.get('presetname:' + index).then(function (name) {
                        if (sceneName === name) {
                            return Scene._scenePool[index];
                        }
                        else {
                            return null;
                        }
                    });
                }));
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
        });
    };
    /**
     * return: Promise<Scene>
     *
     * Get the currently active scene. Does not work on source plugins.
     *
     * #### Usage
     *
     * ```javascript
     * var myScene;
     * Scene.getActiveScene().then(function(scene) {
     *   myScene = scene;
     * });
     * ```
     */
    Scene.getActiveScene = function () {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('Not supported on source plugins'));
            }
            else {
                app_1.App.get('preset:0').then(function (id) {
                    return Scene.getByIdAsync(Number(id) + 1);
                }).then(function (scene) {
                    resolve(scene);
                });
            }
        });
    };
    /**
     * param: scene<number|Scene>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Change active scene. Does not work on source plugins.
     */
    Scene.setActiveScene = function (scene) {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('Not supported on source plugins'));
            }
            else {
                if (scene instanceof Scene) {
                    scene.getId().then(function (id) {
                        app_1.App.set('preset', String(id)).then(function (res) {
                            resolve(res);
                        });
                    });
                }
                else if (typeof scene === 'number') {
                    if (scene < 1 || scene > 12) {
                        reject(Error('Invalid parameters. Valid range is 1 to 12.'));
                    }
                    else {
                        app_1.App.set('preset', String(scene - 1)).then(function (res) {
                            resolve(res);
                        });
                    }
                }
                else {
                    reject(Error('Invalid parameters'));
                }
            }
        });
    };
    /**
     * return: Promise<Source>
     *
     * Searches all scenes for an source by ID. ID search will return exactly 1 result (IDs are unique) or null.
     *
     * See also: {@link #core/Source Core/Source}
     *
     * #### Usage
     *
     * ```javascript
     * Scene.searchSourcesById('{10F04AE-6215-3A88-7899-950B12186359}').then(function(source) {
     *   // result is either a Source or null
     * });
     * ```
     *
     */
    Scene.searchSourcesById = function (id) {
        return new Promise(function (resolve, reject) {
            var isID = /^{[A-F0-9\-]*}$/i.test(id);
            if (!isID) {
                reject(Error('Not a valid ID format for sources'));
            }
            else {
                Scene._initializeScenePoolAsync().then(function (cnt) {
                    var match = null;
                    var found = false;
                    Scene._scenePool.forEach(function (scene, idx, arr) {
                        if (match === null) {
                            scene.getSources().then((function (sources) {
                                found = sources.some(function (source) {
                                    if (source['_id'] === id.toUpperCase()) {
                                        match = source;
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
        });
    };
    ;
    /**
     * return: Promise<Scene>
     *
     * Searches all scenes for one that contains the given source ID.
     *
     *
     * #### Usage
     *
     * ```javascript
     * Scene.searchScenesBySourceId('{10F04AE-6215-3A88-7899-950B12186359}').then(function(scene) {
     *   // scene contains the source
     * });
     * ```
     *
     */
    Scene.searchScenesBySourceId = function (id) {
        return new Promise(function (resolve, reject) {
            var isID = /^{[A-F0-9-]*}$/i.test(id);
            if (!isID) {
                reject(Error('Not a valid ID format for sources'));
            }
            else {
                Scene._initializeScenePoolAsync().then(function (cnt) {
                    var match = null;
                    var found = false;
                    Scene._scenePool.forEach(function (scene, idx, arr) {
                        if (match === null) {
                            scene.getSources().then(function (sources) {
                                found = sources.some(function (source) {
                                    if (source['_id'] === id.toUpperCase()) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                });
                                if (found) {
                                    resolve(scene);
                                }
                                else if (idx === arr.length - 1) {
                                    // last scene, no match
                                    resolve(match);
                                }
                            });
                        }
                    });
                });
            }
        });
    };
    ;
    /**
     * return: Promise<Source[]>
     *
     * Searches all scenes for a source by name substring. This function
     * compares against custom name first (recommended) before falling back to the
     * name property of the source.
     *
     *
     * #### Usage
     *
     * ```javascript
     * Scene.searchSourcesByName('camera').then(function(sources) {
     *   // do something to each source in sources array
     * });
     * ```
     *
     */
    Scene.searchSourcesByName = function (param) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.filterSources(function (source, filterResolve) {
                source.getCustomName().then(function (cname) {
                    if (cname.match(param)) {
                        filterResolve(true);
                    }
                    else {
                        return source.getName();
                    }
                }).then(function (name) {
                    if (name !== undefined) {
                        if (name.match(param)) {
                            filterResolve(true);
                        }
                        else {
                            return source.getValue();
                        }
                    }
                }).then(function (value) {
                    if (value !== undefined) {
                        if (value.toString().match(param)) {
                            filterResolve(true);
                        }
                        else {
                            filterResolve(false);
                        }
                    }
                });
            }).then(function (sources) {
                resolve(sources);
            });
        });
    };
    ;
    /**
     * param: function(source, resolve)
     * ```
     * return: Promise<Source[]>
     * ```
     *
     * Searches all scenes for sources that satisfies the provided testing function.
     *
     * #### Usage
     *
     * ```javascript
     * Scene.filterSources(function(source, resolve) {
     *   // We'll only fetch Flash Sources by resolving 'true' if the source is an
     *   // instance of FlashSource
     *   resolve((source instanceof FlashSource));
     * }).then(function(sources) {
     *   // sources would either be an empty array if no Flash sources was found,
     *   // or an array of FlashSource objects
     * });
     * ```
     */
    Scene.filterSources = function (func) {
        return new Promise(function (resolve, reject) {
            Scene._initializeScenePoolAsync().then(function (cnt) {
                var matches = [];
                if (typeof func === 'function') {
                    return Promise.all(Scene._scenePool.map(function (scene) {
                        return new Promise(function (resolveScene) {
                            scene.getSources().then(function (sources) {
                                if (sources.length === 0) {
                                    resolveScene();
                                }
                                else {
                                    return Promise.all(sources.map(function (source) {
                                        return new Promise(function (resolveSource) {
                                            func(source, function (checker) {
                                                if (checker) {
                                                    matches.push(source);
                                                }
                                                resolveSource();
                                            });
                                        });
                                    })).then(function () {
                                        resolveScene();
                                    });
                                }
                            }).catch(function () {
                                resolveScene();
                            });
                        });
                    })).then(function () {
                        resolve(matches);
                    });
                }
                else {
                    reject(Error('Parameter is not a function'));
                }
            });
        });
    };
    /**
     * param: function(source, resolve)
     * ```
     * return: Promise<Scene[]>
     * ```
     *
     * Searches all scenes for sources that satisfies the provided testing
     * function, and then return the scene that contains the source.
     *
     * #### Usage
     *
     * ```javascript
     * Scene.filterScenesBySources(function(source, resolve) {
     *   // We'll only fetch the scenes with flash sources by resolving 'true' if
     *   // the source is an instance of FlashSource
     *   resolve((source instanceof FlashSource));
     * }).then(function(scenes) {
     *   // scenes would be an array of all scenes with FlashSources
     * });
     * ```
     */
    Scene.filterScenesBySources = function (func) {
        return new Promise(function (resolve, reject) {
            Scene._initializeScenePoolAsync().then(function (cnt) {
                var matches = [];
                if (typeof func === 'function') {
                    return Promise.all(Scene._scenePool.map(function (scene) {
                        return new Promise(function (resolveScene) {
                            scene.getSources().then(function (sources) {
                                if (sources.length === 0) {
                                    resolveScene();
                                }
                                else {
                                    return Promise.all(sources.map(function (source) {
                                        return new Promise(function (resolveSource) {
                                            func(source, function (checker) {
                                                if (checker) {
                                                    matches.push(scene);
                                                }
                                                resolveSource();
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
                }
                else {
                    reject(Error('Parameter is not a function'));
                }
            });
        });
    };
    /**
     * return: Promise<boolean>
  
     * Load scenes that are not yet initialized in XSplit Broadcaster.
     *
     * Note: For memory saving purposes, this is not called automatically.
     * If your extension wants to manipulate multiple scenes, it is imperative that you call this function.
     * This function is only available to extensions.
     *
     * #### Usage
     *
     * ```javascript
     * Scene.initializeScenes().then(function(val) {
     *   if (val === true) {
     *     // Now you know that all scenes are loaded :)
     *   }
     * })
     * ```
     */
    Scene.initializeScenes = function () {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('function is not available for source'));
            }
            app_1.App.get('presetcount').then(function (cnt) {
                if (Number(cnt) !== 12) {
                    // Insert an empty scene for scene #12
                    app_1.App
                        .set('presetconfig:11', '<placement name="Scene 12" defpos="0" />')
                        .then(function (res) {
                        resolve(res);
                    });
                }
                else {
                    resolve(true);
                }
            });
        });
    };
    /**
     * return: number
     *
     * Get the 1-indexed scene number of this scene object.
     *
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getSceneNumber().then(function(num) {
     *  console.log('My scene is scene number ' + num);
     * });
     * ```
     */
    Scene.prototype.getSceneNumber = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this._id + 1);
        });
    };
    /**
     * return: number
     *
     * Get the name of this scene object.
     *
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getSceneName().then(function(name) {
     *  console.log('My scene is named ' + name);
     * });
     * ```
     */
    Scene.prototype.getName = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.get('presetname:' + _this._id).then(function (val) {
                resolve(val);
            });
        });
    };
    /**
     *
     * Set the name of this scene object. Cannot be set by source plugins.
     *
     * #### Usage
     *
     * ```javascript
     * myScene.setName('Gameplay');
     * ```
     */
    Scene.prototype.setName = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('Scene names are readonly for source plugins.'));
            }
            else {
                app_1.App.set('presetname:' + _this._id, name).then(function (value) {
                    resolve(value);
                });
            }
        });
    };
    /**
     * return: Promise<Source[]>
     *
     * Gets all the sources in a specific scene.
     * See also: {@link #core/Source Core/Source}
     *
     * #### Usage
     *
     * ```javascript
     * myScene.getSources().then(function(sources) {
     *  // do something to each source in sources array
     * });
     * ```
     */
    Scene.prototype.getSources = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            app_1.App.getAsList('presetconfig:' + _this._id).then(function (jsonArr) {
                var promiseArray = [];
                // type checking to return correct Source subtype
                var typePromise = function (index) { return new Promise(function (typeResolve) {
                    var source = jsonArr[index];
                    var type = Number(source['type']);
                    if (type === source_1.SourceTypes.GAMESOURCE) {
                        typeResolve(new game_1.GameSource(source));
                    }
                    else if ((type === source_1.SourceTypes.HTML || type === source_1.SourceTypes.FILE) &&
                        source['name'].indexOf('Video Playlist') === 0 &&
                        source['FilePlaylist'] !== '') {
                        typeResolve(new videoplaylist_1.VideoPlaylistSource(source));
                    }
                    else if (type === source_1.SourceTypes.HTML) {
                        typeResolve(new html_1.HtmlSource(source));
                    }
                    else if (type === source_1.SourceTypes.SCREEN) {
                        typeResolve(new screen_1.ScreenSource(source));
                    }
                    else if (type === source_1.SourceTypes.BITMAP ||
                        type === source_1.SourceTypes.FILE &&
                            /\.gif$/.test(source['item'])) {
                        typeResolve(new image_1.ImageSource(source));
                    }
                    else if (type === source_1.SourceTypes.FILE &&
                        /\.(gif|xbs)$/.test(source['item']) === false &&
                        /^(rtsp|rtmp):\/\//.test(source['item']) === false) {
                        typeResolve(new media_1.MediaSource(source));
                    }
                    else if (Number(source['type']) === source_1.SourceTypes.LIVE &&
                        source['item'].indexOf('{33D9A762-90C8-11D0-BD43-00A0C911CE86}') === -1) {
                        typeResolve(new camera_1.CameraSource(source));
                    }
                    else if (Number(source['type']) === source_1.SourceTypes.LIVE &&
                        source['item'].indexOf('{33D9A762-90C8-11D0-BD43-00A0C911CE86}') !== -1) {
                        typeResolve(new audio_1.AudioSource(source));
                    }
                    else if (Number(source['type']) === source_1.SourceTypes.FLASHFILE) {
                        typeResolve(new flash_1.FlashSource(source));
                    }
                    else {
                        typeResolve(new source_1.Source(source));
                    }
                }); };
                if (Array.isArray(jsonArr)) {
                    for (var i = 0; i < jsonArr.length; i++) {
                        jsonArr[i]['sceneId'] = _this._id;
                        promiseArray.push(typePromise(i));
                    }
                }
                Promise.all(promiseArray).then(function (results) {
                    resolve(results);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Checks if a scene is empty.
     *
     * #### Usage
     *
     * ```javascript
     * myScene.isEmpty().then(function(empty) {
     *   if (empty === true) {
     *     console.log('My scene is empty.');
     *   }
     * });
     * ```
     */
    Scene.prototype.isEmpty = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.get('presetisempty:' + _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: Array<Source> | Array<string> (source IDs)
     * ```
     * return: Promise<Scene>
     * ```
     *
     * Sets the source order of the current scene. The first source in the array
     * will be on top (will cover sources below it).
     */
    Scene.prototype.setSourceOrder = function (sources) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('not available for source plugins'));
            }
            else {
                sources.reverse();
                var ids = [];
                Scene.getActiveScene().then(function (scene) {
                    if (sources.every(function (el) { return el instanceof source_1.Source; })) {
                        return new Promise(function (resolve) {
                            var promises = [];
                            for (var i in sources) {
                                promises.push((function (_i) {
                                    return new Promise(function (resolve) {
                                        sources[_i].getId().then(function (id) {
                                            ids[_i] = id;
                                            resolve(_this);
                                        });
                                    });
                                })(i));
                            }
                            Promise.all(promises).then(function () {
                                return scene.getSceneNumber();
                            }).then(function (id) {
                                resolve(id);
                            });
                        });
                    }
                    else {
                        ids = sources;
                        return scene.getSceneNumber();
                    }
                }).then(function (id) {
                    if ((Number(id) - 1) === _this._id && environment_1.Environment.isSourceConfig()) {
                        internal_1.exec('SourcesListOrderSave', ids.join(','));
                        resolve(_this);
                    }
                    else {
                        var sceneName;
                        _this.getName().then(function (name) {
                            sceneName = name;
                            return app_1.App.getAsList('presetconfig:' + _this._id);
                        }).then(function (jsonArr) {
                            var newOrder = new json_1.JSON();
                            newOrder.children = [];
                            newOrder['tag'] = 'placement';
                            newOrder['name'] = sceneName;
                            if (Array.isArray(jsonArr)) {
                                var attrs = ['name', 'cname', 'item'];
                                for (var i = 0; i < jsonArr.length; i++) {
                                    for (var a = 0; a < attrs.length; a++) {
                                        jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]]
                                            .replace(/([^\\])(\\)([^\\])/g, '$1\\\\$3');
                                        jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]]
                                            .replace(/"/g, '&quot;');
                                    }
                                    newOrder.children[ids.indexOf(jsonArr[i]['id'])] = jsonArr[i];
                                }
                                app_1.App.set('presetconfig:' + _this._id, xml_1.XML.parseJSON(newOrder).toString()).then(function () {
                                    resolve(_this);
                                });
                            }
                            else {
                                reject(Error('Scene does not have any source'));
                            }
                        });
                    }
                });
            }
        });
    };
    Scene._maxScenes = 12;
    Scene._scenePool = [];
    return Scene;
})();
exports.Scene = Scene;
},{"../internal/app":27,"../internal/internal":30,"../internal/util/json":32,"../internal/util/xml":34,"./environment":4,"./source/audio":7,"./source/camera":8,"./source/flash":10,"./source/game":11,"./source/html":12,"./source/image":19,"./source/media":22,"./source/screen":23,"./source/source":24,"./source/videoplaylist":25}],7:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mixin_1 = require('../../internal/util/mixin');
var item_1 = require('../../internal/item');
var iaudio_1 = require('./iaudio');
var source_1 = require('./source');
/**
 * The AudioSource class represents an audio device that has been added
 * to the stage.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemAudio Core/IItemAudio}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.AudioSource) {
 *         // Manipulate your audio device source here
 *         sources[i].setSilenceDetectionEnabled(true);
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `AudioSource`
 *  instance.
 */
var AudioSource = (function (_super) {
    __extends(AudioSource, _super);
    function AudioSource() {
        _super.apply(this, arguments);
    }
    /**
     * return: Promise<boolean>
     *
     * Check if silence detection is on or off
     */
    AudioSource.prototype.isSilenceDetectionEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:AudioGainEnable', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value: boolean)
     *
     * Set silence detection to ON or OFF
     *
     * *Chainable.*
     */
    AudioSource.prototype.setSilenceDetectionEnabled = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.set('prop:AudioGainEnable', (value ? '1' : '0'), _this._id)
                .then(function (res) {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets silenced detection threshold.
     * Amplitude less than threshold will be detected as silence.
     */
    AudioSource.prototype.getSilenceThreshold = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:AudioGain', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    /**
     * param: (value: number)
     *
     * Sets silence detection threshold, min of 0, max of 128
     *
     * *Chainable.*
     */
    AudioSource.prototype.setSilenceThreshold = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(Error('Only numbers are acceptable values for threshold'));
            }
            else if (value % 1 !== 0 || value < 0 || value > 128) {
                reject(Error('Only integers in the range 0-128 are acceptable for threshold'));
            }
            else {
                item_1.Item.set('prop:AudioGain', String(value), _this._id).then(function (res) {
                    resolve(_this);
                });
            }
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets silenced detection period in ms time unit.
     * Reaction time before filter removes noice/sound less than threshold
     */
    AudioSource.prototype.getSilencePeriod = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:AudioGainLatency', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    /**
     * param: (value: number)
     *
     * Sets silence detection period, min of 0, max of 10000
     *
     * *Chainable.*
     */
    AudioSource.prototype.setSilencePeriod = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(Error('Only numbers are acceptable values for period'));
            }
            else if (value % 1 !== 0 || value < 0 || value > 10000) {
                reject(Error('Only integers in the range 0-10000 are acceptable for period'));
            }
            else {
                item_1.Item.set('prop:AudioGainLatency', String(value), _this._id).then(function (res) {
                    resolve(_this);
                });
            }
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets audio delay (1 unit = 100ns)
     */
    AudioSource.prototype.getAudioOffset = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:AudioDelay', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    /**
     * param: (value: number)
     *
     * Sets audio delay, accepts only positive delay
     *
     * *Chainable.*
     */
    AudioSource.prototype.setAudioOffset = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(Error('Only numbers are acceptable values for period'));
            }
            else if (value < 0) {
                reject(Error('Audio offset cannot be negative'));
            }
            else {
                item_1.Item.set('prop:AudioDelay', String(value), _this._id).then(function (res) {
                    resolve(_this);
                });
            }
        });
    };
    return AudioSource;
})(source_1.Source);
exports.AudioSource = AudioSource;
mixin_1.applyMixins(source_1.Source, [iaudio_1.ItemAudio]);
},{"../../internal/item":31,"../../internal/util/mixin":33,"./iaudio":13,"./source":24}],8:[function(require,module,exports){
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
var ieffects_1 = require('./ieffects');
var itransition_1 = require('./itransition');
var iaudio_1 = require('./iaudio');
var source_1 = require('./source');
var system_1 = require('../../system/system');
/**
 * The CameraSource Class provides methods specifically used for camera sources and
 * also methods that are shared between Source Classes. The
 * {@link #core/Scene Scene} class' getSources method would automatically return a
 * CameraSource object if there's a camera source on the specified scene.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.CameraSource) {
 *         // Manipulate your camera sources here
 *         sources[i].getDeviceId().then(function(id) {
 *           // Do something with the id
 *         });
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `CameraSource`
 *  instance.
 */
var CameraSource = (function (_super) {
    __extends(CameraSource, _super);
    function CameraSource() {
        _super.apply(this, arguments);
        this._delayExclusionObject = {
            roxio: "vid_1b80&pid_e0(01|11|12)",
            hauppauge1: "vid_2040&pid_49(0[0-3]|8[0-3])",
            hauppauge2: "vid_2040&pid_e50[012a4]"
        };
    }
    /**
     * return: Promise<string>
     *
     * Gets the device ID of the underlying camera device.
     */
    CameraSource.prototype.getDeviceId = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:item', _this._id).then(function (val) {
                resolve(val);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks if camera feed is paused
     */
    CameraSource.prototype.isStreamPaused = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:StreamPause', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value: boolean)
     *
     * Sets whether camera feed is paused or not
     *
     * *Chainable.*
     */
    CameraSource.prototype.setStreamPaused = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.set('prop:StreamPause', value ? '1' : '0', _this._id).then(function () {
                return item_1.Item.get('prop:StreamPause', _this._id);
            }).then(function (val) {
                if (value === (val === ('1'))) {
                    resolve(_this);
                }
                else {
                    reject(new Error('Camera feed cannot be paused/resumed or is not present'));
                }
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks if camera device is a hardware encoder or not. This check may fail
     * if camera device is reinitializing or not present (value defaults to false)
     *
     */
    CameraSource.prototype.isHardwareEncoder = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.get('prop:hwencoder', _this._id).then(function (val) {
                if (val === '1') {
                    resolve(true);
                }
                else {
                    _this.isActive().then(function (isActive) {
                        if (isActive) {
                            resolve(false);
                        }
                        else {
                            reject(new Error('Cannot check hardware encoding. Device not present'));
                        }
                    });
                }
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks if camera device is active and present.
     *
     */
    CameraSource.prototype.isActive = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:activestate', _this._id).then(function (val) {
                resolve(val === 'active');
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets feed capture delay in milliseconds
     */
    CameraSource.prototype.getDelay = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var streamDelay, audioDelay;
            item_1.Item.get('prop:StreamDelay', _this._id).then(function (val) {
                streamDelay = Number(val);
                return item_1.Item.get('prop:AudioDelay', _this._id);
            }).then(function (val) {
                audioDelay = Number(val);
                if (streamDelay < audioDelay) {
                    resolve(streamDelay / 10000);
                }
                else {
                    resolve(audioDelay / 10000);
                }
            });
        });
    };
    /**
     * param: (value: number)
     *
     * Sets feed capture delay in milliseconds, accepts only positive delay
     *
     * *Chainable.*
     */
    CameraSource.prototype.setDelay = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var isPositive, audioOffset;
            _this.isHardwareEncoder().then(function (val) {
                if (val === true) {
                    reject(new Error('Cannot set delay to hardware encoder devices'));
                }
                else {
                    return _this.getValue();
                }
            }).then(function (val) {
                for (var key in _this._delayExclusionObject) {
                    var regex = new RegExp(_this._delayExclusionObject[key].toLowerCase(), 'g');
                    if (typeof val === 'string' && val.toLowerCase().match(regex) != null) {
                        reject(new Error('Cannot set delay to specific device'));
                        break;
                    }
                }
                return _this.getAudioOffset();
            }).then(function (val) {
                audioOffset = val;
                if (audioOffset >= 0) {
                    isPositive = true;
                    return item_1.Item.set('prop:StreamDelay', String(value * 10000), _this._id);
                }
                else {
                    isPositive = false;
                    return item_1.Item.set('prop:StreamDelay', String((value + (audioOffset * -1)) * 10000), _this._id);
                }
            }).then(function (val) {
                if (isPositive) {
                    return item_1.Item.set('prop:AudioDelay', String((value + audioOffset) * 10000), _this._id);
                }
                else {
                    return item_1.Item.set('prop:AudioDelay', String(value * 10000), _this._id);
                }
            }).then(function (val) {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<number>
     *
     * Gets audio delay with respect to video feed in milliseconds
     */
    CameraSource.prototype.getAudioOffset = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var streamDelay, audioDelay;
            item_1.Item.get('prop:StreamDelay', _this._id).then(function (val) {
                streamDelay = Number(val);
                return item_1.Item.get('prop:AudioDelay', _this._id);
            }).then(function (val) {
                audioDelay = Number(val);
                resolve((audioDelay - streamDelay) / 10000);
            });
        });
    };
    /**
     * param: (value: number)
     *
     * Sets audio delay with respect to video feed in milliseconds
     *
     * *Chainable.*
     */
    CameraSource.prototype.setAudioOffset = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var itemAudio, delay;
            item_1.Item.get('prop:itemaudio', _this._id).then(function (val) {
                itemAudio = val;
                return _this.isAudioAvailable();
            }).then(function (val) {
                if (val === false && itemAudio === '') {
                    reject(new Error('Device has no audio'));
                }
                else {
                    return _this.getDelay();
                }
            }).then(function (val) {
                delay = val;
                if (value >= 0) {
                    return item_1.Item.set('prop:StreamDelay', String(delay * 10000), _this._id);
                }
                else {
                    return item_1.Item.set('prop:StreamDelay', String((delay + (value * -1)) * 10000), _this._id);
                }
            }).then(function (val) {
                if (value >= 0) {
                    return item_1.Item.set('prop:AudioDelay', String((delay + value) * 10000), _this._id);
                }
                else {
                    return item_1.Item.set('prop:AudioDelay', String(delay * 10000), _this._id);
                }
            }).then(function (val) {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<MicrophoneDevice>
     *
     * Gets the microphone device tied as an audio input,
     * rejected if no microphone device is used
     */
    CameraSource.prototype.getAudioInput = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var itemAudioId;
            item_1.Item.get('prop:itemaudio', _this._id).then(function (val) {
                if (val === '') {
                    reject(new Error('No tied audio input'));
                }
                else {
                    itemAudioId = val;
                    return system_1.System.getMicrophones();
                }
            }).then(function (val) {
                var micDevice;
                if (val !== undefined) {
                    for (var i = 0; i < val.length; ++i) {
                        if (val[i].getDisplayId() === itemAudioId) {
                            micDevice = val[i];
                            break;
                        }
                    }
                }
                if (micDevice !== undefined) {
                    resolve(micDevice);
                }
                else {
                    reject(new Error('Tied audio input not present'));
                }
            });
        });
    };
    /**
     * param: (value: number)
     *
     * Sets the microphone device to be tied as an audio input
     *
     * *Chainable.*
     */
    CameraSource.prototype.setAudioInput = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.set('prop:itemaudio', value.getDisplayId(), _this._id)
                .then(function (val) {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks whether deinterlacing is enforced
     */
    CameraSource.prototype.isForceDeinterlace = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:fdeinterlace', _this._id).then(function (val) {
                resolve(val === '3');
            });
        });
    };
    /**
     * param: (value: boolean)
     *
     * Enables or disables forcing of deinterlacing
     *
     * *Chainable.*
     */
    CameraSource.prototype.setForceDeinterlace = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:fdeinterlace', (value ? '3' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    // special color options pinning
    /**
     * param: (value: boolean)
     *
     * Set this to true to share color settings across all instances of this
     * camera device on the stage.
     *
     * *Chainable.*
     */
    CameraSource.prototype.setColorOptionsPinned = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:cc_pin', value ? '1' : '0', _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks whether color settings are shared across all instances of
     * this camera device on the stage.
     */
    CameraSource.prototype.getColorOptionsPinned = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:cc_pin', _this._id).then(function (val) {
                resolve(val === '1' ? true : false);
            });
        });
    };
    // special chroma options pinning
    /**
     * param: (value: boolean)
     *
     * Set this to true to share chroma keying settings across all instances of
     * this camera device on the stage.
     *
     * *Chainable.*
     */
    CameraSource.prototype.setKeyingOptionsPinned = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:key_pin', value ? '1' : '0', _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks whether chroma keying settings are shared across all instances of
     * this camera device on the stage.
     */
    CameraSource.prototype.getKeyingOptionsPinned = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_pin', _this._id).then(function (val) {
                resolve(val === '1' ? true : false);
            });
        });
    };
    return CameraSource;
})(source_1.Source);
exports.CameraSource = CameraSource;
mixin_1.applyMixins(CameraSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition,
    iaudio_1.ItemAudio, ieffects_1.ItemEffect]);
},{"../../internal/item":31,"../../internal/util/mixin":33,"../../system/system":41,"./iaudio":13,"./ichroma":14,"./icolor":15,"./ieffects":17,"./ilayout":18,"./itransition":21,"./source":24}],9:[function(require,module,exports){
/**
 *  A CuePoint represents a configurable object for sources that
 *  support cue points. Check `getCuePoints()` and other related methods of
 *  {@link #core/MediaSource#getCuePoints Core/MediaSource}.
 */
var CuePoint = (function () {
    function CuePoint(time, action) {
        this._time = time;
        this._action = action;
    }
    CuePoint.prototype.toString = function () {
        return String(this._time * 10000000) + this._action;
    };
    /**
     * param: number
     *
     * Sets this cue point's time in seconds, with precision up to 100ns.
     */
    CuePoint.prototype.setTime = function (time) {
        this._time = time;
    };
    /**
     *  param: string
     *
     *  Sets the action to be performed on the cue point. Choose any of the
     *  following values: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
     */
    CuePoint.prototype.setAction = function (action) {
        if (action === CuePoint.PAUSE || action === CuePoint.RESUME ||
            action === CuePoint.CUT) {
            this._action = action;
        }
        else {
            throw new Error('Trying to set to an invalid Cue Point action.');
        }
    };
    /**
     * return: number
     *
     * Gets the time in seconds corresponding to this cue point, with precision
     * up to 100ns.
     */
    CuePoint.prototype.getTime = function () {
        return this._time / 10000000;
    };
    /**
     *  return: string
     *
     *  Gets the action to be performed on the cue point, which may be any of the
     *  following: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
     */
    CuePoint.prototype.getAction = function () {
        return this._action;
    };
    CuePoint._fromString = function (value) {
        var _a = [value.substring(0, value.length - 1),
            value.charAt(value.length - 1)], time = _a[0], action = _a[1];
        return new CuePoint(Number(time), action);
    };
    CuePoint.PAUSE = 'p';
    CuePoint.RESUME = 'r';
    CuePoint.CUT = 's';
    return CuePoint;
})();
exports.CuePoint = CuePoint;
},{}],10:[function(require,module,exports){
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
var ieffects_1 = require('./ieffects');
var itransition_1 = require('./itransition');
var iaudio_1 = require('./iaudio');
var source_1 = require('./source');
var rectangle_1 = require('../../util/rectangle');
/**
 * The FlashSource class represents a flash source, which is any SWF file
 * loaded to XSplit Broadcaster.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 *  All methods marked as *Chainable* resolve with the original `FlashSource`
 * instance. Also, any audio setting, i.e. volume, mute, stream only
 * may not be properly reflected in the source unless native flash audio support
 * is enabled. (Tools menu > General Settings > Advanced tab)
 */
var FlashSource = (function (_super) {
    __extends(FlashSource, _super);
    function FlashSource() {
        _super.apply(this, arguments);
    }
    /**
     * return: Promise<Rectangle>
     *
     * Gets the custom resolution (in pixels) for the source, if set,
     * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
     * custom resolution has been set.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    FlashSource.prototype.getCustomResolution = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var customSize;
            item_1.Item.get('prop:BrowserSize', _this._id).then(function (val) {
                if (val !== '') {
                    var _a = String(val).split(','), width = _a[0], height = _a[1];
                    customSize = rectangle_1.Rectangle.fromDimensions(Number(width), Number(height));
                }
                else {
                    customSize = rectangle_1.Rectangle.fromDimensions(0, 0);
                }
                resolve(customSize);
            });
        });
    };
    /**
     * param: (value: Rectangle)
     * ```
     * return: Promise<FlashSource>
     * ```
     *
     * Sets the custom resolution for the source
     * regardless of its layout on the mixer
     *
     * *Chainable.*
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    FlashSource.prototype.setCustomResolution = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:BrowserSize', value.toDimensionString(), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Check if right click events are sent to the source or not.
     *
     * #### Usage
     *
     * ```javascript
     * source.getAllowRightClick().then(function(isRightClickAllowed) {
     *   // The rest of your code here
     * });
     * ```
     */
    FlashSource.prototype.getAllowRightClick = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:BrowserRightClick', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value:boolean)
     * ```
     * return: Promise<Source>
     * ```
     *
     * Allow or disallow right click events to be sent to the source. Note that
     * you can only catch right click events using `mouseup/mousedown`
     *
     * *Chainable*
     *
     * #### Usage
     *
     * ```javascript
     * source.setAllowRightClick(true).then(function(source) {
     *   // Promise resolves with the same Source instance
     * });
     * ```
     */
    FlashSource.prototype.setAllowRightClick = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:BrowserRightClick', (value ? '1' : '0'), _this._id)
                .then(function () {
                resolve(_this);
            });
        });
    };
    return FlashSource;
})(source_1.Source);
exports.FlashSource = FlashSource;
mixin_1.applyMixins(FlashSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition,
    iaudio_1.ItemAudio, ieffects_1.ItemEffect]);
},{"../../internal/item":31,"../../internal/util/mixin":33,"../../util/rectangle":48,"./iaudio":13,"./ichroma":14,"./icolor":15,"./ieffects":17,"./ilayout":18,"./itransition":21,"./source":24}],11:[function(require,module,exports){
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
var ieffects_1 = require('./ieffects');
var itransition_1 = require('./itransition');
var source_1 = require('./source');
var json_1 = require('../../internal/util/json');
var xml_1 = require('../../internal/util/xml');
var source_2 = require('./source');
var environment_1 = require('../environment');
/**
 * The GameSource Class provides methods specifically used for game sources and
 * also methods that is shared between Source Classes. The
 * {@link #core/Scene Scene} class' getSources method would automatically return a
 * GameSource object if there's a game source on the specified scene.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.GameSource) {
 *         // Manipulate your game source here
 *         sources[i].setOfflineImage(path); // just an example here
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `GameSource`
 *  instance.
 */
var GameSource = (function (_super) {
    __extends(GameSource, _super);
    function GameSource() {
        _super.apply(this, arguments);
    }
    /**
     * return: Promise<boolean>
     *
     * Check if Game Special Optimization is currently enabled or not
     */
    GameSource.prototype.isSpecialOptimizationEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('GameCapSurfSharing', _this._id).then(function (res) {
                resolve(res === '1');
            });
        });
    };
    /**
     * param: Promise<boolean>
     *
     * Set Game Special Optimization to on or off
     *
     * *Chainable.*
     */
    GameSource.prototype.setSpecialOptimizationEnabled = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('GameCapSurfSharing', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Check if Show Mouse is currently enabled or not
     */
    GameSource.prototype.isShowMouseEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('GameCapShowMouse', _this._id).then(function (res) {
                resolve(res === '1');
            });
        });
    };
    /**
     * param: (value: boolean)
     *
     * Set Show Mouse in game to on or off
     *
     * *Chainable.*
     */
    GameSource.prototype.setShowMouseEnabled = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('GameCapShowMouse', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * param: path<string>
     *
     * Set the offline image of a game source
     *
     * *Chainable.*
     */
    GameSource.prototype.setOfflineImage = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._type !== source_2.SourceTypes.GAMESOURCE) {
                reject(Error('Current source should be a game source'));
            }
            else if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('Source plugins cannot update offline images of other sources'));
            }
            else if (!(_this._value instanceof xml_1.XML)) {
                _this.getValue().then(function () {
                    _this.setOfflineImage(path).then(function (itemObj) {
                        resolve(itemObj);
                    });
                });
            }
            else {
                var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?' +
                    '\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*))\.(png|gif|jpg|jpeg|tif)$');
                if (regExp.test(path) || path === '') {
                    var valueObj = json_1.JSON.parse(_this._value.toString());
                    valueObj['replace'] = path;
                    _this.setValue(xml_1.XML.parseJSON(valueObj)).then(function () {
                        resolve(_this);
                    });
                }
            }
        });
    };
    /**
     * return: Promise<string>
     *
     * Get the offline image of a game source
     */
    GameSource.prototype.getOfflineImage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._type !== source_2.SourceTypes.GAMESOURCE) {
                reject(Error('Current source should be a game source'));
            }
            else {
                _this.getValue().then(function () {
                    var valueObj = json_1.JSON.parse(_this._value.toString());
                    resolve(valueObj['replace'] ? valueObj['replace'] : '');
                });
            }
        });
    };
    return GameSource;
})(source_1.Source);
exports.GameSource = GameSource;
mixin_1.applyMixins(GameSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition,
    ieffects_1.ItemEffect]);
},{"../../internal/item":31,"../../internal/util/json":32,"../../internal/util/mixin":33,"../../internal/util/xml":34,"../environment":4,"./ichroma":14,"./icolor":15,"./ieffects":17,"./ilayout":18,"./itransition":21,"./source":24}],12:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var internal_1 = require('../../internal/internal');
var mixin_1 = require('../../internal/util/mixin');
var item_1 = require('../../internal/item');
var ilayout_1 = require('./ilayout');
var icolor_1 = require('./icolor');
var ichroma_1 = require('./ichroma');
var ieffects_1 = require('./ieffects');
var itransition_1 = require('./itransition');
var iconfig_1 = require('./iconfig');
var iaudio_1 = require('./iaudio');
var source_1 = require('./source');
var rectangle_1 = require('../../util/rectangle');
var environment_1 = require('../environment');
/**
 * The HtmlSource class represents a web page source. This covers both source
 * plugins and non-plugin URLs.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemConfigurable Core/IItemConfigurable},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.HtmlSource) {
 *         // Manipulate your HTML source here
 *         sources[i].enableBrowserTransparency(true);
 *       }
 *     }
 *   });
 * });
 * ```
 *
 *  All methods marked as *Chainable* resolve with the original `HtmlSource`
 * instance. Also, any audio setting, i.e. volume, mute, stream only
 * may not be properly reflected in the source unless native browser audio support
 * is enabled. (Tools menu > General Settings > Advanced tab)
 */
var HtmlSource = (function (_super) {
    __extends(HtmlSource, _super);
    function HtmlSource() {
        _super.apply(this, arguments);
    }
    /**
     * return: Promise<string>
     *
     * Gets the URL of this webpage source.
     */
    HtmlSource.prototype.getURL = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:item', _this._id).then(function (url) {
                var _url = String(url).split('*');
                url = _url[0];
                resolve(url);
            });
        });
    };
    /**
     * param: (url: string)
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Sets the URL of this webpage source.
     *
     * *Chainable.*
     */
    HtmlSource.prototype.setURL = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.set('prop:item', value, _this._id).then(function (code) {
                if (code) {
                    resolve(_this);
                }
                else {
                    reject('Invalid value');
                }
            });
        });
    };
    /**
     * return: Promise<string>
     *
     * Gets the javascript commands to be executed on source upon load
     */
    HtmlSource.prototype.getBrowserJS = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var customJS = '';
                try {
                    var customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('customJS')) {
                        customJS = customObject['customJS'];
                    }
                }
                catch (e) {
                }
                resolve(customJS);
            });
        });
    };
    /**
     * param: (js: string, refresh: boolean = false)
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Sets the javascript commands to be executed on source
     * right upon setting and on load. Optionally set second parameter
     * to true to refresh source (needed to clean previously executed JS code.)
     *
     * *Chainable.*
     */
    HtmlSource.prototype.setBrowserJS = function (value, refresh) {
        var _this = this;
        if (refresh === void 0) { refresh = false; }
        return new Promise(function (resolve, reject) {
            var customObject = {};
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var customJS = '';
                var customCSS = '';
                var scriptString = ' ';
                var scriptEnabled = true;
                var cssEnabled = true;
                try {
                    customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('cssEnabled')) {
                        cssEnabled = (customObject['cssEnabled'] == 'true');
                    }
                    if (customObject.hasOwnProperty('scriptEnabled')) {
                        scriptEnabled = (customObject['scriptEnabled'] == 'true');
                    }
                    if (customObject.hasOwnProperty('customCSS')) {
                        customCSS = customObject['customCSS'];
                    }
                }
                catch (e) {
                }
                customObject['cssEnabled'] = cssEnabled.toString();
                customObject['scriptEnabled'] = scriptEnabled.toString();
                customObject['customCSS'] = customCSS;
                customObject['customJS'] = value;
                if (cssEnabled === true) {
                    var cssScript = "var xjsCSSOverwrite = document.createElement('style');xjsCSSOverwrite.id = 'splitmedialabsCSSOverwrite';xjsCSSOverwrite.type = 'text/css';var h = document.querySelector('head');var existing = document.querySelector('head #splitmedialabsCSSOverwrite');if (existing != null)h.removeChild(existing);xjsCSSOverwrite.innerHTML = '" + customCSS.replace(/(\r\n|\n|\r)/gm, '').replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') + "';h.appendChild(xjsCSSOverwrite);";
                    scriptString = scriptString + cssScript;
                }
                if (value !== '' && scriptEnabled === true) {
                    scriptString = scriptString + value;
                }
                return item_1.Item.set('prop:BrowserJs', scriptString, _this._id);
            })
                .then(function () {
                return item_1.Item.set('prop:custom', JSON.stringify(customObject), _this._id);
            })
                .then(function () {
                if (refresh) {
                    item_1.Item.set('refresh', '', _this._id).then(function () {
                        resolve(_this);
                    });
                }
                else {
                    resolve(_this);
                }
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Gets if BrowserJS is enabled and executed on load
     */
    HtmlSource.prototype.isBrowserJSEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var enabled = true;
                try {
                    var customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('scriptEnabled')) {
                        enabled = (customObject['scriptEnabled'] == 'true');
                    }
                }
                catch (e) {
                }
                resolve(enabled);
            });
        });
    };
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Enables or disables execution of the set BrowserJs upon load.
     * Note that disabling this will require source to be refreshed
     * in order to remove any BrowserJS previously executed.
     *
     * *Chainable.*
     */
    HtmlSource.prototype.enableBrowserJS = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var customObject = {};
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var customJS = '';
                var customCSS = '';
                var scriptString = ' ';
                var scriptEnabled = true;
                var cssEnabled = true;
                try {
                    customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('cssEnabled')) {
                        cssEnabled = (customObject['cssEnabled'] == 'true');
                    }
                    if (customObject.hasOwnProperty('customJS')) {
                        customJS = customObject['customJS'];
                    }
                    if (customObject.hasOwnProperty('customCSS')) {
                        customCSS = customObject['customCSS'];
                    }
                }
                catch (e) {
                }
                customObject['cssEnabled'] = cssEnabled.toString();
                customObject['scriptEnabled'] = value.toString();
                customObject['customJS'] = customJS;
                customObject['customCSS'] = customCSS;
                if (cssEnabled === true) {
                    var cssScript = 'var xjsCSSOverwrite = document.createElement("style");' +
                        'xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";' +
                        'xjsCSSOverwrite.type = "text/css";' +
                        'var h = document.querySelector("head");' +
                        'var existing = document' +
                        '.querySelector("head #splitmedialabsCSSOverwrite");' +
                        'if (existing != null)h.removeChild(existing);' +
                        'xjsCSSOverwrite.innerHTML = "' +
                        customCSS.replace(/(\r\n|\n|\r)/gm, '')
                            .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') + '";"' +
                        'h.appendChild(xjsCSSOverwrite);';
                    scriptString = scriptString + cssScript;
                }
                if (customJS !== '' && value === true) {
                    scriptString = scriptString + customJS;
                }
                return item_1.Item.set('prop:BrowserJs', scriptString, _this._id);
            })
                .then(function () {
                return item_1.Item.set('prop:custom', JSON.stringify(customObject), _this._id);
            })
                .then(function () {
                if (!value) {
                    item_1.Item.set('refresh', '', _this._id).then(function () {
                        resolve(_this);
                    });
                }
                else {
                    resolve(_this);
                }
            });
        });
    };
    /**
     * return: Promise<string>
     *
     * Gets the custom CSS applied to the document upon loading
     */
    HtmlSource.prototype.getCustomCSS = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var customCSS = '';
                try {
                    var customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('customCSS')) {
                        customCSS = customObject['customCSS'];
                    }
                }
                catch (e) {
                }
                resolve(customCSS);
            });
        });
    };
    /**
     * param: (value: string)
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Sets the custom CSS to be applied to the document upon loading
     *
     * *Chainable.*
     */
    HtmlSource.prototype.setCustomCSS = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var customObject = {};
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var customJS = '';
                var customCSS = '';
                var scriptString = ' ';
                var scriptEnabled = true;
                var cssEnabled = true;
                try {
                    customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('cssEnabled')) {
                        cssEnabled = (customObject['cssEnabled'] == 'true');
                    }
                    if (customObject.hasOwnProperty('scriptEnabled')) {
                        scriptEnabled = (customObject['scriptEnabled'] == 'true');
                    }
                    if (customObject.hasOwnProperty('customJS')) {
                        customJS = customObject['customJS'];
                    }
                }
                catch (e) {
                }
                customObject['cssEnabled'] = cssEnabled.toString();
                customObject['scriptEnabled'] = scriptEnabled.toString();
                customObject['customJS'] = customJS;
                customObject['customCSS'] = value;
                if (cssEnabled === true) {
                    var cssScript = 'var xjsCSSOverwrite = document.createElement("style");' +
                        'xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";' +
                        'xjsCSSOverwrite.type = "text/css";' +
                        'var h = document.querySelector("head");' +
                        'var existing = document' +
                        '.querySelector("head #splitmedialabsCSSOverwrite");' +
                        'if (existing != null)h.removeChild(existing);' +
                        'xjsCSSOverwrite.innerHTML = "' +
                        value.replace(/(\r\n|\n|\r)/gm, '')
                            .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') +
                        '";h.appendChild(xjsCSSOverwrite);';
                    scriptString = scriptString + cssScript;
                }
                if (customJS !== '' && scriptEnabled === true) {
                    scriptString = scriptString + customJS;
                }
                return item_1.Item.set('prop:BrowserJs', scriptString, _this._id);
            })
                .then(function () {
                return item_1.Item.set('prop:custom', JSON.stringify(customObject), _this._id);
            })
                .then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Gets if custom CSS is enabled and applied to the document on load
     */
    HtmlSource.prototype.isCustomCSSEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var enabled = true;
                try {
                    var customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('cssEnabled')) {
                        enabled = (customObject['cssEnabled'] == 'true');
                    }
                }
                catch (e) {
                }
                resolve(enabled);
            });
        });
    };
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Enables or disables application of custom CSS to the document
     *
     * *Chainable.*
     */
    HtmlSource.prototype.enableCustomCSS = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var customObject = {};
            item_1.Item.get('prop:custom', _this._id).then(function (custom) {
                var customJS = '';
                var customCSS = '';
                var scriptString = ' ';
                var scriptEnabled = true;
                var cssEnabled = true;
                try {
                    customObject = JSON.parse(custom);
                    if (customObject.hasOwnProperty('scriptEnabled')) {
                        scriptEnabled = (customObject['scriptEnabled'] == 'true');
                    }
                    if (customObject.hasOwnProperty('customJS')) {
                        customJS = customObject['customJS'];
                    }
                    if (customObject.hasOwnProperty('customCSS')) {
                        customCSS = customObject['customCSS'];
                    }
                }
                catch (e) {
                }
                customObject['scriptEnabled'] = scriptEnabled.toString();
                customObject['cssEnabled'] = value.toString();
                customObject['customJS'] = customJS;
                customObject['customCSS'] = customCSS;
                if (value === true) {
                    var cssScript = 'var xjsCSSOverwrite = document.createElement("style");' +
                        'xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";' +
                        'xjsCSSOverwrite.type = "text/css";' +
                        'var h = document.querySelector("head");' +
                        'var existing = document' +
                        '.querySelector("head #splitmedialabsCSSOverwrite");' +
                        'if (existing != null)h.removeChild(existing);' +
                        'xjsCSSOverwrite.innerHTML = "' +
                        customCSS.replace(/(\r\n|\n|\r)/gm, '')
                            .replace(/\s{2,}/g, ' ').replace(/(\[br\])/gm, '') +
                        '";h.appendChild(xjsCSSOverwrite);';
                    scriptString = scriptString + cssScript;
                }
                if (customJS !== '' && value === scriptEnabled) {
                    scriptString = scriptString + customJS;
                }
                return item_1.Item.set('prop:BrowserJs', scriptString, _this._id);
            })
                .then(function () {
                return item_1.Item.set('prop:custom', JSON.stringify(customObject), _this._id);
            })
                .then(function () {
                if (!value) {
                    var cssScript = "var h = document.querySelector('head');var existing3 = document.querySelector('head #splitmedialabsCSSOverwrite');if (existing3 != null)h.removeChild(existing3);";
                    if (environment_1.Environment.isSourcePlugin()) {
                        eval(cssScript);
                    }
                    else {
                        internal_1.exec('CallInner', 'eval', cssScript);
                    }
                    resolve(_this);
                }
                else {
                    resolve(_this);
                }
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Check if browser is rendered transparent
     */
    HtmlSource.prototype.isBrowserTransparent = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:BrowserTransparent', _this._id).then(function (isTransparent) {
                resolve(isTransparent === '1');
            });
        });
    };
    /**
     * param: Promise<boolean>
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Enable or disabled transparency of CEF browser
     *
     * *Chainable.*
     */
    HtmlSource.prototype.enableBrowserTransparency = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:BrowserTransparent', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<Rectangle>
     *
     * Gets the custom browser window size (in pixels) for the source, if set,
     * regardless of its layout on the mixer. Returns a (0, 0) Rectangle if no
     * custom size has been set.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    HtmlSource.prototype.getBrowserCustomSize = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var customSize;
            item_1.Item.get('prop:BrowserSize', _this._id).then(function (val) {
                if (val !== '') {
                    var _a = String(val).split(','), width = _a[0], height = _a[1];
                    customSize = rectangle_1.Rectangle.fromDimensions(Number(width) / window.devicePixelRatio, Number(height) / window.devicePixelRatio);
                }
                else {
                    customSize = rectangle_1.Rectangle.fromDimensions(0, 0);
                }
                resolve(customSize);
            });
        });
    };
    /**
     * param: Promise<Rectangle>
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Sets the custom browser window size for the source
     * regardless of its layout on the mixer
     *
     * *Chainable.*
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    HtmlSource.prototype.setBrowserCustomSize = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            // Set the correct width and height based on the DPI settings
            value.setWidth(value.getWidth() * window.devicePixelRatio);
            value.setHeight(value.getHeight() * window.devicePixelRatio);
            item_1.Item.set('prop:BrowserSize', value.toDimensionString(), _this._id)
                .then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Check if right click events are sent to the source or not.
     *
     * #### Usage
     *
     * ```javascript
     * source.getAllowRightClick().then(function(isRightClickAllowed) {
     *   // The rest of your code here
     * });
     * ```
     */
    HtmlSource.prototype.getAllowRightClick = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:BrowserRightClick', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value:boolean)
     * ```
     * return: Promise<Source>
     * ```
     *
     * Allow or disallow right click events to be sent to the source. Note that
     * you can only catch right click events using `mouseup/mousedown`
     *
     * *Chainable*
     *
     * #### Usage
     *
     * ```javascript
     * source.setAllowRightClick(true).then(function(source) {
     *   // Promise resolves with the same Source instance
     * });
     * ```
     */
    HtmlSource.prototype.setAllowRightClick = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:BrowserRightClick', (value ? '1' : '0'), _this._id)
                .then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * param: (func: string, arg: string)
     * ```
     * return: Promise<HtmlSource>
     * ```
     *
     * Allow this source to communicate with another source.
     */
    HtmlSource.prototype.call = function (func, arg) {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            internal_1.exec('CallInner' +
                (String(slot) === '0' ? '' : slot + 1), func, arg);
            resolve(_this);
        });
    };
    return HtmlSource;
})(source_1.Source);
exports.HtmlSource = HtmlSource;
mixin_1.applyMixins(HtmlSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition,
    iconfig_1.ItemConfigurable, iaudio_1.ItemAudio, ieffects_1.ItemEffect]);
},{"../../internal/internal":30,"../../internal/item":31,"../../internal/util/mixin":33,"../../util/rectangle":48,"../environment":4,"./iaudio":13,"./ichroma":14,"./icolor":15,"./iconfig":16,"./ieffects":17,"./ilayout":18,"./itransition":21,"./source":24}],13:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var ItemAudio = (function () {
    function ItemAudio() {
    }
    ItemAudio.prototype.getVolume = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:volume', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemAudio.prototype.setVolume = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            value = value < 0 ? 0 : value > 100 ? 100 : value;
            item_1.Item.set('prop:volume', String(value), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemAudio.prototype.isMute = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:mute', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemAudio.prototype.setMute = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:mute', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemAudio.prototype.isStreamOnlyAudio = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:sounddev', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemAudio.prototype.setStreamOnlyAudio = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:sounddev', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemAudio.prototype.isAudioAvailable = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:audioavail', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    return ItemAudio;
})();
exports.ItemAudio = ItemAudio;
},{"../../internal/item":31}],14:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var color_1 = require('../../util/color');
/**
 *  Used by sources that implement the Chroma interface.
 *  Check `getKeyingType()`/`setKeyingType()` method of
 *  {@link #core/CameraSource#getKeyingType Core/CameraSource},
 *  {@link #core/GameSource#getKeyingType Core/GameSource}, and
 *  {@link #core/HtmlSource#getKeyingType Core/HtmlSource}.
 */
(function (KeyingType) {
    KeyingType[KeyingType["LEGACY"] = 0] = "LEGACY";
    KeyingType[KeyingType["COLORKEY"] = 1] = "COLORKEY";
    KeyingType[KeyingType["RGBKEY"] = 2] = "RGBKEY"; // Chroma Key RGB Mode
})(exports.KeyingType || (exports.KeyingType = {}));
var KeyingType = exports.KeyingType;
/**
 *  Used by sources that implement the Chroma interface, when using RGB mode
 *  Chroma Key.
 *
 *  Check `getChromaRGBKeyPrimaryColor()`/`setChromaRGBKeyPrimaryColor()` method
 *  of {@link #core/CameraSource#getChromaRGBKeyPrimaryColor Core/CameraSource},
 *  {@link #core/GameSource#getChromaRGBKeyPrimaryColor Core/GameSource}, and
 *  {@link #core/HtmlSource#getChromaRGBKeyPrimaryColor Core/HtmlSource}.
 */
(function (ChromaPrimaryColors) {
    ChromaPrimaryColors[ChromaPrimaryColors["RED"] = 0] = "RED";
    ChromaPrimaryColors[ChromaPrimaryColors["GREEN"] = 1] = "GREEN";
    ChromaPrimaryColors[ChromaPrimaryColors["BLUE"] = 2] = "BLUE";
})(exports.ChromaPrimaryColors || (exports.ChromaPrimaryColors = {}));
var ChromaPrimaryColors = exports.ChromaPrimaryColors;
/**
 *  Used by sources that implement the Chroma interface.
 *
 *  Check `getChromaAntiAliasLevel()`/`setChromaAntiAliasLevel()` method
 *  of {@link #core/CameraSource#getChromaAntiAliasLevel Core/CameraSource},
 *  {@link #core/GameSource#getChromaAntiAliasLevel Core/GameSource}, and
 *  {@link #core/HtmlSource#getChromaAntiAliasLevel Core/HtmlSource}.
 */
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
            item_1.Item.get('prop:key_chromakey', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemChroma.prototype.setChromaEnabled = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'boolean') {
                reject(TypeError('Parameter should be boolean.'));
            }
            else {
                item_1.Item.set('prop:key_chromakey', (value ? '1' : '0'), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getKeyingType = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromakeytype', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setKeyingType = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a KeyingType value as the parameter.'));
            }
            else if (value < 0 || value > 2) {
                reject(RangeError('Use a KeyingType value as the parameter.'));
            }
            else {
                item_1.Item.set('prop:key_chromakeytype', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaAntiAliasLevel = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_antialiasing', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaAntiAliasLevel = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a ChromaAntiAliasLevel value as the parameter.'));
            }
            else if (value < 0 || value > 2) {
                reject(RangeError('Use a ChromaAntiAliasLevel value as the parameter.'));
            }
            else {
                item_1.Item.set('prop:key_antialiasing', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    // CHROMA LEGACY MODE FUNCTIONS
    ItemChroma.prototype.getChromaLegacyBrightness = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromabr', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyBrightness = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_chromabr', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaLegacySaturation = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromasat', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacySaturation = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_chromasat', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaLegacyHue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromahue', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyHue = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 180) {
                reject(RangeError('Valid value is an integer from 0-180.'));
            }
            else {
                item_1.Item.set('prop:key_chromahue', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaLegacyThreshold = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromarang', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyThreshold = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_chromarang', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaLegacyAlphaSmoothing = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromaranga', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaLegacyAlphaSmoothing = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_chromaranga', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    // CHROMA RGB KEY FUNCTIONS
    ItemChroma.prototype.getChromaRGBKeyPrimaryColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromargbkeyprimary', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaRGBKeyPrimaryColor = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a ChromaPrimaryColors value as the parameter.'));
            }
            else if (value < 0 || value > 2) {
                reject(RangeError('Use a ChromaPrimaryColors value as the parameter.'));
            }
            else {
                item_1.Item.set('prop:key_chromargbkeyprimary', String(value), _this._id)
                    .then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaRGBKeyThreshold = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromargbkeythresh', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaRGBKeyThreshold = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_chromargbkeythresh', String(value), _this._id)
                    .then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaRGBKeyExposure = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_chromargbkeybalance', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaRGBKeyExposure = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_chromargbkeybalance', String(value), _this._id)
                    .then(function () {
                    resolve(_this);
                });
            }
        });
    };
    // CHROMA COLOR KEY FUNCTIONS
    ItemChroma.prototype.getChromaColorKeyThreshold = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_colorrang', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaColorKeyThreshold = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_colorrang', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaColorKeyExposure = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_colorranga', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemChroma.prototype.setChromaColorKeyExposure = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use an integer as the parameter.'));
            }
            else if (value < 0 || value > 255) {
                reject(RangeError('Valid value is an integer from 0-255.'));
            }
            else {
                item_1.Item.set('prop:key_colorranga', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemChroma.prototype.getChromaColorKeyColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:key_colorrgb', _this._id).then(function (val) {
                var color = color_1.Color.fromBGRString(val);
                resolve(color);
            });
        });
    };
    ItemChroma.prototype.setChromaColorKeyColor = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:key_colorrgb', String(value.getIbgr()), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    return ItemChroma;
})();
exports.ItemChroma = ItemChroma;
},{"../../internal/item":31,"../../util/color":44}],15:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var color_1 = require('../../util/color');
var ItemColor = (function () {
    function ItemColor() {
    }
    ItemColor.prototype.getTransparency = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:alpha', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setTransparency = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < 0 || value > 255) {
                reject(RangeError('Transparency may only be in the range 0 to 255.'));
            }
            else {
                item_1.Item.set('prop:alpha', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemColor.prototype.getBrightness = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:cc_brightness', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setBrightness = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -100 || value > 100) {
                reject(RangeError('Brightness may only be in the range -100 to 100.'));
            }
            else {
                item_1.Item.set('prop:cc_brightness', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemColor.prototype.getContrast = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:cc_contrast', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setContrast = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -100 || value > 100) {
                reject(RangeError('Contrast may only be in the range -100 to 100.'));
            }
            else {
                item_1.Item.set('prop:cc_contrast', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemColor.prototype.getHue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:cc_hue', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setHue = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -180 || value > 180) {
                reject(RangeError('Contrast may only be in the range -180 to 180.'));
            }
            else {
                item_1.Item.set('prop:cc_hue', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemColor.prototype.getSaturation = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:cc_saturation', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemColor.prototype.setSaturation = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -100 || value > 100) {
                reject(RangeError('Saturation may only be in the range -100 to 100'));
            }
            else {
                item_1.Item.set('prop:cc_saturation', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemColor.prototype.getBorderColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:border', _this._id).then(function (val) {
                var bgr = Number(val) - 0x80000000;
                var color = color_1.Color.fromBGRInt(bgr);
                resolve(color);
            });
        });
    };
    ItemColor.prototype.setBorderColor = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.set('prop:border', String(value.getIbgr() - 0x80000000), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemColor.prototype.isFullDynamicColorRange = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:cc_dynamicrange', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemColor.prototype.setFullDynamicColorRange = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'boolean') {
                reject(TypeError('Parameter should be boolean.'));
            }
            else {
                item_1.Item.set('prop:cc_dynamicrange', (value ? '1' : '0'), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    return ItemColor;
})();
exports.ItemColor = ItemColor;
},{"../../internal/item":31,"../../util/color":44}],16:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var global_1 = require('../../internal/global');
var internal_1 = require('../../internal/internal');
var environment_1 = require('../environment');
var ItemConfigurable = (function () {
    function ItemConfigurable() {
    }
    ItemConfigurable.prototype.loadConfig = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:BrowserConfiguration', _this._id).then(function (config) {
                var configObj = config === 'null' ? {} : JSON.parse(config);
                var persist = global_1.Global.getPersistentConfig();
                for (var key in persist) {
                    delete configObj[key];
                }
                resolve(configObj);
            });
        });
    };
    ItemConfigurable.prototype.saveConfig = function (configObj) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin) {
                var slot = item_1.Item.attach(_this._id);
                // only allow direct saving for self
                if (slot === 0) {
                    // check for valid object
                    if ({}.toString.call(configObj) === '[object Object]') {
                        // add persisted configuration if available
                        // currently only top level merging is available
                        var persist = global_1.Global.getPersistentConfig();
                        for (var key in persist) {
                            configObj[key] = persist[key];
                        }
                        internal_1.exec('SetBrowserProperty', 'Configuration', JSON.stringify(configObj));
                        resolve(_this);
                    }
                    else {
                        reject(Error('Configuration object should be ' +
                            'in JSON format.'));
                    }
                }
                else {
                    reject(Error('Sources may only request other ' +
                        'sources to save a configuration. Consider ' +
                        'calling requestSaveConfig() on this Item ' +
                        'instance instead.'));
                }
            }
            else {
                reject(Error('Extensions and source properties windows are ' +
                    'not allowed to directly save configuration objects. ' +
                    'Call requestSaveConfig() instead.'));
            }
        });
    };
    ItemConfigurable.prototype.requestSaveConfig = function (configObj) {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            internal_1.exec('CallInner' + (slot === 0 ? '' : (slot + 1)), 'MessageSource', JSON.stringify({
                'request': 'saveConfig',
                'data': configObj
            }));
            resolve(_this);
        });
    };
    ItemConfigurable.prototype.applyConfig = function (configObj) {
        var _this = this;
        return new Promise(function (resolve) {
            var slot = item_1.Item.attach(_this._id);
            internal_1.exec('CallInner' + (slot === 0 ? '' : (slot + 1)), 'MessageSource', JSON.stringify({
                'request': 'applyConfig',
                'data': configObj
            }));
            resolve(_this);
        });
    };
    return ItemConfigurable;
})();
exports.ItemConfigurable = ItemConfigurable;
},{"../../internal/global":28,"../../internal/internal":30,"../../internal/item":31,"../environment":4}],17:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var color_1 = require('../../util/color');
/**
 *  Used by sources that implement the Effect interface.
 *  Check `getMaskEffect()`/`setMaskEffect()` method of
 *  {@link #core/CameraSource#getMaskEffect Core/CameraSource},
 *  {@link #core/FlashSource#getMaskEffect Core/FlashSource},
 *  {@link #core/GameSource#getMaskEffect Core/GameSource},
 *  {@link #core/HtmlSource#getMaskEffect Core/HtmlSource},
 *  {@link #core/ImageSource#getMaskEffect Core/ImageSource},
 *  {@link #core/MediaSource#getMaskEffect Core/MediaSource}, and
 *  {@link #core/ScreenSource#getMaskEffect Core/ScreenSource}.
 */
(function (MaskEffect) {
    MaskEffect[MaskEffect["NONE"] = 0] = "NONE";
    MaskEffect[MaskEffect["SHAPE"] = 1] = "SHAPE";
    MaskEffect[MaskEffect["FILE_BIND_TO_SOURCE"] = 2] = "FILE_BIND_TO_SOURCE";
    MaskEffect[MaskEffect["FILE_BIND_TO_STAGE"] = 3] = "FILE_BIND_TO_STAGE";
})(exports.MaskEffect || (exports.MaskEffect = {}));
var MaskEffect = exports.MaskEffect;
var _DEFAULT_EFFECT_VALUES = {
    'MASK_EFFECT': MaskEffect.NONE,
    'BORDER_RADIUS': 0,
    'BORDER_THICKNESS': 0,
    'BORDER_OPACITY': 100,
    'BORDER_COLOR': color_1.Color.fromRGBString('#FFFFFF'),
    'SHADOW_COLOR': color_1.Color.fromRGBString('#FFFFFF'),
    'SHADOW_THICKNESS': 0,
    'SHADOW_BLUR': 0,
    'SHADOW_OPACITY': 100,
    'SHADOW_OFFSET_X': 0,
    'SHADOW_OFFSET_Y': 0,
    'FILE_MASK': '',
    'FILE_MASK_GUIDE': false
};
var _DEFAULT_EDGE_EFFECT_CONFIG = '0,1.00,1.00,1.00,1|1,0,0,0,1|2,0,0,0,0|3,1.00,1.00,1.00,1';
var ItemEffect = (function () {
    function ItemEffect() {
    }
    ItemEffect.prototype._convertToHex = function (value) {
        var hex = (parseInt(String(Number(value) * 255))).toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        return hex;
    };
    ItemEffect.prototype._getEdgeEffectValue = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.get('prop:edgeeffectcfg', _this._id).then(function (val) {
                if (val !== '' && val !== null) {
                    var edgeConfig = val.split("|");
                    var arrayIndex = value['arrayIndex'];
                    var individualIndex = value['indIndex'];
                    if (typeof edgeConfig[arrayIndex] !== 'undefined') {
                        var cfgArray = edgeConfig[arrayIndex].split(',');
                        if (Array.isArray(individualIndex)) {
                            var newArray = [];
                            for (var i = 0; i < individualIndex.length; ++i) {
                                var config = individualIndex[i];
                                newArray.push(cfgArray[config]);
                            }
                            resolve(newArray);
                        }
                        else {
                            resolve(cfgArray[individualIndex]);
                        }
                    }
                    else {
                        reject(RangeError('Invalid parameter. Array index given not included.'));
                    }
                }
                else {
                    reject(ReferenceError('Edge effect configuration not set.'));
                }
            });
        });
    };
    ItemEffect.prototype._setEdgeEffectValue = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.get('prop:edgeeffectcfg', _this._id).then(function (val) {
                var edgeConfig = [];
                var edgeEffectString;
                if (val !== '' && val !== null) {
                    edgeEffectString = val;
                }
                else {
                    edgeEffectString = _DEFAULT_EDGE_EFFECT_CONFIG;
                }
                var edgeArray = edgeEffectString.split("|");
                var edgeArrayLength = edgeArray.length;
                for (var i = 0; i < edgeArrayLength; ++i) {
                    edgeConfig.push(edgeArray[i].split(','));
                }
                var arrayIndex = value['arrayIndex'];
                var individualIndex = value['indIndex'];
                var setValue = value['value'];
                if (typeof edgeConfig[arrayIndex] !== 'undefined') {
                    var oldArray = edgeConfig[arrayIndex];
                    if (Array.isArray(individualIndex)) {
                        for (var j = 0; j < individualIndex.length; ++j) {
                            var tempIndex = individualIndex[j];
                            oldArray[tempIndex] = setValue[j];
                        }
                    }
                    else {
                        oldArray[individualIndex] = setValue;
                    }
                    edgeConfig[arrayIndex] = oldArray;
                    var edgeEffectStringValue = '';
                    for (var k = 0; k < edgeConfig.length; ++k) {
                        edgeEffectStringValue = edgeEffectStringValue + edgeConfig[k].toString();
                        if (k !== edgeConfig.length - 1) {
                            edgeEffectStringValue = edgeEffectStringValue + '|';
                        }
                    }
                    item_1.Item.set('prop:edgeeffectcfg', edgeEffectStringValue, _this._id)
                        .then(function () {
                        resolve(_this);
                    });
                }
                else {
                    reject(RangeError('Invalid parameter. Array index given not included.'));
                }
            });
        });
    };
    ItemEffect.prototype._getRGBArray = function (value) {
        var hex = value.getRgb();
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4), 16) / 255;
        return [r, g, b];
    };
    ItemEffect.prototype.getMaskEffect = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:edgeeffectid', _this._id).then(function (val) {
                if (val === 'border') {
                    resolve(MaskEffect.SHAPE);
                }
                else {
                    item_1.Item.get('prop:edgeeffectmaskmode', _this._id).then(function (val) {
                        if (val === '1' || val === '3') {
                            resolve(MaskEffect.FILE_BIND_TO_SOURCE);
                        }
                        else if (val === '2' || val === '4') {
                            resolve(MaskEffect.FILE_BIND_TO_STAGE);
                        }
                        else {
                            resolve(_DEFAULT_EFFECT_VALUES['MASK_EFFECT']);
                        }
                    });
                }
            });
        });
    };
    ItemEffect.prototype.setMaskEffect = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a MaskEffect value as the parameter.'));
            }
            else if (value < 0 || value > 3) {
                reject(RangeError('Use a MaskEffect value as the parameter.'));
            }
            else {
                if (value === 1) {
                    item_1.Item.set('prop:edgeeffectmaskmode', '0', _this._id).then(function () {
                        return item_1.Item.set('prop:edgeeffectid', 'border', _this._id);
                    }).then(function () {
                        resolve(_this);
                    });
                }
                else {
                    item_1.Item.set('prop:edgeeffectid', '', _this._id).then(function () {
                        if (value === 2 || value === 3) {
                            value = value - 1;
                        }
                        else {
                            value = 0;
                        }
                        return item_1.Item.set('prop:edgeeffectmaskmode', String(value), _this._id);
                    }).then(function () {
                        resolve(_this);
                    });
                }
            }
        });
    };
    ItemEffect.prototype.getBorderEffectRadius = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 1;
            parameterObject['indIndex'] = 1;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['BORDER_RADIUS']);
            });
        });
    };
    ItemEffect.prototype.setBorderEffectRadius = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < 0 || value > 100) {
                reject(RangeError('Valid value is a number from 0 - 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 1;
                parameterObject['indIndex'] = 1;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getBorderEffectThickness = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 1;
            parameterObject['indIndex'] = 2;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['BORDER_THICKNESS']);
            });
        });
    };
    ItemEffect.prototype.setBorderEffectThickness = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < 0 || value > 100) {
                reject(RangeError('Valid value is a number from 0 - 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 1;
                parameterObject['indIndex'] = 2;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getBorderEffectOpacity = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 0;
            parameterObject['indIndex'] = 4;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['BORDER_OPACITY']);
            });
        });
    };
    ItemEffect.prototype.setBorderEffectOpacity = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < 0 || value > 100) {
                reject(RangeError('Valid value is a number from 0 - 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 0;
                parameterObject['indIndex'] = 4;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getBorderEffectColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 0;
            parameterObject['indIndex'] = [1, 2, 3];
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(color_1.Color.fromRGBString('#' + _this._convertToHex(val[0]) + _this._convertToHex(val[1]) + _this._convertToHex(val[2])));
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['BORDER_COLOR']);
            });
        });
    };
    ItemEffect.prototype.setBorderEffectColor = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 0;
            parameterObject['indIndex'] = [1, 2, 3];
            parameterObject['value'] = _this._getRGBArray(value);
            _this._setEdgeEffectValue(parameterObject).then(function () {
                resolve(_this);
            });
        });
    };
    ItemEffect.prototype.getShadowEffectColor = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 3;
            parameterObject['indIndex'] = [1, 2, 3];
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(color_1.Color.fromRGBString('#' + _this._convertToHex(val[0]) + _this._convertToHex(val[1]) + _this._convertToHex(val[2])));
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['SHADOW_COLOR']);
            });
        });
    };
    ItemEffect.prototype.setShadowEffectColor = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 3;
            parameterObject['indIndex'] = [1, 2, 3];
            parameterObject['value'] = _this._getRGBArray(value);
            _this._setEdgeEffectValue(parameterObject).then(function () {
                resolve(_this);
            });
        });
    };
    ItemEffect.prototype.getShadowEffectThickness = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 1;
            parameterObject['indIndex'] = 3;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['SHADOW_THICKNESS']);
            });
        });
    };
    ItemEffect.prototype.setShadowEffectThickness = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < 0 || value > 100) {
                reject(RangeError('Valid value is a number from 0 - 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 1;
                parameterObject['indIndex'] = 3;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getShadowEffectBlur = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 2;
            parameterObject['indIndex'] = 3;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['SHADOW_BLUR']);
            });
        });
    };
    ItemEffect.prototype.setShadowEffectBlur = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < 0 || value > 100) {
                reject(RangeError('Valid value is a number from 0 - 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 2;
                parameterObject['indIndex'] = 3;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getShadowEffectOpacity = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 3;
            parameterObject['indIndex'] = 4;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['SHADOW_OPACITY']);
            });
        });
    };
    ItemEffect.prototype.setShadowEffectOpacity = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < 0 || value > 100) {
                reject(RangeError('Valid value is a number from 0 - 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 3;
                parameterObject['indIndex'] = 4;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getShadowEffectOffsetX = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 2;
            parameterObject['indIndex'] = 1;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['SHADOW_OFFSET_X']);
            });
        });
    };
    ItemEffect.prototype.setShadowEffectOffsetX = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < -100 || value > 100) {
                reject(RangeError('Valid value is a number from -100 to 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 2;
                parameterObject['indIndex'] = 1;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getShadowEffectOffsetY = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var parameterObject = {};
            parameterObject['arrayIndex'] = 2;
            parameterObject['indIndex'] = 2;
            _this._getEdgeEffectValue(parameterObject).then(function (val) {
                resolve(Number(val) * 100);
            }).catch(function (err) {
                resolve(_DEFAULT_EFFECT_VALUES['SHADOW_OFFSET_Y']);
            });
        });
    };
    ItemEffect.prototype.setShadowEffectOffsetY = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof value !== 'number') {
                reject(TypeError('Use a number as the parameter.'));
            }
            else if (value < -100 || value > 100) {
                reject(RangeError('Valid value is a number from -100 to 100.'));
            }
            else {
                var parameterObject = {};
                parameterObject['arrayIndex'] = 2;
                parameterObject['indIndex'] = 2;
                parameterObject['value'] = value / 100;
                _this._setEdgeEffectValue(parameterObject).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemEffect.prototype.getFileMask = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:edgeeffectmask', _this._id).then(function (val) {
                resolve(val);
            });
        });
    };
    ItemEffect.prototype.setFileMask = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:edgeeffectmask', value, _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemEffect.prototype.isFileMaskingGuideVisible = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.get('prop:edgeeffectmaskmode', _this._id).then(function (val) {
                if (val === '4' || val === '3') {
                    resolve(true);
                }
                else if (val === '2' || val === '1') {
                    resolve(false);
                }
                else {
                    reject(new Error('This method is not available if filemasking is not enabled.'));
                }
            });
        });
    };
    ItemEffect.prototype.showFileMaskingGuide = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.get('prop:edgeeffectmaskmode', _this._id).then(function (val) {
                if (val === '1' || val === '3') {
                    item_1.Item.set('prop:edgeeffectmaskmode', value ? '3' : '1', _this._id);
                }
                else if (val === '2' || val === '4') {
                    item_1.Item.set('prop:edgeeffectmaskmode', value ? '4' : '2', _this._id);
                }
                else {
                    reject(new Error('This method is not available if filemasking is not enabled.'));
                }
            });
        });
    };
    return ItemEffect;
})();
exports.ItemEffect = ItemEffect;
},{"../../internal/item":31,"../../util/color":44}],18:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var rectangle_1 = require('../../util/rectangle');
var ItemLayout = (function () {
    function ItemLayout() {
    }
    ItemLayout.prototype._getCanvasAndZRotate = function (value) {
        var rotationObject = {};
        if (value >= -180 && value <= -135) {
            rotationObject['canvasRotate'] = 180;
            rotationObject['zRotate'] = value + 180;
            rotationObject['orientation'] = 'landscape';
        }
        else if (value > -135 && value < -45) {
            rotationObject['canvasRotate'] = 270;
            rotationObject['zRotate'] = value + 90;
            rotationObject['orientation'] = 'portrait';
        }
        else if (value >= -45 && value <= 45) {
            rotationObject['canvasRotate'] = 0;
            rotationObject['zRotate'] = value;
            rotationObject['orientation'] = 'landscape';
        }
        else if (value > 45 && value < 135) {
            rotationObject['canvasRotate'] = 90;
            rotationObject['zRotate'] = value - 90;
            rotationObject['orientation'] = 'portrait';
        }
        else if (value >= 135 && value <= 180) {
            rotationObject['canvasRotate'] = 180;
            rotationObject['zRotate'] = value - 180;
            rotationObject['orientation'] = 'landscape';
        }
        return rotationObject;
    };
    ItemLayout.prototype._adjustRotation = function (value) {
        if (value > 180) {
            value -= 360;
        }
        else if (value < -180) {
            value += 360;
        }
        return value;
    };
    ItemLayout.prototype.isKeepAspectRatio = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:keep_ar', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemLayout.prototype.setKeepAspectRatio = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:keep_ar', value ? '1' : '0', _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemLayout.prototype.isPositionLocked = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:lockmove', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemLayout.prototype.setPositionLocked = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:lockmove', value ? '1' : '0', _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemLayout.prototype.isEnhancedResizeEnabled = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:mipmaps', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemLayout.prototype.setEnhancedResizeEnabled = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:mipmaps', value ? '1' : '0', _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemLayout.prototype.getPosition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:pos', _this._id).then(function (val) {
                var _a = String(val).split(','), left = _a[0], top = _a[1], right = _a[2], bottom = _a[3];
                _this.position = rectangle_1.Rectangle.fromCoordinates(Number(left), Number(top), Number(right), Number(bottom));
                resolve(_this.position);
            });
        });
    };
    ItemLayout.prototype.setPosition = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                item_1.Item.set('prop:pos', value.toCoordinateString(), _this._id).then(function () {
                    resolve(_this);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    ItemLayout.prototype.getRotateY = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:rotate_y', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemLayout.prototype.setRotateY = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -360 || value > 360) {
                reject(Error('Invalid value. Min: -360, Max: 360'));
            }
            else {
                item_1.Item.set('prop:rotate_y', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemLayout.prototype.getRotateX = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:rotate_x', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemLayout.prototype.setRotateX = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -360 || value > 360) {
                reject(Error('Invalid value. Min: -360, Max: 360'));
            }
            else {
                item_1.Item.set('prop:rotate_x', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemLayout.prototype.getRotateZ = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:rotate_z', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemLayout.prototype.setRotateZ = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -360 || value > 360) {
                reject(Error('Invalid value. Min: -360, Max: 360'));
            }
            else {
                item_1.Item.set('prop:rotate_z', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemLayout.prototype.getCropping = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var cropObject = {};
            item_1.Item.get('prop:crop', _this._id).then(function (val) {
                var _a = String(val).split(','), left = _a[0], top = _a[1], right = _a[2], bottom = _a[3];
                cropObject['left'] = Number(left);
                cropObject['top'] = Number(top);
                cropObject['right'] = Number(right);
                cropObject['bottom'] = Number(bottom);
                resolve(cropObject);
            });
        });
    };
    ItemLayout.prototype.setCropping = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value.hasOwnProperty('top') && value.hasOwnProperty('left') &&
                value.hasOwnProperty('right') && value.hasOwnProperty('bottom')) {
                item_1.Item.set('prop:crop', value['left'].toFixed(6) + ',' +
                    value['top'].toFixed(6) + ',' + value['right'].toFixed(6) + ',' +
                    value['bottom'].toFixed(6), _this._id).then(function () {
                    resolve(_this);
                });
            }
            else {
                reject('Error setting cropping,' +
                    ' insufficient properties (left, top, right, bottom)');
            }
        });
    };
    ItemLayout.prototype.getCanvasRotate = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:rotate_canvas', _this._id).then(function (val) {
                var value = Number(val);
                if ([0, 90, 180, 270].indexOf(value) < 0) {
                    resolve(0);
                }
                else {
                    resolve(value);
                }
            });
        });
    };
    ItemLayout.prototype.setCanvasRotate = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if ([0, 90, 180, 270].indexOf(value) < 0) {
                reject(Error('Invalid value. Only possible values are 0, 90, 180 and 270'));
            }
            else {
                item_1.Item.set('prop:rotate_canvas', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    ItemLayout.prototype.getEnhancedRotate = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var rotateZ;
            var rotateCanvas;
            var rotateValue;
            item_1.Item.get('prop:rotate_z', _this._id).then(function (val) {
                rotateZ = Number(val);
                return item_1.Item.get('prop:rotate_canvas', _this._id);
            }).then(function (val) {
                rotateCanvas = Number(val);
                rotateValue = _this._adjustRotation(rotateCanvas + rotateZ);
                resolve(rotateValue);
            });
        });
    };
    ItemLayout.prototype.setEnhancedRotate = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < -180 || value > 180) {
                reject(Error('Invalid value. Min: -180, Max: 180'));
            }
            else {
                var formerObject;
                var valueObject = _this._getCanvasAndZRotate(Number(value));
                _this.getEnhancedRotate().then(function (val) {
                    formerObject = _this._getCanvasAndZRotate(Number(val));
                    return item_1.Item.set('prop:rotate_z', String(valueObject['zRotate']), _this._id);
                }).then(function () {
                    return item_1.Item.set('prop:rotate_canvas', String(valueObject['canvasRotate']), _this._id);
                }).then(function () {
                    if (formerObject['orientation'] !== valueObject['orientation']) {
                        // interChangeHeightAndWidth();
                        var outputResolution;
                        var widthMax;
                        var heightMax;
                        item_1.Item.get('mixerresolution', _this._id).then(function (val) {
                            outputResolution = val.split(',');
                            widthMax = Number(outputResolution[0]);
                            heightMax = Number(outputResolution[1]);
                            return item_1.Item.get('prop:pos', _this._id);
                        }).then(function (val) {
                            var position = val.split(',');
                            var leftPosition = parseFloat(position[0]) * widthMax;
                            var topPosition = parseFloat(position[1]) * heightMax;
                            var rightPosition = parseFloat(position[2]) * widthMax;
                            var bottomPosition = parseFloat(position[3]) * heightMax;
                            var newLeft;
                            var newRight;
                            var newTop;
                            var newBottom;
                            var widthValue = Math.round(rightPosition - leftPosition);
                            var heightValue = Math.round(bottomPosition - topPosition);
                            if (heightValue > widthMax) {
                                newLeft = 0;
                                newRight = widthMax;
                            }
                            else {
                                var xCenter = leftPosition +
                                    ((rightPosition - leftPosition) / 2);
                                newLeft = xCenter - (heightValue / 2);
                                newRight = xCenter + (heightValue / 2);
                            }
                            if (widthValue > heightMax) {
                                newTop = 0;
                                newBottom = heightMax;
                            }
                            else {
                                var yCenter = topPosition + ((bottomPosition - topPosition) / 2);
                                newTop = yCenter - (widthValue / 2);
                                newBottom = yCenter + (widthValue / 2);
                            }
                            var leftPos = newLeft / widthMax;
                            var topPos = newTop / heightMax;
                            var rightPos = newRight / widthMax;
                            var bottomPos = newBottom / heightMax;
                            return item_1.Item.set('prop:pos', leftPos.toFixed(6) + ',' +
                                topPos.toFixed(6) + ',' + rightPos.toFixed(6) + ',' +
                                bottomPos.toFixed(6), _this._id);
                        }).then(function () {
                            return item_1.Item.get('prop:posaspect', _this._id);
                        }).then(function (val) {
                            return item_1.Item.set('prop:pos', val, _this._id);
                        });
                    }
                });
            }
        });
    };
    ItemLayout.prototype.setCroppingEnhanced = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value.hasOwnProperty('top') && value.hasOwnProperty('left') &&
                value.hasOwnProperty('right') && value.hasOwnProperty('bottom')) {
                var originalWidth;
                var originalHeight;
                var outputResolution;
                var position;
                var canvasRotate;
                var preCropPosition = {};
                item_1.Item.get('mixerresolution', _this._id).then(function (val) {
                    outputResolution = val.split(',');
                    return item_1.Item.get('prop:pos', _this._id);
                }).then(function (val) {
                    position = val.split(',');
                    return item_1.Item.get('prop:rotate_canvas', _this._id);
                }).then(function (val) {
                    canvasRotate = val;
                    return item_1.Item.get('prop:crop', _this._id);
                }).then(function (val) {
                    var mixerWidth = parseInt(outputResolution[0]);
                    var mixerHeight = parseInt(outputResolution[1]);
                    var leftPositionInit = parseFloat(position[0]) * mixerWidth;
                    var topPositionInit = parseFloat(position[1]) * mixerHeight;
                    var rightPositionInit = parseFloat(position[2]) * mixerWidth;
                    var bottomPositionInit = parseFloat(position[3]) * mixerHeight;
                    var widthValue = rightPositionInit - leftPositionInit;
                    var heightValue = bottomPositionInit - topPositionInit;
                    var crop = val.split(',');
                    var leftCropRaw = parseFloat(crop[0]);
                    var topCropRaw = parseFloat(crop[1]);
                    var rightCropRaw = parseFloat(crop[2]);
                    var bottomCropRaw = parseFloat(crop[3]);
                    var leftValue = Math.round(leftCropRaw * 100);
                    var topValue = Math.round(topCropRaw * 100);
                    var rightValue = Math.round(rightCropRaw * 100);
                    var bottomValue = Math.round(bottomCropRaw * 100);
                    var isNoCropping = ((leftValue == 0) && (topValue == 0) &&
                        (rightValue == 0) && (bottomValue == 0));
                    if (canvasRotate == 270) {
                        if (isNoCropping) {
                            preCropPosition = position;
                            originalHeight = widthValue;
                            originalWidth = heightValue;
                        }
                        else {
                            var leftPosition = parseFloat(position[3]);
                            var topPosition = parseFloat(position[0]);
                            var rightPosition = parseFloat(position[1]);
                            var bottomPosition = parseFloat(position[2]);
                            if (leftCropRaw != 0 || rightCropRaw != 0) {
                                originalWidth = heightValue / (1 - rightCropRaw - leftCropRaw);
                                var leftDifference = (originalWidth * leftCropRaw) / mixerHeight;
                                preCropPosition[3] = leftPosition + leftDifference;
                                var rightDifference = (originalWidth * rightCropRaw) /
                                    mixerHeight;
                                preCropPosition[1] = rightPosition - rightDifference;
                            }
                            else {
                                originalWidth = heightValue;
                            }
                            if (topCropRaw != 0 || bottomCropRaw != 0) {
                                originalHeight = widthValue / (1 - bottomCropRaw - topCropRaw);
                                var topDifference = (originalHeight * topCropRaw) / mixerWidth;
                                preCropPosition[0] = topPosition - topDifference;
                                var bottomDifference = (originalHeight * bottomCropRaw) /
                                    mixerWidth;
                                preCropPosition[2] = bottomPosition + bottomDifference;
                            }
                            else {
                                originalHeight = widthValue;
                            }
                            if (leftCropRaw == 0) {
                                preCropPosition[3] = position[3];
                            }
                            if (topCropRaw == 0) {
                                preCropPosition[0] = position[0];
                            }
                            if (rightCropRaw == 0) {
                                preCropPosition[1] = position[1];
                            }
                            if (bottomCropRaw == 0) {
                                preCropPosition[2] = position[2];
                            }
                        }
                    }
                    else if (canvasRotate == 180) {
                        if (isNoCropping) {
                            preCropPosition = position;
                            originalWidth = widthValue;
                            originalHeight = heightValue;
                        }
                        else {
                            var leftPosition = parseFloat(position[2]);
                            var topPosition = parseFloat(position[3]);
                            var rightPosition = parseFloat(position[0]);
                            var bottomPosition = parseFloat(position[1]);
                            if (leftCropRaw != 0 || rightCropRaw != 0) {
                                originalWidth = widthValue / (1 - rightCropRaw - leftCropRaw);
                                var leftDifference = (originalWidth * leftCropRaw) / mixerWidth;
                                preCropPosition[2] = leftPosition + leftDifference;
                                var rightDifference = (originalWidth * rightCropRaw) / mixerWidth;
                                preCropPosition[0] = rightPosition - rightDifference;
                            }
                            else {
                                originalWidth = widthValue;
                            }
                            if (topCropRaw != 0 || bottomCropRaw != 0) {
                                originalHeight = heightValue / (1 - bottomCropRaw - topCropRaw);
                                var topDifference = (originalHeight * topCropRaw) / mixerHeight;
                                preCropPosition[3] = topPosition + topDifference;
                                var bottomDifference = (originalHeight * bottomCropRaw) /
                                    mixerHeight;
                                preCropPosition[1] = bottomPosition - bottomDifference;
                            }
                            else {
                                originalHeight = heightValue;
                            }
                            if (leftCropRaw == 0) {
                                preCropPosition[2] = position[2];
                            }
                            if (topCropRaw == 0) {
                                preCropPosition[3] = position[3];
                            }
                            if (rightCropRaw == 0) {
                                preCropPosition[0] = position[0];
                            }
                            if (bottomCropRaw == 0) {
                                preCropPosition[1] = position[1];
                            }
                        }
                    }
                    else if (canvasRotate == 90) {
                        if (isNoCropping) {
                            preCropPosition = position;
                            originalHeight = widthValue;
                            originalWidth = heightValue;
                        }
                        else {
                            var leftPosition = parseFloat(position[1]);
                            var topPosition = parseFloat(position[2]);
                            var rightPosition = parseFloat(position[3]);
                            var bottomPosition = parseFloat(position[0]);
                            if (leftCropRaw != 0 || rightCropRaw != 0) {
                                originalWidth = heightValue / (1 - rightCropRaw - leftCropRaw);
                                var leftDifference = (originalWidth * leftCropRaw) / mixerHeight;
                                preCropPosition[1] = leftPosition - leftDifference;
                                var rightDifference = (originalWidth * rightCropRaw) /
                                    mixerHeight;
                                preCropPosition[3] = rightPosition + rightDifference;
                            }
                            else {
                                originalWidth = heightValue;
                            }
                            if (topCropRaw != 0 || bottomCropRaw != 0) {
                                originalHeight = widthValue / (1 - bottomCropRaw - topCropRaw);
                                var topDifference = (originalHeight * topCropRaw) / mixerWidth;
                                preCropPosition[2] = topPosition + topDifference;
                                var bottomDifference = (originalHeight * bottomCropRaw) /
                                    mixerWidth;
                                preCropPosition[0] = bottomPosition - bottomDifference;
                            }
                            else {
                                originalHeight = widthValue;
                            }
                            if (leftCropRaw == 0) {
                                preCropPosition[1] = position[1];
                            }
                            if (topCropRaw == 0) {
                                preCropPosition[2] = position[2];
                            }
                            if (rightCropRaw == 0) {
                                preCropPosition[3] = position[3];
                            }
                            if (bottomCropRaw == 0) {
                                preCropPosition[0] = position[0];
                            }
                        }
                    }
                    else {
                        if (isNoCropping) {
                            preCropPosition = position;
                            originalHeight = heightValue;
                            originalWidth = widthValue;
                        }
                        else {
                            var leftPosition = parseFloat(position[0]);
                            var topPosition = parseFloat(position[1]);
                            var rightPosition = parseFloat(position[2]);
                            var bottomPosition = parseFloat(position[3]);
                            if (leftCropRaw != 0 || rightCropRaw != 0) {
                                originalWidth = widthValue / (1 - rightCropRaw - leftCropRaw);
                                var leftDifference = (originalWidth * leftCropRaw) / mixerWidth;
                                preCropPosition[0] = leftPosition - leftDifference;
                                var rightDifference = (originalWidth * rightCropRaw) /
                                    mixerWidth;
                                preCropPosition[2] = rightPosition + rightDifference;
                            }
                            else {
                                originalWidth = widthValue;
                            }
                            if (topCropRaw != 0 || bottomCropRaw != 0) {
                                originalHeight = heightValue / (1 - bottomCropRaw - topCropRaw);
                                var topDifference = (originalHeight * topCropRaw) / mixerHeight;
                                preCropPosition[1] = topPosition - topDifference;
                                var bottomDifference = (originalHeight * bottomCropRaw) /
                                    mixerHeight;
                                preCropPosition[3] = bottomPosition + bottomDifference;
                            }
                            else {
                                originalHeight = heightValue;
                            }
                            if (leftCropRaw == 0) {
                                preCropPosition[0] = position[0];
                            }
                            if (topCropRaw == 0) {
                                preCropPosition[1] = position[1];
                            }
                            if (rightCropRaw == 0) {
                                preCropPosition[2] = position[2];
                            }
                            if (bottomCropRaw == 0) {
                                preCropPosition[3] = position[3];
                            }
                        }
                    }
                    var leftCrop = value['left'];
                    var topCrop = value['top'];
                    var rightCrop = value['right'];
                    var bottomCrop = value['bottom'];
                    var leftPosition = parseFloat(preCropPosition[0]);
                    var topPosition = parseFloat(preCropPosition[1]);
                    var rightPosition = parseFloat(preCropPosition[2]);
                    var bottomPosition = parseFloat(preCropPosition[3]);
                    var sourceHeight = (bottomPosition - topPosition) * mixerHeight;
                    var sourceWidth = (rightPosition - leftPosition) * mixerWidth;
                    var newLeft, newTop, newRight, newBottom;
                    if (canvasRotate == 270) {
                        newLeft = ((topCrop * sourceWidth) / mixerWidth) + leftPosition;
                        newTop = ((rightCrop * sourceHeight) / mixerHeight) + topPosition;
                        newRight = rightPosition - ((bottomCrop * sourceWidth) / mixerWidth);
                        newBottom = bottomPosition -
                            ((leftCrop * sourceHeight) / mixerHeight);
                    }
                    else if (canvasRotate == 180) {
                        newLeft = ((rightCrop * sourceWidth) / mixerWidth) + leftPosition;
                        newTop = ((bottomCrop * sourceHeight) / mixerHeight) + topPosition;
                        newRight = rightPosition - ((leftCrop * sourceWidth) / mixerWidth);
                        newBottom = bottomPosition -
                            ((topCrop * sourceHeight) / mixerHeight);
                    }
                    else if (canvasRotate == 90) {
                        newLeft = ((bottomCrop * sourceWidth) / mixerWidth) + leftPosition;
                        newTop = ((leftCrop * sourceHeight) / mixerHeight) + topPosition;
                        newRight = rightPosition - ((topCrop * sourceWidth) / mixerWidth);
                        newBottom = bottomPosition -
                            ((rightCrop * sourceHeight) / mixerHeight);
                    }
                    else {
                        newLeft = ((leftCrop * sourceWidth) / mixerWidth) + leftPosition;
                        newTop = ((topCrop * sourceHeight) / mixerHeight) + topPosition;
                        newRight = rightPosition - ((rightCrop * sourceWidth) / mixerWidth);
                        newBottom = bottomPosition -
                            ((bottomCrop * sourceHeight) / mixerHeight);
                    }
                    item_1.Item.set('prop:crop', value['left'].toFixed(6) + ',' +
                        value['top'].toFixed(6) + ',' + value['right'].toFixed(6) + ',' +
                        value['bottom'].toFixed(6), _this._id).then(function () {
                        return item_1.Item.set('prop:pos', newLeft.toFixed(6) + ',' +
                            newTop.toFixed(6) + ',' + newRight.toFixed(6) + ',' +
                            newBottom.toFixed(6), _this._id);
                    }).then(function () {
                        resolve(_this);
                    });
                });
            }
            else {
                reject('Error setting cropping,' +
                    ' insufficient properties (left, top, right, bottom)');
            }
        });
    };
    return ItemLayout;
})();
exports.ItemLayout = ItemLayout;
},{"../../internal/item":31,"../../util/rectangle":48}],19:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var mixin_1 = require('../../internal/util/mixin');
var ilayout_1 = require('./ilayout');
var icolor_1 = require('./icolor');
var ichroma_1 = require('./ichroma');
var itransition_1 = require('./itransition');
var source_1 = require('./source');
/**
 * The ImageSource class represents an image source (includes GIF files).
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 *  All methods marked as *Chainable* resolve with the original `ImageSource`
 *  instance.
 */
var ImageSource = (function (_super) {
    __extends(ImageSource, _super);
    function ImageSource() {
        _super.apply(this, arguments);
    }
    return ImageSource;
})(source_1.Source);
exports.ImageSource = ImageSource;
mixin_1.applyMixins(ImageSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition]);
},{"../../internal/util/mixin":33,"./ichroma":14,"./icolor":15,"./ilayout":18,"./itransition":21,"./source":24}],20:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var cuepoint_1 = require('./cuepoint');
/**
 *  Used by sources that implement the Playback interface.
 *  Check `getActionAfterPlayback()`/`setActionAfterPlayback()` method of
 *  {@link #core/MediaSource#getActionAfterPlayback Core/MediaSource}.
 */
(function (ActionAfterPlayback) {
    ActionAfterPlayback[ActionAfterPlayback["NONE"] = 0] = "NONE";
    ActionAfterPlayback[ActionAfterPlayback["REWIND"] = 1] = "REWIND";
    ActionAfterPlayback[ActionAfterPlayback["LOOP"] = 2] = "LOOP";
    ActionAfterPlayback[ActionAfterPlayback["TRANSPARENT"] = 3] = "TRANSPARENT";
    ActionAfterPlayback[ActionAfterPlayback["HIDE"] = 4] = "HIDE";
})(exports.ActionAfterPlayback || (exports.ActionAfterPlayback = {}));
var ActionAfterPlayback = exports.ActionAfterPlayback;
var AUDIO_REGEX = /\.(mp3|aac|cda|ogg|m4a|flac|wma|aiff|aif|wav|mid|midi|rma)$/;
var VIDEO_REGEX = /\.(avi|flv|mkv|mp4|mpg|wmv|3gp|3g2|asf|f4v|mov|mpeg|vob|webm)$/;
var ItemPlayback = (function () {
    function ItemPlayback() {
    }
    ItemPlayback.prototype.isSeekable = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('sync:syncable', _this._id).then(function (val) {
                resolve(val === '1' ? true : false);
            });
        });
    };
    ItemPlayback.prototype.getPlaybackPosition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('sync:position', _this._id).then(function (val) {
                resolve(Number(val) / 10000000);
            });
        });
    };
    ItemPlayback.prototype.setPlaybackPosition = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('sync:position', String(value * 10000000), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.getPlaybackDuration = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('sync:duration', _this._id).then(function (val) {
                resolve(Number(val) / 10000000);
            });
        });
    };
    ItemPlayback.prototype.isPlaying = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('sync:state', _this._id).then(function (val) {
                resolve(val === "running");
            });
        });
    };
    ItemPlayback.prototype.setPlaying = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('sync:state', value ? "running" : "stopped", _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.getPlaybackStartPosition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:InPoint', _this._id).then(function (val) {
                resolve(Number(val) / 10000000);
            });
        });
    };
    ItemPlayback.prototype.setPlaybackStartPosition = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:InPoint', String(value * 10000000), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.getPlaybackEndPosition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:OutPoint', _this._id).then(function (val) {
                resolve(Number(val) / 10000000);
            });
        });
    };
    ItemPlayback.prototype.setPlaybackEndPosition = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:OutPoint', String(value * 10000000), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.getActionAfterPlayback = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:OpWhenFinished', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemPlayback.prototype.setActionAfterPlayback = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:OpWhenFinished', String(value), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.isAutostartOnSceneLoad = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:StartOnLoad', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemPlayback.prototype.setAutostartOnSceneLoad = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:StartOnLoad', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.isForceDeinterlace = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:fdeinterlace', _this._id).then(function (val) {
                resolve(val === '3');
            });
        });
    };
    ItemPlayback.prototype.setForceDeinterlace = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:fdeinterlace', (value ? '3' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.isRememberingPlaybackPosition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:RememberPosition', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemPlayback.prototype.setRememberingPlaybackPosition = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:RememberPosition', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.isShowingPlaybackPosition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:ShowPosition', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    ItemPlayback.prototype.setShowingPlaybackPosition = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:ShowPosition', (value ? '1' : '0'), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemPlayback.prototype.getCuePoints = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:CuePoints', _this._id).then(function (cuePointString) {
                if (cuePointString === '') {
                    resolve([]);
                }
                else {
                    var cuePointStrings = cuePointString.split(',');
                    var cuePoints = cuePointStrings.map(function (string) { return cuepoint_1.CuePoint._fromString(string); });
                    resolve(cuePoints);
                }
            });
        });
    };
    ItemPlayback.prototype.setCuePoints = function (cuePoints) {
        var _this = this;
        return new Promise(function (resolve) {
            var cuePointString = cuePoints.map(function (point) { return point.toString(); }).join(',');
            resolve(_this);
        });
    };
    ItemPlayback.prototype.isAudio = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:item', _this._id).then(function (filename) {
                resolve(AUDIO_REGEX.test(filename));
            });
        });
    };
    ItemPlayback.prototype.isVideo = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:item', _this._id).then(function (filename) {
                resolve(VIDEO_REGEX.test(filename));
            });
        });
    };
    ItemPlayback.prototype.getValue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            // we do not do any additional checking since we are assured of the type
            item_1.Item.get('prop:item', _this._id).then(function (val) {
                resolve(val);
            });
        });
    };
    ;
    ItemPlayback.prototype.setValue = function (filename) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (VIDEO_REGEX.test(filename) || AUDIO_REGEX.test(filename)) {
                item_1.Item.set('prop:item', filename, _this._id)
                    .then(function () { return item_1.Item.set('prop:name', filename, _this._id); })
                    .then(function () { return item_1.Item.set('prop:CuePoints', '', _this._id); })
                    .then(function () {
                    resolve(_this);
                });
            }
            else {
                reject(new Error('You can only set the value to a valid media type'));
            }
        });
    };
    return ItemPlayback;
})();
exports.ItemPlayback = ItemPlayback;
},{"../../internal/item":31,"./cuepoint":9}],21:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var item_1 = require('../../internal/item');
var transition_1 = require('../transition');
var ItemTransition = (function () {
    function ItemTransition() {
    }
    ItemTransition.prototype.isVisible = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:visible', _this._id).then(function (val) {
                resolve(val === '1' ? true : false);
            });
        });
    };
    ItemTransition.prototype.setVisible = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:visible', value ? '1' : '0', _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemTransition.prototype.getTransition = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:transitionid', _this._id).then(function (val) {
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
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:transitionid', value.toString(), _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    ItemTransition.prototype.getTransitionTime = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:transitiontime', _this._id).then(function (val) {
                resolve(Number(val));
            });
        });
    };
    ItemTransition.prototype.setTransitionTime = function (value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (value < 0 || value > 60000) {
                reject(RangeError('Transparency may only be in the range 0 to 60000.'));
            }
            else {
                item_1.Item.set('prop:transitiontime', String(value), _this._id).then(function () {
                    resolve(_this);
                });
            }
        });
    };
    return ItemTransition;
})();
exports.ItemTransition = ItemTransition;
},{"../../internal/item":31,"../transition":26}],22:[function(require,module,exports){
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
var ieffects_1 = require('./ieffects');
var itransition_1 = require('./itransition');
var iplayback_1 = require('./iplayback');
var iaudio_1 = require('./iaudio');
var source_1 = require('./source');
var json_1 = require('../../internal/util/json');
/**
 * The MediaSource class represents a playable media file.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemAudio Core/IItemAudio},
 * {@link #core/IItemPlayback Core/IItemPlayback},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 *  All methods marked as *Chainable* resolve with the original `MediaSource`
 *  instance.
 */
var MediaSource = (function (_super) {
    __extends(MediaSource, _super);
    function MediaSource() {
        _super.apply(this, arguments);
    }
    /**
     * return: Promise<object>
     *
     * Gets file information such as codecs, bitrate, resolution, etc.
     *
     * sample file info object format:
     *
     * {
     *  "audio": {
     *    "duration":"1436734690",
     *    "samplerate":"44100",
     *    "bitrate":"128000",
     *    "codec":"mp3"},
     *  "video":{
     *    "frameduration":"333670",
     *    "bitrate":"1132227",
     *    "duration":"1436436440",
     *    "height":"240",
     *    "width":"320",
     *    "codec":"mpeg4"}
     * }
     *
     * #### Usage
     *
     * ```javascript
     * mediaSource.getFileInfo().then(function(value) {
     *   // Do something with the value
     *   var audioCodec;
     *   if (typeof value['audio'] !== 'undefined' && typeof value['audio']['codec']) {
     *     audioCodec = value['audio']['codec'];
     *   }
     * });
     * ```
     */
    MediaSource.prototype.getFileInfo = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            item_1.Item.get('FileInfo', _this._id).then(function (val) {
                try {
                    var fileInfoObj = {};
                    var fileInfoJXON = json_1.JSON.parse(val);
                    if (typeof fileInfoJXON['children'] !== 'undefined'
                        && fileInfoJXON['children'].length > 0) {
                        var fileInfoChildren = fileInfoJXON['children'];
                        for (var i = fileInfoChildren.length - 1; i >= 0; i--) {
                            var child = fileInfoChildren[i];
                            var childObj = {};
                            var childObjKeys = Object.keys(child);
                            for (var j = childObjKeys.length - 1; j >= 0; j--) {
                                var key = childObjKeys[j];
                                if (key !== 'value' && key !== 'tag') {
                                    childObj[key] = child[key];
                                }
                            }
                            var tag = child['tag'];
                            fileInfoObj[tag] = childObj;
                        }
                        resolve(fileInfoObj);
                    }
                    else {
                        resolve(fileInfoObj);
                    }
                }
                catch (e) {
                    reject(Error('Error retrieving file information'));
                }
            });
        });
    };
    return MediaSource;
})(source_1.Source);
exports.MediaSource = MediaSource;
mixin_1.applyMixins(MediaSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma,
    itransition_1.ItemTransition, iplayback_1.ItemPlayback, iaudio_1.ItemAudio, ieffects_1.ItemEffect]);
},{"../../internal/item":31,"../../internal/util/json":32,"../../internal/util/mixin":33,"./iaudio":13,"./ichroma":14,"./icolor":15,"./ieffects":17,"./ilayout":18,"./iplayback":20,"./itransition":21,"./source":24}],23:[function(require,module,exports){
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
var ieffects_1 = require('./ieffects');
var itransition_1 = require('./itransition');
var source_1 = require('./source');
var rectangle_1 = require('../../util/rectangle');
var json_1 = require('../../internal/util/json');
var xml_1 = require('../../internal/util/xml');
/**
 * The ScreenSource class represents a screen capture source.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemEffect Core/IItemEffect}
 *
 *  All methods marked as *Chainable* resolve with the original `ScreenSource`
 *  instance.
 */
var ScreenSource = (function (_super) {
    __extends(ScreenSource, _super);
    function ScreenSource() {
        _super.apply(this, arguments);
    }
    /**
     * return: Promise<Rectangle>
     *
     * Gets the Capture Area of the Screen Capture Source. Returns a Rectangle
     * object.
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    ScreenSource.prototype.getCaptureArea = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getValue().then(function (val) {
                if (!(val instanceof xml_1.XML)) {
                    resolve(rectangle_1.Rectangle.fromCoordinates(0, 0, 0, 0));
                }
                else {
                    var _value = json_1.JSON.parse(val);
                    resolve(rectangle_1.Rectangle.fromCoordinates(Number(_value['left']), Number(_value['top']), Number(_value['width']) + Number(_value['left']), Number(_value['height']) + Number(_value['top'])));
                }
            });
        });
    };
    /**
     * param: Promise<Rectangle>
     * ```
     * return: Promise<ScreenSource>
     * ```
     *
     * Sets the Window Capture Area of the Screen Capture Source.
     *
     * *Chainable.*
     *
     * See also: {@link #util/Rectangle Util/Rectangle}
     */
    ScreenSource.prototype.setCaptureArea = function (dimension) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getValue().then(function (val) {
                return new Promise(function (iResolve) {
                    item_1.Item.get('screenresolution', _this._id).then(function (res) {
                        var _res = res.split(',');
                        iResolve({
                            value: val,
                            res: rectangle_1.Rectangle.fromCoordinates(Number(_res[0]), Number(_res[1]), Number(_res[2]), Number(_res[3]))
                        });
                    });
                });
            }).then(function (obj) {
                var _config = new json_1.JSON();
                if (!(obj.value instanceof xml_1.XML)) {
                    _config['tag'] = 'screen';
                    _config['module'] = '';
                    _config['window'] = '';
                    _config['hwnd'] = '0';
                    _config['wclient'] = '0';
                    _config['left'] = '0';
                    _config['top'] = '0';
                    _config['width'] = '0';
                    _config['height'] = '0';
                }
                else {
                    _config = json_1.JSON.parse(obj.value);
                }
                _config['left'] = dimension.getLeft() >= obj.res.getLeft() ?
                    dimension.getLeft() : Number(_config['left']) >= obj.res.getLeft() ?
                    _config['left'] : obj.res.getLeft();
                _config['top'] = dimension.getTop() >= obj.res.getTop() ?
                    dimension.getTop() : Number(_config['top']) >= obj.res.getTop() ?
                    _config['top'] : obj.res.getTop();
                _config['width'] = dimension.getWidth() <= obj.res.getWidth() ?
                    dimension.getWidth() : Number(_config['width']) <=
                    obj.res.getWidth() ? _config['width'] : obj.res.getWidth();
                _config['height'] = dimension.getHeight() <= obj.res.getHeight() ?
                    dimension.getHeight() : Number(_config['height']) <=
                    obj.res.getHeight() ? _config['height'] : obj.res.getHeight();
                _this.setValue(xml_1.XML.parseJSON(_config)).then(function () {
                    resolve(_this);
                });
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks if the Screen Capture Source only captures the
     * Client area (does not capture the title bar, menu bar, window border, etc.)
     */
    ScreenSource.prototype.isClientArea = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getValue().then(function (val) {
                if (!(val instanceof xml_1.XML)) {
                    resolve(false);
                }
                else {
                    var _value = json_1.JSON.parse(val);
                    resolve(_value['wclient'] === '1');
                }
            });
        });
    };
    /**
     * param: Promise<boolean>
     * ```
     * return: Promise<ScreenSource>
     * ```
     *
     * Set the Screen Capture to capture the Client area only or include
     * the titlebar, menu bar, window border, etc.
     */
    ScreenSource.prototype.setClientArea = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.getValue().then(function (val) {
                var _config = new json_1.JSON();
                if (!(val instanceof xml_1.XML)) {
                    _config['tag'] = 'screen';
                    _config['module'] = '';
                    _config['window'] = '';
                    _config['hwnd'] = '0';
                    _config['wclient'] = '0';
                    _config['left'] = '0';
                    _config['top'] = '0';
                    _config['width'] = '0';
                    _config['height'] = '0';
                }
                else {
                    _config = json_1.JSON.parse(val);
                }
                _config['wclient'] = (value ? '1' : '0');
                _this.setValue(xml_1.XML.parseJSON(_config)).then(function () {
                    resolve(_this);
                });
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Checks if the Screen Capture Source captures a window based on
     * the window's title.
     */
    ScreenSource.prototype.isStickToTitle = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:ScrCapTrackWindowTitle', _this._id).then(function (val) {
                resolve(val === '0');
            });
        });
    };
    /**
     * param: Promise<boolean>
     * ```
     * return: Promise<ScreenSource>
     * ```
     *
     * Set the Screen Capture to capture the window based on the window title.
     * Useful when capturing programs with multiple tabs, for you to only
     * capture a particular tab.
     */
    ScreenSource.prototype.setStickToTitle = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:ScrCapTrackWindowTitle', value ? '0' : '1', _this._id)
                .then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return Promise<ScreenSource>
     *
     * Checks if the Screen Capture layered window is selected.
     */
    ScreenSource.prototype.getCaptureLayered = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:ScrCapLayered', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value: boolean)
     * ```
     * return Promise<ScreenSource>
     * ```
     *
     * Sets the Screen Capture Layered window
     */
    ScreenSource.prototype.setCaptureLayered = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:ScrCapLayered', value ? '1' : '0', _this._id).then(function (val) {
                resolve(_this);
            });
        });
    };
    /**
     * return Promise<boolean>
     *
     * Checks if the Exclusive Window capture is selected.
     */
    ScreenSource.prototype.getOptimizedCapture = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:ScrCapOptCapture1', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value: boolean)
     * ```
     * return Promise<ScreenSource>
     * ```
     *
     * Sets the Exclusive Window capture.
     */
    ScreenSource.prototype.setOptimizedCapture = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:ScrCapOptCapture1', value ? '1' : '0', _this._id).then(function (val) {
                resolve(_this);
            });
        });
    };
    /**
     * return Promise<boolean>
     *
     * Checks if the Show mouse clicks is selected.
     *
     */
    ScreenSource.prototype.getShowMouseClicks = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:ScrCapShowClicks', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value: boolean)
     * ```
     * return Promise<ScreenSource>
     * ```
     *
     * Sets the Show mouse clicks.
     */
    ScreenSource.prototype.setShowMouseClicks = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:ScrCapShowClicks', value ? '1' : '0', _this._id).then(function (val) {
                resolve(_this);
            });
        });
    };
    /**
     * return Promise<boolean>
     *
     * Checks if the Show mouse is selected.
     *
     */
    ScreenSource.prototype.getShowMouse = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:ScrCapShowMouse', _this._id).then(function (val) {
                resolve(val === '1');
            });
        });
    };
    /**
     * param: (value: boolean)
     * ```
     * return Promise<ScreenSource>
     * ```
     *
     * Sets the Show Mouse.
     */
    ScreenSource.prototype.setShowMouse = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('prop:ScrCapShowMouse', value ? '1' : '0', _this._id).then(function (val) {
                if (val === true) {
                    item_1.Item.set('prop:ScrCapShowClicks', value ? '1' : '0', _this._id);
                }
                resolve(_this);
            });
        });
    };
    return ScreenSource;
})(source_1.Source);
exports.ScreenSource = ScreenSource;
mixin_1.applyMixins(ScreenSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition,
    ieffects_1.ItemEffect]);
},{"../../internal/item":31,"../../internal/util/json":32,"../../internal/util/mixin":33,"../../internal/util/xml":34,"../../util/rectangle":48,"./ichroma":14,"./icolor":15,"./ieffects":17,"./ilayout":18,"./itransition":21,"./source":24}],24:[function(require,module,exports){
/// <reference path="../../../defs/es6-promise.d.ts" />
var mixin_1 = require('../../internal/util/mixin');
var item_1 = require('../../internal/item');
var app_1 = require('../../internal/app');
var environment_1 = require('../environment');
var json_1 = require('../../internal/util/json');
var xml_1 = require('../../internal/util/xml');
var scene_1 = require('../scene');
var ilayout_1 = require('./ilayout');
(function (SourceTypes) {
    SourceTypes[SourceTypes["UNDEFINED"] = 0] = "UNDEFINED";
    SourceTypes[SourceTypes["FILE"] = 1] = "FILE";
    SourceTypes[SourceTypes["LIVE"] = 2] = "LIVE";
    SourceTypes[SourceTypes["TEXT"] = 3] = "TEXT";
    SourceTypes[SourceTypes["BITMAP"] = 4] = "BITMAP";
    SourceTypes[SourceTypes["SCREEN"] = 5] = "SCREEN";
    SourceTypes[SourceTypes["FLASHFILE"] = 6] = "FLASHFILE";
    SourceTypes[SourceTypes["GAMESOURCE"] = 7] = "GAMESOURCE";
    SourceTypes[SourceTypes["HTML"] = 8] = "HTML";
})(exports.SourceTypes || (exports.SourceTypes = {}));
var SourceTypes = exports.SourceTypes;
(function (ViewTypes) {
    ViewTypes[ViewTypes["MAIN"] = 0] = "MAIN";
    ViewTypes[ViewTypes["PREVIEW"] = 1] = "PREVIEW";
    ViewTypes[ViewTypes["THUMBNAIL"] = 2] = "THUMBNAIL";
})(exports.ViewTypes || (exports.ViewTypes = {}));
var ViewTypes = exports.ViewTypes;
/**
 * A `Source` represents an object that is used as a source on the stage.
 * Some possible sources are games, microphones, or a webpage.
 *
 * Implements: {@link #core/IItemLayout Core/IItemLayout}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var xjs = require('xjs');
 * var Scene = xjs.Scene.getById(0);
 *
 * Scene.getSources().then(function(sources) {
 *   if (sources.length === 0) return;
 *
 *   // There's a valid source, let's use that
 *   var source = sources[sources.length - 1];
 *   return source.setCustomName('SourceTesting');
 * }).then(function(source) {
 *   // Do something else here
 * });
 * ```
 * All methods marked as *Chainable* resolve with the original `Source` instance.
 * This allows you to perform sequential operations correctly:
 * ```javascript
 * var xjs = require('xjs');
 * var Source = xjs.Source;
 *
 * // a source that sets its own properties on load
 * xjs.ready()
 *    .then(Source.getCurrentSource)
 *    .then(function(source) {
 *     return source.setCustomName('MyCustomName');
 *  }).then(function(source) {
 *     return source.setKeepLoaded(true);
 *  }).then(function(source) {
 *     // set more properties here
 *  });
 * ```
 */
var Source = (function () {
    function Source(props) {
        props = props ? props : {};
        this._name = props['name'];
        this._cname = props['cname'];
        this._id = props['id'];
        this._sceneId = props['sceneId'];
        this._value = props['value'];
        this._keepLoaded = props['keeploaded'];
        this._type = Number(props['type']);
        this._xmlparams = props;
    }
    /**
     * param: (value: string)
     * ```
     * return: Promise<Source>
     * ```
     *
     * Sets the name of the source.
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * source.setName('newNameHere').then(function(source) {
     *   // Promise resolves with same Source instance when name has been set
     *   return source.getName();
     * }).then(function(name) {
     *   // 'name' should be the updated value by now.
     * });
     * ```
     */
    Source.prototype.setName = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._name = value;
            item_1.Item.set('prop:name', _this._name, _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<string>
     *
     * Gets the name of the source.
     *
     * #### Usage
     *
     * ```javascript
     * source.getName().then(function(name) {
     *   // Do something with the name
     * });
     * ```
     */
    Source.prototype.getName = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:name', _this._id).then(function (val) {
                _this._name = val;
                resolve(val);
            });
        });
    };
    /**
     * param: (value: string)
     * ```
     * return: Promise<Source>
     * ```
     *
     * Sets the custom name of the source.
     *
     * The main difference between `setName` and `setCustomName` is that the CustomName
     * can be edited by users using XBC through the bottom panel. `setName` on
     * the other hand would update the source's internal name property.
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * source.setCustomName('newNameHere').then(function(source) {
     *   // Promise resolves with same Source instance when custom name has been set
     *   return source.getCustomName();
     * }).then(function(name) {
     *   // 'name' should be the updated value by now.
     * });
     * ```
     */
    Source.prototype.setCustomName = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._cname = value;
            item_1.Item.set('prop:cname', _this._cname, _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<string>
     *
     * Gets the custom name of the source.
     *
     * #### Usage
     *
     * ```javascript
     * source.getCustomName().then(function(name) {
     *   // Do something with the name
     * });
     * ```
     */
    Source.prototype.getCustomName = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:cname', _this._id).then(function (val) {
                _this._cname = val;
                resolve(val);
            });
        });
    };
    /**
     * return: Promise<string|XML>
     *
     * Gets a special string that refers to the source's main definition.
     *
     * This method can resolve with an XML object, which is an object generated by
     * the framework. Call `toString()` to transform into an XML String. (See the
     * documentation for `setValue` for more details.)
     *
     * #### Usage
     *
     * ```javascript
     * source.getValue().then(function(value) {
     *   // Do something with the value
     * });
     * ```
     */
    Source.prototype.getValue = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:item', _this._id).then(function (val) {
                val = (val === 'null') ? '' : val;
                if (val === '') {
                    _this._value = '';
                    resolve(val);
                }
                else {
                    try {
                        _this._value = xml_1.XML.parseJSON(json_1.JSON.parse(val));
                        resolve(_this._value);
                    }
                    catch (e) {
                        // value is not valid XML (it is a string instead)
                        _this._value = val;
                        resolve(val);
                    }
                }
            });
        });
    };
    /**
     * param: (value: string)
     * ```
     * return: Promise<Source>
     * ```
     *
     * Set the source's main definition; this special string defines the source's
     * "identity". Each type of source requires a different format for this value.
     *
     * *Chainable.*
     *
     * **WARNING:**
     * Please do note that using this method COULD break the current source, possibly modifying
     * its type IF you set an invalid string for the current source.
     *
     * #### Possible values by source type
     * - FILE - path/URL
     * - LIVE - Device ID
     * - BITMAP - path
     * - SCREEN - XML string
     * - FLASHFILE - path
     * - GAMESOURCE - XML string
     * - HTML - path/URL or html:<plugin>
     *
     * #### Usage
     *
     * ```javascript
     * source.setValue('@DEVICE:PNP:\\?\USB#VID_046D&amp;PID_082C&amp;MI_02#6&amp;16FD2F8D&amp;0&amp;0002#{65E8773D-8F56-11D0-A3B9-00A0C9223196}\GLOBAL')
     *   .then(function(source) {
     *   // Promise resolves with same Source instance
     * });
     * ```
     */
    Source.prototype.setValue = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            var val = (typeof value === 'string') ?
                value : value.toString();
            if (typeof value !== 'string') {
                _this._value = json_1.JSON.parse(val);
            }
            else {
                _this._value = val;
            }
            item_1.Item.set('prop:item', val, _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<boolean>
     *
     * Check if source is kept loaded in memory
     *
     * #### Usage
     *
     * ```javascript
     * source.getKeepLoaded().then(function(isLoaded) {
     *   // The rest of your code here
     * });
     * ```
     */
    Source.prototype.getKeepLoaded = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:keeploaded', _this._id).then(function (val) {
                _this._keepLoaded = (val === '1');
                resolve(_this._keepLoaded);
            });
        });
    };
    /**
     * param: (value: boolean)
     * ```
     * return: Promise<Source>
     * ```
     *
     * Set Keep loaded option to ON or OFF
     *
     * Sources with Keep loaded set to ON would emit `scene-load` event each time
     * the active scene switches to the source's current scene.
     *
     * *Chainable.*
     *
     * #### Usage
     *
     * ```javascript
     * source.setKeepLoaded(true).then(function(source) {
     *   // Promise resolves with same Source instance
     * });
     * ```
     */
    Source.prototype.setKeepLoaded = function (value) {
        var _this = this;
        return new Promise(function (resolve) {
            _this._keepLoaded = value;
            item_1.Item.set('prop:keeploaded', (_this._keepLoaded ? '1' : '0'), _this._id)
                .then(function () {
                resolve(_this);
            });
        });
    };
    /**
     * return: Promise<SourceTypes>
     *
     * Get the type of the source
     *
     * #### Usage
     *
     * ```javascript
     * source.getType().then(function(type) {
     *   // The rest of your code here
     * });
     * ```
     */
    Source.prototype.getType = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:type', _this._id).then(function (val) {
                _this._type = SourceTypes[SourceTypes[Number(val)]];
                resolve(_this._type);
            });
        });
    };
    /**
     * return: Promise<string>
     *
     * Get the ID of the source
     *
     * #### Usage
     *
     * ```javascript
     * source.getId().then(function(id) {
     *   // The rest of your code here
     * });
     * ```
     */
    Source.prototype.getId = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this._id);
        });
    };
    /**
     * return: Promise<number>
     *
     * Get (1-indexed) Scene ID where the source is loaded
     *
     * #### Usage
     *
     * ```javascript
     * source.getSceneId().then(function(id) {
     *   // The rest of your code here
     * });
     * ```
     */
    Source.prototype.getSceneId = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(Number(_this._sceneId) + 1);
        });
    };
    /**
     * return: Promise<ViewTypes>
     *
     * Get the view type of the source
     *
     * #### Usage
     *
     * ```javascript
     * source.getView().then(function(view) {
     *   // view values:
     *   // 0 = main view
     *   // 1 = preview editor
     *   // 2 = thumbnail preview
     * })
     * ```
     */
    Source.prototype.getView = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:viewid', _this._id).then(function (viewId) {
                var view = ViewTypes.MAIN;
                if (viewId === '1') {
                    var preview = app_1.App.getGlobalProperty('preview_editor_opened');
                    view = preview === '1' ? ViewTypes.PREVIEW : ViewTypes.THUMBNAIL;
                }
                resolve(view);
            });
        });
    };
    /**
     * return: XML
     *
     * Convert the Source object to an XML object. Use `toString()` to
     * get the string version of the returned object.
     *
     * #### Usage
     *
     * ```javascript
     * var xml = source.toXML();
     * ```
     */
    Source.prototype.toXML = function () {
        var item = new json_1.JSON();
        item['tag'] = 'item';
        item['name'] = this._name;
        item['item'] = this._value;
        item['type'] = this._type;
        item['selfclosing'] = true;
        if (this._cname) {
            item['cname'] = this._cname;
        }
        return xml_1.XML.parseJSON(item);
    };
    /**
     * return: Promise<Source>
     *
     * Get the current source (when function is called by sources), or the source
     * that was right-clicked to open the source properties window (when function is called
     * from the source properties window)
     *
     * #### Usage
     *
     * ```javascript
     * xjs.Source.getCurrentSource().then(function(source) {
     *   // This will fetch the current source (the plugin)
     * }).catch(function(err) {
     *   // Handle the error here. Errors would only occur
     *   // if we try to execute this method on Extension plugins
     * });
     * ```
     */
    Source.getCurrentSource = function () {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isExtension()) {
                reject(Error('Extensions do not have sources ' +
                    'associated with them.'));
            }
            else if (environment_1.Environment.isSourcePlugin() || environment_1.Environment.isSourceConfig()) {
                scene_1.Scene.searchSourcesById(item_1.Item.getBaseId()).then(function (item) {
                    resolve(item); // this should always exist
                });
            }
        });
    };
    /**
     *  return: Promise<Source>
     *
     *  Refreshes the specified source.
     *
     *  #### Usage
     *  ```javascript
     *  // Sample 1: let source refresh itself
     *  xjs.Source.getCurrentSource().then(function(source) {
     *    source.refresh(); // execution of JavaScript halts because of refresh
     *  });
     *
     *  // Sample 2: refresh some other source 'otherSource'
     *  otherSource.refresh().then(function(source) {
     *    // further manipulation of other source goes here
     *  });
     *  ```
     */
    Source.prototype.refresh = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.set('refresh', '', _this._id).then(function () {
                resolve(_this);
            });
        });
    };
    return Source;
})();
exports.Source = Source;
mixin_1.applyMixins(Source, [ilayout_1.ItemLayout]);
},{"../../internal/app":27,"../../internal/item":31,"../../internal/util/json":32,"../../internal/util/mixin":33,"../../internal/util/xml":34,"../environment":4,"../scene":6,"./ilayout":18}],25:[function(require,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../defs/es6-promise.d.ts" />
var mixin_1 = require('../../internal/util/mixin');
var ilayout_1 = require('./ilayout');
var icolor_1 = require('./icolor');
var item_1 = require('../../internal/item');
var ichroma_1 = require('./ichroma');
var itransition_1 = require('./itransition');
var iconfig_1 = require('./iconfig');
var source_1 = require('./source');
var io_1 = require('../../util/io');
/**
 * The VideoPlaylistSource class represents the VideoPlaylist item that has been
 * added to the stage.
 *
 * Inherits from: {@link #core/Source Core/Source}
 *
 * Implements: {@link #core/IItemChroma Core/IItemChroma},
 * {@link #core/IItemColor Core/IItemColor},
 * {@link #core/IItemLayout Core/IItemLayout},
 * {@link #core/IItemTransition Core/IItemTransition},
 * {@link #core/IItemConfigurable Core/IItemConfigurable}
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 *
 * XJS.Scene.getActiveScene().then(function(scene) {
 *   scene.getSources().then(function(sources) {
 *     for (var i in sources) {
 *       if (sources[i] instanceof XJS.VideoPlaylistSource) {
 *         // Manipulate your VideoPlaylist Source here
 *       }
 *     }
 *   });
 * });
 *
 */
var VideoPlaylistSource = (function (_super) {
    __extends(VideoPlaylistSource, _super);
    function VideoPlaylistSource() {
        _super.apply(this, arguments);
    }
    /**
     * return: Promise<string>
     *
     * Gets the now playing video of this VideoPlaylist source.
     *
     */
    VideoPlaylistSource.prototype.getVideoNowPlaying = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:item', _this._id).then(function (playlist) {
                var _playlist = String(playlist).slice(0, playlist.indexOf('*'));
                resolve(_playlist);
            });
        });
    };
    /**
     * param: (value: string|number)
     *
     * return: Promise<VideoPlaylistSource>
     *
     * Sets the now playing video of this VideoPlaylist source.
     *
     * ## Possible Values
     * - STRING - file path
     * - NUMBER - number|within the range of fileplaylist array length
     *
     */
    VideoPlaylistSource.prototype.setVideoNowPlaying = function (value) {
        var _this = this;
        var file;
        var _playlist;
        return new Promise(function (resolve, reject) {
            item_1.Item.get('prop:FilePlaylist', _this._id).then(function (playlist) {
                _playlist = String(playlist).split('|');
                for (var i = 0; i < _playlist.length; i++) {
                    _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf('*'));
                }
                ;
                return _playlist;
            }).then(function (list) {
                if (typeof value === 'string') {
                    if (_playlist.indexOf(value) === -1) {
                        reject(Error('File not found on Playlist.'));
                    }
                    else {
                        var index = _playlist.indexOf(value);
                        file = _playlist[index] + '*' + index;
                        item_1.Item.set('prop:item', file, _this._id)
                            .then(function (fileplaylist) {
                            resolve(_this);
                        });
                    }
                }
                else if (typeof value === 'number' && value <= _playlist.length) {
                    file = (_playlist[value] + '*' + value);
                    item_1.Item.set('prop:item', file, _this._id)
                        .then(function (fileplaylist) {
                        resolve(this);
                    });
                }
                else {
                    reject(Error('Invalid value.'));
                }
                ;
            });
        });
    };
    ;
    /**
     * return: Promise<string[]>
     *
     * Gets the file paths of the playlist of this VideoPlaylist source.
     *
     */
    VideoPlaylistSource.prototype.getVideoPlaylistItems = function () {
        var _this = this;
        return new Promise(function (resolve) {
            item_1.Item.get('prop:FilePlaylist', _this._id).then(function (playlist) {
                var _playlist = String(playlist).split('|');
                for (var i = 0; i < _playlist.length; i++) {
                    _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf('*'));
                }
                ;
                resolve(_playlist);
            });
        });
    };
    ;
    /**
     * param: (file: string[])
     *
     * return: Promise<string>
     *
     * Sets the playlist of this VideoPlaylist source according to the specified
     * file paths.
     *
     * This call would replace all the items on the playlist.
     * The now playing item is also set to the first item of the new FilePlaylist.
     *
     */
    VideoPlaylistSource.prototype.setVideoPlaylistItems = function (fileItems) {
        var _this = this;
        var fileString;
        var filePromises = fileItems.map(function (filename) {
            return io_1.IO.getVideoDuration(filename);
        });
        return new Promise(function (resolve, reject) {
            Promise.all(filePromises).then(function (duration) {
                for (var i = 0; i < fileItems.length; i++) {
                    if (fileString === undefined) {
                        fileString = fileItems[i] + '*' + i + '*1*'
                            + duration[i] + '*100*0*0*0*0*0|';
                    }
                    else {
                        fileString += fileItems[i] + '*' + i + '*1*'
                            + duration[i] + '*100*0*0*0*0*0';
                        if (i + 1 < fileItems.length) {
                            fileString += '|';
                        }
                        ;
                    }
                    ;
                }
                ;
                item_1.Item.set('prop:item', fileItems[0] + '*0', _this._id);
                return fileString;
            }).then(function (fileString) {
                item_1.Item.set('prop:FilePlaylist', fileString, _this._id)
                    .then(function (fileplaylist) {
                    resolve(_this);
                });
            });
        });
    };
    ;
    return VideoPlaylistSource;
})(source_1.Source);
exports.VideoPlaylistSource = VideoPlaylistSource;
mixin_1.applyMixins(VideoPlaylistSource, [ilayout_1.ItemLayout, icolor_1.ItemColor, ichroma_1.ItemChroma, itransition_1.ItemTransition,
    iconfig_1.ItemConfigurable]);
},{"../../internal/item":31,"../../internal/util/mixin":33,"../../util/io":46,"./ichroma":14,"./icolor":15,"./iconfig":16,"./ilayout":18,"./itransition":21,"./source":24}],26:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
/**
 * The Transition class represents a preset transition within XSplit Broadcaster.
 * This may be used to set the application's transition scheme when switching scenes,
 * or to set an individual source's transition when its visibility changes.
 *
 * Simply use one of the available Transition objects such as Transition.FAN or
 * Transition.COLLAPSE as the parameter to the `setTransition()` method of an
 * App instance, or a valid Source instance that supports transitions (this
 * includes {@link #core/CameraSource Core/CameraSource},
 * {@link #core/CameraSource Core/FlashSource},
 * {@link #core/CameraSource Core/GameSource},
 * {@link #core/GameSource Core/HtmlSource},
 * {@link #core/CameraSource Core/ImageSource},
 * {@link #core/GameSource Core/MediaSource}, and
 * {@link #core/HtmlSource Core/ScreenSource}.)
 *
 * For scene transitions, you can also use custom stinger transitions,
 * which are exposed through the static method Transition.getSceneTransitions
 */
var Transition = (function () {
    function Transition(key, setValue) {
        if (setValue === void 0) { setValue = null; }
        var value = Transition._transitionMap[key];
        if (typeof value !== 'undefined') {
            this._key = key; // retain key so that NONE is readable
            this._value = value;
        }
        else if (key.substring(0, 8) === 'stinger:') {
            if (typeof setValue !== 'undefined' && setValue !== null) {
                this._key = setValue;
            }
            else {
                var fileName = key.split(',')[0].split('\\').pop().split('/').pop();
                var m = fileName.lastIndexOf('.webm');
                if (m >= 0 && m + fileName.length >= fileName.length) {
                    fileName = fileName.substring(0, m);
                }
                var n = fileName.lastIndexOf('_');
                if (n >= 0 && n + fileName.length >= fileName.length) {
                    fileName = fileName.substring(0, n) + ': ' +
                        fileName.substring(n + 1) + 'ms';
                }
                this._key = fileName;
            }
            this._value = key;
        }
        else {
            this._key = key; // retain key so that NONE is readable
            this._value = key.toLowerCase();
        }
    }
    /**
     * Converts this transition object to the underlying string representation to be read by XSplit Broadcaster.
     */
    Transition.prototype.toString = function () {
        return this._value;
    };
    /**
     * Converts this transition object to a easily identifiable string such as 'NONE'.
     */
    Transition.prototype.toTransitionKey = function () {
        return this._key;
    };
    /**
     * return: Promise<Transition[]>
     *
     * Get all available transitions for use in scene change
     *
     * ** MINIMUM XBC REQUIREMENT **
     * requires XBC v.2.7.1602.0502 and above
     *
     * #### Usage
     *
     * ```javascript
     * Transtition.getSceneTransitions().then(function(transitions) {
     *   for (var i = 0; i < transitions.length; i++) {
     *     transitions.toString(); // Returns the value of the transition
     *     transitions.toTransitionKey(); // Returns the key of the transition
     *   }
     * })
     * ```
     */
    Transition.getSceneTransitions = function () {
        return new Promise(function (resolve) {
            var transitions = [];
            var transitionString = app_1.App.getGlobalProperty('transitions');
            try {
                if (transitionString !== '') {
                    var transitionArray = JSON.parse(transitionString);
                    for (var i = transitionArray.length - 1; i >= 0; i--) {
                        var transitionObject = transitionArray[i];
                        if (transitionObject.hasOwnProperty('Id') &&
                            transitionObject.hasOwnProperty('Name')) {
                            transitions.push(new Transition(transitionObject['Id'], transitionObject['Name']));
                        }
                    }
                    resolve(transitions);
                }
                else {
                    resolve(transitions);
                }
            }
            catch (e) {
                throw new Error('Error retrieving available transitions');
            }
        });
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
},{"../internal/app":27}],27:[function(require,module,exports){
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
                resolve(Number(ret) < 0 ? false : true);
            });
        });
    };
    /** Gets the value of the given property as list */
    App.getAsList = function (name) {
        return new Promise(function (resolve, reject) {
            App.get(name).then(function (xml) {
                try {
                    var propsJSON = json_1.JSON.parse(xml), propsArr = [];
                    if (propsJSON.children && propsJSON.children.length > 0) {
                        propsArr = propsJSON.children;
                    }
                    resolve(propsArr);
                }
                catch (e) {
                    reject(e);
                }
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
},{"./internal":30,"./util/json":32}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var environment_1 = require('../core/environment');
var item_1 = require('./item');
var internal_1 = require('./internal');
var global_1 = require('./global');
var config_1 = require('../window/config');
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
        if (environment_1.Environment.isSourcePlugin()) {
            var configObj = {};
            // initialize config URL if necessary
            var promise = new Promise(function (resolveInner) {
                internal_1.exec('GetLocalPropertyAsync', 'prop:BrowserConfiguration', function (result) {
                    resolveInner(result);
                });
            });
            promise.then(function (browserConfig) {
                try {
                    if (browserConfig === '' || browserConfig === 'null') {
                        browserConfig = internal_1.exec('GetConfiguration');
                    }
                    configObj = JSON.parse(browserConfig);
                }
                catch (e) {
                }
                finally {
                    var metas = document.getElementsByTagName('meta');
                    for (var i = metas.length - 1; i >= 0; i--) {
                        if (metas[i].name === 'xsplit:config-url') {
                            var url = resolveRelativePath(metas[i].content, window.location.href);
                            configObj['configUrl'] = url;
                            var persist = {
                                configUrl: url
                            };
                            global_1.Global.setPersistentConfig(persist);
                            break;
                        }
                    }
                    internal_1.exec('SetBrowserProperty', 'Configuration', JSON.stringify(configObj));
                    resolve();
                }
            });
        }
        else {
            resolve();
        }
    });
}
function getCurrentSourceId() {
    return new Promise(function (resolve) {
        if (environment_1.Environment.isSourcePlugin() || environment_1.Environment.isSourceConfig()) {
            // initialize Item.getSource() functions
            internal_1.exec('GetLocalPropertyAsync', 'prop:id', function (result) {
                var id = result;
                item_1.Item.setBaseId(id);
                if (environment_1.Environment.isSourcePlugin() || environment_1.Environment.isSourceConfig()) {
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
function informWhenConfigLoaded() {
    return new Promise(function (resolve) {
        if (environment_1.Environment.isSourceConfig()) {
            window.addEventListener('load', function () {
                config_1.SourcePropsWindow.getInstance().emit('config-load');
                resolve();
            });
        }
        else {
            resolve(); // other environments don't care if config iframe has loaded
        }
    });
}
function init() {
    global_1.Global.addInitializationPromise(readMetaConfigUrl());
    global_1.Global.addInitializationPromise(getCurrentSourceId());
    global_1.Global.addInitializationPromise(informWhenConfigLoaded());
    Promise.all(global_1.Global.getInitializationPromises()).then(function () {
        document.dispatchEvent(new CustomEvent('xsplit-js-ready', {
            bubbles: true
        }));
    });
}
init();
},{"../core/environment":4,"../window/config":49,"./global":28,"./internal":30,"./item":31}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
            if (!environment_1.Environment.isSourcePlugin()) {
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
    Item.get = function (name, id) {
        return new Promise(function (resolve) {
            var slot = Item.attach(id);
            internal_1.exec('GetLocalPropertyAsync' +
                (String(slot) === '0' ? '' : slot + 1), name, function (val) {
                resolve(val);
            });
        });
    };
    /** Sets an item's local property */
    Item.set = function (name, value, id) {
        return new Promise(function (resolve) {
            var slot = Item.attach(id);
            internal_1.exec('SetLocalPropertyAsync' +
                (String(slot) === '0' ? '' : slot + 1), name, value, function (val) {
                resolve(!(Number(val) < 0));
            });
        });
    };
    /** helper function to get current source on init */
    Item.setBaseId = function (id) {
        Item.baseID = id;
    };
    /** helper function for Source.getCurrentSource() */
    Item.getBaseId = function () {
        return Item.baseID;
    };
    Item.MAX_SLOTS = 2;
    Item.lastSlot = Item.MAX_SLOTS - 1;
    Item.itemSlotMap = [];
    Item.islockedSourceSlot = false;
    return Item;
})();
exports.Item = Item;
},{"../core/environment":4,"./internal":30}],32:[function(require,module,exports){
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
},{"./xml":34}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
/**
 * The AudioDevice Class is the object returned by
 * {@link #system/System System Class'} getAudioDevices method. It provides you
 * with methods to fetch the audio device object's attributes, and also provides
 * methods to convert it back to an XML object that is compatible with XBC.
 *
 * If you are looking to add a microphone device to the stage, please see
 * {@link #system/MicrophoneDevice System/MicrophoneDevice} instead.
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
     * var audioDeviceID = device.getId();
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
     *   //where possible values are 'render' or 'capture'
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
     * audioDevice._setLevel(100);
     * ```
     */
    AudioDevice.prototype._setLevel = function (level) {
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
     * audioDevice._setEnabled(true);
     * ```
     */
    AudioDevice.prototype._setEnabled = function (enabled) {
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
     * audioDevice._setSystemLevel(100);
     * ```
     */
    AudioDevice.prototype._setSystemLevel = function (hwlevel) {
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
     * audioDevice._setSystemEnabled(AudioDevice.SYSTEM_LEVEL_MUTE);
     * ```
     */
    AudioDevice.prototype._setSystemEnabled = function (hwenabled) {
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
     * audioDevice._setDelay(100);
     * ```
     */
    AudioDevice.prototype._setDelay = function (delay) {
        this._delay = delay;
        return this;
    };
    /**
     * return: string
     *
     * Converts the AudioDevice object to XML-formatted string
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
        device['level'] = (this.getLevel() / 100).toFixed(6);
        device['enable'] = this.isEnabled() ? 1 : 0;
        device['hwlevel'] = (this.getSystemLevel() / 100).toFixed(6);
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
        audio._setLevel(Number(deviceJXON['level'] !== undefined ? deviceJXON['level'] * 100 : 100))
            ._setEnabled(deviceJXON['enable'] !== undefined ? deviceJXON['enable'] === '1' : true)
            ._setSystemLevel(Number(deviceJXON['hwlevel'] !== undefined ? deviceJXON['hwlevel'] * 100 : -100))
            ._setSystemEnabled(Number(deviceJXON['hwenable'] !== undefined ? deviceJXON['hwenable'] : 255))
            ._setDelay(Number(deviceJXON['delay'] !== undefined ? deviceJXON['delay'] : 0));
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
},{"../internal/util/json":32,"../internal/util/xml":34}],36:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var app_1 = require('../internal/app');
/**
 * The CameraDevice Class is the object returned by
 * {@link #system/System System Class'} getCameraDevices method. It provides
 * you with methods to fetch the Camera Device's id, name, and to add it as
 * a source in the current scene.
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
     * var cameraID = device.getId();
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
     * param: (deviceJSON: JXON)
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
    /**
     *  Adds this camera device to the current scene.
     */
    CameraDevice.prototype.addToScene = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.callFunc('addcamera', 'dev:' + _this._id).then(function () {
                resolve(true);
            });
        });
    };
    return CameraDevice;
})();
exports.CameraDevice = CameraDevice;
},{"../internal/app":27,"../internal/util/json":32,"../internal/util/xml":34}],37:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
/**
 *  Class for adding files (such as images and media)
 *  from your file system to the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var File = XJS.File;
 *
 * var filePromise = new File('C:\\Users\\Public\\Music\\song.mp3').addToScene();
 * ```
 */
var File = (function () {
    /**
     *  param: (file: string)
     *
     *  Creates a File object pertaining to a file's full path.
     */
    function File(file) {
        this._path = file;
    }
    /**
     *  return: Promise<boolean>
     *
     *  Adds this file to the current scene.
     */
    File.prototype.addToScene = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.callFunc('addfile', _this._path).then(function () {
                resolve(true);
            });
        });
    };
    return File;
})();
exports.File = File;
},{"../internal/app":27}],38:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var rectangle_1 = require('../util/rectangle');
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var app_1 = require('../internal/app');
/**
 * The Game Class is the object returned by {@link #system/System System Class'}
 * getGames method. It provides you with methods to fetch the game object's
 * attributes, as well as methods to add any game to the current scene.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 * var xml;
 *
 * System.getGames().then(function(games) {
 *  for (var i in games) {
 *    if(games[i].isFullscreen()) {
 *      games[i].addToScene();
 *    }
 *  }
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
     * Gets the game resolution in pixels.
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
     * return: number
     *
     * Get the FPS Render of the game
     */
    Game.prototype.getFpsRender = function () {
        return this._fpsRender;
    };
    /**
     * return: number
     *
     * Get the Captured FPS of the game
     */
    Game.prototype.getFpsCapture = function () {
        return this._fpsCapture;
    };
    /**
     * return: string
     *
     * Get the image name of the game
     */
    Game.prototype.getImageName = function () {
        return this._imagename;
    };
    /**
     * return: string
     *
     * Get the replace image value of the game
     */
    Game.prototype.getReplace = function () {
        return this._replace;
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
        g._fpsRender = jxon['fpsRender'] !== undefined ? Number(jxon['fpsRender']) :
            undefined;
        g._fpsCapture = jxon['fpsCapture'] !== undefined ?
            Number(jxon['fpsCapture']) : undefined;
        g._imagename = jxon['imagename'];
        g._replace = jxon['replace'];
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
    /**
     *  Adds this game to the current scene.
     */
    Game.prototype.addToScene = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.callFunc('addgamesource', 'dev:' + _this.toXML()).then(function () {
                resolve(true);
            });
        });
    };
    /**
     *  return: Game
     *
     *  Returns a special Game object that may be added to the stage. This
     *  object automatically detects any compatible games that are running
     *  and focused, and changes the displayed game on the stage accordingly.
     *
     *  #### Usage
     *
     * ```javascript
     * var xjs = require('xjs');
     * xjs.Game.autoDetect().addToScene();
     * ```
     */
    Game.autoDetect = function () {
        if (Game._autoDetect === undefined) {
            Game._autoDetect = new Game();
            var ad = Game._autoDetect;
            ad._pid = 0;
            ad._handle = 0;
            ad._hwnd = 0;
            ad._gapitype = "";
            ad._width = 0;
            ad._height = 0;
            ad._flags = 0;
            ad._wndname = "";
            ad._lastframets = 0;
            ad._fpsRender = 0;
            ad._fpsCapture = 0;
            ad._imagename = "";
            Game._autoDetect.addToScene = function () {
                return new Promise(function (resolve) {
                    var adstring = '<item GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt; " name="Game: Auto Detect"  type="7" pos_left="0" pos_top="0" pos_right="0.5" pos_bottom="0.5"/>';
                    app_1.App.callFunc('additem', adstring).then(function () {
                        resolve(true);
                    });
                });
            };
        }
        return Game._autoDetect;
    };
    return Game;
})();
exports.Game = Game;
},{"../internal/app":27,"../internal/util/json":32,"../internal/util/xml":34,"../util/rectangle":48}],39:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var app_1 = require('../internal/app');
/**
 * The MicrophoneDevice class provides you with methods to add a microphone
 * device as a source on the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getMicrophones().then(function(microphones) {
 *  for (var i in microphones) {
 *    microphones[i].addToScene();
 *  }
 * });
 * ```
 */
var MicrophoneDevice = (function () {
    function MicrophoneDevice() {
    }
    MicrophoneDevice.parse = function (jxon) {
        var m = new MicrophoneDevice();
        m._disp = jxon['disp'];
        m._name = jxon['name'];
        return m;
    };
    /**
     * return: string
     *
     * Gets the display ID
     *
     * #### Usage
     *
     * ```javascript
     * var micDisplayId = device.getDisplayId();
     * ```
     */
    MicrophoneDevice.prototype.getDisplayId = function () {
        return this._disp;
    };
    /**
     * return: XML
     *
     * Converts Microphone object into an XML object
     *
     * #### Usage
     *
     * ```javascript
     * var microphoneXML = microphone.toXML();
     * ```
     */
    MicrophoneDevice.prototype.toXML = function () {
        var microphone = new json_1.JSON();
        microphone.tag = 'item';
        microphone['item'] = this._disp;
        microphone['name'] = this._name;
        microphone['type'] = '2'; // type LIVE
        microphone['selfclosing'] = true;
        return xml_1.XML.parseJSON(microphone);
    };
    /**
     *  Adds this microphone device to the current scene.
     */
    MicrophoneDevice.prototype.addToScene = function () {
        var _this = this;
        return new Promise(function (resolve) {
            app_1.App.callFunc('additem', _this.toXML().toString()).then(function () {
                resolve(true);
            });
        });
    };
    return MicrophoneDevice;
})();
exports.MicrophoneDevice = MicrophoneDevice;
},{"../internal/app":27,"../internal/util/json":32,"../internal/util/xml":34}],40:[function(require,module,exports){
var internal_1 = require('../internal/internal');
/**
 *  This class servers to allow developers to add new screen regions or window
 *  regions to the stage in XSplit Broadcaster.
 */
var Screen = (function () {
    function Screen() {
    }
    /**
     * Initializes the screen region selector crosshair so user may select
     * a desktop region or a window to add to the stage in the current scene.
     */
    Screen.prototype.addToScene = function () {
        return new Promise(function (resolve) {
            internal_1.exec('AppCallFunc', 'addscreen');
            resolve(true);
        });
    };
    return Screen;
})();
exports.Screen = Screen;
},{"../internal/internal":30}],41:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
var audio_1 = require('./audio');
var microphone_1 = require('./microphone');
var camera_1 = require('./camera');
var game_1 = require('./game');
var environment_1 = require('../core/environment');
var internal_1 = require('../internal/internal');
/**
 * This enum is used for {@link #system/System System Class'} getAudioDevices
 * method's first parameter.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * XJS.System.getAudioDevices(XJS.AudioDeviceDataflow.CAPTURE, ...);
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
 * var XJS = require('xjs');
 * XJS.System.getAudioDevices(..., XJS.AudioDeviceState.ACTIVE);
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
 * The System class provides you methods to fetch audio devices to manipulate
 * the application's audio settings. It also allows you to fetch games,
 * microphone devices and camera devices to add to scenes. Finally, some
 * system-level functionality such as cursor position is exposed.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var System = XJS.System;
 *
 * System.getCameraDevices().then(function(cameras) {
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
     * See also: {@link #system/AudioDevice System/AudioDevice}
     *
     * #### Usage
     *
     * ```javascript
     * System.getAudioDevices(
     *   XML.AudioDeviceDataflow.ALL,
     *   XML.AudioDeviceState.ACTIVE
     * ).then(function(devices) {
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
     * See also: {@link #system/CameraDevice System/CameraDevice}
     *
     * #### Usage
     *
     * ```javascript
     * System.getCameraDevices().then(function(devices) {
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
                                ('@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\' +
                                    '{778abfb2-e87b-48a2-8d33-675150fcf8a2}').toLowerCase()) {
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
     * Gets all currently running games
     * See also: {@link #system/Game System/Game}
     *
     * #### Usage
     *
     * ```javascript
     * System.getGames().then(function(games) {
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
    /**
     * return: Promise<MicrophoneDevice[]>
     *
     * Gets all audio capture devices that may be added to the stage
     * See also: {@link #system/MicrophoneDevice System/MicrophoneDevice}
     *
     * #### Usage
     *
     * ```javascript
     * System.getMicrophones().then(function(microphones) {
     *   microphones[0].addToScene(); // add first microphone to stage
     * });
     * ```
     */
    System.getMicrophones = function () {
        return new Promise(function (resolve) {
            app_1.App.getAsList('dshowenum:asrc').then(function (micsJXON) {
                var mics = [];
                if (micsJXON !== undefined) {
                    var micsJXONLength = micsJXON.length;
                    for (var i = 0; i < micsJXONLength; ++i) {
                        if (micsJXON[i]['WaveInId'] !== undefined) {
                            mics.push(microphone_1.MicrophoneDevice.parse(micsJXON[i]));
                        }
                    }
                }
                resolve(mics);
            });
        });
    };
    /**
     * return: Promise<string[]>
     *
     * Gets array of system-installed fonts
     *
     * #### Usage
     *
     * ```javascript
     * var mySelect = document.getElementById("mySelect");
     *
     * System.getSystemFonts().then(function(fontsArray) {
     *   var fontsArrayLength = fontsArray.length;
     *   for (var i = 0; i < fontsArrayLength; ++i) {
     *     var option = document.createElement('option');
     *     option.text = 'Kiwi';
     *     mySelect.add(option);
     *   }
     * });
     * ```
     */
    System.getFonts = function () {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('function is not available for source'));
            }
            else {
                app_1.App.get('html:fontlist').then(function (fontlist) {
                    if (typeof fontlist === 'string' && fontlist !== '') {
                        var fontArray = fontlist.split(',');
                        resolve(fontArray);
                    }
                    else {
                        reject(Error('cannot fetch list of available system fonts'));
                    }
                });
            }
        });
    };
    /**
     * return: Promise<JSON>
     *
     * Gets the position of the cursor. Does not work on Source Plugins.
     *
     * #### Usage
     *
     * ```javascript
     * System.getCursorPosition().then(function(pos) {
     *   var x = pos.x; // X Axis
     *   var y = pos.y; // Y Axis
     * });
     * ```
     */
    System.getCursorPosition = function () {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('function is not available for source'));
            }
            else {
                var res = internal_1.exec('GetCursorPos');
                if (typeof res === 'string') {
                    var posArr = res.split(',');
                    var pos = {};
                    pos['x'] = Number(posArr[0]);
                    pos['y'] = Number(posArr[1]);
                    resolve(pos);
                }
                else {
                    reject(Error('cannot fetch current cursor position'));
                }
            }
        });
    };
    /**
     * param: JSON: {x: number, y: number}
     *
     * Sets the position of the cursor. Does not work on Source Plugins.
     *
     * #### Usage
     *
     * ```javascript
     * System.setCursorPosition({x:0, y:0});
     * ```
     */
    System.setCursorPosition = function (pos) {
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('function is not available for source'));
            }
            else if (typeof pos.x !== 'number' || typeof pos.y !== 'number') {
                reject(Error('invalid parameters'));
            }
            else {
                internal_1.exec('SetCursorPos', String(pos.x), String(pos.y));
                resolve(true);
            }
        });
    };
    return System;
})();
exports.System = System;
},{"../core/environment":4,"../internal/app":27,"../internal/internal":30,"./audio":35,"./camera":36,"./game":38,"./microphone":39}],42:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
/**
 *  Class for adding a web source to the stage.
 *  URLs will use http by default unless https
 *  is specified. This class supports adding
 *  locally hosted HTML files as well.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var Url = XJS.Url;
 *
 * var urlPromise = new Url('https://www.xsplit.com').addToScene();
 * ```
 */
var Url = (function () {
    /**
     *  param: (url: string)
     *
     *  Creates a URL object. If unspecified, protocol is http.
     */
    function Url(url) {
        this._url = url;
    }
    Url.prototype._getUrl = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (/^https?:\/\//i.test(_this._url)) {
                resolve(_this._url);
            }
            else if (/[a-z]+:\/\//i.test(_this._url)) {
                reject(new Error('You may only add HTTP or HTTPS URLs to the stage.'));
            }
            else {
                resolve('http://' + _this._url);
            }
        });
    };
    /**
     *  return: Promise<boolean>
     *
     *  Adds this URL to the current scene as an HTML source.
     *
     *  Will raise an error if URL is not http or https.
     */
    Url.prototype.addToScene = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._getUrl().then(function (url) {
                app_1.App.callFunc('addurl', url).then(function () {
                    resolve(true);
                });
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    return Url;
})();
exports.Url = Url;
},{"../internal/app":27}],43:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var app_1 = require('../internal/app');
var json_1 = require('../internal/util/json');
var xml_1 = require('../internal/util/xml');
var io_1 = require('../util/io');
var environment_1 = require('../core/environment');
/**
 *  Special class for adding a video playlist to the stage.
 *
 * ### Basic Usage
 *
 * ```javascript
 * var XJS = require('xjs');
 * var VideoPlaylist = XJS.VideoPlaylist;
 *
 * var vids = new VideoPlaylist(['C:\\Users\\Public\\Music\\video1.mp4',
      'C:\\Users\\Public\\Music\\video2.mp4']).addToScene();
 * ```
 */
var VideoPlaylist = (function () {
    /**
     *  param: (files: string[])
     *
     *  Creates a VideoPlaylist object for several video files.
     */
    function VideoPlaylist(items) {
        this._id = 0;
        this._fileplaylist = '';
        this._playlist = items;
    }
    /**
     * return: XML
     *
     * Creates an XML object with the playlist properties. This method is used
     * internally for the `addToScene` method.
     */
    VideoPlaylist.prototype.toXML = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var filePromises = _this._playlist.map(function (filename) {
                return new Promise(function (ioResolve) {
                    io_1.IO.getVideoDuration(filename).then(function (duration) {
                        ioResolve(duration);
                    }).catch(function (err) {
                        ioResolve(err);
                    });
                });
            });
            Promise.all(filePromises).then(function (duration) {
                var fileItems = new json_1.JSON();
                var isError = false;
                for (var i = 0; i < _this._playlist.length; i++) {
                    if (typeof duration === 'object') {
                        isError = true;
                        break;
                    }
                    _this._fileplaylist += _this._playlist[i] + '*' + i + '*1*' +
                        duration[i] + '*100*0*0*0*0*0|';
                }
                if (!isError) {
                    fileItems.tag = 'item';
                    fileItems['type'] = '1';
                    fileItems['name'] = 'Video Playlist';
                    fileItems['pos_left'] = '0.250000';
                    fileItems['pos_top'] = '0.250000';
                    fileItems['pos_right'] = '0.750000';
                    fileItems['pos_bottom'] = '0.750000';
                    fileItems['item'] = _this._playlist[0] + '*0';
                    fileItems['FilePlaylist'] = _this._fileplaylist;
                    resolve(xml_1.XML.parseJSON(fileItems));
                }
                else {
                    reject(new Error('One or more files included are invalid.'));
                }
            });
        });
    };
    /**
     *  Adds the prepared video playlist to the current scene.
     *
     *  This function is not available to sources.
     */
    VideoPlaylist.prototype.addToScene = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (environment_1.Environment.isSourcePlugin()) {
                reject(Error('This function is not available to sources.'));
            }
            else {
                _this.toXML().then(function (fileitem) {
                    app_1.App.callFunc('additem', ' ' + fileitem)
                        .then(function () { resolve(true); });
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    return VideoPlaylist;
})();
exports.VideoPlaylist = VideoPlaylist;
},{"../core/environment":4,"../internal/app":27,"../internal/util/json":32,"../internal/util/xml":34,"../util/io":46}],44:[function(require,module,exports){
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
        return this._rgb;
    };
    Color.prototype.setRgb = function (rgb) {
        this._rgb = rgb.replace(/^#/, '');
        this._irgb = parseInt(this._rgb, 16);
        this._bgr = [this._rgb.substring(4, 6), this._rgb.substring(2, 4),
            this._rgb.substring(0, 2)].join('');
        this._ibgr = parseInt(this._bgr, 16);
        return this;
    };
    Color.prototype.getBgr = function () {
        return this._bgr;
    };
    Color.prototype.setBgr = function (bgr) {
        this.setRgb([bgr.substring(4, 6), bgr.substring(2, 4),
            bgr.substring(0, 2)
        ].join(''));
        return this;
    };
    Color.prototype.getIrgb = function () {
        return this._irgb;
    };
    Color.prototype.setIrgb = function (irgb) {
        var rgb = irgb.toString(16);
        while (rgb.length < 6) {
            rgb = '0' + rgb;
        }
        this.setRgb(rgb);
        return this;
    };
    Color.prototype.getIbgr = function () {
        return this._ibgr;
    };
    Color.prototype.setIbgr = function (ibgr) {
        var bgr = ibgr.toString(16);
        while (bgr.length < 6) {
            bgr = '0' + bgr;
        }
        this.setBgr(bgr);
        return this;
    };
    return Color;
})();
exports.Color = Color;
},{}],45:[function(require,module,exports){
// simple event emitter
var EventEmitter = (function () {
    function EventEmitter() {
        this._handlers = {};
    }
    /** This function attaches a handler to an event. Duplicate handlers are allowed. */
    EventEmitter.prototype.on = function (event, handler) {
        if (this._handlers[event] === undefined) {
            this._handlers[event] = [];
        }
        this._handlers[event].push(handler);
    };
    /** This function lets an event trigger with any number of supplied parameters. */
    EventEmitter.prototype.emit = function (event) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this._handlers[event] === undefined) {
            return;
        }
        for (var _a = 0, _b = this._handlers[event]; _a < _b.length; _a++) {
            var handler = _b[_a];
            handler.apply(this, params);
        }
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
},{}],46:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var internal_1 = require('../internal/internal');
var IO = (function () {
    function IO() {
    }
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
    IO.getFileContent = function (path) {
        return new Promise(function (resolve) {
            resolve(internal_1.exec('GetFileContent', path));
        });
    };
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
    IO.getWebContent = function (url) {
        return new Promise(function (resolve) {
            internal_1.exec('GetWebContent', url, function (encoded) {
                resolve(encoded);
            });
        });
    };
    /**
     * param: (url: string)
     *
     * Opens a URL in the user's default browser. URL must specify HTTP or HTTPS.
     *
     */
    IO.openUrl = function (url) {
        internal_1.exec('OpenUrl', url);
    };
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
    IO.openFileDialog = function (optionBag, filter) {
        return new Promise(function (resolve, reject) {
            var flags = 0;
            if (optionBag !== undefined && optionBag !== null) {
                if (optionBag.allowMultiSelect === true) {
                    flags = flags | IO._ALLOW_MULTI_SELECT;
                }
                if (optionBag.fileMustExist === true) {
                    flags = flags | IO._FILE_MUST_EXIST;
                }
                if (optionBag.forceShowHidden === true) {
                    flags = flags | IO._FORCE_SHOW_HIDDEN;
                }
            }
            var filterString = '';
            if (filter !== undefined && filter !== null &&
                filter.name !== undefined && filter.extensions !== undefined) {
                filterString = filter.name + '|';
                filterString += (filter.extensions.map(function (val) {
                    return '*.' + val;
                })).join(';');
                filterString += '||';
            }
            internal_1.exec('OpenFileDialogAsync', null, null, String(flags), filterString, function (path) {
                if (path !== 'null') {
                    resolve(path.split('|'));
                }
                else {
                    reject(Error('File selection cancelled.'));
                }
            });
        });
    };
    IO.getVideoDuration = function (file) {
        return new Promise(function (resolve, reject) {
            if (IO._callback[file] === undefined) {
                IO._callback[file] = [];
            }
            IO._callback[file].push({ resolve: resolve, reject: reject });
            internal_1.exec('GetVideoDuration', file);
        });
    };
    ;
    IO._ALLOW_MULTI_SELECT = 0x200;
    IO._FILE_MUST_EXIST = 0x1000;
    IO._FORCE_SHOW_HIDDEN = 0x10000000;
    /**
     * param: (file: string)
     *
     * return: Promise<number>
     *
     * Returns the duration of a video file on the local system, specified in
     * units of 10^-7 seconds.
     */
    IO._callback = {};
    return IO;
})();
exports.IO = IO;
window.OnGetVideoDuration = function (file, duration) {
    IO._callback[decodeURIComponent(file)].shift().resolve(duration);
    if (IO._callback[decodeURIComponent(file)].length === 0) {
        delete IO._callback[decodeURIComponent(file)];
    }
};
window.OnGetVideoDurationFailed = function (file) {
    IO._callback[decodeURIComponent(file)].shift().reject(Error('Invalid file path.'));
    if (IO._callback[decodeURIComponent(file)].length === 0) {
        delete IO._callback[decodeURIComponent(file)];
    }
};
},{"../internal/internal":30}],47:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var isReady = false;
var readyPromise = new Promise(function (resolve) {
    document.addEventListener('xsplit-js-ready', function () {
        resolve();
    });
    if (isReady) {
        resolve();
    }
});
function ready() {
    return readyPromise;
}
exports.ready = ready;
function setReady() {
    isReady = true;
}
exports.setReady = setReady;
},{}],48:[function(require,module,exports){
/**
 *  The Rectangle class is a utility class used in many different parts of the
 *  framework. Please note that there are cases where the framework uses
 *  absolute (pixel) measurements, and cases where relative measurements are
 *  required (0 being the left/top edges and 1 being the right/bottom edges.)
 *
 *  Please check the documentation of each function to determine the necessary
 *  parameters for the Rectangle to be created.
 */
var Rectangle = (function () {
    function Rectangle() {
    }
    /** Gets the top value */
    Rectangle.prototype.getTop = function () {
        return this._top;
    };
    /** Sets the top value */
    Rectangle.prototype.setTop = function (top) {
        this._top = top;
        if (this._bottom !== undefined &&
            this._height !== (this._top - this._bottom)) {
            this.setHeight(Math.abs(this._top - this._bottom));
        }
        else if (this._height !== undefined &&
            this._bottom !== (this._top + this._height)) {
            this.setBottom(this._top + this._height);
        }
        return this;
    };
    /** Gets the left value */
    Rectangle.prototype.getLeft = function () {
        return this._left;
    };
    /** Sets the left value */
    Rectangle.prototype.setLeft = function (left) {
        this._left = left;
        if (this._right !== undefined &&
            this._width !== Math.abs(this._right - this._left)) {
            this.setWidth(Math.abs(this._right - this._left));
        }
        else if (this._width !== undefined &&
            this._height !== (this._left + this._width)) {
            this.setRight(this._left + this._width);
        }
        return this;
    };
    /** Gets the right value */
    Rectangle.prototype.getRight = function () {
        return this._right;
    };
    /** Sets the right value */
    Rectangle.prototype.setRight = function (right) {
        this._right = right;
        if (this._left !== undefined &&
            this._width !== Math.abs(this._right - this._left)) {
            this.setWidth(Math.abs(this._right - this._left));
        }
        else if (this._width !== undefined &&
            this._left !== (this._right - this._width)) {
            this.setLeft(this._right - this._width);
        }
        return this;
    };
    /** Gets the bottom value */
    Rectangle.prototype.getBottom = function () {
        return this._bottom;
    };
    /** Sets the bottom value */
    Rectangle.prototype.setBottom = function (bottom) {
        this._bottom = bottom;
        if (this._top !== undefined &&
            this._height !== Math.abs(this._top - this._bottom)) {
            this.setHeight(Math.abs(this._top - this._bottom));
        }
        else if (this._height !== undefined &&
            this._top !== (this._bottom - this._height)) {
            this.setTop(this._bottom - this._height);
        }
        return this;
    };
    /** Gets the width value */
    Rectangle.prototype.getWidth = function () {
        return this._width;
    };
    /** Sets the width value */
    Rectangle.prototype.setWidth = function (width) {
        this._width = width;
        if (this._right !== undefined &&
            this._left !== (this._right - this._width)) {
            this.setLeft(this._right - this._width);
        }
        else if (this._left !== undefined &&
            this._right !== (this._left + this._width)) {
            this.setRight(this._left + this._width);
        }
        return this;
    };
    /** Gets the height value */
    Rectangle.prototype.getHeight = function () {
        return this._height;
    };
    /** Sets the height value */
    Rectangle.prototype.setHeight = function (height) {
        this._height = height;
        if (this._top !== undefined &&
            this._bottom !== (this._top + this._height)) {
            this.setBottom(this._top + this._height);
        }
        else if (this._bottom !== undefined &&
            this._top !== (this._bottom - this._height)) {
            this.setTop(this._bottom - this._height);
        }
        return this;
    };
    /**
     *  param: (width: number, height: number)
     *  ```
     *  return: Rectangle
     *  ```
     *  Creates a rectangle from width and height dimensions. Absolute (pixels)
     *  and relative (0-1) dimensions are accepted. Refer to the documentation
     *  of each individual function to see which one is necessary.
     */
    Rectangle.fromDimensions = function (width, height) {
        if (width < 0 || height < 0) {
            throw new Error('Rectangle dimensions cannot be negative.');
        }
        var rect = new Rectangle();
        rect._width = width;
        rect._height = height;
        return rect;
    };
    /**
     *  param: (left: number, top: number, right: number, bottom: number)
     *  ```
     *  return: Rectangle
     *  ```
     *  Creates a rectangle from coordinates. Absolute (pixels)
     *  and relative (0-1) dimensions are accepted. Refer to the documentation
     *  of each individual function to see which one is necessary.
     */
    Rectangle.fromCoordinates = function (left, top, right, bottom) {
        if (top > bottom) {
            throw new Error('Top coordinate must be smaller than bottom.');
        }
        else if (left > right) {
            throw new Error('Right coordinate must be smaller than left.');
        }
        var rect = new Rectangle();
        rect._top = top;
        rect._left = left;
        rect.setRight(right); // calculates width
        rect.setBottom(bottom); // calculates height
        return rect;
    };
    /**
     *  return: string
     *
     *  Returns a comma-separated string containing the width and height values.
     */
    Rectangle.prototype.toDimensionString = function () {
        return this._width + ',' + this._height;
    };
    /**
     *  return: string
     *
     *  Returns a comma-separated string containing the coordinates in the order:
     *  left, top, right, bottom.
     */
    Rectangle.prototype.toCoordinateString = function () {
        if (this._left === undefined) {
            throw new Error('This Rectangle instance does not have coordinates.');
        }
        else {
            return this._left + ',' + this._top + ',' + this._right + ',' + this._bottom;
        }
    };
    /**
     *  return: string
     *  ```
     *  param: (format ?: string)
     *  ```
     *  Returns a string representation of the Rectangle object. If the format
     *  optional parameter is omitted, then this is simply the string from
     *  `toDimensionString()`. Sample usage:
     *
     *  ```javascript
     *  console.log(rect.toString('Origin is at (:left, :top)'));```
     *
     *  You can format the output string by specifying the following markers in
     *  the parameter:
     *  - :left
     *  - :top
     *  - :right
     *  - :bottom
     *  - :width
     *  - :height
     */
    Rectangle.prototype.toString = function (value) {
        if (value === undefined) {
            return this.toDimensionString(); // all rectangles have dimensions
        }
        else {
            var format = value;
            format = format.replace(':left', String(this._left));
            format = format.replace(':top', String(this._top));
            format = format.replace(':right', String(this._right));
            format = format.replace(':bottom', String(this._bottom));
            format = format.replace(':width', String(this._width));
            format = format.replace(':height', String(this._height));
            return format;
        }
    };
    return Rectangle;
})();
exports.Rectangle = Rectangle;
},{}],49:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var eventemitter_1 = require('../util/eventemitter');
var internal_1 = require('../internal/internal');
/** This utility class exposes functionality for source plugin developers to
 *  handle the properties window for their source plugins. The framework also
 *  uses this class for its own internal purposes.
 *
 *  Developers can use this class to specify how their configuration HTML
 *  should be rendered within the built-in window in XSplit Broadcaster.
 *  This class also serves as an event emitter for specific important events.
 *
 * Inherits from: {@link #util/EventEmitter Util/EventEmitter}
 *
 *  At the moment, the only relevant event for developers is:
 *    - `set-selected-tab`: used when using Tabbed mode. Passes the name of the selected tab so properties window can update itself accordingly.
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 */
var SourcePropsWindow = (function (_super) {
    __extends(SourcePropsWindow, _super);
    /**
     *  Use getInstance() instead.
     */
    function SourcePropsWindow() {
        var _this = this;
        _super.call(this);
        window.addEventListener('message', function (event) {
            try {
                var data = JSON.parse(event.data);
            }
            catch (e) {
                // syntax error probably happened, exit gracefully
                return;
            }
            switch (data.event) {
                // currently, restrict messages to selected set
                case 'set-selected-tab':
                    this.emit(data.event, data.value);
                    break;
                case 'async-callback':
                    this.emit(data.event, {
                        asyncId: data.value.asyncId,
                        result: data.value.result
                    });
                    break;
            }
        }.bind(this));
        this.on('config-load', function () {
            _this._informConfigLoaded();
        });
        SourcePropsWindow._instance = this;
    }
    /**
     *  Gets the instance of the window utility. Use this instead of the constructor.
     */
    SourcePropsWindow.getInstance = function () {
        if (SourcePropsWindow._instance === undefined) {
            SourcePropsWindow._instance = new SourcePropsWindow();
        }
        return SourcePropsWindow._instance;
    };
    // helper function to communicate with built-in container
    SourcePropsWindow.prototype._notify = function (obj) {
        window.parent.postMessage(JSON.stringify(obj), '*');
    };
    /**
     *  Informs the application that the plugin intends to use the entire window for rendering its configuration.
     */
    SourcePropsWindow.prototype.useFullWindow = function () {
        this._setRenderMode(SourcePropsWindow._MODE_FULL);
        // use default size to avoid layout issues. plugin can resize later
        this.resize(354, 390);
    };
    /**
     *  param: ({customTabs: string[], tabOrder: string[]})
     *
     *  Informs the application that the plugin intends to use the existing tab
     *  system to render its properties window.
     *
     *  The `customTabs` node should contain a list of tab titles that the plugin
     *  will create for itself.
     *
     *  The `tabOrder` node contains the desired order of tabs. This list comes
     *  from the specified custom tabs, and the set of reusable XSplit tabs:
     *  'Color', 'Layout' and 'Transition'.
     */
    SourcePropsWindow.prototype.useTabbedWindow = function (config) {
        this._setRenderMode(SourcePropsWindow._MODE_TABBED);
        this._declareCustomTabs(config.customTabs);
        this._setTabOrder(config.tabOrder);
    };
    SourcePropsWindow.prototype._setRenderMode = function (renderMode) {
        this._mode = renderMode;
        this._notify({
            event: 'set-mode',
            value: renderMode
        });
    };
    ;
    SourcePropsWindow.prototype._setTabOrder = function (tabArray) {
        this._notify({
            event: 'set-tab-order',
            value: JSON.stringify(tabArray)
        });
    };
    ;
    SourcePropsWindow.prototype._declareCustomTabs = function (tabArray) {
        this._notify({
            event: 'set-custom-tabs',
            value: JSON.stringify(tabArray)
        });
    };
    ;
    SourcePropsWindow.prototype._informConfigLoaded = function () {
        this._notify({ event: 'load' });
    };
    /**
     *  param: width<number>, height<number>
     *
     *  Resizes the properties window. Currently only works when using full
     *  window mode.
     */
    SourcePropsWindow.prototype.resize = function (width, height) {
        this._notify({
            event: 'resize',
            value: JSON.stringify({
                width: width,
                height: height
            })
        });
    };
    ;
    /**
     *  param: name<string>
     *
     *  Changes the title of the source properties dialog.
     *  Note: The title change is temporary, as re-opening the source properties
     *  resets the title to the display name of the source
     *  (custom name takes precedence over name)
     */
    SourcePropsWindow.prototype.requestDialogTitleChange = function (name) {
        this._notify({
            event: 'change-dialog-title',
            value: name
        });
    };
    ;
    /** Closes the properties window. */
    SourcePropsWindow.prototype.close = function () {
        internal_1.exec('Close');
    };
    ;
    SourcePropsWindow._MODE_FULL = 'full';
    SourcePropsWindow._MODE_TABBED = 'embedded';
    return SourcePropsWindow;
})(eventemitter_1.EventEmitter);
exports.SourcePropsWindow = SourcePropsWindow;
},{"../internal/internal":30,"../util/eventemitter":45}],50:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
/// <reference path="../../defs/object.d.ts" />
var rectangle_1 = require('../util/rectangle');
var environment_1 = require('../core/environment');
var internal_1 = require('../internal/internal');
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
 *      .show()
 *      .getResult().then(function(result) {
 *        document.getElementById('input').value = result;
 *      });
 *    });
 *  });
 *
 *  // in the opened dialog, call Dialog.return() to return a value
 *  //
 *  // see documentation below for more details
 *  ```
 */
var Dialog = (function () {
    function Dialog() {
        var _this = this;
        if (environment_1.Environment.isSourcePlugin()) {
            throw new Error('Dialogs are not available for source plugins.');
        }
        else {
            this._result = null;
            var eventListener = function (e) {
                // self-deleting event listener
                e.target.removeEventListener(e.type, eventListener);
                _this._result = e.detail;
                _this._resultListener = null;
            };
            document.addEventListener('xsplit-dialog-result', eventListener);
            this._resultListener = eventListener;
            return this;
        }
    }
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
    Dialog.createDialog = function (url) {
        var dialog = new Dialog();
        dialog._url = url;
        return dialog;
    };
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
    Dialog.createAutoDialog = function (url) {
        if (environment_1.Environment.isSourceConfig()) {
            throw new Error('Auto dialogs are not available for config windows.');
        }
        else {
            var dialog = new Dialog();
            dialog._url = url;
            dialog._autoclose = true;
            return dialog;
        }
    };
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
    Dialog.return = function (result) {
        if (result !== undefined) {
            internal_1.exec('SetDialogResult', result);
        }
        internal_1.exec('Close');
    };
    /**
     *  param: (width: number, height: number)
     *
     *  return: Dialog
     *
     *  Sets the size in pixels of the dialog to be displayed.
     *
     * *Chainable.*
     */
    Dialog.prototype.setSize = function (width, height) {
        if (width === void 0) { width = 300; }
        if (height === void 0) { height = 300; }
        this._size = rectangle_1.Rectangle.fromDimensions(width, height);
        return this;
    };
    /**
     *  param: (title: string)
     *
     *  return: Dialog
     *
     *  Sets the title of the dialog to be displayed.
     *
     * *Chainable.*
     */
    Dialog.prototype.setTitle = function (title) {
        if (this._autoclose) {
            throw new Error('Autoclosing dialogs cannot use this method.');
        }
        this._title = title;
        return this;
    };
    /**
     *  param: (showBorder: boolean, resizable: boolean)
     *
     *  return: Dialog
     *
     *  Specifies the border and resizable flags for the dialog to be displayed.
     *
     * *Chainable.*
     */
    Dialog.prototype.setBorderOptions = function (showBorder, resizable) {
        if (showBorder === void 0) { showBorder = false; }
        if (resizable === void 0) { resizable = false; }
        if (this._autoclose) {
            throw new Error('Autoclosing dialogs cannot use this method.');
        }
        this._showBorder = showBorder;
        this._resizable = resizable;
        return this;
    };
    /**
     *  param: (isMinimizeActive: boolean, isMaximizeActive: boolean)
     *
     *  return: Dialog
     *
     *  Specifies if the window buttons (minimize and maximize) should be active.
     *
     * *Chainable.*
     */
    Dialog.prototype.setButtons = function (isMinimizeActive, isMaximizeActive) {
        if (isMinimizeActive === void 0) { isMinimizeActive = false; }
        if (isMaximizeActive === void 0) { isMaximizeActive = false; }
        if (this._autoclose) {
            throw new Error('Autoclosing dialogs cannot use this method.');
        }
        this._minimize = isMinimizeActive;
        this._maximize = isMaximizeActive;
        return this;
    };
    /**
     *  return: Dialog
     *
     *  After configuring the dialog, call this function to spawn it.
     *
     * *Chainable.*
     */
    Dialog.prototype.show = function () {
        this._result = null;
        if (this._autoclose) {
            internal_1.exec('NewAutoDialog', this._url, '', this._size === undefined ?
                undefined : (this._size.getWidth() + ',' + this._size.getHeight()));
        }
        else {
            internal_1.exec('NewDialog', this._url, '', this._size === undefined ?
                undefined : (this._size.getWidth() + ',' + this._size.getHeight()), this._calculateFlags(), this._title);
        }
        return this;
    };
    /**
     *  return: Promise<string>
     *
     *  Gets the string result returned from the spawned dialog.
     */
    Dialog.prototype.getResult = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this._result !== null) {
                resolve(_this._result);
            }
            else if (_this._resultListener === null) {
                var eventListener = function (e) {
                    // self-deleting event listener
                    e.target.removeEventListener(e.type, eventListener);
                    _this._result = e.detail;
                    _this._resultListener = null;
                    resolve(_this._result);
                };
                document.addEventListener('xsplit-dialog-result', eventListener);
                _this._resultListener = eventListener;
            }
            else {
                Object.observe(_this, function (changes) {
                    // Search for changes with the name as result
                    var change = changes.filter(function (elem) {
                        return elem.name === '_result';
                    });
                    if (change !== undefined && change.length > 0) {
                        resolve(change[0].object._result);
                    }
                });
            }
        });
    };
    /**
     *  Closes the dialog that this window spawned.
     */
    Dialog.prototype.close = function () {
        internal_1.exec('CloseDialog');
    };
    Dialog.prototype._calculateFlags = function () {
        var flags = 0;
        if (this._showBorder) {
            flags += 1;
        }
        if (this._resizable) {
            flags += 4;
        }
        if (this._minimize) {
            flags += 8;
        }
        if (this._maximize) {
            flags += 16;
        }
        if (this._title || this._minimize || this._maximize) {
            flags += 2;
        }
        return String(flags);
    };
    return Dialog;
})();
exports.Dialog = Dialog;
if (environment_1.Environment.isSourceConfig() || environment_1.Environment.isExtension()) {
    window.OnDialogResult = function (result) {
        document.dispatchEvent(new CustomEvent('xsplit-dialog-result', {
            detail: result }));
    };
}
},{"../core/environment":4,"../internal/internal":30,"../util/rectangle":48}],51:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var environment_1 = require('../core/environment');
var eventemitter_1 = require('../util/eventemitter');
var internal_1 = require('../internal/internal');
var app_1 = require('../internal/app');
var _RESIZE = '2';
/** This utility class represents the extension window. It allows manipulation
 *  of the window (e.g., resizing), and also serves as an event emitter
 *  for all events that the window should be able to handle.
 *
 *  Currently, the following events are available:
 *    - `scene-load`: notifies in the event of a scene change. Handler is a function f(sceneNumber: number)
 *    - `sources-list-highlight`: notifies when a user hovers over a source in the stage, returning its source id, or when the mouse moves out of a source bounding box, returning null. Source id is also returned when hovering over the bottom panel. Handler is a function f(id: string)
 *    - `sources-list-select`: notifies when a user clicks a source in the stage. Handler is a function f(id: string)
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 *
 */
var ExtensionWindow = (function (_super) {
    __extends(ExtensionWindow, _super);
    /**
     *  Use getInstance() instead.
     */
    function ExtensionWindow() {
        _super.call(this);
        ExtensionWindow._instance = this;
    }
    /**
     *  Gets the instance of the window utility. Use this instead of the constructor.
     */
    ExtensionWindow.getInstance = function () {
        if (ExtensionWindow._instance === undefined) {
            ExtensionWindow._instance = new ExtensionWindow();
        }
        return ExtensionWindow._instance;
    };
    /** param: (width: number, height: number)
     *
     *  Resizes this extension's window.
     */
    ExtensionWindow.prototype.resize = function (width, height) {
        app_1.App.postMessage(_RESIZE, String(width), String(height));
    };
    /**
     * param: (value: string)
     *
     * Renames the extension window.
     */
    ExtensionWindow.prototype.setTitle = function (value) {
        ExtensionWindow._value = value;
        app_1.App.postMessage("8");
    };
    ;
    /**
     * param (flag: number)
     *
     * Modifies this extension's window border.
     *
     * "4" is th e base command on setting border flags.
     *
     * Flags can be:
     *     (bit 0 - enable border)
     *     (bit 1 - enable caption)
     *     (bit 2 - enable sizing)
     *     (bit 3 - enable minimize btn)
     *     (bit 4 - enable maximize btn)
     */
    ExtensionWindow.prototype.setBorder = function (flag) {
        app_1.App.postMessage("4", String(flag));
    };
    /**
     * Closes this extension window
     */
    ExtensionWindow.prototype.close = function () {
        app_1.App.postMessage("1");
    };
    /**
     * Disable Close Button on this extension's window
     */
    ExtensionWindow.prototype.disableClose = function () {
        app_1.App.postMessage("5", "0");
    };
    /**
     * Enable Close Button on this extension's window
     */
    ExtensionWindow.prototype.enableClose = function () {
        app_1.App.postMessage("5", "1");
    };
    return ExtensionWindow;
})(eventemitter_1.EventEmitter);
exports.ExtensionWindow = ExtensionWindow;
if (environment_1.Environment.isExtension()) {
    window.Setid = function (id) {
        internal_1.exec("CallHost", "setExtensionWindowTitle:" + id, ExtensionWindow._value);
    };
    window.OnSceneLoad = function (view, scene) {
        if (Number(view) === 0) {
            ExtensionWindow.getInstance().emit('scene-load', Number(scene));
        }
    };
    window.SourcesListHighlight = function (view, id) {
        if (view === 0) {
            ExtensionWindow.getInstance().emit('sources-list-highlight', id === '' ?
                null : id);
        }
    };
    window.SourcesListSelect = function (view, id) {
        if (view === 0) {
            ExtensionWindow.getInstance().emit('sources-list-select', id === '' ?
                null : id);
        }
    };
}
},{"../core/environment":4,"../internal/app":27,"../internal/internal":30,"../util/eventemitter":45}],52:[function(require,module,exports){
/// <reference path="../../defs/es6-promise.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var global_1 = require('../internal/global');
var environment_1 = require('../core/environment');
var eventemitter_1 = require('../util/eventemitter');
/** This utility class is used internally by the framework for certain important
 *  processes. This class also exposes certain important events that the source
 *  plugin may emit.
 *
 * Inherits from: {@link #util/EventEmitter Util/EventEmitter}
 *
 *  Currently there are only four events:
 *    - `save-config`: signals the source that it should save the configuration object. Handler is a function f(config: JSON)
 *    - `apply-config`: signals the source that it should apply the changes that this configuration object describes. Handler is a function f(config: JSON)
 *    - `set-background-color`: only used when the native Color tab is reused and background color is set. Handler is a function f(colorHexNoNumberSign: string)
 *    - `scene-load`: signals the source that the active scene is the scene where it is loaded. Only works on sources loaded in memory
 *
 *  Use the `on(event: string, handler: Function)` function to listen to an event.
 */
var SourcePluginWindow = (function (_super) {
    __extends(SourcePluginWindow, _super);
    /**
     *  Use getInstance() instead.
     */
    function SourcePluginWindow() {
        _super.call(this);
        this.on('message-source', function (message) {
            if (message.request !== undefined) {
                if (message.request === 'saveConfig') {
                    this.emit('save-config', this._hideGlobalConfig(message.data));
                }
                else if (message.request === 'applyConfig') {
                    this.emit('apply-config', this._hideGlobalConfig(message.data));
                }
            }
        });
        SourcePluginWindow._instance = this;
    }
    /**
     *  Gets the instance of the window utility. Use this instead of the constructor.
     */
    SourcePluginWindow.getInstance = function () {
        if (SourcePluginWindow._instance === undefined) {
            SourcePluginWindow._instance = new SourcePluginWindow();
        }
        return SourcePluginWindow._instance;
    };
    // We modify the configuration sent from the source properties window
    // so that we do not see 'persistent' configuration such as config-url.
    // When saving, this is restored back to the config object through
    // Item#saveConfig().
    //
    // Note that we could have chosen to hide this from Item#requestSaveConfig()
    // or Item#applyConfig() calls, but unfortunately, the context of the source
    // properties window cannot always correctly determine the global config nodes
    // when dealing with sources other than the current source (right-clicked.)
    SourcePluginWindow.prototype._hideGlobalConfig = function (data) {
        var persist = global_1.Global.getPersistentConfig();
        for (var key in persist) {
            delete data[key];
        }
        return data;
    };
    return SourcePluginWindow;
})(eventemitter_1.EventEmitter);
exports.SourcePluginWindow = SourcePluginWindow;
if (environment_1.Environment.isSourcePlugin()) {
    window.MessageSource = function (message) {
        SourcePluginWindow.getInstance().emit('message-source', JSON.parse(message));
    };
    window.SetConfiguration = function (configObj) {
        try {
            var data = JSON.parse(configObj);
            var source = SourcePluginWindow.getInstance();
            source.emit('apply-config', data);
            source.emit('save-config', data);
        }
        catch (e) {
            // syntax error probably happened, exit gracefully
            return;
        }
    };
    window.setBackGroundColor = function (color) {
        SourcePluginWindow.getInstance().emit('set-background-color', color);
    };
    window.OnSceneLoad = function () {
        SourcePluginWindow.getInstance().emit('scene-load');
    };
}
},{"../core/environment":4,"../internal/global":28,"../util/eventemitter":45}],"xjs":[function(require,module,exports){
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require('./internal/init');
__export(require('./util/color'));
__export(require('./util/rectangle'));
__export(require('./util/io'));
__export(require('./core/environment'));
__export(require('./core/app'));
__export(require('./core/channel'));
__export(require('./core/scene'));
__export(require('./core/transition'));
__export(require('./core/dll'));
__export(require('./core/extension'));
__export(require('./core/source/source'));
__export(require('./core/source/camera'));
__export(require('./core/source/game'));
__export(require('./core/source/audio'));
__export(require('./core/source/html'));
__export(require('./core/source/flash'));
__export(require('./core/source/screen'));
__export(require('./core/source/image'));
__export(require('./core/source/media'));
var ichroma_1 = require('./core/source/ichroma');
exports.KeyingType = ichroma_1.KeyingType;
exports.ChromaPrimaryColors = ichroma_1.ChromaPrimaryColors;
exports.ChromaAntiAliasLevel = ichroma_1.ChromaAntiAliasLevel;
var iplayback_1 = require('./core/source/iplayback');
exports.ActionAfterPlayback = iplayback_1.ActionAfterPlayback;
var ieffects_1 = require('./core/source/ieffects');
exports.MaskEffect = ieffects_1.MaskEffect;
var cuepoint_1 = require('./core/source/cuepoint');
exports.CuePoint = cuepoint_1.CuePoint;
__export(require('./system/system'));
__export(require('./system/audio'));
__export(require('./system/game'));
__export(require('./system/camera'));
__export(require('./system/microphone'));
__export(require('./system/url'));
__export(require('./system/screen'));
__export(require('./system/file'));
__export(require('./system/videoplaylist'));
__export(require('./window/config'));
__export(require('./window/source'));
__export(require('./window/extension'));
__export(require('./window/dialog'));
var ready_1 = require('./util/ready');
exports.ready = ready_1.ready;
},{"./core/app":1,"./core/channel":2,"./core/dll":3,"./core/environment":4,"./core/extension":5,"./core/scene":6,"./core/source/audio":7,"./core/source/camera":8,"./core/source/cuepoint":9,"./core/source/flash":10,"./core/source/game":11,"./core/source/html":12,"./core/source/ichroma":14,"./core/source/ieffects":17,"./core/source/image":19,"./core/source/iplayback":20,"./core/source/media":22,"./core/source/screen":23,"./core/source/source":24,"./core/transition":26,"./internal/init":29,"./system/audio":35,"./system/camera":36,"./system/file":37,"./system/game":38,"./system/microphone":39,"./system/screen":40,"./system/system":41,"./system/url":42,"./system/videoplaylist":43,"./util/color":44,"./util/io":46,"./util/ready":47,"./util/rectangle":48,"./window/config":49,"./window/dialog":50,"./window/extension":51,"./window/source":52}]},{},["xjs"]);
