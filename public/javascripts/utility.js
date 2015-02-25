/* global _: false */
'use strict';
var utility = (function () {
  // 1. For all functions, sets can be array of strings,
  //      array of fds and array of array of strings.
  // 2. For any functions that require two set params,
  //      symmetry of set is expected.
  // 3. For any set param, elems are expected to be of the same type.
  var utility = {};

  // returns whether set contains elem
  // @set: []; elem: any
  utility.contains = function (set, elem) {
    var isContaining = false;
    if (typeof elem !== 'object') {
      return _.indexOf(set, elem) !== -1;
    }
    _.forEach(set, function (item) {
      if (utility.isSetsEqual(item, elem)) {
        isContaining = true;
      }
    });
    return isContaining;
  };

  // remove duplicates in the given set and return the result
  // @set: []
  utility.removeDuplicates = function (set) {
    if (!set || !set.length || (typeof set[0]) !== 'object') {
      return _.uniq(set);
    } else if ((typeof set[0]) === 'object' && set[0].length >= 0) {
      return _.uniq(set, function (item) {
        return JSON.stringify(item.sort());
      });
    }
    return _.uniq(set, function (item) {
      item.left.sort();
      item.right.sort();
      return JSON.stringify(item);
    });
  };

  // return whether set2 is a subset of set1
  // @set1: []; @set2; []
  utility.isSubset = function (superset, subset) {
    var isSub = true;
    superset = utility.removeDuplicates(superset);
    subset = utility.removeDuplicates(subset);
    if (superset.length && (typeof superset[0]) !== 'object') {
      return _.intersection(superset, subset).length === subset.length;
    }
    _.forEach(subset, function (item) {
      if (isSub && !utility.contains(superset, item)) {
        isSub = false;
      }
    });
    return isSub;
  };

  // return whether two sets are equals
  // @set1: []; @set2; []
  utility.isSetsEqual = function (set1, set2) {
    set1 = utility.removeDuplicates(set1);
    set2 = utility.removeDuplicates(set2);
    return utility.isSubset(set1, set2) && utility.isSubset(set2, set1);
  };

  // return whether set2 is a proper subset of set1
  // @set1: []; @set2: []
  utility.isProperSubset = function (superset, subset) {
    superset = utility.removeDuplicates(superset);
    subset = utility.removeDuplicates(subset);
    return superset.length > subset.length && utility.isSubset(superset, subset);
  };

  // return the union of two sets
  // @set1: []; @set2: []
  utility.getUnion = function (set1, set2) {
    var union = [];
    set1 = utility.removeDuplicates(set1);
    set2 = utility.removeDuplicates(set2);
    if (set1.length && (typeof set1[0] !== 'object')) {
      return _.union(set1, set2);
    }
    function iteretee(item) {
      if (!utility.contains(union, item)) {
        union.push(item);
      }
    }
    _.forEach(set1, iteretee);
    _.forEach(set2, iteretee);
    return union;
  };

  // return the intersection of two sets
  // @set1: []; @set2: []
  utility.getIntersection = function (set1, set2) {
    var intersection = [];
    set1 = utility.removeDuplicates(set1);
    set2 = utility.removeDuplicates(set2);
    if (set1.length && (typeof set1[0] !== 'object')) {
      return _.intersection(set1, set2);
    }
    function iteretee(item) {
      if (utility.contains(set2, item)) {
        intersection.push(item);
      }
    }
    _.forEach(set1, iteretee);
    return intersection;
  };

  // calculate set1 - set2 and return the result
  // @set1: []; @set2: []
  utility.getDifference = function (set1, set2) {
    var diff = [];
    set1 = utility.removeDuplicates(set1);
    set2 = utility.removeDuplicates(set2);
    if (set1.length && (typeof set1[0] !== 'object')) {
      return _.difference(set1, set2);
    }
    function iteretee(item) {
      if (!utility.contains(set2, item)) {
        diff.push(item);
      }
    }
    _.forEach(set1, iteretee);
    return diff;
  };

  // get all subsets of the input set
  // @set: []
  utility.getAllSubsets = function (set) {
    var subsets = [];
    var isUpdating = true;
    var i;
    var j;
    var tmpsets = [];
    var tmpset;
    _.forEach(set, function (item) {
      subsets.push([item]);
    });
    while (isUpdating) {
      isUpdating = false;
      tmpsets = [];
      for (i = subsets.length - 1; i >= 0; i--) {
        for (j = i; j >= 0; j--) {
          tmpset = utility.getUnion(subsets[i], subsets[j]);
          if (!utility.contains(subsets, tmpset)
               && !utility.contains(tmpsets, tmpset)){
            isUpdating = true;
            tmpsets.push(tmpset);
          }
        }
      }
      subsets = utility.getUnion(subsets, tmpsets);
    }
    subsets.push([]);
    return subsets;
  };

  // get closure of the input attribute based on the input fds
  // @attr: []; @fds: [{left: '', right; '', type:''}]
  utility.getClosureForAttr = function (attr, fds) {
    var fdSet = utility.removeDuplicates(fds);
    var closure = utility.removeDuplicates(attr);
    var update = true;
    function iteretee(item) {
      if (utility.isSubset(closure, item.left)
          && !utility.isSubset(closure, item.right)) {
        closure = utility.getUnion(item.right, closure);
        update = true;
      }
    }
    do {
      update = false;
      _.forEach(fdSet, iteretee);
    } while (update);

    return closure;
  };

  // return whether attr is a superkey for the relation with fds
  // @attr: []; @attrs: []; @fds: [{left: '', right; '', type:''}]
  utility.isSuperkeyForRelation = function (attr, attrs, fds) {
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
    var closure = utility.getClosureForAttr(attr, fdSet);
    if (utility.isSetsEqual(closure, attrSet)) {
      return true;
    }
    return false;
  };

  // return whether attr is a key for the relation with fds
  // @attr: []; @attrs: []; @fds: [{left: '', right; '', type:''}]
  utility.isKeyForRelation = function (attr, attrs, fds) {
    var isSuperkey = utility.isSuperkeyForRelation(attr, attrs, fds);
    var isKey = true;
    if (!isSuperkey) {
      return false;
    }
    _.forEach(attr, function (item) {
      var subtract = utility.getDifference(attr, [item]);
      var isSubtractSuperkey = utility.isSuperkeyForRelation(subtract, attrs, fds);
      if (isSubtractSuperkey) {
        isKey = false;
      }
    });
    return isKey;
  };

  // TODO: not compeltely tested yet
  // get all keys of the input attr set and input fds
  // @attrs: ['elem']; @fds: [{left: '', right; '', type:''}]
  utility.getAllKeys = function (attrs, fds) {
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
    var superkeys = [];
    var subsets = [];
    var isUpdating = false;
    var keys = [];

    // a complete way of finding all keys
    superkeys.push(attrs);  // for sure the universal relation itself is a super key
    function generateSubsetsForSuperkey(superkey) {
      _.forEach(fdSet, function (item) {
        var sub = utility.getUnion(utility.getDifference(superkey, item.right), item.left);
        if (utility.isProperSubset(superkey, item.left)
            && utility.isProperSubset(superkey, item.right)
            && !utility.contains(subsets, sub)
            && !utility.contains(superkeys, sub)) {
          subsets.push(sub);
          isUpdating = true;
        }
      });
    }
    do {
      isUpdating = false;
      _.forEach(superkeys, generateSubsetsForSuperkey);
      superkeys = utility.getUnion(superkeys, subsets);
      subsets = [];
    } while (isUpdating);

    _.forEach(superkeys, function (item) {
      if (utility.isKeyForRelation(item, attrSet, fdSet)) {
        keys.push(item);
      }
    });
    return keys;
  };

  return utility;
}());
