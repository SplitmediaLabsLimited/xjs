import '../../docs-old/app/js/xsplit-doc-shell.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function render(tagName) {
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  await Promise.resolve();
  return element;
}

it('defines and renders docs search fixture', async () => {
  const element = await render('xsplit-doc-search');

  assert(customElements.get('xsplit-doc-search'), 'search custom element should be registered');
  assert(element.getAttribute('data-ready') === 'true', 'search fixture should mark itself ready');
  assert(
    element.querySelector('#search[placeholder="Search"]'),
    'search input should preserve docs search markup'
  );

  element.remove();
});

it('defines and renders docs navigation fixture', async () => {
  const element = await render('xsplit-doc-navigation');

  assert(
    customElements.get('xsplit-doc-navigation'),
    'navigation custom element should be registered'
  );
  assert(
    element.getAttribute('data-ready') === 'true',
    'navigation fixture should mark itself ready'
  );
  assert(
    element.querySelector('ul.navigation'),
    'navigation list should preserve docs navigation class'
  );
  assert(
    element.textContent.includes('App class'),
    'navigation fixture should include sample API page text'
  );

  element.remove();
});

it('defines and renders docs quicklinks fixture', async () => {
  const element = await render('xsplit-doc-quicklinks');

  assert(
    customElements.get('xsplit-doc-quicklinks'),
    'quicklinks custom element should be registered'
  );
  assert(
    element.getAttribute('data-ready') === 'true',
    'quicklinks fixture should mark itself ready'
  );
  assert(
    element.querySelector('ul.quicklink'),
    'quicklinks list should preserve docs quicklink class'
  );
  assert(
    element.textContent.includes('Core module'),
    'quicklinks fixture should include sample section text'
  );

  element.remove();
});

it('defines and renders docs search-results fixture', async () => {
  const element = await render('xsplit-doc-search-results');

  assert(
    customElements.get('xsplit-doc-search-results'),
    'search results custom element should be registered'
  );
  assert(
    element.getAttribute('data-ready') === 'true',
    'search results fixture should mark itself ready'
  );
  assert(
    element.querySelector('ul.quicklink.search-results'),
    'search results should preserve docs result classes'
  );
  assert(
    element.textContent.includes('Scene class'),
    'search results fixture should include sample result text'
  );

  element.remove();
});

it('defines and renders docs member-card fixture', async () => {
  const element = await render('xsplit-doc-member-card');

  assert(
    customElements.get('xsplit-doc-member-card'),
    'member card custom element should be registered'
  );
  assert(
    element.getAttribute('data-ready') === 'true',
    'member card fixture should mark itself ready'
  );
  assert(element.querySelector('section.member'), 'member card should preserve docs member class');
  assert(element.querySelector('.params .param'), 'member card should preserve parameter markup');
  assert(
    element.textContent.includes('getVersion'),
    'member card should include sample API member text'
  );

  element.remove();
});

it('defines and renders docs code-sample fixture', async () => {
  const element = await render('xsplit-doc-code-sample');

  assert(
    customElements.get('xsplit-doc-code-sample'),
    'code sample custom element should be registered'
  );
  assert(
    element.getAttribute('data-ready') === 'true',
    'code sample fixture should mark itself ready'
  );
  assert(
    element.querySelector('pre.language-javascript code.language-javascript'),
    'code sample should preserve Prism markup'
  );
  assert(element.textContent.includes('xjs.ready'), 'code sample should include sample API usage');

  element.remove();
});
