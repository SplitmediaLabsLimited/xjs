/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;
  var audioItems = [];
  var audioItem;
  var audioIndex;

  XJS.Scene.getActiveScene().then(function(scene) {
    scene.getItems().then(function(items) {
      for (var i in items) {
        if (items[i] instanceof XJS.AudioItem) {
          audioItems.push(items[i]);
        }
      }
      if (audioItems.length > 0) {
        audioItem = audioItems[0];
        audioIndex = 0;
      }
    });
  });

  Rose.createTab({
    name: 'AudioItem',
    buttons: [
      {
        name: 'toggleAudioItem',
        onClick: function() {
          if (audioIndex < audioItems.length - 1) {
            audioItem = audioItems[audioIndex + 1];
            audioIndex ++;
          } else {
            audioItem = audioItems[0];
            audioIndex = 0;
          }
          audioItem.getName().then(function(audioName) {
            console.trace(audioName);
            Rose.output(audioName);
          });
        }
      },

      {
        name: 'getName',
        onClick: function() {
          audioItem.getName().then(function(audioName) {
            console.trace(audioName);
            Rose.output(audioName);
          });
        }
      },

      {
        name: 'isSilenceDetectionEnabled',
        onClick: function() {
          audioItem.isSilenceDetectionEnabled()
            .then(function(silenceDetectionEnabled) {
              console.trace(silenceDetectionEnabled);
              Rose.output(silenceDetectionEnabled);
          });
        }
      },

      {
        name: 'setSilenceDetectionEnabled',
        onClick: function() {
          audioItem.isSilenceDetectionEnabled()
            .then(function(silenceDetectionEnabled) {
              return audioItem
                .setSilenceDetectionEnabled(!silenceDetectionEnabled);
          })
          .then(function(result) {
            return audioItem.isSilenceDetectionEnabled();
          })
          .then(function(silenceDetectionEnabled2) {
            console.trace(silenceDetectionEnabled2);
            Rose.output(silenceDetectionEnabled2);
          });
        }
      },

      {
        name: 'getSilenceThreshold',
        onClick: function() {
          audioItem.getSilenceThreshold().then(function(silenceThreshold) {
            console.trace(silenceThreshold);
            Rose.output(silenceThreshold);
          });
        }
      },

      {
        name: 'setSilenceThreshold',
        onClick: function() {
          audioItem.getSilenceThreshold().then(function(silenceThreshold) {
            var newSilenceThreshold;
            if (silenceThreshold < 128) {
              newSilenceThreshold = silenceThreshold + 1;
            } else {
             newSilenceThreshold = 0;
            }
            return audioItem.setSilenceThreshold(newSilenceThreshold);
          })
          .then(function(result) {
            return audioItem.getSilenceThreshold();
          })
          .then(function(silenceThreshold2) {
            console.trace(silenceThreshold2);
            Rose.output(silenceThreshold2);
          });
        }
      },

      {
        name: 'getSilencePeriod',
        onClick: function() {
          audioItem.getSilencePeriod().then(function(silencePeriod) {
            console.trace(silencePeriod);
            Rose.output(silencePeriod);
          });
        }
      },

      {
        name: 'setSilencePeriod',
        onClick: function() {
          audioItem.getSilencePeriod().then(function(silencePeriod) {
            var newSilencePeriod;
            if (silencePeriod < 10000) {
              newSilencePeriod = silencePeriod + 1;
            } else {
              newSilencePeriod = 0;
            }
            return audioItem.setSilencePeriod(newSilencePeriod);
          })
          .then(function(result) {
            return audioItem.getSilencePeriod();
          })
          .then(function(silencePeriod2) {
            console.trace(silencePeriod2);
            Rose.output(silencePeriod2);
          });
        }
      },

      //ItemAudio interface
      {
        name: 'getVolume',
        onClick: function() {
          audioItem.getVolume().then(function(volume) {
            console.trace(volume);
            Rose.output(volume);
          });
        }
      },

      {
        name: 'setVolume',
        onClick: function() {
          audioItem.getVolume().then(function(volume) {
            var newVolume;
            if (volume < 100) {
              newVolume = volume + 1;
            } else {
              newVolume = 0;
            }
            return audioItem.setVolume(newVolume);
          })
          .then(function(result) {
            return audioItem.getVolume();
          })
          .then(function(volume2) {
            console.trace(volume2);
            Rose.output(volume2);
          });
        }
      },

      {
        name: 'isMute',
        onClick: function() {
          audioItem.isMute().then(function(isMute) {
            console.trace(isMute);
            Rose.output(isMute);
          });
        }
      },

      {
        name: 'setMute',
        onClick: function() {
          audioItem.isMute().then(function(isMute) {
            return audioItem.setMute(!isMute);
          })
          .then(function(result) {
            return audioItem.isMute();
          })
          .then(function(isMute2) {
            console.trace(isMute2);
            Rose.output(isMute2);
          });
        }
      },

      {
        name: 'getAudioOffset',
        onClick: function() {
          audioItem.getAudioOffset().then(function(audioOffset) {
            console.trace(audioOffset);
            Rose.output(audioOffset);
          });
        }
      },

      {
        name: 'setAudioOffset',
        onClick: function() {
          audioItem.getAudioOffset().then(function(audioOffset) {
            var newAudioOffset;
            if (audioOffset < 100000000) {
              newAudioOffset = audioOffset + 100000;
            } else {
              newAudioOffset = 0;
            }
            return audioItem.setAudioOffset(newAudioOffset);
          })
          .then(function(result) {
            return audioItem.getAudioOffset();
          })
          .then(function(audioOffset2) {
            console.trace(audioOffset2);
            Rose.output(audioOffset2);
          });
        }
      },

      {
        name: 'isStreamOnlyEnabled',
        onClick: function() {
          audioItem.isStreamOnlyEnabled().then(function(isStreamOnly) {
            console.trace(isStreamOnly);
            Rose.output(isStreamOnly);
          });
        }
      },

      {
        name: 'setStreamOnlyEnabled',
        onClick: function() {
          audioItem.isStreamOnlyEnabled().then(function(isStreamOnly) {
            return audioItem.setStreamOnlyEnabled(!isStreamOnly);
          })
          .then(function(result) {
            return audioItem.isStreamOnlyEnabled();
          })
          .then(function(isStreamOnly2) {
            console.trace(isStreamOnly2);
            Rose.output(isStreamOnly2);
          });
        }
      }
    ]
  });
})();
