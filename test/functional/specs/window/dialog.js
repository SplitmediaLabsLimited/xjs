/* globals Rose, require, console */

(() => {
  var XJS = require('xjs');
  var Dialog = XJS.Dialog;
  var newDialog = Dialog.createDialog('http://localhost:9000');

  Rose.createTab({
    name: 'Dialog',
    buttons: [
      {
        name: 'createDialog',
        onClick: () => {
          newDialog = Dialog.createDialog('http://localhost:9000');
          Rose.output('Click Show!');
        },
      },

      {
        name: 'createAutoDialog',
        onClick: () => {
          newDialog = Dialog.createAutoDialog('http://localhost:9000');
          Rose.output('Click Show!');
        },
      },

      {
        name: 'getResult',
        onClick: () => {
          newDialog.getResult().then((details) => {
            Rose.output(details);
            console.log(details);
          });
        },
      },

      {
        name: 'setSize',
        onClick: () => {
          newDialog.setSize(500, 800);
          Rose.output('Click Show!');
        },
      },

      {
        name: 'setBorderOptions',
        onClick: () => {
          newDialog.setBorderOptions(true, true);
          Rose.output('Click Show!');
        },
      },

      {
        name: 'setButtons',
        onClick: () => {
          newDialog.setButtons(true, true);
          Rose.output('Click Show!');
        },
      },

      {
        name: 'setTitle',
        onClick: () => {
          newDialog.setTitle('XJS Testing Thingy');
          Rose.output('Click Show!');
        },
      },

      {
        name: 'show',
        onClick: () => {
          newDialog.show();
        },
      },

      {
        name: 'return',
        onClick: () => {
          Dialog.return(JSON.stringify({ 'xjs-test': 'true' }));
        },
      },
    ],
  });
})();
