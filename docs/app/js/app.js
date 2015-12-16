/* globals angular, $, Prism */

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
  };
})

.directive('autoComplete', ['$rootScope', '$window', 'MODULES',
  function($rootScope, $window, MODULES) {
  var searchObj = [];
  var searchKeys = [];

  for (var sIdx in MODULES.sections) {
    searchObj.push({
      path: MODULES.sections[sIdx].path,
      label: String(MODULES.sections[sIdx].name + ' ' +
              MODULES.sections[sIdx].type)
    });
    for (var pIdx in MODULES.sections[sIdx].pages) {
      searchObj.push({
        path: MODULES.sections[sIdx].pages[pIdx].path,
        label: String(MODULES.sections[sIdx].pages[pIdx].name + ' ' +
                MODULES.sections[sIdx].pages[pIdx].type),
        parent: String(MODULES.sections[sIdx].name + ' ' +
                MODULES.sections[sIdx].type)
      });
      for (var mIdx in MODULES.sections[sIdx].pages[pIdx].pages) {
        searchObj.push({
          path: MODULES.sections[sIdx].pages[pIdx].pages[mIdx].path,
          label: String(MODULES.sections[sIdx].pages[pIdx].pages[mIdx].name),
          parent: String(MODULES.sections[sIdx].pages[pIdx].name + ' ' +
                  MODULES.sections[sIdx].pages[pIdx].type)
        });
      }
    }
  }

  searchKeys = searchObj.map(function(obj) {
    return String(obj.label).toLowerCase();
  });

  var $search = $('#search');
  $rootScope.searchResults = [];

  $rootScope.search = function(e, ui) {
    $rootScope.searchResults = [];

    if (e === undefined) {
      var keyword = String($search.val()).toLowerCase();
      var reg = new RegExp(keyword, 'i');
      var exactSearch = [];

      searchKeys.forEach(function(item, idx) {
        if (reg.test(item) &&
          keyword !== String(item).toLowerCase()) {
          $rootScope.searchResults.push(searchObj[idx]);
        } else if (keyword === String(item).toLowerCase()) {
          exactSearch.push(searchObj[idx]);
        }
      });

      if (exactSearch.length === 1) {
        $window.location.href = $window.location.pathname + '#' +
          exactSearch[0].path;
      } else {
        if (exactSearch.length > 1) {
          $rootScope.searchResults = exactSearch;
        }
        $window.location.href = $window.location.pathname + '#search';
      }

      $search.val('');

      return false;
    } else {
      e.preventDefault();

      $window.location.href = $window.location.pathname + '#' + ui.item.path;
    }
  };

  return {
    restrict: 'A',
    link: function(scope, elem) {
      $(elem).autocomplete({
        source: function(request, response) {
          var results = $.ui.autocomplete.filter(searchObj, request.term);

          response(results.slice(0, 10));
        },
        select: $rootScope.search
      })
      .autocomplete('instance')._renderItem = function(ul, item) {
        return $('<li>')
          .append('<span>' + item.label + '</span>' +
            (item.parent ? '<span class="grey">' + item.parent + '</span>' : '')
          ).appendTo(ul);
      };
    }
  };
}])

.controller('NavController', ['$rootScope', '$scope',  '$location', 'MODULES',
  function($rootScope, $scope, $location, MODULES) {
    var self = this;

    this.sections = MODULES.sections;

    this.updateCurrentPage = function(path) {
      this.currentPage = null;
      self.currentPath = path;

      self.sections.forEach(function(section) {
        // Short-circuit out if the page has been found
        if ( self.currentPage ) {
          return;
        }
        if (section.path === path) {
          self.currentPage = section;
        } else {
          section.pages.forEach(function(page) {
            if (page.path === path) {
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
    };
  }
]);
