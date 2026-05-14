/* globals describe, it, expect, beforeEach, require */

var XJS = require('xjs');
var Game = XJS.Game;
var System = XJS.System;
var ctr = 0;
describe('System', () => {
  var promise;
  var defpos = 0;
  var itemPosition = '';

  beforeEach(() => {
    if (!/xsplit broadcaster/gi.test(navigator.appVersion)) {
      spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
        ctr++;
        var asyncId = 'game_' + ctr;
        if (funcName === 'gsenum') {
          setTimeout(() => {
            window.OnAsyncCallback(
              asyncId,
              encodeURIComponent(
                '<configuration><src pid="6304" handle="378066208"' +
                  ' hwnd="656086" GapiType="DX9" width="800" height="600"' +
                  ' flags="0" wndname="Terraria: The Grass is Greener on This' +
                  ' Side" lastframets="10075574" fpsRender="47.804348"' +
                  ' fpsCapture="0.000000"/><src pid="7472" handle="597654744"' +
                  ' hwnd="132348" GapiType="DX9Ex_SwapChain" width="1920"' +
                  ' height="1028" flags="0" wndname="SourceTree"' +
                  ' lastframets="10069146" fpsRender="0.000099"' +
                  ' fpsCapture="0.000000" mods="wpf"/><src pid="10804"' +
                  ' handle="47316000" hwnd="395436" GapiType="DX9" width="1024"' +
                  ' height="576" flags="0" wndname="Mark of the Ninja"' +
                  ' lastframets="10075589" fpsRender="59.811462"' +
                  ' fpsCapture="0.000000"/></configuration>\n'
              )
            );
          }, 10);
        } else if (funcName === 'scene:0') {
          setTimeout(() => {
            window.OnAsyncCallback(asyncId, '0');
          }, 10);
        } else if (funcName === 'sceneconfig:0') {
          setTimeout(() => {
            window.OnAsyncCallback(
              asyncId,
              encodeURIComponent('<placement name="Scene 1" defpos="' + defpos + '" />')
            );
          }, 10);
        }
        return asyncId;
      });

      spyOn(window.external, 'AppCallFuncAsync').and.callFake((funcName, item) => {
        ctr++;
        var asyncId = 'game_' + ctr;
        if (funcName.includes('additem')) {
          var itemXML = new window.DOMParser().parseFromString(item, 'text/xml');
          var itemPlacement = itemXML.getElementsByTagName('item')[0];

          var posLeft = itemPlacement.getAttribute('pos_left');
          var posTop = itemPlacement.getAttribute('pos_top');
          var posRight = itemPlacement.getAttribute('pos_right');
          var posBottom = itemPlacement.getAttribute('pos_bottom');
          if (posLeft === '0' && posTop === '0' && posRight === '0.5' && posBottom === '0.5') {
            itemPosition = 'top-left';
          } else if (
            posLeft === '0.5' &&
            posTop === '0' &&
            posRight === '1' &&
            posBottom === '0.5'
          ) {
            itemPosition = 'top-right';
          } else if (
            posLeft === '0' &&
            posTop === '0.5' &&
            posRight === '0.5' &&
            posBottom === '1'
          ) {
            itemPosition = 'bottom-left';
          } else if (
            posLeft === '0.5' &&
            posTop === '0.5' &&
            posRight === '1' &&
            posBottom === '1'
          ) {
            itemPosition = 'bottom-right';
          } else if (
            posLeft === '0.25' &&
            posTop === '0.25' &&
            posRight === '0.75' &&
            posBottom === '0.75'
          ) {
            itemPosition = 'center';
          }
          setTimeout(() => {
            window.OnAsyncCallback(asyncId, '0');
          }, 10);
        }
        return asyncId;
      });
    }

    promise = System.getGames();
  });

  describe('should get games', () => {
    it('through a promise', () => {
      expect(promise).toBeInstanceOf(Promise);
    });

    it('an array of System.Games object', (done) => {
      promise.then((games) => {
        expect(games).toBeInstanceOf(Array);
        expect(games).eachToBeInstanceOf(Game);
        done();
      });
    });
  });

  describe('System.Game', () => {
    var game;
    beforeEach((done) => {
      promise.then((games) => {
        if (games.length > 0) {
          game = games[0];
        }
        done();
      });
    });

    it('pid should be a Number', () => {
      expect(game.getPid()).toBeTypeOf('number');
      expect(game.getPid()).not.toBeNaN();
    });

    it('handle should be a number', () => {
      expect(game.getHandle()).toBeTypeOf('number');
      expect(game.getHandle()).not.toBeNaN();
    });

    it('window handle should be a number', () => {
      expect(game.getWindowHandle()).toBeTypeOf('number');
      expect(game.getWindowHandle()).not.toBeNaN();
    });

    it('Graphics API should be a string', () => {
      expect(game.getGapiType()).toBeTypeOf('string');
      expect(String(game.getGapiType()).trim()).not.toEqual('');
    });

    it('Resolution should be a Rectangle', () => {
      var resolution = game.getResolution();
      expect(resolution).hasMethods(
        ['getTop', 'getLeft', 'getRight', 'getBottom', 'getHeight', 'getWidth'].join(',')
      );
    });

    it('Flags should be a boolean', () => {
      expect(game.isFullscreen()).toBeBoolean();
    });

    it('Window name should be a string', () => {
      expect(game.getWindowName()).toBeTypeOf('string');
    });

    it('Last Frame Timestamp should be a number', () => {
      expect(game.getLastFrameTimestamp()).toBeTypeOf('number');
      expect(game.getLastFrameTimestamp()).not.toBeNaN();
    });

    it('Should be able to convert to an XML object', () => {
      var xml = game.toXML();
      expect(xml).hasMethods('toString');
    });
  });

  describe('Auto Detect gamesource', () => {
    var autoDetectGame;
    beforeEach(() => {
      autoDetectGame = Game.autoDetect();
    });

    it('has default attributes', () => {
      expect(autoDetectGame.getPid()).toEqual(0);
      expect(autoDetectGame.getHandle()).toEqual(0);
      expect(autoDetectGame.getWindowHandle()).toEqual(0);
      expect(autoDetectGame.getGapiType()).toEqual('');
      expect(autoDetectGame.getResolution().getWidth()).toEqual(0);
      expect(autoDetectGame.getResolution().getHeight()).toEqual(0);
      expect(autoDetectGame.isFullscreen()).toBe(false);
      expect(autoDetectGame.getWindowName()).toEqual('');
      expect(autoDetectGame.getLastFrameTimestamp()).toEqual(0);
      expect(autoDetectGame.getFpsRender()).toEqual(0);
      expect(autoDetectGame.getFpsCapture()).toEqual(0);
      expect(autoDetectGame.getImageName()).toEqual('');
    });

    it('position when added depends on default add position', (done) => {
      defpos = 0;
      autoDetectGame
        .addToScene()
        .then(() => {
          expect(itemPosition).toEqual('top-left');
          defpos = 1;
          return autoDetectGame.addToScene();
        })
        .then(() => {
          expect(itemPosition).toEqual('top-right');
          defpos = 2;
          return autoDetectGame.addToScene();
        })
        .then(() => {
          expect(itemPosition).toEqual('bottom-left');
          defpos = 3;
          return autoDetectGame.addToScene();
        })
        .then(() => {
          expect(itemPosition).toEqual('bottom-right');
          defpos = 4;
          return autoDetectGame.addToScene();
        })
        .then(() => {
          expect(itemPosition).toEqual('center');
          done();
        });
    });
  });
});
