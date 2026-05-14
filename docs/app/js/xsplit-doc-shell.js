(function() {
  'use strict';

  var sections = [
    {
      name: 'Core',
      type: 'module',
      path: '/core',
      pages: [
        { name: 'App', type: 'class', path: '/core/app' },
        { name: 'Scene', type: 'class', path: '/core/scene' },
      ],
    },
    {
      name: 'Window',
      type: 'module',
      path: '/window',
      pages: [
        { name: 'ExtensionWindow', type: 'class', path: '/window/extension-window' },
      ],
    },
  ];

  function renderLink(path, label) {
    return '<a href="api.html#' + path + '">' + label + '</a>';
  }

  function markReady(element, html) {
    if (element.hasAttribute('data-ready')) {
      return;
    }
    element.innerHTML = html;
    element.setAttribute('data-ready', 'true');
  }

  class XSplitDocSearch extends HTMLElement {
    connectedCallback() {
      markReady(this, [
        '<div id="search-container">',
        '  <input type="text" id="search" placeholder="Search" ng-enter="search()" ng-value="keyword" ng-model="search.keyword" auto-complete>',
        '</div>',
      ].join(''));
    }
  }

  class XSplitDocNavigation extends HTMLElement {
    connectedCallback() {
      var items = [
        '<li class="active">',
        '  <a href="api.html">Home</a>',
        '</li>',
      ];

      sections.forEach(function(section, sectionIndex) {
        var className = sectionIndex === 0 ? 'child-active' : '';
        items.push(
          '<li class="' + className + '">',
          renderLink(section.path, section.name + ' ' + section.type),
          '  <ul>'
        );
        section.pages.forEach(function(page, pageIndex) {
          items.push(
            '    <li class="' + (sectionIndex === 0 && pageIndex === 0 ? 'active' : '') + '">',
            renderLink(page.path, page.name + ' ' + page.type),
            '    </li>'
          );
        });
        items.push('  </ul>', '</li>');
      });

      markReady(this, '<ul class="navigation">' + items.join('') + '</ul>');
    }
  }

  class XSplitDocQuicklinks extends HTMLElement {
    connectedCallback() {
      var links = sections.map(function(section) {
        return '<li><h3>' + renderLink(section.path, section.name + ' ' + section.type) + '</h3></li>';
      });
      markReady(this, '<ul class="quicklink">' + links.join('') + '</ul>');
    }
  }

  class XSplitDocSearchResults extends HTMLElement {
    connectedCallback() {
      var results = [
        {
          path: '/core/scene',
          label: 'Scene class',
          parent: 'Core module',
        },
        {
          path: '/window/extension-window',
          label: 'ExtensionWindow class',
          parent: 'Window module',
        },
      ];
      var links = results.map(function(result) {
        return [
          '<li><h3>',
          renderLink(result.path, result.label + '<span class="grey">' + result.parent + '</span>'),
          '</h3></li>',
        ].join('');
      });
      markReady(this, '<ul class="quicklink search-results">' + links.join('') + '</ul>');
    }
  }

  [
    ['xsplit-doc-search', XSplitDocSearch],
    ['xsplit-doc-navigation', XSplitDocNavigation],
    ['xsplit-doc-quicklinks', XSplitDocQuicklinks],
    ['xsplit-doc-search-results', XSplitDocSearchResults],
  ].forEach(function(definition) {
    if (!customElements.get(definition[0])) {
      customElements.define(definition[0], definition[1]);
    }
  });
})();
