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

describe('Item', function() {
  var XJS = require('xjs');
  var Item = new XJS.Item({
    id: '{D0FF055A-57BF-43BB-8F25-907DA028A2CC}',
    sceneID : 1
  });
  var local = {};

  beforeEach(function() {
    if (!/xsplit broadcaster/ig.test(navigator.appVersion)) {
      spyOn(window.external, 'SetLocalPropertyAsync')
        .and.callFake(function(prop, val) {
        switch (prop) {
          case 'prop:name':
            local.name = val;
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
    }
  });

  it('should be able to set the name', function() {
    var word = randomWord(5);
    Item.setName(word);
    expect(local.name).toEqual(word);
  });

  it('should be able to get the name', function(done) {
    Item.getName().then(function(val) {
      expect(val).toEqual(local.name);
      done();
    });
  });

  it('should be able to set the value', function() {
    var word = randomWord(5);
    Item.setValue(word);
    expect(local.item).toEqual(word);
  });

  it('should be able to get the value', function(done) {
    Item.getValue().then(function(val) {
      expect(val).toEqual(local.item);
      done();
    });
  });

  it('should be able to set keep loaded property', function() {
    Item.setKeepLoaded(!local.keeploaded);
    expect(local.keeploaded).not.toBeNaN();
  });

  it('should be able to get keep loaded property', function(done) {
    Item.getKeepLoaded().then(function(val) {
      expect(val).toBeTypeOf('boolean');
      done();
    });
  });

  it('should be able to get the id', function(done) {
    Item.getID().then(function(val) {
      expect(val).toBeDefined();
      done();
    });
  });

  it('should be able to get the scene id', function(done) {
    Item.getSceneID().then(function(val) {
      expect(val).toBeTypeOf('number');
      expect(val).not.toBeNaN();
      done();
    });
  });

  it('should have toXML method', function() {
    expect(Item).hasMethods('toXML');
  });

  it('should have static getCurrentSource method', function() {
    expect(XJS.Item).hasMethods('getCurrentSource');
  });
});
