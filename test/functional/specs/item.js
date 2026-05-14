/* globals Rose, require */

(() => {
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
  Scene.getActiveScene()
    .then((scene) => scene.getItems())
    .then((sources) => {
      if (sources.length === 0) {
        throw new Error('NO SOURCE ON CURRENT SCENE!');
      }

      var sourceIndex = 0;
      var currentSource = sources[sourceIndex];
      var items = sources;

      Rose.createTab({
        name: 'Item',
        buttons: [
          {
            name: 'toggle attached source',
            onClick: () => {
              sourceIndex = sourceIndex >= items.length - 1 ? 0 : ++sourceIndex;
              currentSource = items[sourceIndex];
              Rose.output(currentSource);
            },
          },

          {
            name: 'setName',
            onClick: () => {
              currentSource.setName(randomWord(10));
              Rose.output('Done!');
            },
          },

          {
            name: 'getName',
            onClick: () => {
              currentSource.getName().then((val) => {
                console.trace(val);
                Rose.output(val);
              });
            },
          },

          {
            name: 'setCustomName',
            onClick: () => {
              currentSource.setCustomName(randomWord(10));
              Rose.output('Done!');
            },
          },

          {
            name: 'getCustomName',
            onClick: () => {
              currentSource.getCustomName().then((val) => {
                console.trace(val);
                Rose.output(val);
              });
            },
          },

          {
            name: 'setValue',
            onClick: () => {
              currentSource.setValue(randomWord(10));
              Rose.output('Done!');
            },
          },

          {
            name: 'getValue',
            onClick: () => {
              currentSource.getValue().then((val) => {
                console.trace(val);
                Rose.output(val);
              });
            },
          },

          {
            name: 'setKeepLoaded',
            onClick: () => {
              App.setKeepLoaded(true);
              Rose.output('Done!');
            },
          },

          {
            name: 'getKeepLoaded',
            onClick: () => {
              currentSource.getKeepLoaded().then((val) => {
                console.trace(val);
                Rose.output(val);
              });
            },
          },

          {
            name: 'getType',
            onClick: () => {
              currentSource.getType().then((val) => {
                console.trace(val);
                Rose.output(val);
              });
            },
          },

          {
            name: 'getId',
            onClick: () => {
              currentSource.getId().then((val) => {
                console.trace(val);
                Rose.output(val);
              });
            },
          },

          {
            name: 'remove',
            onClick: () => {
              var rVal;
              currentSource
                .remove()
                .then((val) => {
                  rVal = val;
                  return Scene.getActiveScene();
                })
                .then((scene) => scene.getItems())
                .then((sources) => {
                  console.trace(rVal);
                  Rose.output(rVal);
                  if (sources.length === 0) {
                    throw new Error('NO SOURCE ON CURRENT SCENE!');
                  }
                  sourceIndex = sourceIndex <= 0 ? 0 : --sourceIndex;
                  items = sources;
                  currentSource = sources[sourceIndex];
                });
            },
          },

          {
            name: 'getSceneID',
            onClick: () => {
              currentSource.getSceneID().then((val) => {
                console.trace(val);
                Rose.output(val);
              });
            },
          },

          {
            name: 'toXML',
            onClick: () => {
              console.trace(currentSource.toXML());
              Rose.output(currentSource.toXML());
            },
          },

          {
            name: 'getCurrentSource',
            onClick: () => {
              Source.getCurrentSource().then((sources) => {
                console.log(sources);
                Rose.output(sources);
              });
            },
          },

          {
            name: 'sortItemOrder',
            onClick: () => {
              var activeScene;
              const arrayPosition = [];

              Scene.getActiveScene()
                .then((scene) => {
                  activeScene = scene;
                  return scene.getItems();
                })
                .then((sources) => {
                  console.log('Item Definition');
                  console.log(sources);

                  return new Promise((resolve, reject) => {
                    shuffle(sources);
                    resolve(sources);
                  });
                })
                .then((shuffledArray) => {
                  console.log('Before Order');
                  console.log(shuffledArray);
                  return activeScene.setItemOrder(shuffledArray);
                })
                .then((scene) => scene.getItems())
                .then((resultingSources) => {
                  console.log('Value of Sources After');
                  console.log(resultingSources);
                });
            },
          },
        ],
      });
    });
})();
