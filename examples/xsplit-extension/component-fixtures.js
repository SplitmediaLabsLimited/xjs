(function() {
  'use strict';

  window.__xjsComponentFixtures = [
    {
      id: 'docs-navbar',
      label: 'Docs navbar',
      selector: 'xsplit-navbar',
      customElement: 'xsplit-navbar',
      readyAttribute: 'data-ready',
      readyValue: 'true',
      expectedText: [
        'XSplit JS Framework',
        'API Reference',
        'GitHub',
      ],
      expectedLinks: [
        'api.html',
        'https://github.com/SplitmediaLabsLimited/xjs',
      ],
      minBoundingBox: {
        width: 240,
        height: 20,
      },
    },
    {
      id: 'docs-search',
      label: 'Docs search',
      selector: 'xsplit-doc-search',
      customElement: 'xsplit-doc-search',
      readyAttribute: 'data-ready',
      readyValue: 'true',
      expectedSelectors: [
        '#search[placeholder="Search"]',
        '#search[auto-complete]',
      ],
      minBoundingBox: {
        width: 240,
        height: 34,
      },
    },
    {
      id: 'docs-navigation',
      label: 'Docs navigation',
      selector: 'xsplit-doc-navigation',
      customElement: 'xsplit-doc-navigation',
      readyAttribute: 'data-ready',
      readyValue: 'true',
      expectedText: [
        'Home',
        'Core module',
        'App class',
        'Scene class',
      ],
      expectedLinks: [
        'api.html',
        'api.html#/core',
        'api.html#/core/app',
        'api.html#/core/scene',
      ],
      expectedSelectors: [
        'ul.navigation',
        'li.child-active',
        'li.active',
      ],
      minBoundingBox: {
        width: 240,
        height: 120,
      },
    },
    {
      id: 'docs-quicklinks',
      label: 'Docs quicklinks',
      selector: 'xsplit-doc-quicklinks',
      customElement: 'xsplit-doc-quicklinks',
      readyAttribute: 'data-ready',
      readyValue: 'true',
      expectedText: [
        'Core module',
        'Window module',
      ],
      expectedLinks: [
        'api.html#/core',
        'api.html#/window',
      ],
      expectedSelectors: [
        'ul.quicklink',
      ],
      minBoundingBox: {
        width: 240,
        height: 80,
      },
    },
    {
      id: 'docs-search-results',
      label: 'Docs search results',
      selector: 'xsplit-doc-search-results',
      customElement: 'xsplit-doc-search-results',
      readyAttribute: 'data-ready',
      readyValue: 'true',
      expectedText: [
        'Scene class',
        'Core module',
        'ExtensionWindow class',
      ],
      expectedLinks: [
        'api.html#/core/scene',
        'api.html#/window/extension-window',
      ],
      expectedSelectors: [
        'ul.quicklink.search-results',
        '.grey',
      ],
      minBoundingBox: {
        width: 240,
        height: 80,
      },
    },
  ];
})();
