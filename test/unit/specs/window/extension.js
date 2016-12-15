/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('ExtensionWindow ===', function() {
  'use strict';

  var XJS = require('xjs');
  var ExtensionWindow = XJS.ExtensionWindow;
  var env = new window.Environment(XJS);
  var environments = ['props', 'extension', 'plugin'];
  var isSubscribed = false;
  var appVersion = navigator.appVersion;
  var sceneDeleteCounter = 0;
  var sceneAddCounter = 0;
  var ExtensionObj = {};

  var randomInt = function(min, max) {
    if (typeof min === 'undefined') {
      min = 0;
    }
    if (typeof max === 'undefined') {
      max = 100;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  describe('should be able to listen to scene events', function() {
    var sceneLoadSpy, sceneLoadPreviewSpy, someOtherEventSpy;
    beforeEach(function() {
      isSubscribed = false;
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1606.1701 ';
      });

      spyOn(external, 'AppGetPropertyAsync')
      .and.callFake(function(funcName) {
        if (funcName === 'presetcount') {
          global_asyncId++;
          var asyncId = new Date().getTime() + '_' + global_asyncId;

          setTimeout(function() {
            window.OnAsyncCallback(asyncId, '5');
          }, 10);
          return asyncId;
        }
      });

      spyOn(external, 'AppSubscribeEvents')
      .and.callFake(function() {
        setTimeout(function() {
          window.AppOnEvent('OnSceneAddByUser');
        }, 10);
      });

      sceneLoadSpy = spyOn(console, 'assert');
      someOtherEventSpy = spyOn(console, 'warn');
      sceneLoadPreviewSpy = spyOn(console, 'info');
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('such as scene-delete', function(done) {
      ExtensionWindow.on('scene-delete', function(sceneIndex) {
        expect(sceneIndex).toBeTypeOf('number');
        done();
      });
      window.SetEvent('event=SceneDeleted&index=9');
    });

    it('scene-add', function(done) {
      ExtensionWindow.on('scene-add', function(sceneIndex) {
        expect(sceneIndex).toBeTypeOf('number');
        done();
      });
    });

    it('scene-load', function(done) {
      ExtensionWindow.on('scene-load', function(sceneIndex) {
        expect(sceneIndex).toBeTypeOf('number');
      });
      window.OnSceneLoad('0', '2');
      ExtensionWindow.on('scene-load', function(sceneIndex) {
        console.info('This should not be called');
      });
      window.OnSceneLoad('1', '2');
      setTimeout(function() {
        expect(sceneLoadPreviewSpy).not.toHaveBeenCalled();
        window.OnSceneLoad('0', '3');
        expect(sceneLoadPreviewSpy).toHaveBeenCalled();
        expect(sceneLoadPreviewSpy.calls.count()).toEqual(1);
        done();
      }, 10);
    });

    it('and warn if event is not supported', function() {
      ExtensionWindow.on('some-other-event', function() {
      });
      expect(someOtherEventSpy).toHaveBeenCalled();
    });

    it('should make sure that subscription can be toggled', function(done) {
      var sceneDelete1 = function() {
        sceneDeleteCounter++;
        console.assert('This should be called');
        expect(sceneDeleteCounter).toEqual(1);
      };
      var sceneDelete2 = function() {
        sceneDeleteCounter = sceneDeleteCounter * 10;
        expect(sceneDeleteCounter).toEqual(10);
        expect(console.assert).toHaveBeenCalled();
        expect(sceneLoadSpy.calls.count()).toEqual(1);
        done();
      }
      ExtensionWindow.on('scene-delete', sceneDelete1);
      window.SetEvent('event=SceneDeleted&index=9');
      ExtensionWindow.off('scene-delete', sceneDelete1);
      ExtensionWindow.on('scene-delete', sceneDelete2);
      window.SetEvent('event=SceneDeleted&index=9');
    });
  });

  describe('should be able to listen to sources list events', function() {
    var sources_list_highlight, sources_list_select, highlightCtr, selectCtr;
    beforeEach(function() {
      sources_list_highlight = spyOn(window, 'SourcesListHighlight').and.callThrough();
      sources_list_select = spyOn(window, 'SourcesListSelect').and.callThrough();

      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1606.1701 ';
      });
    });

    it('sources-list-highlight', function(done) {
      highlightCtr = 0;
      ExtensionWindow.on('sources-list-highlight', function(id) {
        highlightCtr++;
        if (sources_list_highlight.calls.count() === 1) {
          expect(id).toEqual(null);
        } else if (sources_list_highlight.calls.count() === 3){
          expect(highlightCtr).toEqual(2);
          expect(id).not.toEqual(null);
          expect(id).toBeTypeOf('string');
          done();
        }
      });
      window.SourcesListHighlight('0','');
      window.SourcesListHighlight('1','{3127129D-F961-48E2-8202-6951CA62326B}');
      window.SourcesListHighlight('0','{3127129D-F961-48E2-8202-6951CA62326B}');
      // window.SourcesListHighlight('0','%3cplacement%20name%3d%22Scene%206%22%20defpos%3d%221%22%3e%3citem%20pos_left%3d%220.486977%22%20pos_top%3d%220.538426%22%20pos_right%3d%220.986977%22%20pos_bottom%3d%221.000000%22%20crop_left%3d%220.000000%22%20crop_top%3d%220.000000%22%20crop_right%3d%220.000000%22%20crop_bottom%3d%220.000000%22%20pixalign%3d%220%22%20zorder%3d%220%22%20lockmove%3d%220%22%20keep_ar%3d%221%22%20visible%3d%221%22%20alpha%3d%22255%22%20border%3d%220%22%20cc_brightness%3d%220%22%20cc_contrast%3d%220%22%20cc_hue%3d%220%22%20cc_saturation%3d%220%22%20cc_dynamicrange%3d%220%22%20key_antialiasing%3d%222%22%20key_chromakey%3d%220%22%20key_chromakeytype%3d%220%22%20key_chromahue%3d%220%22%20key_chromarang%3d%2225%22%20key_chromaranga%3d%220%22%20key_chromabr%3d%2225%22%20key_chromasat%3d%2225%22%20key_colorrgb%3d%220%22%20key_colorrang%3d%2225%22%20key_colorranga%3d%220%22%20key_chromargbkeyprimary%3d%221%22%20key_chromargbkeythresh%3d%2250%22%20key_chromargbkeybalance%3d%220%22%20rotate_x%3d%220%22%20rotate_y%3d%220%22%20rotate_z%3d%220%22%20rotate_canvas%3d%220%22%20offset_x%3d%220.000000%22%20offset_y%3d%220.000000%22%20transitionid%3d%22%22%20transitiontime%3d%22300%22%20edgeeffectid%3d%22%22%20edgeeffectcfg%3d%22%22%20edgeeffectmask%3d%22%22%20edgeeffectmaskmode%3d%220%22%20id%3d%22%7b3127129D-F961-48E2-8202-6951CA62326B%7d%22%20srcid%3d%22%7b0830000E-1697-420B-B3AB-3B68D47ED2F9%7d%22%20type%3d%225%22%20name%3d%22Window%20%26quot%3bC:%5cwamp64%5cwww%5cXJS%5ctest%5cunit%5cspecs%5cwindow%5cextension.js%20(XJS)%20-%20Sublime%20Text%202%26quot%3b%20in%20%26quot%3bsublime_text.exe%26quot%3b%20process%22%20cname%3d%22%22%20item%3d%22%26lt%3bscreen%20module%3d%26quot%3b%5cdevice%5charddiskvolume4%5cprogram%20files%5csublime%20text%202%5csublime_text.exe%26quot%3b%20window%3d%26quot%3bC:%5cwamp64%5cwww%5cXJS%5ctest%5cunit%5cspecs%5cwindow%5cextension.js%20(XJS)%20-%20Sublime%20Text%202%26quot%3b%20hwnd%3d%26quot%3b66952%26quot%3b%20wclient%3d%26quot%3b1%26quot%3b%20left%3d%26quot%3b0%26quot%3b%20top%3d%26quot%3b0%26quot%3b%20width%3d%26quot%3b0%26quot%3b%20height%3d%26quot%3b0%26quot%3b/%26gt%3b%0d%0a%22%20itemaudio%3d%22%22%20volume%3d%22100%22%20mute%3d%220%22%20sounddev%3d%220%22%20fdeinterlace%3d%220%22%20mipmaps%3d%220%22%20autoresdet%3d%221%22%20keeploaded%3d%220%22%20cc_pin%3d%220%22%20key_pin%3d%220%22%20key_smartcamenable%3d%220%22%20key_smartcamconfig%3d%22%22%20key_rssmartcamconfig%3d%22%22%20tobii%3d%220%22%20tobiiconfig%3d%22decay:0.970000%26amp%3bstr:0.900000%26amp%3brad:0.070000%26amp%3bcolor:2155905152%26amp%3btrail:0.000000%26amp%3bfiltering:0.000000%26amp%3bfill:0%22%20StreamDelay%3d%220%22%20AudioDelay%3d%220%22%20AudioGainEnable%3d%220%22%20AudioGain%3d%225%22%20AudioGainLatency%3d%221000%22%20LiveClockSync%3d%220%22%20LiveDetectSignal%3d%221%22%20InPoint%3d%220%22%20OutPoint%3d%220%22%20CuePoints%3d%22%22%20FilePlaylist%3d%22%22%20OpWhenFinished%3d%220%22%20StartOnLoad%3d%221%22%20RememberPosition%3d%221%22%20LastPosition%3d%220%22%20LastRunState%3d%22-1%22%20ShowPosition%3d%220%22%20ScrCapMethod%3d%223%22%20ScrCapLayered%3d%221%22%20ScrCapOptCapture%3d%220%22%20ScrCapOptCapture1%3d%221%22%20ScrCapIntResize%3d%220%22%20ScrCapShowMouse%3d%221%22%20ScrCapShowClicks%3d%221%22%20ScrCapTrackWindowTitle%3d%221%22%20GameCapShowMouse%3d%220%22%20GameCapSurfSharing%3d%220%22%20GameCapAlpha%3d%220%22%20GameCapPlSmooth%3d%220%22%20GameCapTrackActive%3d%220%22%20GameCapTrackActiveFullscreen%3d%221%22%20GameCapHideInactive%3d%220%22%20BrowserJs%3d%22%22%20BrowserSizeX%3d%220%22%20BrowserSizeY%3d%220%22%20BrowserTransparent%3d%221%22%20BrowserRightClick%3d%220%22%20BrowserCookiePath%3d%22%22%20BrowserCookieFlags%3d%220%22%20Browser60fps%3d%220%22%20SwfWrapper%3d%221%22%20DllGrant%3d%22%22%20custom%3d%22%22/%3e%3citem%20pos_left%3d%220.000000%22%20pos_top%3d%220.000000%22%20pos_right%3d%220.464145%22%20pos_bottom%3d%220.500000%22%20crop_left%3d%220.000000%22%20crop_top%3d%220.000000%22%20crop_right%3d%220.000000%22%20crop_bottom%3d%220.000000%22%20pixalign%3d%220%22%20zorder%3d%221%22%20lockmove%3d%220%22%20keep_ar%3d%221%22%20visible%3d%221%22%20alpha%3d%22255%22%20border%3d%220%22%20cc_brightness%3d%220%22%20cc_contrast%3d%220%22%20cc_hue%3d%220%22%20cc_saturation%3d%220%22%20cc_dynamicrange%3d%220%22%20key_antialiasing%3d%222%22%20key_chromakey%3d%220%22%20key_chromakeytype%3d%220%22%20key_chromahue%3d%220%22%20key_chromarang%3d%2225%22%20key_chromaranga%3d%220%22%20key_chromabr%3d%2225%22%20key_chromasat%3d%2225%22%20key_colorrgb%3d%220%22%20key_colorrang%3d%2225%22%20key_colorranga%3d%220%22%20key_chromargbkeyprimary%3d%221%22%20key_chromargbkeythresh%3d%2250%22%20key_chromargbkeybalance%3d%220%22%20rotate_x%3d%220%22%20rotate_y%3d%220%22%20rotate_z%3d%220%22%20rotate_canvas%3d%220%22%20offset_x%3d%220.000000%22%20offset_y%3d%220.000000%22%20transitionid%3d%22%22%20transitiontime%3d%22300%22%20edgeeffectid%3d%22%22%20edgeeffectcfg%3d%22%22%20edgeeffectmask%3d%22%22%20edgeeffectmaskmode%3d%220%22%20id%3d%22%7b63F799F6-77A9-4EAA-84F3-0F3B728EB335%7d%22%20srcid%3d%22%7b7D96C1D2-5E14-48F9-9561-C2FFB3F0B202%7d%22%20type%3d%225%22%20name%3d%22Window%20%26quot%3bXJS%20Framework%20Test%20-%20Google%20Chrome%26quot%3b%20in%20%26quot%3bchrome.exe%26quot%3b%20process%22%20cname%3d%22%22%20item%3d%22%26lt%3bscreen%20module%3d%26quot%3b%5cdevice%5charddiskvolume4%5cprogram%20files%20(x86)%5cgoogle%5cchrome%5capplication%5cchrome.exe%26quot%3b%20window%3d%26quot%3bXJS%20Framework%20Test%20-%20Google%20Chrome%26quot%3b%20hwnd%3d%26quot%3b2032944%26quot%3b%20wclient%3d%26quot%3b1%26quot%3b%20left%3d%26quot%3b0%26quot%3b%20top%3d%26quot%3b0%26quot%3b%20width%3d%26quot%3b0%26quot%3b%20height%3d%26quot%3b0%26quot%3b/%26gt%3b%0d%0a%22%20itemaudio%3d%22%22%20volume%3d%22100%22%20mute%3d%220%22%20sounddev%3d%220%22%20fdeinterlace%3d%220%22%20mipmaps%3d%220%22%20autoresdet%3d%221%22%20keeploaded%3d%220%22%20cc_pin%3d%220%22%20key_pin%3d%220%22%20key_smartcamenable%3d%220%22%20key_smartcamconfig%3d%22%22%20key_rssmartcamconfig%3d%22%22%20tobii%3d%220%22%20tobiiconfig%3d%22decay:0.970000%26amp%3bstr:0.900000%26amp%3brad:0.070000%26amp%3bcolor:2155905152%26amp%3btrail:0.000000%26amp%3bfiltering:0.000000%26amp%3bfill:0%22%20StreamDelay%3d%220%22%20AudioDelay%3d%220%22%20AudioGainEnable%3d%220%22%20AudioGain%3d%225%22%20AudioGainLatency%3d%221000%22%20LiveClockSync%3d%220%22%20LiveDetectSignal%3d%221%22%20InPoint%3d%220%22%20OutPoint%3d%220%22%20CuePoints%3d%22%22%20FilePlaylist%3d%22%22%20OpWhenFinished%3d%220%22%20StartOnLoad%3d%221%22%20RememberPosition%3d%221%22%20LastPosition%3d%220%22%20LastRunState%3d%22-1%22%20ShowPosition%3d%220%22%20ScrCapMethod%3d%223%22%20ScrCapLayered%3d%221%22%20ScrCapOptCapture%3d%220%22%20ScrCapOptCapture1%3d%221%22%20ScrCapIntResize%3d%220%22%20ScrCapShowMouse%3d%221%22%20ScrCapShowClicks%3d%221%22%20ScrCapTrackWindowTitle%3d%221%22%20GameCapShowMouse%3d%220%22%20GameCapSurfSharing%3d%220%22%20GameCapAlpha%3d%220%22%20GameCapPlSmooth%3d%220%22%20GameCapTrackActive%3d%220%22%20GameCapTrackActiveFullscreen%3d%221%22%20GameCapHideInactive%3d%220%22%20BrowserJs%3d%22%22%20BrowserSizeX%3d%220%22%20BrowserSizeY%3d%220%22%20BrowserTransparent%3d%221%22%20BrowserRightClick%3d%220%22%20BrowserCookiePath%3d%22%22%20BrowserCookieFlags%3d%220%22%20Browser60fps%3d%220%22%20SwfWrapper%3d%221%22%20DllGrant%3d%22%22%20custom%3d%22%22/%3e%3c/placement%3e%0d%0a');
    });

    it('sources-list-select', function(done) {
      selectCtr = 0;
      ExtensionWindow.on('sources-list-select', function(id) {
        selectCtr++;
        if (sources_list_select.calls.count() === 1) {
          expect(id).toEqual(null);
        } else if (sources_list_select.calls.count() === 3){
          expect(selectCtr).toEqual(2);
          expect(id).not.toEqual(null);
          expect(id).toBeTypeOf('string');
          done();
        }
      });
      window.SourcesListSelect('0','');
      window.SourcesListSelect('1','{3127129D-F961-48E2-8202-6951CA62326B}');
      window.SourcesListSelect('0','{3127129D-F961-48E2-8202-6951CA62326B}');
    });

    it('sources-list-update', function(done) {
      ExtensionWindow.on('sources-list-update', function(idString) {
        expect(idString).toBeTypeOf('string');
        done();        
      });
      window.SourcesListUpdate('0','%3cplacement%20name%3d%22Scene%206%22%20defpos%3d%221%22%3e%3citem%20pos_left%3d%220.486977%22%20pos_top%3d%220.538426%22%20pos_right%3d%220.986977%22%20pos_bottom%3d%221.000000%22%20crop_left%3d%220.000000%22%20crop_top%3d%220.000000%22%20crop_right%3d%220.000000%22%20crop_bottom%3d%220.000000%22%20pixalign%3d%220%22%20zorder%3d%220%22%20lockmove%3d%220%22%20keep_ar%3d%221%22%20visible%3d%221%22%20alpha%3d%22255%22%20border%3d%220%22%20cc_brightness%3d%220%22%20cc_contrast%3d%220%22%20cc_hue%3d%220%22%20cc_saturation%3d%220%22%20cc_dynamicrange%3d%220%22%20key_antialiasing%3d%222%22%20key_chromakey%3d%220%22%20key_chromakeytype%3d%220%22%20key_chromahue%3d%220%22%20key_chromarang%3d%2225%22%20key_chromaranga%3d%220%22%20key_chromabr%3d%2225%22%20key_chromasat%3d%2225%22%20key_colorrgb%3d%220%22%20key_colorrang%3d%2225%22%20key_colorranga%3d%220%22%20key_chromargbkeyprimary%3d%221%22%20key_chromargbkeythresh%3d%2250%22%20key_chromargbkeybalance%3d%220%22%20rotate_x%3d%220%22%20rotate_y%3d%220%22%20rotate_z%3d%220%22%20rotate_canvas%3d%220%22%20offset_x%3d%220.000000%22%20offset_y%3d%220.000000%22%20transitionid%3d%22%22%20transitiontime%3d%22300%22%20edgeeffectid%3d%22%22%20edgeeffectcfg%3d%22%22%20edgeeffectmask%3d%22%22%20edgeeffectmaskmode%3d%220%22%20id%3d%22%7b3127129D-F961-48E2-8202-6951CA62326B%7d%22%20srcid%3d%22%7b0830000E-1697-420B-B3AB-3B68D47ED2F9%7d%22%20type%3d%225%22%20name%3d%22Window%20%26quot%3bC:%5cwamp64%5cwww%5cXJS%5ctest%5cunit%5cspecs%5cwindow%5cextension.js%20(XJS)%20-%20Sublime%20Text%202%26quot%3b%20in%20%26quot%3bsublime_text.exe%26quot%3b%20process%22%20cname%3d%22%22%20item%3d%22%26lt%3bscreen%20module%3d%26quot%3b%5cdevice%5charddiskvolume4%5cprogram%20files%5csublime%20text%202%5csublime_text.exe%26quot%3b%20window%3d%26quot%3bC:%5cwamp64%5cwww%5cXJS%5ctest%5cunit%5cspecs%5cwindow%5cextension.js%20(XJS)%20-%20Sublime%20Text%202%26quot%3b%20hwnd%3d%26quot%3b66952%26quot%3b%20wclient%3d%26quot%3b1%26quot%3b%20left%3d%26quot%3b0%26quot%3b%20top%3d%26quot%3b0%26quot%3b%20width%3d%26quot%3b0%26quot%3b%20height%3d%26quot%3b0%26quot%3b/%26gt%3b%0d%0a%22%20itemaudio%3d%22%22%20volume%3d%22100%22%20mute%3d%220%22%20sounddev%3d%220%22%20fdeinterlace%3d%220%22%20mipmaps%3d%220%22%20autoresdet%3d%221%22%20keeploaded%3d%220%22%20cc_pin%3d%220%22%20key_pin%3d%220%22%20key_smartcamenable%3d%220%22%20key_smartcamconfig%3d%22%22%20key_rssmartcamconfig%3d%22%22%20tobii%3d%220%22%20tobiiconfig%3d%22decay:0.970000%26amp%3bstr:0.900000%26amp%3brad:0.070000%26amp%3bcolor:2155905152%26amp%3btrail:0.000000%26amp%3bfiltering:0.000000%26amp%3bfill:0%22%20StreamDelay%3d%220%22%20AudioDelay%3d%220%22%20AudioGainEnable%3d%220%22%20AudioGain%3d%225%22%20AudioGainLatency%3d%221000%22%20LiveClockSync%3d%220%22%20LiveDetectSignal%3d%221%22%20InPoint%3d%220%22%20OutPoint%3d%220%22%20CuePoints%3d%22%22%20FilePlaylist%3d%22%22%20OpWhenFinished%3d%220%22%20StartOnLoad%3d%221%22%20RememberPosition%3d%221%22%20LastPosition%3d%220%22%20LastRunState%3d%22-1%22%20ShowPosition%3d%220%22%20ScrCapMethod%3d%223%22%20ScrCapLayered%3d%221%22%20ScrCapOptCapture%3d%220%22%20ScrCapOptCapture1%3d%221%22%20ScrCapIntResize%3d%220%22%20ScrCapShowMouse%3d%221%22%20ScrCapShowClicks%3d%221%22%20ScrCapTrackWindowTitle%3d%221%22%20GameCapShowMouse%3d%220%22%20GameCapSurfSharing%3d%220%22%20GameCapAlpha%3d%220%22%20GameCapPlSmooth%3d%220%22%20GameCapTrackActive%3d%220%22%20GameCapTrackActiveFullscreen%3d%221%22%20GameCapHideInactive%3d%220%22%20BrowserJs%3d%22%22%20BrowserSizeX%3d%220%22%20BrowserSizeY%3d%220%22%20BrowserTransparent%3d%221%22%20BrowserRightClick%3d%220%22%20BrowserCookiePath%3d%22%22%20BrowserCookieFlags%3d%220%22%20Browser60fps%3d%220%22%20SwfWrapper%3d%221%22%20DllGrant%3d%22%22%20custom%3d%22%22/%3e%3citem%20pos_left%3d%220.000000%22%20pos_top%3d%220.000000%22%20pos_right%3d%220.464145%22%20pos_bottom%3d%220.500000%22%20crop_left%3d%220.000000%22%20crop_top%3d%220.000000%22%20crop_right%3d%220.000000%22%20crop_bottom%3d%220.000000%22%20pixalign%3d%220%22%20zorder%3d%221%22%20lockmove%3d%220%22%20keep_ar%3d%221%22%20visible%3d%221%22%20alpha%3d%22255%22%20border%3d%220%22%20cc_brightness%3d%220%22%20cc_contrast%3d%220%22%20cc_hue%3d%220%22%20cc_saturation%3d%220%22%20cc_dynamicrange%3d%220%22%20key_antialiasing%3d%222%22%20key_chromakey%3d%220%22%20key_chromakeytype%3d%220%22%20key_chromahue%3d%220%22%20key_chromarang%3d%2225%22%20key_chromaranga%3d%220%22%20key_chromabr%3d%2225%22%20key_chromasat%3d%2225%22%20key_colorrgb%3d%220%22%20key_colorrang%3d%2225%22%20key_colorranga%3d%220%22%20key_chromargbkeyprimary%3d%221%22%20key_chromargbkeythresh%3d%2250%22%20key_chromargbkeybalance%3d%220%22%20rotate_x%3d%220%22%20rotate_y%3d%220%22%20rotate_z%3d%220%22%20rotate_canvas%3d%220%22%20offset_x%3d%220.000000%22%20offset_y%3d%220.000000%22%20transitionid%3d%22%22%20transitiontime%3d%22300%22%20edgeeffectid%3d%22%22%20edgeeffectcfg%3d%22%22%20edgeeffectmask%3d%22%22%20edgeeffectmaskmode%3d%220%22%20id%3d%22%7b63F799F6-77A9-4EAA-84F3-0F3B728EB335%7d%22%20srcid%3d%22%7b7D96C1D2-5E14-48F9-9561-C2FFB3F0B202%7d%22%20type%3d%225%22%20name%3d%22Window%20%26quot%3bXJS%20Framework%20Test%20-%20Google%20Chrome%26quot%3b%20in%20%26quot%3bchrome.exe%26quot%3b%20process%22%20cname%3d%22%22%20item%3d%22%26lt%3bscreen%20module%3d%26quot%3b%5cdevice%5charddiskvolume4%5cprogram%20files%20(x86)%5cgoogle%5cchrome%5capplication%5cchrome.exe%26quot%3b%20window%3d%26quot%3bXJS%20Framework%20Test%20-%20Google%20Chrome%26quot%3b%20hwnd%3d%26quot%3b2032944%26quot%3b%20wclient%3d%26quot%3b1%26quot%3b%20left%3d%26quot%3b0%26quot%3b%20top%3d%26quot%3b0%26quot%3b%20width%3d%26quot%3b0%26quot%3b%20height%3d%26quot%3b0%26quot%3b/%26gt%3b%0d%0a%22%20itemaudio%3d%22%22%20volume%3d%22100%22%20mute%3d%220%22%20sounddev%3d%220%22%20fdeinterlace%3d%220%22%20mipmaps%3d%220%22%20autoresdet%3d%221%22%20keeploaded%3d%220%22%20cc_pin%3d%220%22%20key_pin%3d%220%22%20key_smartcamenable%3d%220%22%20key_smartcamconfig%3d%22%22%20key_rssmartcamconfig%3d%22%22%20tobii%3d%220%22%20tobiiconfig%3d%22decay:0.970000%26amp%3bstr:0.900000%26amp%3brad:0.070000%26amp%3bcolor:2155905152%26amp%3btrail:0.000000%26amp%3bfiltering:0.000000%26amp%3bfill:0%22%20StreamDelay%3d%220%22%20AudioDelay%3d%220%22%20AudioGainEnable%3d%220%22%20AudioGain%3d%225%22%20AudioGainLatency%3d%221000%22%20LiveClockSync%3d%220%22%20LiveDetectSignal%3d%221%22%20InPoint%3d%220%22%20OutPoint%3d%220%22%20CuePoints%3d%22%22%20FilePlaylist%3d%22%22%20OpWhenFinished%3d%220%22%20StartOnLoad%3d%221%22%20RememberPosition%3d%221%22%20LastPosition%3d%220%22%20LastRunState%3d%22-1%22%20ShowPosition%3d%220%22%20ScrCapMethod%3d%223%22%20ScrCapLayered%3d%221%22%20ScrCapOptCapture%3d%220%22%20ScrCapOptCapture1%3d%221%22%20ScrCapIntResize%3d%220%22%20ScrCapShowMouse%3d%221%22%20ScrCapShowClicks%3d%221%22%20ScrCapTrackWindowTitle%3d%221%22%20GameCapShowMouse%3d%220%22%20GameCapSurfSharing%3d%220%22%20GameCapAlpha%3d%220%22%20GameCapPlSmooth%3d%220%22%20GameCapTrackActive%3d%220%22%20GameCapTrackActiveFullscreen%3d%221%22%20GameCapHideInactive%3d%220%22%20BrowserJs%3d%22%22%20BrowserSizeX%3d%220%22%20BrowserSizeY%3d%220%22%20BrowserTransparent%3d%221%22%20BrowserRightClick%3d%220%22%20BrowserCookiePath%3d%22%22%20BrowserCookieFlags%3d%220%22%20Browser60fps%3d%220%22%20SwfWrapper%3d%221%22%20DllGrant%3d%22%22%20custom%3d%22%22/%3e%3c/placement%3e%0d%0a');
    });
  });

  describe('should be able to perform window functions', function() {
    var testExtension, randomId;
    beforeEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1606.1701 ';
      });

      spyOn(external, 'PostMessageToParent')
      .and.callFake(function() {
        var postMessageId = arguments[0];
        if (postMessageId === '1') {
          ExtensionObj['closed'] = true;
        } else if (postMessageId === '2') {
          ExtensionObj['width'] = arguments[1];
          ExtensionObj['height'] = arguments[2];
        } else if (postMessageId === '4') {
          ExtensionObj['flag'] = arguments[1];
        } else if (postMessageId === '5') {
          ExtensionObj['closeEnabled'] = (arguments[1] === '1');
        } else if (postMessageId === '8') {
          randomId = randomWord(15);
          window.Setid(randomId);
        }
      });

      spyOn(external, 'CallHost')
      .and.callFake(function() {
        var funcName = arguments[0];
        if (funcName.startsWith('setExtensionWindowTitle:')) {
          ExtensionObj['title'] = arguments[1];
        }
      });

      testExtension = ExtensionWindow.getInstance();
    });

    afterEach(function() {
      navigator.__defineGetter__('appVersion', function() {
        return appVersion;
      });
    });

    it('resizing', function() {
      var newWidth = randomInt(1,9999);
      var newHeight = randomInt(1,9999);
      testExtension.resize(newWidth, newHeight);
      expect(ExtensionObj['width']).toEqual(String(newWidth));
      expect(ExtensionObj['height']).toEqual(String(newHeight));
    });

    it('setting title', function() {
      var newWord = randomWord(10);
      testExtension.setTitle(newWord);
      expect(ExtensionObj['title']).toEqual(newWord);
    });

    it('setting border', function() {
      var flag = randomInt(1,9999);
      testExtension.setBorder(flag);
      expect(ExtensionObj['flag']).toEqual(String(flag));
    });

    it('disable and enable closing', function() {
      ExtensionObj['closeEnabled'] = true;
      testExtension.disableClose();
      expect(ExtensionObj['closeEnabled']).toBe(false);
      testExtension.enableClose();
      expect(ExtensionObj['closeEnabled']).toBe(true);
    });

    it('closing', function() {
      ExtensionObj['closed'] = false;
      testExtension.close();
      expect(ExtensionObj['closed']).toBe(true);
    });

    it('but throws an error when called not from an extension', function() {
      expect(function() {
        navigator.__defineGetter__('appVersion', function() {
          return appVersion;
        });
        // for testing purposes, we set ExtensionWindow instance to undefined
        // in order to instantiate ExtensionWindow from constructor
        ExtensionWindow._instance = undefined;
        env.set(environments[2]);
        var newTest = ExtensionWindow.getInstance();
      }).toThrow();
    });
  });
});
