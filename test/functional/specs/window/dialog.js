/* globals Rose, require, console */

(function() {
  'use strict';

  var XJS = require('xjs');
  var Dialog = XJS.Dialog;
  var newDialog = Dialog.createDialog('http://localhost:9000');

  if (newDialog) {
    newDialog.getResult().then(function(details) {
      Rose.output(details);
      console.log(details);
    });
  }

  Rose.createTab({
    name: 'Dialog',
    buttons: [
      {
        name: 'createDialog',
        onClick: function() {
          newDialog = Dialog.createDialog('http://localhost:9000');
          Rose.output('Click Show!');
        }
      },

      {
        name: 'createAutoDialog',
        onClick: function() {
          newDialog = Dialog.createAutoDialog('http://localhost:9000');
          Rose.output('Click Show!');
        }
      },

      {
        name: 'setSize',
        onClick: function() {
          newDialog.setSize(500, 800);
          Rose.output('Click Show!');
        }
      },

      {
        name: 'setBorderOptions',
        onClick: function() {
          newDialog.setBorderOptions(true, true);
          Rose.output('Click Show!');
        }
      },

      {
        name: 'setButtons',
        onClick: function() {
          newDialog.setButtons(true, true);
          Rose.output('Click Show!');
        }
      },

      {
        name: 'setTitle',
        onClick: function() {
          newDialog.setTitle('XJS Testing Thingy');
          Rose.output('Click Show!');
        }
      },

      {
        name: 'show',
        onClick: function() {
          newDialog.show();
        }
      },

      {
        name: 'return',
        onClick: function() {
          Dialog.return({'xjs-test':'true'});
        }
      }
    ]
  });
})();
