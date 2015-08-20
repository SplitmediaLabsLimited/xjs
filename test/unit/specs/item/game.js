/* globals describe, it, expect, require, beforeEach, spyOn */

describe('GameItem', function() {
  'use strict';

  var XJS = require('xjs');
  var GameItem = XJS.GameItem;
  var System = XJS.System;

  beforeEach(function() {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      spyOn(window.external, 'AppGetPropertyAsync')
        .and.callFake(function(funcName) {
        if (funcName === 'gsenum') {
          var rand=Math.floor(Math.random()*1000);

          setTimeout(function() {
            window.OnAsyncCallback(rand, '<configuration><src pid="23348" handle="386396224" hwnd="199840" GapiType="DX9" width="1280" height="800" flags="0" wndname="Terraria: Cthulhu is mad... and is missing an eye!" lastframets="9045125" fpsRender="44.885239" fpsCapture="0.000000"/><src pid="24448" handle="129832800" hwnd="265242" GapiType="DX9" width="1280" height="768" flags="0" wndname="AdVenture Capitalist!" lastframets="9045125" fpsRender="231.106949" fpsCapture="0.000000"/><src pid="25592" handle="172451040" hwnd="460446" GapiType="DX9Ex" width="1920" height="1080" flags="1" wndname="DOTA 2" lastframets="9043736" fpsRender="60.599564" fpsCapture="0.000000"/></configuration>');
          },10);

          return rand;
        }
      });
    }
  });

  it('should be created from a game object', function(done) {
    System.getGames().then(function(games) {
      expect( function() {new GameItem(games[games.length-1]);} )
        .not.toThrow();
      done();
    });
  });

  describe('interface method checking', function() {

    beforeEach(function(done) {
      System.getGames().then(function(games) {
        this.gameItem = new GameItem(games[games.length-1]);
        done();
      }.bind(this));
    });

    it('should implement the layout interface', function() {
      expect(this.gameItem).hasMethods([
        'isKeepAspectRatio',
        'setKeepAspectRatio',
        'isPositionLocked',
        'setPositionLocked',
        'isEnhancedResizeEnabled',
        'setEnhancedResizeEnabled',
        'getPosition',
        'setPosition'
        ].join(','));
    });

    it('should implement the color interface', function() {
      expect(this.gameItem).hasMethods([
        'getTransparency',
        'setTransparency',
        'getBrightness',
        'setBrightness',
        'getContrast',
        'setContrast',
        'getHue',
        'setHue',
        'getSaturation',
        'setSaturation',
        'getBorderColor',
        'setBorderColor'
        ].join(','));
    });

    it('should implement the chroma interface', function() {
      expect(this.gameItem).hasMethods([
        'isChromaEnabled',
        'setChromaEnabled',
        'getChromaBrightness',
        'setChromaBrightness',
        'getChromaSaturation',
        'setChromaSaturation',
        'getChromaHue',
        'setChromaHue',
        'getChromaType',
        'setChromaType',
        'getChromaColor',
        'setChromaColor',
        'getChromaPrimaryColor',
        'setChromaPrimaryColor',
        'getChromaBalance',
        'setChromaBalance',
        'getChromaAntiAlias',
        'setChromaAntiAlias',
        'getChromaThreshold',
        'setChromaThreshold',
        'getChromaThresholdAA',
        'setChromaThresholdAA'
        ].join(','));
    });
  });


});
