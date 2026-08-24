(() => {
  window.__xjsComponentFixtures = [];
  window.__xjsComponentFixturesReady = fetch('./component-fixtures.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Unable to load component fixtures: HTTP ' + response.status);
      }
      return response.json();
    })
    .then((fixtures) => {
      window.__xjsComponentFixtures = fixtures;
      return fixtures;
    });
})();
