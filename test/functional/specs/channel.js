/* globals Rose, require, console */

(function() {
  'use strict';

  var XJS = require('xjs');
  var Channel = XJS.Channel;

  var hasChannels = false;
  var curChannel;

  var additionalButtions = [
    {
      name: 'getName',
      onClick: function() {
        curChannel.getName().then(function(name) {
          console.log(name);
          Rose.output(name);
        });
      }
    },

    {
      name: 'getStreamDrops',
      onClick: function() {
        curChannel.getStreamDrops().then(function(drops) {
          console.log(drops);
          Rose.output(drops);
        });
      }
    },

    {
      name: 'getStreamRenderedFrames',
      onClick: function() {
        curChannel.getStreamRenderedFrames().then(function(frames) {
          console.log(frames);
          Rose.output(frames);
        });
      }
    },

    {
      name: 'getStreamTime',
      onClick: function() {
        curChannel.getStreamTime().then(function(time) {
          console.log(time);
          Rose.output(time);
        });
      }
    }
  ]

  var t = Rose.createTab({
    name: 'Channel',
    buttons: [
      {
        name: 'getActiveStreamChannels',
        onClick: function() {
          Channel.getActiveStreamChannels().then(function(channels) {
            console.log(channels);
            Rose.output(channels);

            if (channels.length > 0) {
              curChannel = channels[channels.length - 1];
              t.buttons = t.buttons.concat(additionalButtions);
            } else {
              curChannel = undefined;
              t.buttons = t.buttons.filter(function(obj) {
                return obj.name === 'getActiveStreamChannels';
              });
            }

            t.refresh();
          });
        }
      }
    ]
  });
})();
