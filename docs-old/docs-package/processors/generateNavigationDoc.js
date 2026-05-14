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
            name: String(doc.id).charAt(0).toUpperCase() +
              String(doc.id).slice(1),
            type: 'Module',
            pages: []
          };

          modulesDoc.value.sections.push(moduleNavItem);

          _.forEach(doc.exports, function(exportDoc) {
            if (!exportDoc.private) {
              var exportNavItem = {
                path: exportDoc.path,
                partial: exportDoc.outputPath,
                name: exportDoc.name,
                type: String(exportDoc.docType).charAt(0).toUpperCase() +
                  String(exportDoc.docType).slice(1),
                pages: []
              };
              moduleNavItem.pages.push(exportNavItem);

              _.forEach(exportDoc.members, function(memberDoc) {
                if (memberDoc.docType === 'member') {
                  var methodNavItem = {
                    path: exportDoc.path + String(memberDoc.path).replace('/', '#'),
                    partial: exportDoc.outputPath,
                    name: memberDoc.name
                  };
                  exportNavItem.pages.push(methodNavItem);
                }
              });

              _.forEach(exportDoc.statics, function(staticDoc) {
                if (staticDoc.docType === 'member') {
                  var staticNavItem = {
                    path: exportDoc.path + String(staticDoc.path).replace('/', '#'),
                    partial: exportDoc.outputPath,
                    name: staticDoc.name
                  };
                  exportNavItem.pages.push(staticNavItem);
                }
              });
            }
          });
        }
      });

      docs.push(modulesDoc);
    }
  };
};
