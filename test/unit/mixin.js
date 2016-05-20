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
    self.fcs.map(function(fc) {
      return function() {
        fc();
        return new Promise(function(next) {
          cond(next);
        });
      };
    }).reduce(function(current, next) {
      return current().then(next);
    }).then(done);
  });
};
