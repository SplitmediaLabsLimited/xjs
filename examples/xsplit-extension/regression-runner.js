(function() {
  'use strict';

  var TIMEOUT_MS = 5000;

  function now() {
    return Date.now();
  }

  function timeout(promise, label) {
    return new Promise(function(resolve, reject) {
      var timer = setTimeout(function() {
        reject(new Error(label + ' timed out after ' + TIMEOUT_MS + 'ms'));
      }, TIMEOUT_MS);
      Promise.resolve(promise).then(function(value) {
        clearTimeout(timer);
        resolve(value);
      }, function(error) {
        clearTimeout(timer);
        reject(error);
      });
    });
  }

  function shapedObject(value) {
    return value !== null && typeof value === 'object';
  }

  function runCheck(id, fn) {
    var started = now();
    return Promise.resolve().then(fn).then(function(value) {
      return {
        id: id,
        status: 'pass',
        durationMs: now() - started,
        value: value === undefined ? null : value,
      };
    }, function(error) {
      return {
        id: id,
        status: 'fail',
        durationMs: now() - started,
        error: error && error.stack ? error.stack : String(error),
      };
    });
  }

  function getXjs() {
    if (typeof require === 'function') {
      return require('xjs');
    }
    if (window.XJS) {
      return window.XJS;
    }
    throw new Error('XJS browser bundle is not loaded');
  }

  function getComponentFixtures() {
    if (Array.isArray(window.__xjsComponentFixtures)) {
      return window.__xjsComponentFixtures;
    }
    throw new Error('window.__xjsComponentFixtures is not defined');
  }

  function includesText(text, expected) {
    return String(text || '').indexOf(expected) !== -1;
  }

  function assertFixtureText(fixture, element) {
    (fixture.expectedText || []).forEach(function(expected) {
      if (!includesText(element.textContent, expected)) {
        throw new Error(fixture.id + ' missing expected text: ' + expected);
      }
    });
  }

  function assertFixtureLinks(fixture, element) {
    (fixture.expectedLinks || []).forEach(function(expectedHref) {
      var links = Array.prototype.slice.call(element.querySelectorAll('a'));
      var matched = links.some(function(link) {
        return link.getAttribute('href') === expectedHref || link.href === expectedHref;
      });
      if (!matched) {
        throw new Error(fixture.id + ' missing expected link: ' + expectedHref);
      }
    });
  }

  function assertFixtureSelectors(fixture, element) {
    (fixture.expectedSelectors || []).forEach(function(selector) {
      if (!element.querySelector(selector)) {
        throw new Error(fixture.id + ' missing expected selector: ' + selector);
      }
    });
  }

  function assertFixtureLayout(fixture, element) {
    if (!fixture.minBoundingBox) {
      return null;
    }
    var bounds = element.getBoundingClientRect();
    if (bounds.width < fixture.minBoundingBox.width || bounds.height < fixture.minBoundingBox.height) {
      throw new Error(
        fixture.id + ' rendered too small: '
        + Math.round(bounds.width) + 'x' + Math.round(bounds.height)
      );
    }
    return {
      width: Math.round(bounds.width),
      height: Math.round(bounds.height),
    };
  }

  [
    'OnDialogLoadStart',
    'OnDialogTitleChange',
    'OnDialogLoadEnd',
  ].forEach(function(callbackName) {
    if (typeof window[callbackName] !== 'function') {
      window[callbackName] = function() {};
    }
  });

  function render(results) {
    window.__xjsRegressionResults = results;
    var status = document.getElementById('status');
    var output = document.getElementById('results');
    var failed = results.filter(function(item) { return item.status !== 'pass'; });
    if (status) {
      status.textContent = failed.length ? failed.length + ' checks failed' : 'All checks passed';
    }
    if (output) {
      output.textContent = JSON.stringify(results, null, 2);
    }
  }

  window.__xjsRegressionResults = [];
  window.__runXjsRegressionSuite = function() {
    var xjs = getXjs();
    var app = new xjs.App();
    var checks = [
      runCheck('xjs.ready resolves', function() {
        return timeout(xjs.ready(), 'xjs.ready').then(function() {
          return true;
        });
      }),
      runCheck('ExtensionWindow.getInstance', function() {
        return Boolean(xjs.ExtensionWindow.getInstance());
      }),
      runCheck('App.getVersion', function() {
        return timeout(app.getVersion(), 'App.getVersion').then(function(version) {
          if (typeof version !== 'string') {
            throw new Error('Expected version string');
          }
          return version;
        });
      }),
      runCheck('App.getResolution', function() {
        return timeout(app.getResolution(), 'App.getResolution').then(function(resolution) {
          if (!shapedObject(resolution)) {
            throw new Error('Expected resolution object');
          }
          return resolution;
        });
      }),
      runCheck('App.getFrametime', function() {
        return timeout(app.getFrametime(), 'App.getFrametime').then(function(frametime) {
          if (typeof frametime !== 'number') {
            throw new Error('Expected frametime number');
          }
          return frametime;
        });
      }),
      runCheck('Dialog create/show/close', function() {
        var dialog = xjs.Dialog.createDialog('http://localhost:3999/xsplit-extension/config.html');
        if (!dialog) {
          throw new Error('Dialog.createDialog returned nothing');
        }
        dialog.show();
        dialog.close();
        return true;
      }),
      runCheck('Scene and source-list subscriptions', function() {
        xjs.ExtensionWindow.on('scene-load', function() {});
        xjs.ExtensionWindow.on('sources-list-highlight', function() {});
        xjs.ExtensionWindow.on('sources-list-select', function() {});
        xjs.ExtensionWindow.on('sources-list-update', function() {});
        return true;
      }),
      runCheck('Docs component fixtures render', function() {
        return getComponentFixtures().map(function(fixture) {
          var element = document.querySelector(fixture.selector);
          if (!customElements.get(fixture.customElement)) {
            throw new Error(fixture.customElement + ' custom element is not registered');
          }
          if (!element) {
            throw new Error(fixture.id + ' fixture was not found');
          }
          if (fixture.readyAttribute && element.getAttribute(fixture.readyAttribute) !== fixture.readyValue) {
            throw new Error(fixture.id + ' fixture did not render');
          }
          assertFixtureText(fixture, element);
          assertFixtureLinks(fixture, element);
          assertFixtureSelectors(fixture, element);
          var bounds = assertFixtureLayout(fixture, element);
          return {
            id: fixture.id,
            tagName: element.tagName.toLowerCase(),
            ready: fixture.readyAttribute ? element.getAttribute(fixture.readyAttribute) : null,
            text: element.textContent.trim().replace(/\s+/g, ' '),
            linkCount: element.querySelectorAll('a').length,
            selectorCount: fixture.expectedSelectors ? fixture.expectedSelectors.length : 0,
            bounds: bounds,
          };
        });
      }),
    ];

    return Promise.all(checks).then(function(results) {
      render(results);
      return results;
    });
  };
})();
