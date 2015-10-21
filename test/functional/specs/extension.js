/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');
  var Extension = XJS.Extension.getInstance();

  function randomWord(length) {
    var rand;
    var str = '';

    for (var i = 0; i < length; i++) {
      rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
      str += String.fromCharCode(rand);
    }

    return str;
  }

  Rose.createTab({
    name: 'Extension',
    buttons: [
      {
        name: 'saveConfig',
        onClick: function() {
          var newRandom = { config : randomWord(5) };
          Extension.saveConfig(newRandom).then(function() {
            return Extension.loadConfig();
          })
          .then(function(val) {
            console.trace('FOR SAVING :: ' + JSON.stringify(newRandom)
              + ' => ' + JSON.stringify(val));
            Rose.output('FOR SAVING :: ' + JSON.stringify(newRandom)
              + ' => ' + JSON.stringify(val));
          });
        }
      },

      {
        name: 'loadConfig',
        onClick: function() {
          Extension.loadConfig().then(function(val) {
            console.trace('CONFIG :: ' + JSON.stringify(val));
            Rose.output('CONFIG :: ' + JSON.stringify(val));
          });
        }
      }
    ]
  });
})();
