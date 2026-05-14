/* globals beforeEach, jasmine */

beforeEach(() => {
  jasmine.addMatchers({
    toBeInstanceOf: () => ({
      compare: (actual, expected) => {
        var pass = true;

        pass = actual instanceof expected;

        return { pass: pass };
      },
    }),

    eachToBeInstanceOf: () => ({
      compare: (actual, expected) => {
        var pass = actual.length > 0;

        for (var i = 0; i < actual.length; i++) {
          pass = actual[i] instanceof expected;

          if (!pass) {
            break;
          }
        }

        return { pass: pass };
      },
    }),

    eachToBeTypeOf: () => ({
      compare: (actual, expected) => {
        var pass = actual.length > 0;

        for (var i = 0; i < actual.length; i++) {
          pass = typeof actual[i] === expected;

          if (!pass) {
            break;
          }
        }

        return { pass: pass };
      },
    }),

    eachHasMethods: () => ({
      compare: (actual, expected) => {
        var pass = actual.length > 0;
        var methods = expected.split(',');

        loop1: for (var i = 0; i < actual.length; i++) {
          for (var j = 0; j < methods.length; j++) {
            var obj = actual[i];
            var method = methods[j].trim();

            pass = typeof obj[method] === 'function';
            if (!pass) break loop1;
          }
        }

        return { pass: pass };
      },
    }),

    eachHasProperties: () => ({
      compare: (actual, expected) => {
        var pass = actual.length > 0;
        var properties = expected.split(',');

        loop1: for (var i = 0; i < actual.length; i++) {
          var obj = actual[i];
          for (var j = 0; j < properties.length; j++) {
            var prop = properties[j].trim();

            pass = typeof obj[prop] !== 'undefined';
            if (!pass) break loop1;
          }
        }

        return { pass: pass };
      },
    }),

    hasProperties: () => ({
      compare: (actual, expected) => {
        var pass = actual.length > 0;
        var properties = expected.split(',');

        for (var i = 0; i < properties.length; i++) {
          var testProperty = properties[i].trim();

          pass = typeof actual[testProperty] !== 'undefined';
          if (!pass) break;
        }

        return { pass: pass };
      },
    }),

    hasMethods: () => ({
      compare: (actual, expected) => {
        var pass = actual.length > 0;
        var methods = expected.split(',');
        var missingMethod = '';

        for (var i = 0; i < methods.length; i++) {
          var testMethod = methods[i].trim();

          pass = typeof actual[testMethod] === 'function';
          if (!pass) {
            missingMethod = testMethod;
            break;
          }
        }
        return { pass: pass, message: 'Missing method ' + missingMethod };
      },
    }),

    toBeTypeOf: () => ({
      compare: (actual, expected) => {
        var pass = typeof actual === String(expected).toLowerCase();

        return { pass: pass };
      },
    }),

    toBeBoolean: () => ({
      compare: (actual) => ({
        pass: typeof actual === 'boolean',
        message: 'Expected ' + actual + ' is not boolean',
      }),
    }),

    toBeArray: () => ({
      compare: (actual) => ({
        pass: actual instanceof Array,
        message: 'Expected ' + actual + ' is not an array',
      }),
    }),

    toBeEmptyArray: () => ({
      compare: (actual) => {
        var pass = actual instanceof Array && actual.length === 0;
        return { pass: pass };
      },
    }),
  });
});
