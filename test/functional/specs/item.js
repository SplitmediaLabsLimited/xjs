/* globals Rose, require */

(function() {
  'use strict';

  var XJS = require('xjs');
  var Scene = XJS.Scene;
  var Source = XJS.Source;
  var App = new XJS.App(); 

  function randomWord(length) {
    var rand;
    var str = '';

    for (var i = 0; i < length; i++) {
      rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
      str += String.fromCharCode(rand);
    }

    return str;
  }

  function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
  }

  // This is a Source class functional test case, but since it needs to actually
  // work on XBC, we should always go through Scene class first
  Scene.getActiveScene().then(function(scene) {
    return scene.getItems();
  }).then(function(sources) {
    if (sources.length === 0) {
      throw new Error('NO SOURCE ON CURRENT SCENE!');
    }

    var sourceIndex = 0;
    var currentSource = sources[sourceIndex];

    Rose.createTab({
      name: 'Item',
      buttons: [
        {
          name: 'toggle attached source',
          onClick: function() {
            sourceIndex = (sourceIndex >= sources.length - 1) ? 0 : sourceIndex++;
            currentSource = sources[sourceIndex];
            Rose.output(currentSource);
          }
        },

        {
          name: 'setName',
          onClick: function() {
            currentSource.setName(randomWord(10));
            Rose.output('Done!');
          }
        },

        {
          name: 'getName',
          onClick: function() {
            currentSource.getName().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'setCustomName',
          onClick: function() {
            currentSource.setCustomName(randomWord(10));
            Rose.output('Done!');
          }
        },

        {
          name: 'getCustomName',
          onClick: function() {
            currentSource.getCustomName().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'setValue',
          onClick: function() {
            currentSource.setValue(randomWord(10));
            Rose.output('Done!');
          }
        },

        {
          name: 'getValue',
          onClick: function() {
            currentSource.getValue().then(function(val) {
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
            currentSource.getKeepLoaded().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'getType',
          onClick: function() {
            currentSource.getType().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'getId',
          onClick: function() {
            currentSource.getId().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'getSceneID',
          onClick: function() {
            currentSource.getSceneID().then(function(val) {
              console.trace(val);
              Rose.output(val);
            });
          }
        },

        {
          name: 'toXML',
          onClick: function() {
            console.trace(currentSource.toXML());
            Rose.output(currentSource.toXML());
          }
        },

        {
          name: 'getCurrentSource',
          onClick: function() {
            Source.getCurrentSource().then(function(sources) {
              console.log(sources);
              Rose.output(sources);
            });
          }
        },        

        {
          name: 'sortItemOrder',
          onClick: function() {
            var activeScene;
            let arrayPosition=[];
           
            Scene.getActiveScene().then(function(scene){
              activeScene = scene;
              return scene.getItems();

            }).then(function(sources){
                
                console.log("Item Definition");
                console.log(sources);                

                return new Promise(function(resolve, reject){
                  shuffle(sources);
                  resolve(sources);
                });

                }).then(function(shuffledArray) {

                  console.log("Before Order");
                  console.log(shuffledArray);
                  return activeScene.setItemOrder(shuffledArray);

                }).then(function(scene){

                  return scene.getItems();

                }).then(function(resultingSources){

                  console.log("Value of Sources After");
                  console.log(resultingSources);

                });              
          }
        }
        
      ]
    });
  });
})();
