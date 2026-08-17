/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');
  var System = XJS.System;

  Rose.createTab({
    name: 'System',
    buttons: [
      {
        name: 'getAudioDevices',
        onClick: function() {
          System.getAudioDevices().then(function(devices) {
            console.trace(devices);
            Rose.output(devices);
          });
        }
      },

      {
        name: 'getCameraDevices',
        onClick: function() {
          System.getCameraDevices().then(function(devices) {
            console.trace(devices);
            Rose.output(devices);
          });
        }
      },

      {
        name: 'getGames',
        onClick: function() {
          System.getGames().then(function(games) {
            console.trace(games);
            Rose.output(games);
          });
        }
      },

      {
        name: 'getMicrophones',
        onClick: function() {
          System.getMicrophones().then(function(mics) {
            console.trace(mics);
            Rose.output(mics);
          });
        }
      },

      {
        name: 'getCursorPosition',
        onClick: function() {
          System.getCursorPosition().then(function(pos) {
            console.trace('x : %s, y : %s', pos.x, pos.y);
            Rose.output('x : ' + pos.x + ', y : ' + pos.y);
          });
        }
      },

      {
        name: 'setCursorPosition',
        onClick: function() {
          var x = Math.floor(Math.random() * 100);
          var y = Math.floor(Math.random() * 100);
          System.setCursorPosition({x : x, y : y}).then(function(pos) {
            Rose.output('Done!');
          });
        }
      }
    ]
  });
})();
