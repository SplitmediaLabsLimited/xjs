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
 * env.set('plugin');
 * ```
 *
 * ###Valid Parameter Values
 *
 * - plugin (source plugin)
 * - extension (extension plugin)
 * - config (source properties window)
 */
Environment.prototype.set = function(env) {
  // Prevent modifying Environment IF executed within XBC
  if (/xsplit broadcaster/ig.test(navigator.appVersion)) return;

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
