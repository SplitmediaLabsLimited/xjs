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
  ];
})();
