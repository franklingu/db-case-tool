// TODO: complete the following function
QUnit.test('is2NF test', function (assert) {
  assert.ok(false, 'Not implemented');
});

QUnit.test('is3NF test', function (assert) {
  var attrs = ['A', 'B', 'C', 'D', 'E'];
  var fds = [{
    left: ['A', 'B', 'C'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['E', 'C'],
    type: 'fd'
  }];
  assert.ok(is3NF(attrs, fds), 'In 3NF');
});

// TODO: complete the following
QUnit.test('isBCNF test', function (assert) {
  var attrs = ['A', 'B', 'C', 'D', 'E'];
  var fds = [{
    left: ['A', 'B', 'C'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['E', 'C'],
    type: 'fd'
  }];
  assert.ok(isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A', 'B', 'D'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(!isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B', 'C'],
    right: ['E'],
    type: 'fd'
  }, {
    left: ['D', 'E'],
    right: ['A'],
    type: 'fd'
  }];
  assert.ok(!isBCNF(attrs, fds), 'Not BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }];
  assert.ok(!isBCNF(attrs, fds), 'Not BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['A', 'B', 'C'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(!isBCNF(attrs, fds), 'Not BCNF');
});
