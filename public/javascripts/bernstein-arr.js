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
      // substitute a FD LHS with a proper subset of it,
      // see if the closure of subset is not altered compare to original closure
      // of the LHS.
      // This may be potentially not right though
      _.forEach(fdSet, function (fd) {
        if (fd.left.length <= 1) {
          return;
        }
        var originalLeft = fd.left;
        var subsets = utility.getAllSubsets(originalLeft);
        var closureBeforeSub = utility.getClosureForAttr(fd.left, fdSet);
        _.forEach(subsets, function (sub) {
          fd.left = sub;
          var cloureAfterSub = utility.getClosureForAttr(sub, fdSet);
          if (utility.isSubset(cloureAfterSub, closureBeforeSub)) {
            fd.left = sub;
          } else {
            fd.left = originalLeft;
          }
        });
      });
      removeEmptyFds();
    }

    function findCovering() {
      // substitute a FD RHS with a proper subset of it,
      // see if the closure of subset is not altered compare to original closure
      // of the RHS.
      // This may be potentially not right though
      _.forEach(fdSet, function (fd) {
        if (fd.right.length <= 1) {
          return;
        }
        var originalRight = fd.right;
        var subsets = utility.getAllSubsets(originalRight);
        var closureBeforeSub = utility.getClosureForAttr(fd.left, fdSet);
        _.forEach(subsets, function (sub) {
          fd.right = sub;
          var cloureAfterSub = utility.getClosureForAttr(fd.left, fdSet);
          if (utility.isSubset(cloureAfterSub, closureBeforeSub)) {
            fd.right = sub;
          } else {
            fd.right = originalRight;
          }
        });
      });
      removeEmptyFds();
    }

    function partition() {
      
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

    function removeEmptyFds() {
      for (var i = 0; i < fdSet.length;) {
        if (fdSet[i].right.length === 0 || fdSet[i].left.length === 0) {
          fdSet.splice(i, 1);
        } else {
          i++;
        }
      }
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
