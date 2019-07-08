"use strict";
exports.__esModule = true;
var _callbacks = {};
function exec(fn) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        // @TODO: Add condition for remote thingy
        if (!window.external || !window.external[fn] || typeof window.external !== "function") {
            reject(new Error(fn + " is not a valid external call, or is not supported on the target environment."));
            return;
        }
        var xsplitFunction = window.external[fn];
        var ret = xsplitFunction.apply(void 0, args);
        _callbacks[ret] = function (result) {
            resolve(result);
        };
    });
}
exports.exec = exec;
