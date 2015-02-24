/* global utility: false, _: false */
'use strict';
if (!window.utility) {
  throw Error('dbtester requires utility to be defined in global scope first');
}

var bernstein = (function () {
  var bernstein = {};
  bernstein.generateBernsteinAlgoResults = function (attrs, fds) {
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
    var tables = [];

    function removeExtraneousAttrs() {
      // TODO
    }

    function findCovering() {
      // TODO
    }

    function partition() {
      // TODO
    }

    function mergeEquivalentKeys() {
      // TODO
    }

    function eliminateTransitiveDependencies() {
      // TODO
    }

    function generateTables() {
      // TODO
    }

    function addBackLostAttrs() {
      // TODO
    }

    removeExtraneousAttrs();
    findCovering();
    partition();
    mergeEquivalentKeys();
    eliminateTransitiveDependencies();
    generateTables();
    addBackLostAttrs();

    return tables;
  };
}());
