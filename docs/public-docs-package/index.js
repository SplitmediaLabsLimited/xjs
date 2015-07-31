var Package = require('dgeni').Package;
var basePackage = require('../docs-package');

module.exports = new Package('angular-v2-public-docs', [basePackage])

.config(function(readTypeScriptModules) {
  readTypeScriptModules.sourceFiles = [
    'core/index.ts'
  ];
  readTypeScriptModules.hidePrivateMembers = true;
})

.config(function(getLinkInfo) {
  getLinkInfo.useFirstAmbiguousLink = false;
})

// Configure file writing
.config(function(writeFilesProcessor) {
  writeFilesProcessor.outputFolder  = 'dist/api';
});
