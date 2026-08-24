(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const fixtureId = params.get('id');
  const root = document.getElementById('component-capture');
  const preview = document.getElementById('component-capture-preview');

  function fail(message) {
    root.setAttribute('data-error', message);
    root.textContent = message;
  }

  function waitForPaint() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }

  async function render(fixtures) {
    const fixture = fixtures.find((item) => item.id === fixtureId) || fixtures[0];
    if (!fixture) {
      fail('No component fixture available.');
      return;
    }

    root.setAttribute('data-fixture-id', fixture.id);
    preview.innerHTML = fixture.exampleCode || '';

    if (fixture.customElement && customElements.whenDefined) {
      await customElements.whenDefined(fixture.customElement);
    }

    await waitForPaint();

    const rendered = preview.querySelector(fixture.selector || fixture.customElement);
    if (!rendered) {
      fail('Component fixture did not render: ' + fixture.id);
      return;
    }
    if (
      fixture.readyAttribute &&
      fixture.readyValue !== undefined &&
      rendered.getAttribute(fixture.readyAttribute) !== fixture.readyValue
    ) {
      fail('Component fixture did not become ready: ' + fixture.id);
      return;
    }

    root.setAttribute('data-ready', 'true');
  }

  window.__xjsComponentFixturesReady.then(render).catch((error) => {
    fail(error.message);
  });
})();
