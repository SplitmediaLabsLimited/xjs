import '../../docs/app/js/xsplit-navbar.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

it('defines and renders xsplit-navbar', async () => {
  const element = document.createElement('xsplit-navbar');
  document.body.appendChild(element);
  await Promise.resolve();

  assert(customElements.get('xsplit-navbar'), 'custom element should be registered');
  assert(element.textContent.includes('XSplit JS Framework'), 'brand text should render');
  assert(element.querySelector('a[href="api.html"]'), 'API link should render');

  element.remove();
});
