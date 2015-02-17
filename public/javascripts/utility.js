// returns whether set contains elem
// @set: []; elem: any
function contains(set, elem) {
  var isContaining = false;
  if (typeof elem !== 'object') {
    return _.indexOf(set, elem) !== -1;
  }
  _.forEach(set, function (item) {
    if (isSetsEqual(item, elem)) {
      isContaining = true;
    }
  });
  return isContaining;
}

// remove duplicates in the given set and return the result
// @set: []
function removeDuplicates(set) {
  return _.uniq(set);
}

// return whether set2 is a subset of set1
// @set1: []; @set2; []
function isSubset(superset, subset) {
  superset = removeDuplicates(superset);
  subset = removeDuplicates(subset);
  return _.intersection(superset, subset).length === subset.length;
}

// return whether two sets are equals
// @set1: []; @set2; []
function isSetsEqual(set1, set2) {
  set1 = removeDuplicates(set1);
  set2 = removeDuplicates(set2);
  return isSubset(set1, set2) && isSubset(set2, set1);
}

// return whether set2 is a proper subset of set1
// @set1: []; @set2: []
function isProperSubset(superset, subset) {
  superset = removeDuplicates(superset);
  subset = removeDuplicates(subset);
  return superset.length > subset.length && isSubset(superset, subset);
}

// return the union of two sets
// @set1: []; @set2: []
function getUnion(set1, set2) {
  set1 = removeDuplicates(set1);
  set2 = removeDuplicates(set2);
  return _.union(set1, set2);
}

// return the intersection of two sets
// @set1: []; @set2: []
function getIntersection(set1, set2) {
  set1 = removeDuplicates(set1);
  set2 = removeDuplicates(set2);
  return _.intersection(set1, set2);
}

// calculate set1 - set2 and return the result
// @set1: []; @set2: []
function getDifference(set1, set2) {
  set1 = removeDuplicates(set1);
  set2 = removeDuplicates(set2);
  return _.difference(set1, set2);
}

// get closure of the input attribute based on the input fds
// @attr: []; @fds: [{left: '', right; '', type:''}]
function getClosureForAttr(attr, fds) {
  var fdSet = removeDuplicates(fds);
  var update = true;
  var closure = removeDuplicates(attr);
  function iteretee(item) {
    if (isSubset(closure, item.left) && !isSubset(closure, item.right)) {
      closure = getUnion(item.right, closure);
      update = true;
    }
  }
  do {
    update = false;
    _.forEach(fdSet, iteretee);
  } while (update);

  return closure;
}

// return whether attr is a superkey for the relation with fds
// @attr: []; @attrs: []; @fds: [{left: '', right; '', type:''}]
function isSuperkeyForRelation(attr, attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  var closure = getClosureForAttr(attr, fdSet);
  if (isSetsEqual(closure, attrSet)) {
    return true;
  }
  return false;
}

// return whether attr is a key for the relation with fds
// @attr: []; @attrs: []; @fds: [{left: '', right; '', type:''}]
function isKeyForRelation(attr, attrs, fds) {
  var isSuperkey = isSuperkeyForRelation(attr, attrs, fds);
  var isKey = true;
  if (!isSuperkey) {
    return false;
  }
  _.forEach(attr, function (item) {
    var subtract = getDifference(attr, [item]);
    var isSubtractSuperkey = isSuperkeyForRelation(subtract, attrs, fds);
    if (isSubtractSuperkey) {
      isKey = false;
    }
  });
  return isKey;
}

// TODO: not compeltely tested yet
// get all keys of the input attr set and input fds
// @attrs: ['elem']; @fds: [{left: '', right; '', type:''}]
function getAllKeys(attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  var superkeys = [];
  var subsets = [];
  var isUpdating = false;
  var keys = [];

  // a complete way of finding all keys
  superkeys.push(attrs);  // for sure the universal relation itself is a super key
  function generateSubsetsForSuperkey(superkey) {
    _.forEach(fdSet, function (item) {
      var sub = getUnion(getDifference(superkey, item.right), item.left);
      if (isProperSubset(superkey, item.left)
          && isProperSubset(superkey, item.right)
          && !contains(subsets, sub)
          && !contains(superkeys, sub)) {
        subsets.push(sub);
        isUpdating = true;
      }
    });
  }
  do {
    isUpdating = false;
    _.forEach(superkeys, generateSubsetsForSuperkey);
    superkeys = getUnion(superkeys, subsets);
    subsets = [];
  } while (isUpdating);

  _.forEach(superkeys, function (item) {
    if (isKeyForRelation(item, attrSet, fdSet)) {
      keys.push(item);
    }
  });
  return keys;
}
