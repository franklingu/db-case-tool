/* global utility: false, _: false */
'use strict';
if (!window.utility) {
  throw Error('bernstein requires utility to be defined in global scope first');
}

var bernstein = (function () {
  var bernstein = {};
  bernstein.generateBernsteinAlgoResults = function (attrs, fds) {
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
    var grouped = {};
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
          var updatedLeft = fd.left;
          fd.left = sub;
          var cloureAfterSub = utility.getClosureForAttr(sub, fdSet);
          if (utility.isSubset(cloureAfterSub, closureBeforeSub)
              && utility.isProperSubset(updatedLeft, sub)) {
            fd.left = sub;
          } else {
            fd.left = updatedLeft;
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
          var updatedRight = fd.right;
          fd.right = sub;
          var cloureAfterSub = utility.getClosureForAttr(fd.left, fdSet);
          if (utility.isSubset(cloureAfterSub, closureBeforeSub)
              && utility.isProperSubset(updatedRight, sub)) {
            fd.right = sub;
          } else {
            fd.right = updatedRight;
          }
        });
      });
      removeEmptyFds();
    }

    function partition() {
      _.forEach(fdSet, function (fd) {
        if (!_.has(grouped, fd.left)) {
          grouped[fd.left.join(',')] = [fd];
        } else {
          grouped[fd.left.join(',')].push(fd);
        }
      });
    }

    function mergeEquivalentKeys() {
      function isTwoKeysEquivalent(key1, key2) {
        return utility.isSetsEqual(utility.getClosureForAttr(key1, attrSet, fdSet),
          utility.getClosureForAttr(key2, attrSet, fdSet));
      }
      var keys = _.keys(grouped);
      function iteratee(key) {
        function innerIteratee(anotherKey) {
          if (key !== anotherKey && isTwoKeysEquivalent(key, anotherKey)) {
            grouped[key] = utility.getUnion(grouped[key], grouped[anotherKey]);
            grouped[anotherKey] = undefined;
          }
        }
        _.forEach(keys, innerIteratee);
      }
      _.forEach(keys, iteratee);
    }

    function eliminateTransitiveDependencies() {
      // TODO: to be tested
      // A -> B, B -> C, A -> C
      var fdsToBeRemoved = [];
      _.forEach(fdSet, function (fd) {
        _.forEach(fdSet, function (fd1) {
          var fdToCheck;
          if (utility.isSetsEqual(fd.left, fd1.left)
              && !utility.isSetsEqual(fd.right, fd1.right)) {
            fdToCheck = {left: fd.left, right: fd1.right, type: 'fd'};
            if (utility.contains(fdSet, fdToCheck)
                && !utility.contains(fdsToBeRemoved, fd1)) {
              fdsToBeRemoved.push(fdToCheck);
            }
          }
        });
      });
      _.forEach(fdsToBeRemoved, function (fdToRemove) {
        grouped[fdToRemove.left.join(',')] = utility.getDifference(
          grouped[fdToRemove.left.join(',')], [fdToRemove]);
      });
    }

    function generateTables() {
      function getTableFromFds(fds) {
        var table = fds[0].left;
        _.forEach(fds, function (fd) {
          table = utility.getUnion(table, fd.right);
        });
        return table;
      }
      _.forOwn(grouped, function (value, key) {
        if (!_.isUndefined(value)) {
          var table = getTableFromFds(value);
          tables.push(table);
        }
      });
    }

    function addBackLostAttrs() {
      var attrIsLost = true;
      var fdLHS = [];
      var lostAttrs = [];
      _.forEach(tables, function (table) {
        fdLHS = utility.getUnion(fdLHS, table);
      });
      if (!utility.isSetsEqual(fdLHS, attrs)) {
        lostAttrs = utility.getDifference(attrs, fdLHS);
        var keyOfAnotherTable = [];
        var foundAnotherTable = false;
        _.forOwn(grouped, function (value, key) {
          if (!_.isUndefined(value) && !foundAnotherTable) {
            keyOfAnotherTable = key.split(',');
          }
        });
        tables.push(utility.getUnion(lostAttrs, keyOfAnotherTable));
      }
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
    console.log('generated tables: ',tables);
    return tables;
  };
  return bernstein;
}());
