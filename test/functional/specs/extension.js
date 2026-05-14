/* globals Rose, require */

(() => {
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
        onClick: () => {
          var newRandom = { config: randomWord(5) };
          Extension.saveConfig(newRandom)
            .then(() => Extension.loadConfig())
            .then((val) => {
              console.trace(
                'FOR SAVING :: ' + JSON.stringify(newRandom) + ' => ' + JSON.stringify(val)
              );
              Rose.output(
                'FOR SAVING :: ' + JSON.stringify(newRandom) + ' => ' + JSON.stringify(val)
              );
            });
        },
      },

      {
        name: 'loadConfig',
        onClick: () => {
          Extension.loadConfig().then((val) => {
            console.trace('CONFIG :: ' + JSON.stringify(val));
            Rose.output('CONFIG :: ' + JSON.stringify(val));
          });
        },
      },

      {
        name: 'source list highlight',
        onClick: () => {
          XJS.ExtensionWindow.on('sources-list-highlight', (id) => {
            console.log('Highlight id: ' + id);
          });
          console.log('Subscribed source list highlight');
        },
      },

      {
        name: 'source list select',
        onClick: () => {
          XJS.ExtensionWindow.on('sources-list-select', (id) => {
            console.log('Select id: ' + id);
          });
          console.log('Subscribed source list select');
        },
      },

      {
        name: 'source list update',
        onClick: () => {
          XJS.ExtensionWindow.on('sources-list-update', (sources) => {
            console.log('Sources: ' + sources);
          });
          console.log('Subscribed source list update');
        },
      },

      {
        name: 'unsubscribe source list events',
        onClick: () => {
          //todo: replace with xjs functionality once available in the framework
          window.external.SourcesListUnsubscribeEvents('0');
          console.log('Unsubscribed to source list events');
        },
      },
    ],
  });
})();
