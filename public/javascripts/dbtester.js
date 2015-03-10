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
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
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
      if (!(utility.isSubset(item.left, item.right)
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
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
    var keys = utility.getAllKeys(attrSet, fdSet);
    var primeAttrs = getAllPrimeAttributes(keys);
    var isIn3NF = true;
    _.forEach(fdSet, function (item) {
      if (!(utility.isSubset(item.left, item.right)
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
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
    var isInBCNF = true;
    _.forEach(fdSet, function (item) {
      if (!(utility.isSubset(item.left, item.right)
          || utility.isSuperkeyForRelation(item.left, attrSet, fdSet))) {
        isInBCNF = false;
      }
    });
    return isInBCNF;
  };

  return dbtester;
}());
