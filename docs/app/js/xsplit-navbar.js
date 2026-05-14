(function() {
  'use strict';

  class XSplitNavbar extends HTMLElement {
    connectedCallback() {
      if (this.hasAttribute('data-ready')) {
        return;
      }
      this.setAttribute('data-ready', 'true');
      this.innerHTML = [
        '<header class="xsplit-navbar">',
        '  <a class="xsplit-navbar__brand" href="api.html">XSplit JS Framework</a>',
        '  <nav class="xsplit-navbar__links" aria-label="API reference">',
        '    <a href="api.html">API Reference</a>',
        '    <a href="https://github.com/SplitmediaLabsLimited/xjs">GitHub</a>',
        '  </nav>',
        '</header>',
      ].join('');
    }
  }

  if (!customElements.get('xsplit-navbar')) {
    customElements.define('xsplit-navbar', XSplitNavbar);
  }
})();
