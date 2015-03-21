/* global QUnit: false, bernstein: false */
'use strict';
// TODO: use set comparison instead for this test
QUnit.test('basic test bernsteins', function (assert) {
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

  assert.deepEqual(bernstein.generateBernsteinAlgoResults(attrs, fds), [['A', 'B', 'C', 'D', 'E']], 'Basic decompose');
});
