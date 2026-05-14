/* globals describe, it, expect, beforeEach, require */

var XJS = require('xjs');
var VideoPlaylist = XJS.VideoPlaylist;
var env = new window.Environment(XJS);
var environments = ['props', 'extension', 'plugin'];
var newFile = 'C:\\movie.mov';
var ctr = 0;
describe('Video Playlist', () => {
  var defpos = 0;
  var itemPosition = '';

  beforeEach(() => {
    spyOn(window.external, 'AppGetPropertyAsync').and.callFake((funcName) => {
      ctr++;
      var asyncId = 'videoplaylist_' + ctr;
      if (funcName === 'scene:0') {
        setTimeout(() => {
          window.OnAsyncCallback(asyncId, '0');
        }, 10);
      } else if (funcName === 'sceneconfig:0') {
        setTimeout(() => {
          window.OnAsyncCallback(
            asyncId,
            encodeURIComponent('<placement name="Scene 1" defpos="' + defpos + '" />')
          );
        }, 10);
      }
      return asyncId;
    });

    spyOn(window.external, 'GetVideoDuration').and.callFake((filename) => {
      if (filename === 'C:\\movie.mov') {
        setTimeout(() => {
          window.OnGetVideoDuration(encodeURIComponent(filename), '22522500');
        }, 10);
      } else {
        setTimeout(() => {
          window.OnGetVideoDurationFailed(encodeURIComponent(filename));
        }, 10);
      }
    });

    spyOn(window.external, 'AppCallFuncAsync').and.callFake((funcName, item) => {
      ctr++;
      var asyncId = 'videoplaylist_' + ctr;
      if (funcName.includes('additem')) {
        var itemXML = new window.DOMParser().parseFromString(item, 'text/xml');
        var itemPlacement = itemXML.getElementsByTagName('item')[0];

        var posLeft = itemPlacement.getAttribute('pos_left');
        var posTop = itemPlacement.getAttribute('pos_top');
        var posRight = itemPlacement.getAttribute('pos_right');
        var posBottom = itemPlacement.getAttribute('pos_bottom');
        if (posLeft === '0' && posTop === '0' && posRight === '0.5' && posBottom === '0.5') {
          itemPosition = 'top-left';
        } else if (posLeft === '0.5' && posTop === '0' && posRight === '1' && posBottom === '0.5') {
          itemPosition = 'top-right';
        } else if (posLeft === '0' && posTop === '0.5' && posRight === '0.5' && posBottom === '1') {
          itemPosition = 'bottom-left';
        } else if (posLeft === '0.5' && posTop === '0.5' && posRight === '1' && posBottom === '1') {
          itemPosition = 'bottom-right';
        } else if (
          posLeft === '0.25' &&
          posTop === '0.25' &&
          posRight === '0.75' &&
          posBottom === '0.75'
        ) {
          itemPosition = 'center';
        }
        setTimeout(() => {
          window.OnAsyncCallback(asyncId, '0');
        }, 10);
      }
      return asyncId;
    });
  });

  it('can be added to the active scene', (done) => {
    env.set(environments[2]); // source plugin window
    var newPlaylist = new VideoPlaylist([newFile]);
    newPlaylist
      .addToScene()
      .then(
        () => {
          done.fail('Should reject if called in source');
        },
        () => {
          env.set(environments[1]);
          return new VideoPlaylist('').addToScene();
        }
      )
      .then(
        () => {
          done.fail('Should reject if blank string is included');
        },
        () => new VideoPlaylist().addToScene()
      )
      .then(
        () => {
          done.fail('Should reject if no file parameter is indicated');
        },
        () => new VideoPlaylist('C:\\' + randomWord(10) + '.mov').addToScene()
      )
      .then(
        () => {
          done.fail('Should reject if file is invalid/missing');
        },
        () => newPlaylist.addToScene()
      )
      .then(() => {
        expect(true).toBe(true);
        done();
      });
  });

  it('position when added depends on default add position', (done) => {
    defpos = 0;
    var newPlaylist = new VideoPlaylist([newFile]);
    newPlaylist
      .addToScene()
      .then(() => {
        expect(itemPosition).toEqual('top-left');
        defpos = 1;
        return newPlaylist.addToScene();
      })
      .then(() => {
        expect(itemPosition).toEqual('top-right');
        defpos = 2;
        return newPlaylist.addToScene();
      })
      .then(() => {
        expect(itemPosition).toEqual('bottom-left');
        defpos = 3;
        return newPlaylist.addToScene();
      })
      .then(() => {
        expect(itemPosition).toEqual('bottom-right');
        defpos = 4;
        return newPlaylist.addToScene();
      })
      .then(() => {
        expect(itemPosition).toEqual('center');
        done();
      });
  });
});
