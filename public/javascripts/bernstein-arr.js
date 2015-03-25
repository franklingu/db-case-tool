/* global utility: false, _: false */
'use strict';
if (!window.utility) {
  throw Error('bernstein requires utility to be defined in global scope first');
}

var bernstein = (function () {
  var bernstein = {};
  bernstein.generateBernsteinAlgoResults = function (attrs, fds, isSelfImproved) {
    var attrSet = utility.removeDuplicates(_.cloneDeep(attrs));
    var fdSet = utility.removeDuplicates(_.cloneDeep(fds));
    var grouped = {};
    var tables = [];
    var keysInOutput = {};
    var output = {};

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
      output.steps = [utility.getUnion(fdSet, [])];
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
      fdSet = splitRightHandSide(fdSet);
      output.steps.push(utility.getUnion(fdSet, []));
    }

    function partition() {
      _.forEach(fdSet, function (fd) {
        if (!_.has(grouped, fd.left)) {
          grouped[fd.left.join(',')] = [fd];
        } else {
          grouped[fd.left.join(',')].push(fd);
        }
      });
      output.steps.push(_.cloneDeep(grouped));
    }

    function mergeEquivalentKeys() {
      function isTwoKeysEquivalent(key1, key2) {
        var key1Attr = key1.split(',');
        var key2Attr = key2.split(',');
        return utility.isSetsEqual(utility.getClosureForAttr(key1Attr, fdSet),
          utility.getClosureForAttr(key2Attr, fdSet));
      }
      function getFdsFromEquivalentKey(key1, key2) {
        var key1Attr = key1.split(',');
        var key2Attr = key2.split(',');
        var simpleFds = [{left: key1Attr, right: key2Attr, type: 'fd'}];
        splitRightHandSide(simpleFds);
        return simpleFds;
      }
      var keys = _.keys(grouped);
      function iteratee(key) {
        function innerIteratee(anotherKey) {
          if (key !== anotherKey && !_.isUndefined(grouped[key])
              && !_.isUndefined(grouped[anotherKey]) && isTwoKeysEquivalent(key, anotherKey)) {
            var fdsFromEquivKeys = getFdsFromEquivalentKey(key, anotherKey);
            grouped[key] = utility.getUnion(grouped[key], grouped[anotherKey]);
            grouped[key] = utility.getUnion(grouped[key], fdsFromEquivKeys);
            fdSet = utility.getUnion(fdSet, fdsFromEquivKeys);
            grouped[anotherKey] = undefined;
          }
        }
        _.forEach(keys, innerIteratee);
      }
      _.forEach(keys, iteratee);
      output.steps.push(_.cloneDeep(grouped));
    }

    function eliminateTransitiveDependencies() {
      var fd;
      var closureBefore;
      var fdSetAfterSub;
      var cloureAfter;
      for (var i = 0; i < fdSet.length;) {
        fd = fdSet[i];
        closureBefore = utility.getClosureForAttr(fd.left, fdSet);
        fdSetAfterSub = utility.getDifference(fdSet, [fd]);
        cloureAfter = utility.getClosureForAttr(fd.left, fdSetAfterSub);
        if (utility.isSetsEqual(closureBefore, cloureAfter)) {
          fdSet.splice(i, 1);
          grouped[fd.left.join(',')] = utility.getDifference(grouped[fd.left.join(',')], [fd]);
        } else {
          i++;
        }
      }
      output.steps.push(_.cloneDeep(grouped));
    }

    function generateTables() {
      function getTableFromFds(fds) {
        if (!fds.length) {
          return [];
        }
        var table = fds[0].left;
        var key = fds[0].left;
        _.forEach(fds, function (fd) {
          table = utility.getUnion(table, fd.left);
          table = utility.getUnion(table, fd.right);
        });
        return {'table': table, 'key': key};
      }
      _.forOwn(grouped, function (value, key) {
        if (!_.isUndefined(value)) {
          var tab = getTableFromFds(value);
          if (tab.table.length) {
            tables.push(tab.table);
            keysInOutput[tab.table.join(',')] = tab.key;
          }
        }
      });
      output.steps.push(_.cloneDeep(tables));
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
      output.steps.push(_.cloneDeep(tables));
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

    function splitRightHandSide(fdParam) {
      var fdsToAdd = [];
      _.forEach(fdParam, function (fd) {
        if (fd.right.length > 1) {
          _.forEach(fd.right, function (item) {
            var fdNew = {left: fd.left, right: [item], type: 'fd'};
            fdsToAdd = utility.getUnion(fdsToAdd, [fdNew]);
          });
          fd.right = [fd.right[0]];
        }
      });
      fdParam = utility.getUnion(fdParam, fdsToAdd);
      return fdParam;
    }

    removeExtraneousAttrs();
    findCovering();
    partition();
    mergeEquivalentKeys();
    eliminateTransitiveDependencies();
    generateTables();
    if (isSelfImproved) {
      addBackLostAttrs();
    }
    output.tables = tables;
    output.keys = keysInOutput;
    return output;
  };
  return bernstein;
}());
