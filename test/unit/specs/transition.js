/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Transition Class', function() {
  'use strict';

  var xjs = require('xjs');
  var Transition = xjs.Transition;
  var noTransition = false;
  var transitionArray;

  beforeEach(function() {
    transitionArray = [{"Id":"stinger:C:\\Program Files (x86)\\SplitmediaLabs\\XSplit Broadcaster\\XsplitBroadcaster\\BlackBerry_18450.webm,184500000","Name":"BlackBerry: 18450ms","Content":null,"Type":".webm"},
      {"Id":"stinger:C:\\Program Files (x86)\\SplitmediaLabs\\XSplit Broadcaster\\XsplitBroadcaster\\Stinger_1100.webm,11000000","Name":"Stinger: 1100ms","Content":null,"Type":".webm"},
      {"Id":"clock","Name":"Clock","Content":null,"Type":".re3"},
      {"Id":"collapse","Name":"Collapse","Content":null,"Type":".re3"},
      {"Id":"fade","Name":"Fade","Content":null,"Type":".re3"},
      {"Id":"fan","Name":"Fan","Content":null,"Type":".re3"},
      {"Id":"hole","Name":"Hole","Content":null,"Type":".re3"},
      {"Id":"move_left","Name":"Move left","Content":null,"Type":".re3"},
      {"Id":"move_right","Name":"Move right","Content":null,"Type":".re3"},
      {"Id":"move_left_right","Name":"Move left & right","Content":null,"Type":".re3"},{"Id":"move_top","Name":"Move top","Content":null,"Type":".re3"},{"Id":"move_bottom","Name":"Move bottom","Content":null,"Type":".re3"},{"Id":"move_top_bottom","Name":"Move top & bottom","Content":null,"Type":".re3"},{"Id":"wave","Name":"Wave","Content":null,"Type":".re3"},{"Id":"none","Name":"None","Content":null,"Type":null}];

    spyOn(window.external, 'GetGlobalProperty')
      .and.callFake(function(funcName) {

      if (funcName === 'transitions' && !noTransition) {
        return JSON.stringify(transitionArray);
      } else {
        return '';
      }
    });
  });

  describe('should be able to fetch allowed scene transitions', function() {

    it('returned as an array of Transition objects', function(done) {
      Transition.getSceneTransitions().then(function(transitions) {
        expect(transitions).toBeInstanceOf(Array);
        expect(transitions).eachToBeInstanceOf(Transition);
        done();
      });
    });

    it('or an empty array if none is available', function(done) {
      noTransition = true;
      Transition.getSceneTransitions().then(function(transitions) {
        expect(transitions).toBeInstanceOf(Array);
        expect(transitions.length).toEqual(0);
        done();
      });
    });    

  });
});
