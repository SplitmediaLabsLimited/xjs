angular.module('app', [
  'navigation-modules'
])

.directive('ngEnter', function() {
  return function(scope, element, attr) {
    element.bind('keydown keypress', function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attr.ngEnter);
        });

        event.preventDefault();
      }
    });
  }
})

.directive('autoComplete', ['$rootScope', '$window', 'MODULES',
  function($rootScope, $window, MODULES) {
  var searchObj = [];
  var searchKeys = [];

  for (var sIdx in MODULES.sections) {
    searchObj.push({
      path: MODULES.sections[sIdx].path,
      name: String(MODULES.sections[sIdx].name + ' ' +
              MODULES.sections[sIdx].type).toLowerCase()
    });
    for (var pIdx in MODULES.sections[sIdx].pages) {
      searchObj.push({
        path: MODULES.sections[sIdx].pages[pIdx].path,
        name: String(MODULES.sections[sIdx].pages[pIdx].name + ' ' +
                MODULES.sections[sIdx].pages[pIdx].type).toLowerCase()
      });
    }
  }

  searchKeys = searchObj.map(function(obj) {
    return obj.name;
  });

  $search = $('#search');
  $rootScope.searchResults = [];

  $rootScope.search = function(e, ui) {
    var keyword = ui === undefined ?
      String($search.val()).toLowerCase() : ui.item.value;

    if (ui !== undefined) e.preventDefault();
    $search.val('');
    $rootScope.searchResults = [];

    var searchResults = [];
    var keywordIndex = searchKeys.indexOf(keyword);

    if (keywordIndex !== -1) {
      $window.location.href = $window.location.pathname + '#' +
        searchObj[keywordIndex].path;
    } else {
      var reg = new RegExp(keyword, 'ig');
      for (var sIdx in searchKeys) {
        if (reg.test(searchKeys[sIdx])) {
          $rootScope.searchResults.push(searchObj[sIdx]);
        }
      }
      $window.location.href = $window.location.pathname + '#search';
    }
  }

  return {
    restrict: 'A',
    link: function(scope, elem, attr, ctrl) {
      $(elem).autocomplete({
        source: searchKeys,
        select: $rootScope.search
      });
    }
  };
}])

.controller('NavController', ['$rootScope', '$scope',  '$location', 'MODULES',
  function($rootScope, $scope, $location, MODULES) {
    var self = this;

    this.sections = MODULES.sections;

    this.updateCurrentPage = function(path) {
      this.currentPage = null;
      self.currentPath = path.substring(1);

      self.sections.forEach(function(section) {
        // Short-circuit out if the page has been found
        if ( self.currentPage ) {
          return;
        }
        if ('/' + section.path === path) {
          self.currentPage = section;
        } else {
          section.pages.forEach(function(page) {
            if ('/' + page.path === path) {
              self.currentPage = page;
            }
          });
        }
      });

      if (self.currentPage) {
        $rootScope.searchResults = [];
      }
    };

    $scope.$on('$includeContentLoaded', function() {
      Prism.highlightAll();
    });

    /* Search behavior */

    $scope.$watch(
      function getLocationPath() { return $location.path(); },
      function handleLocationPathChange(path) { self.updateCurrentPage(path); }
    );

    $scope.isActive = function(url) {
      var reg = new RegExp(url + '/');
      return reg.test(self.currentPath);
    }
  }
]);
