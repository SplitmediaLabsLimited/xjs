/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var Item = XJS.Item;

  function randomWord(length) {
    var rand;
    var str = '';

    for (var i = 0; i < length; i++) {
      rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
      str += String.fromCharCode(rand);
    }

    return str;
  }

  // This is a Item class functional test case, but since it needs to actually
  // work on XBC, we should always go through Scene class first
  Scene.getActiveScene().then(function(scene) {
    return scene.getItems();
  }).then(function(items) {
    if (items.length === 0) {
      throw new Error('NO ITEMS ON CURRENT SCENE!');
    }

    var itemIndex = 0;
    var currentItem = items[itemIndex];

    Rose.createTab({
      name: 'PLG-118',
      buttons: [
        {
          name: 'toggle attached item',
          onClick: function() {
            itemIndex = (itemIndex >= items.length - 1) ? 0 : itemIndex++;
            currentItem = items[itemIndex];
            Rose.output(currentItem);
          }
        },

        {
          name: 'setName',
          onClick: function() {
            currentItem.setName(randomWord(10));
            Rose.output('Done!');
          }
        },

        {
          name: 'getName',
          onClick: function() {
            currentItem.getName().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'setValue',
          onClick: function() {
            currentItem.setValue(randomWord(10));
            Rose.output('Done!');
          }
        },

        {
          name: 'getValue',
          onClick: function() {
            currentItem.getValue().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'setKeepLoaded',
          onClick: function() {
            App.setKeepLoaded(true);
            Rose.output('Done!');
          }
        },

        {
          name: 'getKeepLoaded',
          onClick: function() {
            currentItem.getKeepLoaded().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'getType',
          onClick: function() {
            currentItem.getType().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'getID',
          onClick: function() {
            currentItem.getID().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'getSceneID',
          onClick: function() {
            currentItem.getSceneID().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'toXML',
          onClick: function() {
            console.trace(currentItem.toXML());
            Rose.output(currentItem.toXML());
          }
        },

        {
          name: 'getCurrentSource',
          onClick: function() {
            Item.getCurrentSource().then(function(items) {
              console.log(items);
              Rose.output(items);
            });
          }
        }
      ]
    });
  });
})();
