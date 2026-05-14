/* globals Rose, require, console */

(() => {
  var XJS = require('xjs');
  var ExtensionWindow = XJS.ExtensionWindow;
  var inst;
  var eve;

  Rose.createTab({
    name: 'Extension',
    buttons: [
      {
        name: 'getInstance',
        onClick: () => {
          inst = ExtensionWindow.getInstance();
          if (eve === undefined) {
            inst.on('scene-load', (scene) => {
              inst = true;
              Rose.output(scene);
              console.log(scene);
            });
          }
        },
      },
    ],
  });
})();
