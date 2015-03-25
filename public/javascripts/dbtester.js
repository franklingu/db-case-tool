// requires utility to be defined in global scope first
// see if we can use AMD to do requires
/* global utility: false, _: false */
'use strict';
if (!window.utility) {
  throw Error('dbtester requires utility to be defined in global scope first');
}

var dbtester = (function () {
  var dbtester = {};
  function getAllPrimeAttributes(keys) {
    var primeAttrs = keys[0];
    function itereteeInner(item) {
      if (!utility.contains(primeAttrs, item)) {
        primeAttrs.push(item);
      }
    }
    function itereteeOuter(item) {
      _.forEach(item, itereteeInner);
    }
    _.forEach(keys, itereteeOuter);
    return primeAttrs;
  }

  // return whether a relation is 2NF
  // @attrs: []; @fds: [{left: '', right; '', type:''}]
  dbtester.is2NF = function (attrs, fds) {
    var attrSet = utility.removeDuplicates(_.cloneDeep(attrs));
    var fdSet = utility.removeDuplicates(_.cloneDeep(fds));
    var keys = utility.getAllKeys(attrSet, fdSet);
    var primeAttrs = getAllPrimeAttributes(keys);
    var isIn2NF = true;
    function isProperSubsetForKey(attr) {
      var isProperSub = false;
      _.forEach(keys, function (item) {
        if (utility.isProperSubset(item, attr)) {
          isProperSub = true;
        }
      });
      return isProperSub;
    }
    _.forEach(fdSet, function (item) {
      if (utility.isSubset(attrSet, item.left) && utility.isSubset(attrSet, item.right)
            && !(utility.isSubset(item.left, item.right)
                || !isProperSubsetForKey(item.left)
                || utility.isSubset(primeAttrs, item.right))) {
        isIn2NF = false;
      }
    });
    return isIn2NF;
  };

  // return whether a relation is 3NF
  // @attrs: []; @fds: [{left: '', right; '', type:''}]
  dbtester.is3NF = function (attrs, fds) {
    var attrSet = utility.removeDuplicates(_.cloneDeep(attrs));
    var fdSet = utility.removeDuplicates(_.cloneDeep(fds));
    var keys = utility.getAllKeys(attrSet, fdSet);
    var primeAttrs = getAllPrimeAttributes(keys);
    var isIn3NF = true;
    _.forEach(fdSet, function (item) {
      if (utility.isSubset(attrSet, item.left) && utility.isSubset(attrSet, item.right)
          && !(utility.isSubset(item.left, item.right)
              || utility.isSuperkeyForRelation(item.left, attrSet, fdSet)
              || utility.isSubset(primeAttrs, item.right))) {
        isIn3NF = false;
      }
    });
    return isIn3NF;
  };

  // return whether a relation is BCNF
  // @attrs: []; @fds: [{left: '', right; '', type:''}]
  dbtester.isBCNF = function (attrs, fds) {
    var attrSet = utility.removeDuplicates(_.cloneDeep(attrs));
    var fdSet = utility.removeDuplicates(_.cloneDeep(fds));
    var isInBCNF = true;
    _.forEach(fdSet, function (item) {
      if (utility.isSubset(attrSet, item.left) && utility.isSubset(attrSet, item.right)
          && !(utility.isSubset(item.left, item.right)
              || utility.isSuperkeyForRelation(item.left, attrSet, fdSet))) {
        isInBCNF = false;
      }
    });
    return isInBCNF;
  };

  // return whether a database schema is loseless or not
  // tables:[[]], fds: [{left: , right: , type; }]
  dbtester.isLossless = function (tables, fds) {
    var attrs = _.cloneDeep(tables);
    var fdSet = utility.removeDuplicates(_.cloneDeep(fds));
    var attrSet = [];
    var fdSides = [];
    _.forEach(attrs, function (item) {
      attrSet = utility.getUnion(attrSet, item);
    });
    _.forEach(fdSet, function (item) {
      fdSides = utility.getUnion(fdSides, item.left);
      fdSides = utility.getUnion(fdSides, item.right);
    });
    return utility.isSetsEqual(fdSides, attrSet);
  };

  // return whether a database schema is dependency preserving or not
  // tables:[[]], fds: [{left: , right: , type; }]
  dbtester.isDependencyPreserving = function (tables, fds) {
    var attrs = _.cloneDeep(tables);
    var fdSet = utility.removeDuplicates(_.cloneDeep(fds));
    var isPreserving = true;
    _.forEach(fdSet, function (fd) {
      if (isPreserving) {
        isPreserving = false;
        _.forEach(attrs, function (table) {
          if (utility.isSubset(table, fd.left)
              && utility.isSubset(table, fd.right)) {
            isPreserving = true;
          }
        });
      }
    });
    return isPreserving;
  };

  return dbtester;
}());
