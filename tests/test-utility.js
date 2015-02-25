/* global QUnit: false, utility: false */
'use strict';
QUnit.test('utility.contains test', function (assert) {
  assert.ok(utility.contains(['A', 'B', 'C'], 'A'), 'Normal case');
  assert.ok(utility.contains([['A'], ['B', 'C']], ['A']), 'Normal case');
  assert.ok(utility.contains([['A'], ['B', 'C']], ['C', 'B']), 'Normal case');

  assert.ok(!utility.contains(['B', 'C'], 'A'), 'Not containing');
  assert.ok(!utility.contains([], 'B'), 'Empty set');
  assert.ok(!utility.contains(['A']), 'Null element');
  assert.ok(!utility.contains([['A'], ['B', 'C']], ['A', 'B']), 'Different set elems');
});

QUnit.test('utility.isSubset test', function (assert) {
  assert.ok(utility.isSubset(['A', 'B', 'C'], ['A']), 'Normal case');
  assert.ok(utility.isSubset(['A', 'B', 'C'], ['A', 'B', 'C']), 'Normal case');
  assert.ok(utility.isSubset([['A'], ['B'], ['C']], [['A'], ['B']]), 'Normal case');
  assert.ok(utility.isSubset([['A', 'B'], ['C']], [['A', 'B']]), 'Normal case');
  assert.ok(utility.isSubset(['B'], []), 'Empty set');

  assert.ok(!utility.isSubset(['B', 'C'], ['A', 'B']), 'Extra element');
  assert.ok(!utility.isSubset([], ['A']), 'Extra element');
  assert.ok(!utility.isSubset([['A', 'B'], ['C']], [['A', 'C']]), 'Different set elems');
});

QUnit.test('utility.isSetsEqual', function (assert) {
  assert.ok(utility.isSetsEqual(['A', 'B', 'C'], ['C', 'A', 'B']), 'Normal case');
  assert.ok(utility.isSetsEqual(['A', 'B', 'C'], ['A', 'B', 'C']), 'Normal case');
  assert.ok(utility.isSetsEqual([['A', 'B'], ['C'], ['D']], [['B', 'A'], ['D'], ['C']]), 'Normal case');
  assert.ok(utility.isSetsEqual([], []), 'Empty sets');

  assert.ok(!utility.isSetsEqual(['A', 'B', 'C', 'D'], ['C', 'A', 'B']), 'Subset case');
  assert.ok(!utility.isSetsEqual(['A', 'B', 'C'], ['C', 'A', 'B', 'D']), 'Subset case');
});

QUnit.test('utility.isProperSubset test', function (assert) {
  assert.ok(utility.isProperSubset(['A', 'B', 'C'], ['A']), 'Normal case');
  assert.ok(utility.isProperSubset(['B'], []), 'Empty set');

  assert.ok(!utility.isProperSubset(['A', 'B', 'C'], ['A', 'B', 'C']), 'Equal sets');
  assert.ok(!utility.isProperSubset(['B', 'C'], ['A', 'B']), 'Extra element');
  assert.ok(!utility.isProperSubset([], ['A']), 'Extra element');
});

