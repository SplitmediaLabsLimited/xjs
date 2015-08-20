angular.module('app', [
  'navigation-modules',
  'navigation-guides'
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

.controller('NavController', ['$scope',  '$location', 'MODULES', 'GUIDES',
  function($scope, $location, MODULES, GUIDES) {
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
        $scope.searchResults = [];
      }
    };

    $scope.$on('$includeContentLoaded', function() {
      Prism.highlightAll();
    });

    /* Search behavior */
    var searchObj = [];
    var searchKeys = [];

    for (var sIdx in this.sections) {
      searchObj.push({
        path: this.sections[sIdx].path,
        name: String(this.sections[sIdx].name + ' ' +
                this.sections[sIdx].type).toLowerCase()
      });
      for (var pIdx in this.sections[sIdx].pages) {
        searchObj.push({
          path: this.sections[sIdx].pages[pIdx].path,
          name: String(this.sections[sIdx].pages[pIdx].name + ' ' +
                  this.sections[sIdx].pages[pIdx].type).toLowerCase()
        });
      }
    }

    searchKeys = searchObj.map(function(obj) {
      return obj.name;
    });

    var $search = $('#search');

    $search.autocomplete({
      source: searchKeys
    });

    $scope.searchResults = [];

    $scope.search = function(e) {
      var keyword = String($search.val()).toLowerCase();
      $search.val('');
      $scope.searchResults = [];

      var searchResults = [];
      var keywordIndex = searchKeys.indexOf(keyword);

      if (keywordIndex !== -1) {
        $location.url(searchObj[keywordIndex].path);
      } else {
        var reg = new RegExp(keyword, 'ig');
        for (var sIdx in searchKeys) {
          if (reg.test(searchKeys[sIdx])) {
            $scope.searchResults.push(searchObj[sIdx]);
          }
        }
        $location.url('search');
      }
    }

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
