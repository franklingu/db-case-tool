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
  var fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fds), ['A', 'B']), 'One fd only');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fds), ['A', 'B', 'C']), 'Transitive fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fds), ['A', 'B', 'C']), 'Circular fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fds), ['A', 'B', 'C', 'D']), 'Derived fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');
});

QUnit.test('getClosureForAttr multiple-attrs-test', function (assert) {
  var fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'E']), 'One fd only');

  fds = [{
    left: ['A', 'E'],
    right: ['B', 'D'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'D', 'E']), 'One multi-attr fd');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }];
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'E']), 'Transitive fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'E']), 'Circular fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

  fds = [{
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
  assert.ok(isSetsEqual(getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');
});

// a subtest for an incomplete function only
QUnit.test('getAllKeys from-fds-only', function (assert) {
  var attrs = ['A', 'B', 'C', 'D'];
  var fds = [{
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
  assert.deepEqual(getAllKeys(attrs, fds), [['A', 'B']], 'One fd only');

  fds = [{
    left: ['A', 'B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['D'],
    type: 'fd'
  }];

  assert.deepEqual(getAllKeys(attrs, fds), [['A', 'B']], 'One fd only');
})

QUnit.test('isSuperkeyForRelation', function (assert) {
  var attrs = ['A', 'B', 'C', 'D', 'E'];
  var fds = [{
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
  assert.ok(isSuperkeyForRelation(['A', 'C', 'D'], attrs, fds), "Candidate key 1");
  assert.ok(isSuperkeyForRelation(['B', 'C', 'D'], attrs, fds), "Candidate key 2");
  assert.ok(isSuperkeyForRelation(['E', 'C', 'D'], attrs, fds), "Candidate key 1");
  assert.ok(isSuperkeyForRelation(['A', 'C', 'D', 'E'], attrs, fds), "Superkey 1");
  assert.ok(isSuperkeyForRelation(['A', 'C', 'D', 'B'], attrs, fds), "Superkey 2");
  assert.ok(isSuperkeyForRelation(['A', 'B', 'C', 'D', 'E'], attrs, fds), "Superkey 3");

  assert.ok(!isSuperkeyForRelation(['A', 'B', 'D'], attrs, fds), "Not superkey 1");
  assert.ok(!isSuperkeyForRelation(['A', 'B', 'D', 'E'], attrs, fds), "Not superkey 2");
  assert.ok(!isSuperkeyForRelation(['A', 'B'], attrs, fds), "Not superkey 3");
});

QUnit.test('isKeyForRelation', function (assert) {
  var attrs = ['A', 'B', 'C', 'D', 'E'];
  var fds = [{
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
  assert.ok(isKeyForRelation(['A', 'C', 'D'], attrs, fds), "Candidate key 1");
  assert.ok(isKeyForRelation(['B', 'C', 'D'], attrs, fds), "Candidate key 2");
  assert.ok(isKeyForRelation(['E', 'C', 'D'], attrs, fds), "Candidate key 1");

  assert.ok(!isKeyForRelation(['A', 'C', 'D', 'E'], attrs, fds), "Superkey 1");
  assert.ok(!isKeyForRelation(['A', 'C', 'D', 'B'], attrs, fds), "Superkey 2");
  assert.ok(!isKeyForRelation(['A', 'B', 'C', 'D', 'E'], attrs, fds), "Superkey 3");
  assert.ok(!isKeyForRelation(['A', 'B', 'D'], attrs, fds), "Not Key 1");
  assert.ok(!isKeyForRelation(['A', 'B', 'D', 'E'], attrs, fds), "Not Key 2");
  assert.ok(!isKeyForRelation(['A', 'B'], attrs, fds), "Not Key 3");
})
