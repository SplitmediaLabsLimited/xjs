/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');

  var currentSource;
  XJS.Scene.getActiveScene().then(function(scene) {
    scene.getItems().then(function(sources) {
      for (var i in sources) {
        if (sources[i] instanceof XJS.CameraSource) {
          currentSource = sources[i];
          return;
        }
      }
    });
  });

  Rose.createTab({
    name: 'CameraSource',
    buttons: [
      {
        name: 'setName',
        onClick: function() {
          currentSource.setName(randomWord(10));
          Rose.output('Done!');
        }
      },

      {
        name: 'getName',
        onClick: function() {
          currentSource.getName().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setValue',
        onClick: function() {
          currentSource.setValue(randomWord(10));
          Rose.output('Done!');
        }
      },

      {
        name: 'getValue',
        onClick: function() {
          currentSource.getValue().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setKeepLoaded',
        onClick: function() {
          App.setKeepLoaded(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getKeepLoaded',
        onClick: function() {
          currentSource.getKeepLoaded().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getType',
        onClick: function() {
          currentSource.getType().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getId',
        onClick: function() {
          currentSource.getId().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getSceneID',
        onClick: function() {
          currentSource.getSceneID().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'toXML',
        onClick: function() {
          console.trace(currentSource.toXML());
          Rose.output(currentSource.toXML());
        }
      },

      // UNIQUE METHODS OF CAMERA CLASS

      {
        name: 'getDeviceId',
        onClick: function() {
          currentSource.getDeviceId().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getColorOptionsPinned',
        onClick: function() {
          currentSource.getColorOptionsPinned().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setColorOptionsPinned',
        onClick: function() {
          currentSource.setColorOptionsPinned(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getKeyingOptionsPinned',
        onClick: function() {
          currentSource.getKeyingOptionsPinned().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setKeyingOptionsPinned',
        onClick: function() {
          currentSource.setKeyingOptionsPinned(true);
          Rose.output('Done!');
        }
      },

      // INTERFACES

      {
        name: 'isKeepAspectRatio',
        onClick: function() {
          currentSource.isKeepAspectRatio().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setKeepAspectRatio',
        onClick: function() {
          currentSource.setKeepAspectRatio(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'isPositionLocked',
        onClick: function() {
          currentSource.isPositionLocked().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setPositionLocked',
        onClick: function() {
          currentSource.setPositionLocked(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'isEnhancedResizeEnabled',
        onClick: function() {
          currentSource.isEnhancedResizeEnabled().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setEnhancedResizeEnabled',
        onClick: function() {
          currentSource.setEnhancedResizeEnabled(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getPosition',
        onClick: function() {
          currentSource.getPosition().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setPosition',
        onClick: function() {
          var rect = new XJS.Rectangle();
          rect.setLeft(0);
          rect.setTop(0);
          rect.setRight(0.5);
          rect.setBottom(0.5);
          currentSource.setPosition(rect);
          Rose.output('Done!');
        }
      },

      {
        name: 'getTransparency',
        onClick: function() {
          currentSource.getTransparency().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setTransparency',
        onClick: function() {
          currentSource.setTransparency(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getBrightness',
        onClick: function() {
          currentSource.getBrightness().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setBrightness',
        onClick: function() {
          currentSource.setBrightness(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getContrast',
        onClick: function() {
          currentSource.getContrast().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setContrast',
        onClick: function() {
          currentSource.setContrast(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getHue',
        onClick: function() {
          currentSource.getHue().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setHue',
        onClick: function() {
          currentSource.setHue(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getSaturation',
        onClick: function() {
          currentSource.getSaturation().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setSaturation',
        onClick: function() {
          currentSource.setSaturation(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getBorderColor',
        onClick: function() {
          currentSource.getBorderColor().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setBorderColor',
        onClick: function() {
          var color = XJS.Color.fromBGRInt(2147548928 - 0x80000000);
          currentSource.setBorderColor(color);
          Rose.output('Done!');
        }
      },

      {
        name: 'isVisible',
        onClick: function() {
          currentSource.isVisible().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setVisible',
        onClick: function() {
          currentSource.setVisible(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getTransition',
        onClick: function() {
          currentSource.getTransition().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setTransition',
        onClick: function() {
          currentSource.setTransition(XJS.Transition.CLOCK);
          Rose.output('Done!');
        }
      },

      {
        name: 'getTransitionTime',
        onClick: function() {
          currentSource.getTransitionTime().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setTransitionTime',
        onClick: function() {
          currentSource.setTransitionTime(5000);
          Rose.output('Done!');
        }
      },

      {
        name: 'isChromaEnabled',
        onClick: function() {
          currentSource.isChromaEnabled().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaEnabled',
        onClick: function() {
          currentSource.setChromaEnabled(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getKeyingType',
        onClick: function() {
          currentSource.getKeyingType().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setKeyingType',
        onClick: function() {
          currentSource.setKeyingType(1);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaAntiAliasLevel',
        onClick: function() {
          currentSource.getChromaAntiAliasLevel().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaAntiAliasLevel',
        onClick: function() {
          currentSource.setChromaAntiAliasLevel(1);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyBrightness',
        onClick: function() {
          currentSource.getChromaLegacyBrightness().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyBrightness',
        onClick: function() {
          currentSource.setChromaLegacyBrightness(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacySaturation',
        onClick: function() {
          currentSource.getChromaLegacySaturation().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacySaturation',
        onClick: function() {
          currentSource.setChromaLegacySaturation(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyHue',
        onClick: function() {
          currentSource.getChromaLegacyHue().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyHue',
        onClick: function() {
          currentSource.setChromaLegacyHue(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyThreshold',
        onClick: function() {
          currentSource.getChromaLegacyThreshold().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyThreshold',
        onClick: function() {
          currentSource.setChromaLegacyThreshold(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyAlphaSmoothing',
        onClick: function() {
          currentSource.getChromaLegacyAlphaSmoothing().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyAlphaSmoothing',
        onClick: function() {
          currentSource.setChromaLegacyAlphaSmoothing(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaRGBKeyPrimaryColor',
        onClick: function() {
          currentSource.getChromaRGBKeyPrimaryColor().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaRGBKeyPrimaryColor',
        onClick: function() {
          currentSource.setChromaRGBKeyPrimaryColor(1);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaRGBKeyThreshold',
        onClick: function() {
          currentSource.getChromaRGBKeyThreshold().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaRGBKeyThreshold',
        onClick: function() {
          currentSource.setChromaRGBKeyThreshold(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaRGBKeyExposure',
        onClick: function() {
          currentSource.getChromaRGBKeyExposure().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaRGBKeyExposure',
        onClick: function() {
          currentSource.setChromaRGBKeyExposure(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaColorKeyThreshold',
        onClick: function() {
          currentSource.getChromaColorKeyThreshold().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaColorKeyThreshold',
        onClick: function() {
          currentSource.setChromaColorKeyThreshold(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaColorKeyExposure',
        onClick: function() {
          currentSource.getChromaColorKeyExposure().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaColorKeyExposure',
        onClick: function() {
          currentSource.setChromaColorKeyExposure(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaColorKeyColor',
        onClick: function() {
          currentSource.getChromaColorKeyColor().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaColorKeyColor',
        onClick: function() {
          var color = XJS.Color.fromBGRInt(2147548928 - 0x80000000);
          currentSource.setChromaColorKeyColor(color);
          Rose.output('Done!');
        }
      },
    ]
  });
})();
