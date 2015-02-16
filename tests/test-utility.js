QUnit.test('contains test', function (assert) {
  assert.ok(contains(['A', 'B', 'C'], 'A'), 'Normal case');

  assert.ok(!contains(['B', 'C'], 'A'), 'Not containing');
  assert.ok(!contains([], 'B'), 'Empty set');
  assert.ok(!contains(['A']), 'Null element');
});

QUnit.test('isSubset test', function (assert) {
  assert.ok(isSubset(['A', 'B', 'C'], ['A']), 'Normal case');
  assert.ok(isSubset(['A', 'B', 'C'], ['A', 'B', 'C']), 'Normal case');
  assert.ok(isSubset(['B'], []), 'Empty set');

  assert.ok(!isSubset(['B', 'C'], ['A', 'B']), 'Extra element');
  assert.ok(!isSubset([], ['A']), 'Extra element');
});

QUnit.test('isSetsEqual', function (assert) {
  assert.ok(isSetsEqual(['A', 'B', 'C'], ['C', 'A', 'B']), 'Normal case');
  assert.ok(isSetsEqual(['A', 'B', 'C'], ['A', 'B', 'C']), 'Normal case');
  assert.ok(isSetsEqual([], []), 'Empty sets');

  assert.ok(!isSetsEqual(['A', 'B', 'C', 'D'], ['C', 'A', 'B']), 'Subset case');
  assert.ok(!isSetsEqual(['A', 'B', 'C'], ['C', 'A', 'B', 'D']), 'Subset case');
});

QUnit.test('isProperSubset test', function (assert) {
  assert.ok(isSubset(['A', 'B', 'C'], ['A']), 'Normal case');
  assert.ok(isSubset(['B'], []), 'Empty set');

  assert.ok(isSubset(['A', 'B', 'C'], ['A', 'B', 'C']), 'Equal sets');
  assert.ok(!isSubset(['B', 'C'], ['A', 'B']), 'Extra element');
  assert.ok(!isSubset([], ['A']), 'Extra element');
});

QUnit.test('getUnion test', function (assert) {
  assert.deepEqual(getUnion(['A', 'B'], ['C', 'D']), ['A', 'B', 'C', 'D'], '2 disjoint sets');
  assert.deepEqual(getUnion(['A', 'B', 'C'], ['C', 'D']), ['A', 'B', 'C', 'D'], '2 non-disjoint sets');
  assert.deepEqual(getUnion(['A', 'B'], ['A', 'B', 'C', 'D']), ['A', 'B', 'C', 'D'], 'Proper subset');
  assert.deepEqual(getUnion(['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'D']), ['A', 'B', 'C', 'D'], 'Same sets');
  assert.deepEqual(getUnion(['A', 'B', 'C', 'D'], []), ['A', 'B', 'C', 'D'], 'One empty set');
});

QUnit.test('getIntersection test', function (assert) {
  assert.deepEqual(getIntersection(['A', 'B'], ['A', 'C']), ['A'], 'proper intersection');
  assert.deepEqual(getIntersection(['A', 'B'], ['A', 'B', 'C']), ['A', 'B'], 'subset');
  assert.deepEqual(getIntersection(['A', 'B'], ['C', 'D']), [], 'nothing in command');
  assert.deepEqual(getIntersection(['A', 'B'], []), [], 'epmty set');
});

QUnit.test('removeDuplicates test', function (assert) {
  assert.deepEqual(removeDuplicates(['A', 'B', 'A', 'A', 'C', 'B']), ['A', 'B', 'C'], 'normal case');
  assert.deepEqual(removeDuplicates(['A', 'A', 'A',]), ['A'], 'only one unique element');
  assert.deepEqual(removeDuplicates(['A', 'B', 'C']), ['A', 'B', 'C'], 'no duplicates');
  assert.deepEqual(removeDuplicates([]), [], 'empty input set');
});

QUnit.test('getDifference test', function (assert) {
  assert.deepEqual(getDifference(['A', 'B', 'C'], ['B']), ['A', 'C'], 'Subset');
  assert.deepEqual(getDifference(['A', 'B', 'C'], ['A', 'C', 'B']), [], 'Same sets');
  assert.deepEqual(getDifference(['A', 'B', 'C'], ['B', 'D']), ['A', 'C'], 'Extra elements');
  assert.deepEqual(getDifference(['A', 'B', 'C'], []), ['A', 'B', 'C'], 'Empty second set');
});

QUnit.test('getClosureForAttr single-attr-test', function (assert) {
  var fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fd), ['A', 'B']), 'One fd only');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fd), ['A', 'B', 'C']), 'Transitive fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['A'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fd), ['A', 'B', 'C']), 'Circular fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C', 'A'],
    right: ['D'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fd), ['A', 'B', 'C', 'D']), 'Derived fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C', 'A'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['B', 'D'],
    right: ['A', 'E'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fd), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C', 'A'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['B', 'D'],
    right: ['A', 'E'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['D'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fd), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');
});

QUnit.test('getClosureForAttr multiple-attrs-test', function (assert) {
  var fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fd), ['A', 'B', 'E']), 'One fd only');

  fd = [{
    left: ['A', 'E'],
    right: ['B', 'D'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fd), ['A', 'B', 'D', 'E']), 'One multi-attr fd');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fd), ['A', 'B', 'C', 'E']), 'Transitive fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['A'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fd), ['A', 'B', 'C', 'E']), 'Circular fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C', 'A'],
    right: ['D'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fd), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C', 'A'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['B', 'D'],
    right: ['A', 'E'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fd), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

  fd = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C', 'A'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['B', 'D'],
    right: ['A', 'E'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['D'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fd), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');
});

QUnit.test('getAllKeys from-fds-only', function (assert) {
  var attrs = ['A', 'B', 'C', 'D'];
  var fd = [{
    left: ['A'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['D'],
    type: 'fd'
  }];
  assert.deepEqual(getAllKeys(attrs, fd), [['A', 'B']], 'One fd only');

  fd = [{
    left: ['A', 'B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['D'],
    type: 'fd'
  }];

  assert.deepEqual(getAllKeys(attrs, fd), [['A', 'B']], 'One fd only');
})
