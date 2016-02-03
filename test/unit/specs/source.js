/* globals describe, it, expect, require */

function randomWord(length) {
  var rand;
  var str = '';

  for (var i = 0; i < length; i++) {
    rand = Math.floor(Math.random() * 25) + 65; // A ~ Z
    str += String.fromCharCode(rand);
  }

  return str;
}

describe('Source', function() {
  var Source;
  var local = {};
  var XJS = require('xjs');
  if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
    Source = new XJS.Source({
      id: '{D0FF055A-57BF-43BB-8F25-907DA028A2CC}',
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

          case 'prop:item':
            local.item = val;
          break;

          case 'prop:keeploaded':
            local.keeploaded = val;
          break;
        }
      });

      spyOn(window.external, 'GetLocalPropertyAsync')
        .and.callFake(function(prop) {
        var rand = Math.floor(Math.random()*1000);

        switch (prop) {
          case 'prop:name':
            setTimeout(function() {
              window.OnAsyncCallback(rand, local.name);
            }, 10);
          break;

          case 'prop:cname':
            setTimeout(function() {
              window.OnAsyncCallback(rand, local.cname);
            }, 10);
          break;

          case 'prop:item':
            setTimeout(function() {
              window.OnAsyncCallback(rand, local.item);
            }, 10);
          break;

          case 'prop:keeploaded':
            setTimeout(function() {
              window.OnAsyncCallback(rand, local.keeploaded);
            }, 10);
          break;
        }

        return rand;
      });

      done();
    } else {
      XJS.Environment.initialize();
      XJS.Scene.getActiveScene().then(function(scene) {
        scene.getSources().then(function(sources) {
          if (sources.length === 0) {
            throw new Error('NO SOURCES ON CURRENT SCENE');
          }

          Source = sources[0];
          done();
        });
      });
    }
  });

  it('should be able to set and get the name', function(done) {
    var word = randomWord(5);
    Source.setName(word);
    Source.getName().then(function(val) {
      expect(val).toEqual(word);
      done();
    });
  });

  it('should be able to set and get the custom name', function(done) {
    var word = randomWord(5);
    Source.setCustomName(word);
    Source.getCustomName().then(function(val) {
      expect(val).toEqual(word);
      done();
    });
  });

  xit('should be able to set and get the value', function() {
    var word = randomWord(5);
    Source.setValue(word);
    Source.getValue().then(function(val) {
      expect(val).toEqual(word);
      done();
    });
  });

  it('should be able to set and get keep loaded property', function(done) {
    Source.setKeepLoaded(!local.keeploaded);
    Source.getKeepLoaded().then(function(val) {
      expect(val).toBeTypeOf('boolean');
      local.keeploaded = val;
      done();
    });
  });

  it('should be able to get the id', function(done) {
    Source.getId().then(function(val) {
      expect(val).toBeDefined();
      done();
    });
  });

  it('should be able to get the scene id', function(done) {
    Source.getSceneId().then(function(val) {
      expect(val).toBeTypeOf('number');
      expect(val).not.toBeNaN();
      done();
    });
  });

  it('should have toXML method', function() {
    expect(Source).hasMethods('toXML');
  });

  it('should have static getCurrentSource method', function() {
    expect(XJS.Source).hasMethods('getCurrentSource');
  });
});
