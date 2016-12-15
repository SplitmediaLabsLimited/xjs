/* globals describe, it, expect, require */

describe('Item', function() {
  var Item;
  var local = {};
  var XJS = require('xjs');
  var appVersion = navigator.appVersion;
  var mix = new window.Mixin([
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.7.1702.2231 ';
      });
    },
    function() {
      navigator.__defineGetter__('appVersion', function() {
        return 'XSplit Broadcaster 2.8.1603.0401 ';
      });
    }
  ]);
  var exec = mix.exec.bind(mix);

  if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
    Item = new XJS.Item({
      id: '{1B4B6EDA-1ECC-4C8B-8CCF-A05C15EA3F85}',
      sceneId : 1
    });
  }

  beforeEach(function(done) {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      spyOn(window.external, 'SetLocalPropertyAsync')
        .and.callFake(function(prop, val) {
        switch (prop) {
          case 'prop:name':
            local.name = val;
          break;

          case 'prop:cname':
            local.cname = val;
          break;

          case 'prop:srcitem':
            local.item = val;
          break;

          case 'prop:keeploaded':
            local.keeploaded = val;
          break;

          case 'prop:globalsrc':
            local.isGlobal = val;
          break;
        }
      });

      spyOn(window.external, 'GetLocalPropertyAsync')
        .and.callFake(function(prop) {
        var asyncId = (new Date()).getTime() + Math.floor(Math.random()*1000);

        switch (prop) {
          case 'prop:name':
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, local.name);
            }, 10);
          break;

          case 'prop:cname':
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, local.cname);
            }, 10);
          break;

          case 'prop:srcitem':
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, local.item);
            }, 10);
          break;

          case 'prop:keeploaded':
            setTimeout(function() {
              window.OnAsyncCallback(asyncId, local.keeploaded);
            }, 10);
          break;

          case 'prop:srcid':
            setTimeout(function() {
              window.OnAsyncCallback(
                asyncId,
                '{CB4EB352-D86F-4478-8BFD-55FF53216697}'
              );
            }, 10);
          break;

          case 'prop:globalsrc':
            setTimeout(function() {
              window.OnAsyncCallback(
                asyncId,
                '1'
              );
            }, 10);
          break;
        }

        return asyncId;
      });

      done();
    } else {
      XJS.Environment.initialize();
      XJS.Scene.getActiveScene().then(function(scene) {
        scene.getItems().then(function(items) {
          if (items.length === 0) {
            throw new Error('NO ITEMS ON CURRENT SCENE');
          }

          Item = items[0];
          done();
        });
      });
    }
  });

  afterEach(function() {
    navigator.__defineGetter__('appVersion', function() {
      return appVersion;
    });
  });

  it('should be able to set and get the name', function(done) {
    var word = randomWord(5);
    exec(function(next) {
      Item.setName(word);
      Item.getName().then(function(val) {
        expect(val).toEqual(word);
        next();
      });
    }).then(done);
  });

  it('should be able to set and get the custom name', function(done) {
    var word = randomWord(5);
    exec(function(next) {
      Item.setCustomName(word);
      Item.getCustomName().then(function(val) {
        expect(val).toEqual(word);
        next();
      });
    }).then(done);
  });

  it('should be able to set and get the value', function(done) {
    var word = randomWord(5);
    exec(function(next) {
      Item.setValue(word);
      Item.getValue().then(function(val) {
        expect(val).toEqual(word);
        next();
      });
    }).then(done);
  });

  it('should be able to set and get keep loaded property', function(done) {
    exec(function(next) {
      Item.setKeepLoaded(!local.keeploaded);
      Item.getKeepLoaded().then(function(val) {
        expect(val).toBeTypeOf('boolean');
        local.keeploaded = val;
        next();
      });
    }).then(done);
  });

  it('should be able to get the id', function(done) {
    exec(function(next) {
      Item.getId().then(function(val) {
        expect(val).toBeDefined();
        next();
      });
    }).then(done);
  });

  it('should be able to get the source id', function(done) {
    exec(function(next) {
      var promise = Item.getSourceId();
      if (navigator.appVersion === 'XSplit Broadcaster 2.8.1603.0401 ') {
        promise.then(function(val) {
          expect(val).toBeDefined();
          next();
        });
      } else {
        promise.catch(function(err) {
          expect(err).toEqual(jasmine.any(Error));
          next();
        });
      }
    }).then(done);
  });

  it('should be able to get the scene id', function(done) {
    exec(function(next) {
      Item.getSceneId().then(function(val) {
        expect(val).toBeTypeOf('number');
        expect(val).not.toBeNaN();
        next();
      });
    }).then(done);
  });

  it('should have toXML method', function() {
    expect(Item).hasMethods('toXML');
  });

  it('should have static getCurrentSource method', function() {
    expect(XJS.Item).hasMethods('getCurrentSource');
  });
});
