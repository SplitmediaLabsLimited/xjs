const fs = require('fs');
const path = require('path');

// We don't use fs.promise since a couple of xsplit guys are using outdated nodejs versions
// due to some older plugins and the lack of time to resolve build issues if ever they do update
// to latest LTS (v10.x)

// since v8.x is the version that someone who complained to me about another tool that I made
// that didn't work in his/her machine... I'll assume that that's the "oldest" version that the
// team has. Also, that version already had support for promise, so let's create a wrapper.

// Usage: pm(fs, 'readFile', 'path/to/file').then(console.log);
function pm() {
  // Spread operator isn't supported in 8.2.1, so we'll have to make do with arguments
  const args = Array.from(arguments);

  return new Promise((resolve, reject) => {
    try {
      // First 2 is module + method name + args
      const module = args.shift();
      const method = args.shift();
      const cb = (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      };

      args.push(cb);

      // The rest is the params... we could use spread to.. oh wait, that isn't supported by 8.2.1
      // we'll make do with fn.apply
      if (typeof module[method] === 'function') {
        module[method].apply(null, args);
      } else {
        throw new Error(`module ${module} has no method ${method}`);
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Check if there's an argv
const file = process.argv[2] || 'index.js';

// ok now, the real work
pm(fs, 'access', 'package.json')
  .then(() => pm(fs, 'readFile', 'package.json', 'utf8'))
  .then(data => {
    try {
      const json = JSON.parse(data);

      // Get 'version'
      return Promise.resolve(json.version);
    } catch (error) {
      console.error(error.message);
      return Promise.reject();
    }
  })
  .then(version => {
    const readDist = pm(fs, 'readFile', path.join('dist', file), 'utf8');

    return Promise.all([version, readDist]);
  })
  .then(([version, dist]) => {
    const parsed = String(dist).replace('%XJS_VERSION%', version);

    return pm(fs, 'writeFile', path.join('dist', file), parsed);
  })
  .then(() => {
    console.log('\x1b[32m%s\x1b[0m', 'Injected version number to output file');
  })
  .catch(reason => {
    console.error(reason);
  });
