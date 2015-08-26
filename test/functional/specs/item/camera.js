/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');

  var currentItem;
  XJS.Scene.getActiveScene().then(function(scene) {
    scene.getItems().then(function(items) {
      for (var i in items) {
        if (items[i] instanceof XJS.CameraItem) {
          currentItem = items[i];
          return;
        }
      }
    });
  });

  Rose.createTab({
    name: 'CameraItem',
    buttons: [
      {
        name: 'setName',
        onClick: function() {
          currentItem.setName(randomWord(10));
          Rose.output('Done!');
        }
      },

      {
        name: 'getName',
        onClick: function() {
          currentItem.getName().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setValue',
        onClick: function() {
          currentItem.setValue(randomWord(10));
          Rose.output('Done!');
        }
      },

      {
        name: 'getValue',
        onClick: function() {
          currentItem.getValue().then(function(val) {
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
          currentItem.getKeepLoaded().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getType',
        onClick: function() {
          currentItem.getType().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getID',
        onClick: function() {
          currentItem.getID().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getSceneID',
        onClick: function() {
          currentItem.getSceneID().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'toXML',
        onClick: function() {
          console.trace(currentItem.toXML());
          Rose.output(currentItem.toXML());
        }
      },

      // UNIQUE METHODS OF CAMERA CLASS

      {
        name: 'getDeviceId',
        onClick: function() {
          currentItem.getDeviceId().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'getColorOptionsPinned',
        onClick: function() {
          currentItem.getColorOptionsPinned().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setColorOptionsPinned',
        onClick: function() {
          currentItem.setColorOptionsPinned(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getKeyingOptionsPinned',
        onClick: function() {
          currentItem.getKeyingOptionsPinned().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setKeyingOptionsPinned',
        onClick: function() {
          currentItem.setKeyingOptionsPinned(true);
          Rose.output('Done!');
        }
      },

      // INTERFACES

      {
        name: 'isKeepAspectRatio',
        onClick: function() {
          currentItem.isKeepAspectRatio().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setKeepAspectRatio',
        onClick: function() {
          currentItem.setKeepAspectRatio(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'isPositionLocked',
        onClick: function() {
          currentItem.isPositionLocked().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setPositionLocked',
        onClick: function() {
          currentItem.setPositionLocked(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'isEnhancedResizeEnabled',
        onClick: function() {
          currentItem.isEnhancedResizeEnabled().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setEnhancedResizeEnabled',
        onClick: function() {
          currentItem.setEnhancedResizeEnabled(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getPosition',
        onClick: function() {
          currentItem.getPosition().then(function(val) {
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
          currentItem.setPosition(rect);
          Rose.output('Done!');
        }
      },

      {
        name: 'getTransparency',
        onClick: function() {
          currentItem.getTransparency().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setTransparency',
        onClick: function() {
          currentItem.setTransparency(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getBrightness',
        onClick: function() {
          currentItem.getBrightness().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setBrightness',
        onClick: function() {
          currentItem.setBrightness(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getContrast',
        onClick: function() {
          currentItem.getContrast().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setContrast',
        onClick: function() {
          currentItem.setContrast(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getHue',
        onClick: function() {
          currentItem.getHue().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setHue',
        onClick: function() {
          currentItem.setHue(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getSaturation',
        onClick: function() {
          currentItem.getSaturation().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setSaturation',
        onClick: function() {
          currentItem.setSaturation(0);
          Rose.output('Done!');
        }
      },

      {
        name: 'getBorderColor',
        onClick: function() {
          currentItem.getBorderColor().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setBorderColor',
        onClick: function() {
          var color = XJS.Color.fromBGRInt(2147548928 - 0x80000000);
          currentItem.setBorderColor(color);
          Rose.output('Done!');
        }
      },

      {
        name: 'isVisible',
        onClick: function() {
          currentItem.isVisible().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setVisible',
        onClick: function() {
          currentItem.setVisible(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getTransition',
        onClick: function() {
          currentItem.getTransition().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setTransition',
        onClick: function() {
          currentItem.setTransition(XJS.Transition.CLOCK);
          Rose.output('Done!');
        }
      },

      {
        name: 'getTransitionTime',
        onClick: function() {
          currentItem.getTransitionTime().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setTransitionTime',
        onClick: function() {
          currentItem.setTransitionTime(5000);
          Rose.output('Done!');
        }
      },

      {
        name: 'isChromaEnabled',
        onClick: function() {
          currentItem.isChromaEnabled().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaEnabled',
        onClick: function() {
          currentItem.setChromaEnabled(true);
          Rose.output('Done!');
        }
      },

      {
        name: 'getKeyingType',
        onClick: function() {
          currentItem.getKeyingType().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setKeyingType',
        onClick: function() {
          currentItem.setKeyingType(1);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaAntiAliasLevel',
        onClick: function() {
          currentItem.getChromaAntiAliasLevel().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaAntiAliasLevel',
        onClick: function() {
          currentItem.setChromaAntiAliasLevel(1);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyBrightness',
        onClick: function() {
          currentItem.getChromaLegacyBrightness().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyBrightness',
        onClick: function() {
          currentItem.setChromaLegacyBrightness(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacySaturation',
        onClick: function() {
          currentItem.getChromaLegacySaturation().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacySaturation',
        onClick: function() {
          currentItem.setChromaLegacySaturation(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyHue',
        onClick: function() {
          currentItem.getChromaLegacyHue().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyHue',
        onClick: function() {
          currentItem.setChromaLegacyHue(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyThreshold',
        onClick: function() {
          currentItem.getChromaLegacyThreshold().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyThreshold',
        onClick: function() {
          currentItem.setChromaLegacyThreshold(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaLegacyAlphaSmoothing',
        onClick: function() {
          currentItem.getChromaLegacyAlphaSmoothing().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaLegacyAlphaSmoothing',
        onClick: function() {
          currentItem.setChromaLegacyAlphaSmoothing(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaRGBKeyPrimaryColor',
        onClick: function() {
          currentItem.getChromaRGBKeyPrimaryColor().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaRGBKeyPrimaryColor',
        onClick: function() {
          currentItem.setChromaRGBKeyPrimaryColor(1);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaRGBKeyThreshold',
        onClick: function() {
          currentItem.getChromaRGBKeyThreshold().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaRGBKeyThreshold',
        onClick: function() {
          currentItem.setChromaRGBKeyThreshold(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaRGBKeyExposure',
        onClick: function() {
          currentItem.getChromaRGBKeyExposure().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaRGBKeyExposure',
        onClick: function() {
          currentItem.setChromaRGBKeyExposure(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaColorKeyThreshold',
        onClick: function() {
          currentItem.getChromaColorKeyThreshold().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaColorKeyThreshold',
        onClick: function() {
          currentItem.setChromaColorKeyThreshold(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaColorKeyExposure',
        onClick: function() {
          currentItem.getChromaColorKeyExposure().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaColorKeyExposure',
        onClick: function() {
          currentItem.setChromaColorKeyExposure(128);
          Rose.output('Done!');
        }
      },

      {
        name: 'getChromaColorKeyColor',
        onClick: function() {
          currentItem.getChromaColorKeyColor().then(function(val) {
            console.trace(val);
            Rose.output(val);
          });
        }
      },

      {
        name: 'setChromaColorKeyColor',
        onClick: function() {
          var color = XJS.Color.fromBGRInt(2147548928 - 0x80000000);
          currentItem.setChromaColorKeyColor(color);
          Rose.output('Done!');
        }
      },
    ]
  });
})();
