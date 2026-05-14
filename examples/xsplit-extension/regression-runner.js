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
        var navbar = document.querySelector('xsplit-navbar');
        if (!customElements.get('xsplit-navbar')) {
          throw new Error('xsplit-navbar custom element is not registered');
        }
        if (!navbar || navbar.getAttribute('data-ready') !== 'true') {
          throw new Error('xsplit-navbar fixture did not render');
        }
        return {
          tagName: navbar.tagName.toLowerCase(),
          ready: navbar.getAttribute('data-ready'),
        };
      }),
    ];

    return Promise.all(checks).then(function(results) {
      render(results);
      return results;
    });
  };
})();
