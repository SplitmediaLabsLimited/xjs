/* globals Rose, require, console */

(function() {
  'use strict';

  var XJS = require('xjs');
  var ExtensionWindow = XJS.ExtensionWindow;
  var inst;
  var eve;

  Rose.createTab({
    name: 'Extension',
    buttons: [
      {
        name: 'getInstance',
        onClick: function() {
          inst = ExtensionWindow.getInstance();
          if (eve === undefined) {
            inst.on('scene-load', function(scene) {
              inst = true;
              Rose.output(scene);
              console.log(scene);
            });
          }
        }
      }
    ]
  });
})();
