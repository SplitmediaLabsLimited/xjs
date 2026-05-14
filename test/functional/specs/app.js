/* globals Rose, require */

(() => {
  var XJS = require('xjs');
  var App = new XJS.App();

  var audioGain = {};
  var transitionTime = 0;
  var transition = 0;
  var transitions = [
    XJS.App.TRANSITION_CLOCK,
    XJS.App.TRANSITION_COLLAPSE,
    XJS.App.TRANSITION_FADE,
    XJS.App.TRANSITION_FAN,
    XJS.App.TRANSITION_HOLE,
    XJS.App.TRANSITION_MOVE_BOTTOM,
    XJS.App.TRANSITION_MOVE_LEFT,
    XJS.App.TRANSITION_MOVE_LEFT_RIGHT,
    XJS.App.TRANSITION_MOVE_RIGHT,
    XJS.App.TRANSITION_MOVE_TOP,
    XJS.App.TRANSITION_MOVE_TOP_BOTTOM,
    XJS.App.TRANSITION_WAVE,
  ];

  var randomWord = (length) => {
    var rand;
    var str = '';

    for (var i = 0; i < length; i++) {
      rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
      str += String.fromCharCode(rand);
    }

    return str;
  };

  Rose.createTab({
    name: 'App',
    buttons: [
      {
        name: 'getFrametime',
        onClick: () => {
          App.getFrametime().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getResolution',
        onClick: () => {
          App.getResolution().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getViewport',
        onClick: () => {
          App.getViewport().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getVersion',
        onClick: () => {
          App.getVersion().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getFramesRendered',
        onClick: () => {
          App.getFramesRendered().then((val) => {
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'getAudioGain',
        onClick: () => {
          App.getAudioGain().then((val) => {
            audioGain = val;
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setAudioGain',
        onClick: () => {
          if (audioGain) {
            audioGain.gain = Number(audioGain.gain) < 128 ? Number(audioGain.gain) + 1 : 0;
            App.setAudioGain(audioGain);
          }
          Rose.output('');
        },
      },

      {
        name: 'newDialog',
        onClick: () => {
          try {
            App.newDialog(
              'http://xsplit.com',
              500,
              500,
              XJS.App.BORDER_ENABLE |
                XJS.App.BORDER_ENABLE_SIZING |
                XJS.App.BORDER_ENABLE_CAPTION |
                XJS.App.BORDER_ENABLE_MINIMIZE |
                XJS.App.BORDER_ENABLE_MAXIMIZE
            );
            Rose.output('');
          } catch (e) {
            Rose.output(e.message);
            console.trace(e.message);
          }
        },
      },

      {
        name: 'newAutoDialog',
        onClick: () => {
          try {
            App.newAutoDialog('http://xsplit.com');
            Rose.output('');
          } catch (e) {
            Rose.output(e.message);
            console.trace(e.message);
          }
        },
      },

      {
        name: 'closeDialog',
        onClick: () => {
          try {
            App.closeDialog();
            Rose.output('');
          } catch (e) {
            Rose.output(e.message);
            console.trace(e.message);
          }
        },
      },

      {
        name: 'getTransition',
        onClick: () => {
          App.getTransition().then((val) => {
            transition = transitions.indexOf(val);
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setTransition',
        onClick: () => {
          transition = transition >= transitions.length - 1 ? 0 : transition + 1;
          App.setTransition(transitions[transition]);
          console.trace(transitions[transition]);
          Rose.output(transitions[transition]);
        },
      },

      {
        name: 'getTransitionTime',
        onClick: () => {
          App.getTransitionTime().then((val) => {
            transitionTime = val;
            console.trace(val);
            Rose.output(val);
          });
        },
      },

      {
        name: 'setTransitionTime',
        onClick: () => {
          transitionTime = transitionTime >= 2000 ? 100 : transitionTime + 100;
          App.setTransitionTime(transitionTime);
          console.trace(transitionTime);
          Rose.output(transitionTime);
        },
      },

      {
        name: 'clearBrowserCookies',
        onClick: () => {
          var expiration_date = new Date();
          expiration_date.setFullYear(expiration_date.getFullYear() + 1);
          var cookie_string =
            'test_cookies=' + randomWord(5) + '; path=/; expires=' + expiration_date.toGMTString();
          document.cookie = cookie_string;
          console.trace('INITIAL :: ' + document.cookie);
          Rose.output('INITIAL :: ' + document.cookie);

          App.clearBrowserCookies().then(() => {
            setTimeout(() => {
              console.trace('FINAL :: ' + document.cookie);
              Rose.output('FINAL :: ' + document.cookie);
            }, 1000);
          });
        },
      },
    ],
  });
})();