QUnit.test('utility.getUnion test', function (assert) {
  assert.ok(utility.isSetsEqual(utility.getUnion(['A', 'B'], ['C', 'D']), ['A', 'B', 'C', 'D']), '2 disjoint sets');
  assert.ok(utility.isSetsEqual(utility.getUnion([['A', 'B']], [['C', 'D']]), [['A', 'B'], ['C', 'D']]), '2 disjoint sets');
  assert.ok(utility.isSetsEqual(utility.getUnion(['A', 'B', 'C'], ['C', 'D']), ['A', 'B', 'C', 'D']), '2 non-disjoint sets');
  assert.ok(utility.isSetsEqual(utility.getUnion(['A', 'B'], ['A', 'B', 'C', 'D']), ['A', 'B', 'C', 'D']), 'Proper subset');
  assert.ok(utility.isSetsEqual(utility.getUnion(['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'D']), ['A', 'B', 'C', 'D']), 'Same sets');
  assert.ok(utility.isSetsEqual(utility.getUnion(['A', 'B', 'C', 'D'], []), ['A', 'B', 'C', 'D']), 'One empty set');
});

QUnit.test('utility.getIntersection test', function (assert) {
  assert.ok(utility.isSetsEqual(utility.getIntersection(['A', 'B'], ['A', 'C']), ['A']), 'proper intersection');
  assert.ok(utility.isSetsEqual(utility.getIntersection(['A', 'B'], ['A', 'B', 'C']), ['A', 'B']), 'subset');
  assert.ok(utility.isSetsEqual(utility.getIntersection([['A', 'B']], [['A', 'B'], ['C']]), [['A', 'B']]), 'subset');
  assert.ok(utility.isSetsEqual(utility.getIntersection(['A', 'B'], ['C', 'D']), []), 'nothing in command');
  assert.ok(utility.isSetsEqual(utility.getIntersection(['A', 'B'], []), []), 'epmty set');
});

QUnit.test('utility.removeDuplicates test', function (assert) {
  assert.ok(utility.isSetsEqual(utility.removeDuplicates(['A', 'B', 'A', 'A', 'C', 'B']), ['A', 'B', 'C']), 'normal case');
  assert.ok(utility.isSetsEqual(utility.removeDuplicates(['A', 'A', 'A',]), ['A']), 'only one unique element');
  assert.ok(utility.isSetsEqual(utility.removeDuplicates(['A', 'B', 'C']), ['A', 'B', 'C']), 'no duplicates');
  assert.ok(utility.isSetsEqual(utility.removeDuplicates([['A', 'B'], ['B', 'A'], ['C']]), [['A', 'B'], ['C']]), 'duplicate sets');
  assert.ok(utility.isSetsEqual(utility.removeDuplicates([]), []), 'empty input set');
});

QUnit.test('utility.getDifference test', function (assert) {
  assert.ok(utility.isSetsEqual(utility.getDifference(['A', 'B', 'C'], ['B']), ['A', 'C']), 'Subset');
  assert.ok(utility.isSetsEqual(utility.getDifference([['A', 'B'], ['C']], [['A', 'B']]), [['C']]), 'Subset');
  assert.ok(utility.isSetsEqual(utility.getDifference(['A', 'B', 'C'], ['A', 'C', 'B']), []), 'Same sets');
  assert.ok(utility.isSetsEqual(utility.getDifference(['A', 'B', 'C'], ['B', 'D']), ['A', 'C']), 'Extra elements');
  assert.ok(utility.isSetsEqual(utility.getDifference(['A', 'B', 'C'], []), ['A', 'B', 'C']), 'Empty second set');
});

QUnit.test('utility.getAllSubsets test', function (assert) {
  assert.ok(utility.isSetsEqual(utility.getAllSubsets(['A', 'B', 'C']),
    [[], ['A'], ['B'], ['C'], ['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B', 'C']]), 'Proper test');
  assert.ok(utility.isSetsEqual(utility.getAllSubsets([['A'], ['B', 'C']]),
    [[], [['A']], [['B', 'C']], [['A'], ['B', 'C']]]), 'Proper test');
});

QUnit.test('utility.getClosureForAttr single-attr-test', function (assert) {
  var fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A'], fds), ['A', 'B']), 'One fd only');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }];
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A'], fds), ['A', 'B', 'C']), 'Transitive fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A'], fds), ['A', 'B', 'C']), 'Circular fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A'], fds), ['A', 'B', 'C', 'D']), 'Derived fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');
});

QUnit.test('utility.getClosureForAttr multiple-attrs-test', function (assert) {
  var fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }];
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'E']), 'One fd only');

  fds = [{
    left: ['A', 'E'],
    right: ['B', 'D'],
    type: 'fd'
  }];
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'D', 'E']), 'One multi-attr fd');

  fds = [{
    left: ['A'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['C'],
    type: 'fd'
  }];
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'E']), 'Transitive fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'E']), 'Circular fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');

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
  assert.ok(utility.isSetsEqual(utility.getClosureForAttr(['A', 'E'], fds), ['A', 'B', 'C', 'D', 'E']), 'Derived fds');
});

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
  assert.ok(utility.isSuperkeyForRelation(['A', 'C', 'D'], attrs, fds), 'Candidate key 1');
  assert.ok(utility.isSuperkeyForRelation(['B', 'C', 'D'], attrs, fds), 'Candidate key 2');
  assert.ok(utility.isSuperkeyForRelation(['E', 'C', 'D'], attrs, fds), 'Candidate key 1');
  assert.ok(utility.isSuperkeyForRelation(['A', 'C', 'D', 'E'], attrs, fds), 'Superkey 1');
  assert.ok(utility.isSuperkeyForRelation(['A', 'C', 'D', 'B'], attrs, fds), 'Superkey 2');
  assert.ok(utility.isSuperkeyForRelation(['A', 'B', 'C', 'D', 'E'], attrs, fds), 'Superkey 3');

  assert.ok(!utility.isSuperkeyForRelation(['A', 'B', 'D'], attrs, fds), 'Not superkey 1');
  assert.ok(!utility.isSuperkeyForRelation(['A', 'B', 'D', 'E'], attrs, fds), 'Not superkey 2');
  assert.ok(!utility.isSuperkeyForRelation(['A', 'B'], attrs, fds), 'Not superkey 3');
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
  assert.ok(utility.isKeyForRelation(['A', 'C', 'D'], attrs, fds), 'Candidate key 1');
  assert.ok(utility.isKeyForRelation(['B', 'C', 'D'], attrs, fds), 'Candidate key 2');
  assert.ok(utility.isKeyForRelation(['E', 'C', 'D'], attrs, fds), 'Candidate key 1');

  assert.ok(!utility.isKeyForRelation(['A', 'C', 'D', 'E'], attrs, fds), 'Superkey 1');
  assert.ok(!utility.isKeyForRelation(['A', 'C', 'D', 'B'], attrs, fds), 'Superkey 2');
  assert.ok(!utility.isKeyForRelation(['A', 'B', 'C', 'D', 'E'], attrs, fds), 'Superkey 3');
  assert.ok(!utility.isKeyForRelation(['A', 'B', 'D'], attrs, fds), 'Not Key 1');
  assert.ok(!utility.isKeyForRelation(['A', 'B', 'D', 'E'], attrs, fds), 'Not Key 2');
  assert.ok(!utility.isKeyForRelation(['A', 'B'], attrs, fds), 'Not Key 3');
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
  assert.deepEqual(utility.getAllKeys(attrs, fds), [['A', 'B']], '1 fd only');

  fds = [{
    left: ['A', 'B'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['B'],
    right: ['D'],
    type: 'fd'
  }];

  assert.deepEqual(utility.getAllKeys(attrs, fds), [['A', 'B']], '2 fds');

  attrs = ['A', 'B', 'C', 'D', 'E'];
  assert.deepEqual(utility.getAllKeys(attrs, fds), [['A', 'B', 'E']], '1 attr not listed in fds');
});
