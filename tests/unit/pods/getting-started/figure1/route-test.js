import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | getting-started/figure1', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:getting-started/figure1');
    assert.ok(route);
  });
});
