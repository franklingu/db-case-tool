/* global QUnit: false, _: false, bernstein: false */
'use strict';
function assertIsTwoTableResultsEqual(assert, tables1, tables2) {
  function iteratee(table) {
    table.sort();
  }
  _.forEach(tables1, iteratee);
  _.forEach(tables2, iteratee);
  tables1.sort();
  tables2.sort();
  assert.deepEqual(tables1, tables2);
}

QUnit.test('basic test bernsteins', function (assert) {
  var attrs;
  var fds;
  attrs = ['A', 'B', 'C', 'D', 'E'];
  fds = [{
    left: ['A', 'B', 'C'],
    right: ['C', 'D'],
    type: 'fd'
  }, {
    left: ['A', 'B'],
    right: ['E', 'C'],
    type: 'fd'
  }];
  assertIsTwoTableResultsEqual(assert, bernstein.generateBernsteinAlgoResults(attrs, fds),
    [['A', 'B', 'D', 'C', 'E']], 'No change to the table');

  fds = [{
    left: ['A', 'B'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['A', 'B', 'C'],
    right: ['E'],
    type: 'fd'
  }];
  assertIsTwoTableResultsEqual(assert, bernstein.generateBernsteinAlgoResults(attrs, fds),
    [['A', 'B', 'D'], ['A', 'B', 'C', 'E']], 'Basic decompose');

  fds = [];

  assertIsTwoTableResultsEqual(assert, bernstein.generateBernsteinAlgoResults(attrs, fds),
    [['A', 'B', 'C', 'D', 'E']], 'Test add back lost attrs');

  attrs = ['A', 'B', 'C', 'D', 'E', 'F'];
  fds = [{
    left: ['E', 'F'],
    right: ['A', 'D'],
    type: 'fd'
  }, {
    left: ['C', 'D'],
    right: ['E', 'F'],
    type: 'fd'
  }, {
    left: ['A', 'E'],
    right: ['B'],
    type: 'fd'
  }, {
    left: ['B', 'F'],
    right: ['C'],
    type: 'fd'
  }, {
    left: ['C'],
    right: ['A'],
    type: 'fd'
  }];

  assertIsTwoTableResultsEqual(assert, bernstein.generateBernsteinAlgoResults(attrs, fds),
    [['C', 'D', 'E', 'F'], ['A', 'E', 'B'], ['B', 'F', 'C'], ['C', 'A']], 'Test transitive dependency elimination');
});
