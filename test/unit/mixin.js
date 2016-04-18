window.Mixin = function(fc) {
  this.fcs = [];
  if (fc !== undefined) this.register(fc);
};

Mixin.eachPromise = function(promises, done) {
  if (!promises instanceof Array || promises.length === 0) {
    done();
    return;
  }

  var promise = promises.shift();

  promise().then(function() {
    Mixin.eachPromise(promises, done);
  });
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
    Mixin.eachPromise(self.fcs.map(function(fc) {
      return function() {
        fc();
        return new Promise(function(done) { cond(done); });
      };
    }), done);
  });
};
