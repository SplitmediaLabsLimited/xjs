/* globals Rose, require */

(() => {
  var XJS = require('xjs');

  var currentSource;
  XJS.Scene.getActiveScene().then((scene) => {
    scene.getSources().then((sources) => {
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
        onClick: () => {
          currentSource.setName(randomWord(10));
          Rose.output('Done!');
        },
      },

      {
        name: 'getName',
        onClick: () => {
          currentSource.getName().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setValue',
        onClick: () => {
          currentSource.setValue(randomWord(10));
          Rose.output('Done!');
        },
      },

      {
        name: 'getValue',
        onClick: () => {
          currentSource.getValue().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setKeepLoaded',
        onClick: () => {
          App.setKeepLoaded(true);
          Rose.output('Done!');
        },
      },

      {
        name: 'getKeepLoaded',
        onClick: () => {
          currentSource.getKeepLoaded().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getType',
        onClick: () => {
          currentSource.getType().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getId',
        onClick: () => {
          currentSource.getId().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getSceneID',
        onClick: () => {
          currentSource.getSceneID().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'toXML',
        onClick: () => {
          console.trace(currentSource.toXML());
          Rose.output(currentSource.toXML());
        },
      },

      // UNIQUE METHODS OF CAMERA CLASS

      {
        name: 'getDeviceId',
        onClick: () => {
          currentSource.getDeviceId().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getColorOptionsPinned',
        onClick: () => {
          currentSource.getColorOptionsPinned().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setColorOptionsPinned',
        onClick: () => {
          currentSource.setColorOptionsPinned(true);
          Rose.output('Done!');
        },
      },

      {
        name: 'getKeyingOptionsPinned',
        onClick: () => {
          currentSource.getKeyingOptionsPinned().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setKeyingOptionsPinned',
        onClick: () => {
          currentSource.setKeyingOptionsPinned(true);
          Rose.output('Done!');
        },
      },

      // INTERFACES

      {
        name: 'isKeepAspectRatio',
        onClick: () => {
          currentSource.isKeepAspectRatio().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setKeepAspectRatio',
        onClick: () => {
          currentSource.setKeepAspectRatio(true);
          Rose.output('Done!');
        },
      },

      {
        name: 'isPositionLocked',
        onClick: () => {
          currentSource.isPositionLocked().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setPositionLocked',
        onClick: () => {
          currentSource.setPositionLocked(true);
          Rose.output('Done!');
        },
      },

      {
        name: 'isEnhancedResizeEnabled',
        onClick: () => {
          currentSource.isEnhancedResizeEnabled().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setEnhancedResizeEnabled',
        onClick: () => {
          currentSource.setEnhancedResizeEnabled(true);
          Rose.output('Done!');
        },
      },

      {
        name: 'getPosition',
        onClick: () => {
          currentSource.getPosition().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setPosition',
        onClick: () => {
          var rect = new XJS.Rectangle();
          rect.setLeft(0);
          rect.setTop(0);
          rect.setRight(0.5);
          rect.setBottom(0.5);
          currentSource.setPosition(rect);
          Rose.output('Done!');
        },
      },

      {
        name: 'getTransparency',
        onClick: () => {
          currentSource.getTransparency().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setTransparency',
        onClick: () => {
          currentSource.setTransparency(0);
          Rose.output('Done!');
        },
      },

      {
        name: 'getBrightness',
        onClick: () => {
          currentSource.getBrightness().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setBrightness',
        onClick: () => {
          currentSource.setBrightness(0);
          Rose.output('Done!');
        },
      },

      {
        name: 'getContrast',
        onClick: () => {
          currentSource.getContrast().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setContrast',
        onClick: () => {
          currentSource.setContrast(0);
          Rose.output('Done!');
        },
      },

      {
        name: 'getHue',
        onClick: () => {
          currentSource.getHue().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setHue',
        onClick: () => {
          currentSource.setHue(0);
          Rose.output('Done!');
        },
      },

      {
        name: 'getSaturation',
        onClick: () => {
          currentSource.getSaturation().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setSaturation',
        onClick: () => {
          currentSource.setSaturation(0);
          Rose.output('Done!');
        },
      },

      {
        name: 'getBorderColor',
        onClick: () => {
          currentSource.getBorderColor().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setBorderColor',
        onClick: () => {
          var color = XJS.Color.fromBGRInt(2147548928 - 0x80000000);
          currentSource.setBorderColor(color);
          Rose.output('Done!');
        },
      },

      {
        name: 'isVisible',
        onClick: () => {
          currentSource.isVisible().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setVisible',
        onClick: () => {
          currentSource.setVisible(true);
          Rose.output('Done!');
        },
      },

      {
        name: 'getTransition',
        onClick: () => {
          currentSource.getTransition().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setTransition',
        onClick: () => {
          currentSource.setTransition(XJS.Transition.CLOCK);
          Rose.output('Done!');
        },
      },

      {
        name: 'getTransitionTime',
        onClick: () => {
          currentSource.getTransitionTime().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setTransitionTime',
        onClick: () => {
          currentSource.setTransitionTime(5000);
          Rose.output('Done!');
        },
      },

      {
        name: 'isChromaEnabled',
        onClick: () => {
          currentSource.isChromaEnabled().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaEnabled',
        onClick: () => {
          currentSource.setChromaEnabled(true);
          Rose.output('Done!');
        },
      },

      {
        name: 'getKeyingType',
        onClick: () => {
          currentSource.getKeyingType().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setKeyingType',
        onClick: () => {
          currentSource.setKeyingType(1);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaAntiAliasLevel',
        onClick: () => {
          currentSource.getChromaAntiAliasLevel().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaAntiAliasLevel',
        onClick: () => {
          currentSource.setChromaAntiAliasLevel(1);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaLegacyBrightness',
        onClick: () => {
          currentSource.getChromaLegacyBrightness().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaLegacyBrightness',
        onClick: () => {
          currentSource.setChromaLegacyBrightness(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaLegacySaturation',
        onClick: () => {
          currentSource.getChromaLegacySaturation().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaLegacySaturation',
        onClick: () => {
          currentSource.setChromaLegacySaturation(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaLegacyHue',
        onClick: () => {
          currentSource.getChromaLegacyHue().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaLegacyHue',
        onClick: () => {
          currentSource.setChromaLegacyHue(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaLegacyThreshold',
        onClick: () => {
          currentSource.getChromaLegacyThreshold().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaLegacyThreshold',
        onClick: () => {
          currentSource.setChromaLegacyThreshold(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaLegacyAlphaSmoothing',
        onClick: () => {
          currentSource.getChromaLegacyAlphaSmoothing().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaLegacyAlphaSmoothing',
        onClick: () => {
          currentSource.setChromaLegacyAlphaSmoothing(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaRGBKeyPrimaryColor',
        onClick: () => {
          currentSource.getChromaRGBKeyPrimaryColor().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaRGBKeyPrimaryColor',
        onClick: () => {
          currentSource.setChromaRGBKeyPrimaryColor(1);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaRGBKeyThreshold',
        onClick: () => {
          currentSource.getChromaRGBKeyThreshold().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaRGBKeyThreshold',
        onClick: () => {
          currentSource.setChromaRGBKeyThreshold(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaRGBKeyExposure',
        onClick: () => {
          currentSource.getChromaRGBKeyExposure().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaRGBKeyExposure',
        onClick: () => {
          currentSource.setChromaRGBKeyExposure(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaColorKeyThreshold',
        onClick: () => {
          currentSource.getChromaColorKeyThreshold().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaColorKeyThreshold',
        onClick: () => {
          currentSource.setChromaColorKeyThreshold(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaColorKeyExposure',
        onClick: () => {
          currentSource.getChromaColorKeyExposure().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaColorKeyExposure',
        onClick: () => {
          currentSource.setChromaColorKeyExposure(128);
          Rose.output('Done!');
        },
      },

      {
        name: 'getChromaColorKeyColor',
        onClick: () => {
          currentSource.getChromaColorKeyColor().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setChromaColorKeyColor',
        onClick: () => {
          var color = XJS.Color.fromBGRInt(2147548928 - 0x80000000);
          currentSource.setChromaColorKeyColor(color);
          Rose.output('Done!');
        },
      },
    ],
  });
})();
