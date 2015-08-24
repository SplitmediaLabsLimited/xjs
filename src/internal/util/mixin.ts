export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name === 'constructor') {
        return;
      }
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    })
  });
}
