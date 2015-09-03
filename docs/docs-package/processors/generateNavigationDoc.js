var _ = require('lodash');

module.exports = function generateNavigationDoc() {

  return {
    $runAfter: ['docs-processed'],
    $runBefore: ['rendering-docs'],
    $process: function(docs) {
      var modulesDoc = {
        value: { sections: [] },
        moduleName: 'navigation-modules',
        serviceName: 'MODULES',
        template: 'data-module.template.js',
        outputPath: 'js/navigation-modules.js'
      };

      _.forEach(docs, function(doc) {
        if ( doc.docType === 'module' ) {
          var moduleNavItem = {
            path: doc.path,
            partial: doc.outputPath,
            name: doc.id,
            type: 'module',
            pages: []
          };

          modulesDoc.value.sections.push(moduleNavItem);

          _.forEach(doc.exports, function(exportDoc) {
            if (!exportDoc.private) {
              var exportNavItem = {
                path: exportDoc.path,
                partial: exportDoc.outputPath,
                name: exportDoc.name,
                type: exportDoc.docType
              };
              moduleNavItem.pages.push(exportNavItem);
            }
          });
        }
      });

      docs.push(modulesDoc);
    }
  };
};
