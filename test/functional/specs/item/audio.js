/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;
  var audioSources = [];
  var audioSource;
  var audioIndex;

  XJS.Scene.getActiveScene().then(function(scene) {
    scene.getItems().then(function(sources) {
      for (var i in sources) {
        if (sources[i] instanceof XJS.AudioSource) {
          audioSources.push(sources[i]);
        }
      }
      if (audioSources.length > 0) {
        audioSource = audioSources[0];
        audioIndex = 0;
      }
    });
  });

  Rose.createTab({
    name: 'AudioSource',
    buttons: [
      {
        name: 'toggleAudioSource',
        onClick: function() {
          if (audioIndex < audioSources.length - 1) {
            audioSource = audioSources[audioIndex + 1];
            audioIndex ++;
          } else {
            audioSource = audioSources[0];
            audioIndex = 0;
          }
          audioSource.getName().then(function(audioName) {
            console.trace(audioName);
            Rose.output(audioName);
          });
        }
      },

      {
        name: 'getName',
        onClick: function() {
          audioSource.getName().then(function(audioName) {
            console.trace(audioName);
            Rose.output(audioName);
          });
        }
      },

      {
        name: 'isSilenceDetectionEnabled',
        onClick: function() {
          audioSource.isSilenceDetectionEnabled()
            .then(function(silenceDetectionEnabled) {
              console.trace(silenceDetectionEnabled);
              Rose.output(silenceDetectionEnabled);
          });
        }
      },

      {
        name: 'setSilenceDetectionEnabled',
        onClick: function() {
          audioSource.isSilenceDetectionEnabled()
            .then(function(silenceDetectionEnabled) {
              return audioSource
                .setSilenceDetectionEnabled(!silenceDetectionEnabled);
          })
          .then(function(result) {
            return audioSource.isSilenceDetectionEnabled();
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
          audioSource.getSilenceThreshold().then(function(silenceThreshold) {
            console.trace(silenceThreshold);
            Rose.output(silenceThreshold);
          });
        }
      },

      {
        name: 'setSilenceThreshold',
        onClick: function() {
          audioSource.getSilenceThreshold().then(function(silenceThreshold) {
            var newSilenceThreshold;
            if (silenceThreshold < 128) {
              newSilenceThreshold = silenceThreshold + 1;
            } else {
             newSilenceThreshold = 0;
            }
            return audioSource.setSilenceThreshold(newSilenceThreshold);
          })
          .then(function(result) {
            return audioSource.getSilenceThreshold();
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
          audioSource.getSilencePeriod().then(function(silencePeriod) {
            console.trace(silencePeriod);
            Rose.output(silencePeriod);
          });
        }
      },

      {
        name: 'setSilencePeriod',
        onClick: function() {
          audioSource.getSilencePeriod().then(function(silencePeriod) {
            var newSilencePeriod;
            if (silencePeriod < 10000) {
              newSilencePeriod = silencePeriod + 1;
            } else {
              newSilencePeriod = 0;
            }
            return audioSource.setSilencePeriod(newSilencePeriod);
          })
          .then(function(result) {
            return audioSource.getSilencePeriod();
          })
          .then(function(silencePeriod2) {
            console.trace(silencePeriod2);
            Rose.output(silencePeriod2);
          });
        }
      },

      //SourceAudio interface
      {
        name: 'getVolume',
        onClick: function() {
          audioSource.getVolume().then(function(volume) {
            console.trace(volume);
            Rose.output(volume);
          });
        }
      },

      {
        name: 'setVolume',
        onClick: function() {
          audioSource.getVolume().then(function(volume) {
            var newVolume;
            if (volume < 100) {
              newVolume = volume + 1;
            } else {
              newVolume = 0;
            }
            return audioSource.setVolume(newVolume);
          })
          .then(function(result) {
            return audioSource.getVolume();
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
          audioSource.isMute().then(function(isMute) {
            console.trace(isMute);
            Rose.output(isMute);
          });
        }
      },

      {
        name: 'setMute',
        onClick: function() {
          audioSource.isMute().then(function(isMute) {
            return audioSource.setMute(!isMute);
          })
          .then(function(result) {
            return audioSource.isMute();
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
          audioSource.getAudioOffset().then(function(audioOffset) {
            console.trace(audioOffset);
            Rose.output(audioOffset);
          });
        }
      },

      {
        name: 'setAudioOffset',
        onClick: function() {
          audioSource.getAudioOffset().then(function(audioOffset) {
            var newAudioOffset;
            if (audioOffset < 100000000) {
              newAudioOffset = audioOffset + 100000;
            } else {
              newAudioOffset = 0;
            }
            return audioSource.setAudioOffset(newAudioOffset);
          })
          .then(function(result) {
            return audioSource.getAudioOffset();
          })
          .then(function(audioOffset2) {
            console.trace(audioOffset2);
            Rose.output(audioOffset2);
          });
        }
      },

      {
        name: 'isStreamOnlyAudio',
        onClick: function() {
          audioSource.isStreamOnlyAudio().then(function(isStreamOnly) {
            console.trace(isStreamOnly);
            Rose.output(isStreamOnly);
          });
        }
      },

      {
        name: 'setStreamOnlyAudio',
        onClick: function() {
          audioSource.isStreamOnlyAudio().then(function(isStreamOnly) {
            return audioSource.setStreamOnlyAudio(!isStreamOnly);
          })
          .then(function(result) {
            return audioSource.isStreamOnlyAudio();
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
