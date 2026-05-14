/* globals Rose, require */

(() => {
  var XJS = require('xjs');
  var System = XJS.System;
  var audioSources = [];
  var audioSource;
  var audioIndex;

  XJS.Scene.getActiveScene().then((scene) => {
    scene.getSources().then((sources) => {
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
        onClick: () => {
          if (audioIndex < audioSources.length - 1) {
            audioSource = audioSources[audioIndex + 1];
            audioIndex++;
          } else {
            audioSource = audioSources[0];
            audioIndex = 0;
          }
          audioSource.getName().then((audioName) => {
            console.trace(audioName);
            Rose.output(audioName);
          });
        },
      },

      {
        name: 'getName',
        onClick: () => {
          audioSource.getName().then((audioName) => {
            console.trace(audioName);
            Rose.output(audioName);
          });
        },
      },

      {
        name: 'isSilenceDetectionEnabled',
        onClick: () => {
          audioSource.isSilenceDetectionEnabled().then((silenceDetectionEnabled) => {
            console.trace(silenceDetectionEnabled);
            Rose.output(silenceDetectionEnabled);
          });
        },
      },

      {
        name: 'setSilenceDetectionEnabled',
        onClick: () => {
          audioSource
            .isSilenceDetectionEnabled()
            .then((silenceDetectionEnabled) =>
              audioSource.setSilenceDetectionEnabled(!silenceDetectionEnabled)
            )
            .then((result) => audioSource.isSilenceDetectionEnabled())
            .then((silenceDetectionEnabled2) => {
              console.trace(silenceDetectionEnabled2);
              Rose.output(silenceDetectionEnabled2);
            });
        },
      },

      {
        name: 'getSilenceThreshold',
        onClick: () => {
          audioSource.getSilenceThreshold().then((silenceThreshold) => {
            console.trace(silenceThreshold);
            Rose.output(silenceThreshold);
          });
        },
      },

      {
        name: 'setSilenceThreshold',
        onClick: () => {
          audioSource
            .getSilenceThreshold()
            .then((silenceThreshold) => {
              var newSilenceThreshold;
              if (silenceThreshold < 128) {
                newSilenceThreshold = silenceThreshold + 1;
              } else {
                newSilenceThreshold = 0;
              }
              return audioSource.setSilenceThreshold(newSilenceThreshold);
            })
            .then((result) => audioSource.getSilenceThreshold())
            .then((silenceThreshold2) => {
              console.trace(silenceThreshold2);
              Rose.output(silenceThreshold2);
            });
        },
      },

      {
        name: 'getSilencePeriod',
        onClick: () => {
          audioSource.getSilencePeriod().then((silencePeriod) => {
            console.trace(silencePeriod);
            Rose.output(silencePeriod);
          });
        },
      },

      {
        name: 'setSilencePeriod',
        onClick: () => {
          audioSource
            .getSilencePeriod()
            .then((silencePeriod) => {
              var newSilencePeriod;
              if (silencePeriod < 10000) {
                newSilencePeriod = silencePeriod + 1;
              } else {
                newSilencePeriod = 0;
              }
              return audioSource.setSilencePeriod(newSilencePeriod);
            })
            .then((result) => audioSource.getSilencePeriod())
            .then((silencePeriod2) => {
              console.trace(silencePeriod2);
              Rose.output(silencePeriod2);
            });
        },
      },

      //SourceAudio interface
      {
        name: 'getVolume',
        onClick: () => {
          audioSource.getVolume().then((volume) => {
            console.trace(volume);
            Rose.output(volume);
          });
        },
      },

      {
        name: 'setVolume',
        onClick: () => {
          audioSource
            .getVolume()
            .then((volume) => {
              var newVolume;
              if (volume < 100) {
                newVolume = volume + 1;
              } else {
                newVolume = 0;
              }
              return audioSource.setVolume(newVolume);
            })
            .then((result) => audioSource.getVolume())
            .then((volume2) => {
              console.trace(volume2);
              Rose.output(volume2);
            });
        },
      },

      {
        name: 'isMute',
        onClick: () => {
          audioSource.isMute().then((isMute) => {
            console.trace(isMute);
            Rose.output(isMute);
          });
        },
      },

      {
        name: 'setMute',
        onClick: () => {
          audioSource
            .isMute()
            .then((isMute) => audioSource.setMute(!isMute))
            .then((result) => audioSource.isMute())
            .then((isMute2) => {
              console.trace(isMute2);
              Rose.output(isMute2);
            });
        },
      },

      {
        name: 'getAudioOffset',
        onClick: () => {
          audioSource.getAudioOffset().then((audioOffset) => {
            console.trace(audioOffset);
            Rose.output(audioOffset);
          });
        },
      },

      {
        name: 'setAudioOffset',
        onClick: () => {
          audioSource
            .getAudioOffset()
            .then((audioOffset) => {
              var newAudioOffset;
              if (audioOffset < 100000000) {
                newAudioOffset = audioOffset + 100000;
              } else {
                newAudioOffset = 0;
              }
              return audioSource.setAudioOffset(newAudioOffset);
            })
            .then((result) => audioSource.getAudioOffset())
            .then((audioOffset2) => {
              console.trace(audioOffset2);
              Rose.output(audioOffset2);
            });
        },
      },

      {
        name: 'isStreamOnlyAudio',
        onClick: () => {
          audioSource.isStreamOnlyAudio().then((isStreamOnly) => {
            console.trace(isStreamOnly);
            Rose.output(isStreamOnly);
          });
        },
      },

      {
        name: 'setStreamOnlyAudio',
        onClick: () => {
          audioSource
            .isStreamOnlyAudio()
            .then((isStreamOnly) => audioSource.setStreamOnlyAudio(!isStreamOnly))
            .then((result) => audioSource.isStreamOnlyAudio())
            .then((isStreamOnly2) => {
              console.trace(isStreamOnly2);
              Rose.output(isStreamOnly2);
            });
        },
      },
    ],
  });
})();
