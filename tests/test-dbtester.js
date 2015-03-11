/* global QUnit: false, dbtester: false */
'use strict';
QUnit.test('dbtester.is2NF test', function (assert) {
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
  assert.ok(dbtester.is2NF(attrs, fds), 'In 2NF');

  fds = [];
  assert.ok(dbtester.is2NF(attrs, fds), 'In 2NF');

  fds = [{
    left: ['A', 'C'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['D'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(dbtester.is2NF(attrs, fds), 'In 2NF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['B', 'D'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(dbtester.is2NF(attrs, fds), 'In 2NF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(dbtester.is2NF(attrs, fds), 'In 3NF already');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(!dbtester.is2NF(attrs, fds), 'Not in 2NF');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }];
  assert.ok(!dbtester.is2NF(attrs, fds), 'Not in 2NF');
});

QUnit.test('dbtester.is3NF test', function (assert) {
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
  assert.ok(dbtester.is3NF(attrs, fds), 'In 3NF');

  fds = [];
  assert.ok(dbtester.is3NF(attrs, fds), 'In 3NF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(dbtester.is3NF(attrs, fds), 'In 3NF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['C'],
    type: 'fd'
  }];
  assert.ok(dbtester.is3NF(attrs, fds), 'In 3NF');

  fds = [{
    left: ['C'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['A', 'B', 'E'],
    right: ['C', 'D'],
    type: 'fd'
  }];
  assert.ok(dbtester.is3NF(attrs, fds), 'In 3NF');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }];
  assert.ok(dbtester.is3NF(attrs, fds), 'In BCNF already');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['D', 'E'],
    right: ['A', 'B', 'C'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['A', 'B'],
    type: 'fd'
  }];
  assert.ok(dbtester.is3NF(attrs, fds), 'In BCNF already');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(!dbtester.is3NF(attrs, fds), 'Not even in 2NF');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }];
  assert.ok(!dbtester.is3NF(attrs, fds), 'Not even in 2NF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['B', 'D'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(!dbtester.is3NF(attrs, fds), 'Not in 3NF');
});

QUnit.test('dbtester.isBCNF test', function (assert) {
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
  assert.ok(dbtester.isBCNF(attrs, fds), 'In BCNF');

  fds = [];
  assert.ok(dbtester.isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(dbtester.isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }];
  assert.ok(dbtester.isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A', 'B', 'D'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(dbtester.isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['D', 'E'],
    right: ['A', 'B', 'C'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['A', 'B'],
    type: 'fd'
  }];
  assert.ok(dbtester.isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(!dbtester.isBCNF(attrs, fds), 'In BCNF');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }];
  assert.ok(!dbtester.isBCNF(attrs, fds), 'Not even in 2NF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D', 'E'],
    type: 'fd'
  }, {
    left: ['B', 'D'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(!dbtester.isBCNF(attrs, fds), 'Not even in 3NF');

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
  assert.ok(!dbtester.isBCNF(attrs, fds), 'Not BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['C', 'D'],
    type: 'fd'
  }];
  assert.ok(!dbtester.isBCNF(attrs, fds), 'Not BCNF');

  fds = [{
    left: ['A', 'B'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['A', 'B', 'C'],
    right: ['E'],
    type: 'fd'
  }];
  assert.ok(!dbtester.isBCNF(attrs, fds), 'Not BCNF');
});
