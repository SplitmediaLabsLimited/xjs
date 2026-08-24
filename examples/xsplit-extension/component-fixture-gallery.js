(function() {
  'use strict';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function listItems(items, getLabel) {
    if (!items || !items.length) {
      return '<li>None</li>';
    }
    return items.map(function(item) {
      return '<li>' + getLabel(item) + '</li>';
    }).join('');
  }

  function apiRows(items) {
    if (!items || !items.length) {
      return '<tr><td colspan="4">No public API documented yet.</td></tr>';
    }
    return items.map(function(item) {
      return [
        '<tr>',
        '<td><code>' + escapeHtml(item.name) + '</code></td>',
        '<td><code>' + escapeHtml(item.type || '-') + '</code></td>',
        '<td>' + escapeHtml(item.default || '-') + '</td>',
        '<td>' + escapeHtml(item.description || '') + '</td>',
        '</tr>',
      ].join('');
    }).join('');
  }

  function renderApiTable(title, items) {
    return [
      '<section class="component-api-group">',
      '<h4>' + escapeHtml(title) + '</h4>',
      '<table>',
      '<thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>',
      '<tbody>',
      apiRows(items),
      '</tbody>',
      '</table>',
      '</section>',
    ].join('');
  }

  function renderRegressionDetails(fixture) {
    return [
      '<details class="component-regression">',
      '<summary>Regression coverage</summary>',
      '<div class="regression-grid">',
      '<section>',
      '<h4>Expected text</h4>',
      '<ul>',
      listItems(fixture.expectedText, function(text) {
        return '<code>' + escapeHtml(text) + '</code>';
      }),
      '</ul>',
      '</section>',
      '<section>',
      '<h4>Expected selectors</h4>',
      '<ul>',
      listItems(fixture.expectedSelectors, function(selector) {
        return '<code>' + escapeHtml(selector) + '</code>';
      }),
      '</ul>',
      '</section>',
      '</div>',
      '</details>',
    ].join('');
  }

  function renderFixtureShell(fixture) {
    var api = fixture.api || {};
    return [
      '<article class="component-example-card" data-component-example-id="' + escapeHtml(fixture.id) + '">',
      '<header class="component-example-header">',
      '<p class="component-kicker">' + escapeHtml(fixture.customElement) + '</p>',
      '<h3>' + escapeHtml(fixture.title || fixture.label || fixture.id) + '</h3>',
      '<p>' + escapeHtml(fixture.description || '') + '</p>',
      '</header>',
      '<div class="component-preview" data-component-preview></div>',
      '<section class="component-code">',
      '<h4>Example code</h4>',
      '<pre><code>' + escapeHtml(fixture.exampleCode || '') + '</code></pre>',
      '</section>',
      '<section class="component-api">',
      '<h4>API surface</h4>',
      renderApiTable('Attributes', api.attributes),
      renderApiTable('Properties', api.properties),
      renderApiTable('Events', api.events),
      renderApiTable('Slots', api.slots),
      '</section>',
      renderRegressionDetails(fixture),
      '</article>',
    ].join('');
  }

  function renderFixture(gallery, fixture) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = renderFixtureShell(fixture);
    var card = wrapper.firstChild;
    var preview = card.querySelector('[data-component-preview]');
    preview.innerHTML = fixture.exampleCode || '';
    gallery.appendChild(card);
  }

  function renderGallery(fixtures) {
    var gallery = document.getElementById('component-fixture-gallery');
    if (!gallery) {
      return;
    }
    gallery.innerHTML = '';
    fixtures.forEach(function(fixture) {
      renderFixture(gallery, fixture);
    });
    gallery.setAttribute('data-ready', 'true');
  }

  if (window.__xjsComponentFixturesReady) {
    window.__xjsComponentFixturesReady.then(renderGallery).catch(function(error) {
      var gallery = document.getElementById('component-fixture-gallery');
      if (gallery) {
        gallery.textContent = 'Unable to render component examples: ' + error.message;
      }
    });
  }
})();
