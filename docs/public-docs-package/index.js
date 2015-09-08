var Package = require('dgeni').Package;
var basePackage = require('../docs-package');

module.exports = new Package('angular-v2-public-docs', [basePackage])

.config(function(readTypeScriptModules) {
  readTypeScriptModules.hidePrivateMembers = true;
  readTypeScriptModules.sourceFiles = [
    'core.ts',
    'system.ts',
    'util.ts',
    'window.ts'
  ];
})

.config(function(getLinkInfo) {
  getLinkInfo.useFirstAmbiguousLink = false;
})

// Configure file writing
.config(function(writeFilesProcessor) {
  writeFilesProcessor.outputFolder  = 'dist/api';
});
