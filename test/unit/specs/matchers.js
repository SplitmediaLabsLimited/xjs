/* globals beforeEach, jasmine */

beforeEach(function() {
    'use strict';
    
    jasmine.addMatchers({
        toBeInstanceOf: function() {
            return { 
                compare: function(actual, expected) {
                    var pass = true;

                    pass = (actual instanceof expected);
        
                    return { pass: pass };
                }
            };
        },

        eachToBeInstanceOf: function() {
            return {
                compare: function(actual, expected) {
                    var pass = (actual.length > 0);
        
                    for (var i = 0; i < actual.length; i++) {
                        pass = (actual[i] instanceof expected);
        
                        if (!pass) {
                            break;
                        }    
                    }
        
                    return { pass: pass };
                }
            };
        },

        eachHasMethods: function() {
            return {
                compare: function(actual, expected) {
                    var pass = (actual.length > 0);
                    var methods = expected.split(',');

                    loop1:
                        for (var i = 0; i < actual.length; i++) {
                    loop2:        
                            for (var j = 0; j < methods.length; j++) {
                                var testObject = actual[i];
                                var testMethod = methods[j].trim();

                                pass = (typeof testObject[testMethod] == 'function' );
                                if (!pass)
                                    break loop1;
                            }
                        }
        
                    return { pass: pass };
                }
            };
        },

        eachHasProperties: function() {
            return {
                compare: function(actual, expected) {
                    var pass = (actual.length > 0);
                    var properties = expected.split(',');

                    loop1:
                        for (var i = 0; i < actual.length; i++) {
                            var testObject = actual[i];
                    loop2:        
                            for (var j = 0; j < properties.length; j++) {
                                
                                var testProperties = properties[j].trim();

                                pass = (typeof testObject[testProperties] !== 'undefined' );
                                if (!pass)
                                    break loop1;
                            }
                        }
        
                    return { pass: pass };
                }
            };
        },

        hasProperties: function() {
            return {
                compare: function(actual, expected) {
                    var pass = (actual.length > 0);
                    var properties = expected.split(',');

                    for (var i = 0; i < properties.length; i++) {
                        var testProperty = properties[i].trim();

                        pass = (typeof actual[testProperty] !== 'undefined');
                        if (!pass)
                            break;
                    }
        
                    return { pass: pass };
                }
            };
        },        

        hasMethods: function() {
            return {
                compare: function(actual, expected) {
                    var pass = (actual.length > 0);
                    var methods = expected.split(',');

                    for (var i = 0; i < methods.length; i++) {
                        var testMethod = methods[i].trim();

                        pass = (typeof actual[testMethod] === 'function');
                        if (!pass)
                            break;
                    }
                    return { pass: pass };
                }
            };
        },
        toBeTypeOf: function() {
            return {
                compare: function(actual, expected) {
                    var pass = 
                        (typeof actual === String(expected).toLowerCase());

                    return { pass: pass };
                }
            };
        }
    });
});