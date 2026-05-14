/* globals Rose, require, console */

(() => {
  var XJS = require('xjs');
  var Channel = XJS.Channel;

  var hasChannels = false;
  var curChannel;

  var additionalButtions = [
    {
      name: 'getName',
      onClick: () => {
        curChannel.getName().then((name) => {
          console.log(name);
          Rose.output(name);
        });
      },
    },

    {
      name: 'getStreamDrops',
      onClick: () => {
        curChannel.getStreamDrops().then((drops) => {
          console.log(drops);
          Rose.output(drops);
        });
      },
    },

    {
      name: 'getStreamRenderedFrames',
      onClick: () => {
        curChannel.getStreamRenderedFrames().then((frames) => {
          console.log(frames);
          Rose.output(frames);
        });
      },
    },

    {
      name: 'getStreamTime',
      onClick: () => {
        curChannel.getStreamTime().then((time) => {
          console.log(time);
          Rose.output(time);
        });
      },
    },
  ];

  var t = Rose.createTab({
    name: 'Channel',
    buttons: [
      {
        name: 'getActiveStreamChannels',
        onClick: () => {
          Channel.getActiveStreamChannels().then((channels) => {
            console.log(channels);
            Rose.output(channels);

            if (channels.length > 0) {
              curChannel = channels[channels.length - 1];
              t.buttons = t.buttons.concat(additionalButtions);
            } else {
              curChannel = undefined;
              t.buttons = t.buttons.filter((obj) => obj.name === 'getActiveStreamChannels');
            }

            t.refresh();
          });
        },
      },
    ],
  });
})();
