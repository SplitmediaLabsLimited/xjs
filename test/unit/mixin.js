function PromiseLoop(condition, action, value) {
  if (!condition(value)) return Promise.resolve();
  return action(value).then(nextVal => PromiseLoop(condition, action, nextVal));
}


window.Mixin = function(fc) {
  this.fcs = [];
  if (fc !== undefined) this.register(fc);
};

Mixin.prototype.register = function(fc) {
  if (typeof fc === 'function') {
    this.fcs.push(fc);
  } else if (fc instanceof Array) {
    this.fcs = this.fcs.concat(fc);
  }
};

Mixin.prototype.exec = function(cond) {
  var self = this;
  return new Promise(function(done) {
    var funcs = self.fcs.map(function(fc) {
      return function() {
        fc();
        return new Promise(function(next) {
          cond(next);
        });
      };
    });

    PromiseLoop(
      (idx) => idx < funcs.length,
      (idx) => funcs[idx]().then(() => Promise.resolve(++idx)),
      0
    ).then(() => {
      done();
    });
  });
};
