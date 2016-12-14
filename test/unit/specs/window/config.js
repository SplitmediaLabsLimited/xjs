/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('SourcePropsWindow ===', function() {
  'use strict';

  var XJS = require('xjs');
  var SourcePropsWindow = XJS.SourcePropsWindow;
  var env = new window.Environment(XJS);
  var environments = ['props', 'extension', 'plugin'];
  var appVersion = navigator.appVersion;
  var SourcePropsObj = {};

  var randomBoolean = function() {
    return Math.random() >= 0.5;
  };

  var randomWord = function(length) {
    var rand;
    var str = '';

    for (var i = 0; i < length; i++) {
      rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
      str += String.fromCharCode(rand);
    }

    return str;
  };

  var randomInt = function(min, max) {
    if (typeof min === 'undefined') {
      min = 0;
    }
    if (typeof max === 'undefined') {
      max = 100;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var shuffle = function(arrayShuffle) {
    var ctr = arrayShuffle.length;
    // While there are elements in the array
    while (ctr > 0) {
      // Pick a random index
      var randomIndex = Math.floor(Math.random() * ctr);
      // Decrease ctr by 1
      ctr--;
      // And swap the last element with it
      var temp = arrayShuffle[ctr];
      arrayShuffle[ctr] = arrayShuffle[randomIndex];
      arrayShuffle[randomIndex] = temp;
    }
    return arrayShuffle;
  };

  describe('should be able to change modes', function() {
    var testConfigWindow;
    beforeEach(function() {
      env.set(environments[0]);
      testConfigWindow = SourcePropsWindow.getInstance();
      SourcePropsObj = {};
      spyOn(parent, 'postMessage')
      .and.callFake(function(objString, allowed) {
        var eventObj = JSON.parse(objString);
        if (eventObj['event'] === 'set-mode') {
          SourcePropsObj['mode'] = eventObj['value'];
        } else if (eventObj['event'] === 'resize') {
          var sizeObj = JSON.parse(eventObj['value']);
          SourcePropsObj['width'] = Number(sizeObj['width']);
          SourcePropsObj['height'] = Number(sizeObj['height']);
        } else if (eventObj['event'] === 'set-custom-tabs') {
          var customTabArray = JSON.parse(eventObj['value']);
          SourcePropsObj['custom'] = customTabArray;
        } else if (eventObj['event'] === 'set-tab-order') {
          var tabOrderArray = JSON.parse(eventObj['value']);
          SourcePropsObj['tabOrder'] = tabOrderArray;
        }
      });
    });

    afterEach(function() {
      env.set(environments[1]);
    });

    it('such as full window', function() {
      testConfigWindow.useFullWindow();
      expect(SourcePropsObj['mode']).toEqual('full');
      expect(SourcePropsObj['width']).toEqual(354);
      expect(SourcePropsObj['height']).toEqual(390);
    });

    it('such as tabbed mode', function() {
      var customTab = randomWord(10);
      var useColor = randomBoolean();
      var useLayout = randomBoolean();
      var useTransition = randomBoolean();
      var tabOrder = [];
      var customTabs = [];
      customTabs.push(customTab);
      tabOrder.push(customTab);

      if (useColor) {
        tabOrder.push('Color');
      }
      if (useLayout) {
        tabOrder.push('Layout');
      }
      if (useTransition) {
        tabOrder.push('Transition');
      }

      tabOrder = shuffle(tabOrder);
      testConfigWindow.useTabbedWindow({'customTabs' : customTabs, 'tabOrder' : tabOrder});

      expect(SourcePropsObj['mode']).toEqual('embedded');
      expect(SourcePropsObj['custom'][0]).toEqual(customTab);
      var customIndex, colorIndex, layoutIndex, transitionIndex;
      if (useColor) {
        colorIndex = tabOrder.indexOf('Color');
      } else {
        colorIndex = -1;
      }

      if (useLayout) {
        layoutIndex = tabOrder.indexOf('Layout');
      } else {
        layoutIndex = -1;
      }

      if (useTransition) {
        transitionIndex = tabOrder.indexOf('Transition');
      } else {
        transitionIndex = -1;
      }

      customIndex = tabOrder.indexOf(customTab);

      expect(SourcePropsObj['tabOrder'].indexOf('Color')).toEqual(colorIndex);
      expect(SourcePropsObj['tabOrder'].indexOf('Layout')).toEqual(layoutIndex);
      expect(SourcePropsObj['tabOrder'].indexOf('Transition')).toEqual(transitionIndex);
      expect(SourcePropsObj['tabOrder'].indexOf(customTab)).toEqual(customIndex);
    });
  });

  describe('should be able to call limited window manipulations', function() {
    var testConfigWindow;
    beforeEach(function() {
      env.set(environments[0]);
      testConfigWindow = SourcePropsWindow.getInstance();
      SourcePropsObj = {};
      spyOn(parent, 'postMessage')
      .and.callFake(function(objString, allowed) {
        var eventObj = JSON.parse(objString);
        if (eventObj['event'] === 'resize') {
          var sizeObj = JSON.parse(eventObj['value']);
          SourcePropsObj['width'] = Number(sizeObj['width']);
          SourcePropsObj['height'] = Number(sizeObj['height']);
        } else if (eventObj['event'] === 'change-dialog-title') {
          SourcePropsObj['title'] = eventObj['value'];
        }
      });

      spyOn(external, 'Close')
      .and.callFake(function() {
        SourcePropsObj['closed'] = true;
      });
    });

    afterEach(function() {
      env.set(environments[1]);
    });

    it('resize', function() {
      var width = randomInt(1, 9999);
      var height = randomInt(1, 9999);
      testConfigWindow.resize(width, height);
      expect(SourcePropsObj['width']).toEqual(width);
      expect(SourcePropsObj['height']).toEqual(height);
    });

    it('request dialog title change', function() {
      var newTitle = randomWord(15);
      testConfigWindow.requestDialogTitleChange(newTitle);
      expect(SourcePropsObj['title']).toEqual(newTitle);
    });

    it('close', function() {
      SourcePropsObj['closed'] = false;
      testConfigWindow.close();
      expect(SourcePropsObj['closed']).toBe(true);
    });

    it('but throws an error when called not from source props', function() {
      expect(function() {
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        // for testing purposes, we set SourcePropsWindow instance to undefined
        // in order to instantiate SourcePropsWindow from constructor
        SourcePropsWindow._instance = undefined;
        env.set(environments[2]);
        var newTest = SourcePropsWindow.getInstance();
      }).toThrow();
    });
  });
});
