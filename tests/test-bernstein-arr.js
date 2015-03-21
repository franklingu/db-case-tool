/* global QUnit: false, bernstein: false */
'use strict';
// TODO: use set comparison instead for this test
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
  assert.deepEqual(bernstein.generateBernsteinAlgoResults(attrs, fds), [['A', 'B', 'C', 'D', 'E']], 'No change to the table');

  fds = [{
    left: ['A', 'B'],
    right: ['D'],
    type: 'fd'
  }, {
    left: ['A', 'B', 'C'],
    right: ['E'],
    type: 'fd'
  }];
  assert.deepEqual(bernstein.generateBernsteinAlgoResults(attrs, fds), [['A', 'B', 'D'], ['A', 'B', 'C', 'E']], 'Basic decompose');

  fds = [];

  assert.deepEqual(bernstein.generateBernsteinAlgoResults(attrs, fds), [['A', 'B', 'C', 'D', 'E']], 'Test add back lost attrs');

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

  assert.deepEqual(bernstein.generateBernsteinAlgoResults(attrs, fds),
    [['C', 'D', 'E', 'F'], ['A', 'E', 'B'], ['B', 'F', 'C'], ['C', 'A']], 'Test transitive dependency elimination');
});
