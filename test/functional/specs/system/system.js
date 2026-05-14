/* globals Rose, require */

(() => {
  var XJS = require('xjs');
  var System = XJS.System;

  Rose.createTab({
    name: 'System',
    buttons: [
      {
        name: 'getAudioDevices',
        onClick: () => {
          System.getAudioDevices().then((devices) => {
            console.trace(devices);
            Rose.output(devices);
          });
        },
      },

      {
        name: 'getCameraDevices',
        onClick: () => {
          System.getCameraDevices().then((devices) => {
            console.trace(devices);
            Rose.output(devices);
          });
        },
      },

      {
        name: 'getGames',
        onClick: () => {
          System.getGames().then((games) => {
            console.trace(games);
            Rose.output(games);
          });
        },
      },

      {
        name: 'getMicrophones',
        onClick: () => {
          System.getMicrophones().then((mics) => {
            console.trace(mics);
            Rose.output(mics);
          });
        },
      },

      {
        name: 'getCursorPosition',
        onClick: () => {
          System.getCursorPosition().then((pos) => {
            console.trace('x : %s, y : %s', pos.x, pos.y);
            Rose.output('x : ' + pos.x + ', y : ' + pos.y);
          });
        },
      },

      {
        name: 'setCursorPosition',
        onClick: () => {
          var x = Math.floor(Math.random() * 100);
          var y = Math.floor(Math.random() * 100);
          System.setCursorPosition({ x: x, y: y }).then((pos) => {
            Rose.output('Done!');
          });
        },
      },
    ],
  });
})();
