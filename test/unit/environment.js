window.Environment = function(xjs) {
  if (xjs === undefined) throw new Error('XJS instance is required');

  this.xjs = xjs;
}

/**
 * Set Environment type of XJS
 *
 * #Usage
 *
 * ```
 * var env = new Environment(XJS);
 * env.set('html');
 * ```
 *
 * ###Valid Parameter Values
 *
 * - html
 * - script
 * - config
 */
Environment.prototype.set = function(env) {
  for (var prop in this.xjs.Environment) {
    if (
      this.xjs.Environment.hasOwnProperty(prop) &&
      typeof this.xjs.Environment[prop] === 'boolean'
    ) {
      this.xjs.Environment[prop] =
        prop.toLowerCase().indexOf(String(env).toLowerCase()) !== -1;
    }
  }
}
