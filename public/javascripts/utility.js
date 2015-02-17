// returns whether set contains elem
// @set: []; elem: any
function contains(set, elem) {
  return _.indexOf(set, elem) !== -1;
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

// not compeltely working yet
// get all keys of the input attr set and input fds
// @attrs: ['elem']; @fds: [{left: '', right; '', type:''}]
function getAllKeys(attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  var starting = [];
  var tracking = {};
  // var superkeys = [];
  // var lefts = [];
  // var right = [];
  // var middle = [];
  var keys = [];

  // still needs work on this.
  // function isSuperKeyAlready(keys, candidate) {
  //   var isSuperKey = false;
  //   _.forEach(keys, function (item) {
  //     if (isSubset(candidate, item)) {
  //       isSuperKey = true;
  //     }
  //   });
  //   return isSuperKey;
  // }

  // // a complete way of finding all keys
  // superkeys.push(attrs);  // for sure the universal relation itself is a super key


  // check for any LHS that can make up to be keys
  // something to start with
  _.forEach(fdSet, function (item) {
    if (!contains(starting, item.left)) {
      starting.push(item.left);
    }
  });

  // get closures of starting
  _.forEach(starting, function (item) {
    if (!contains(keys, item) && !tracking[item.join('.')]) {
      tracking[item.join('%')] = getClosureForAttr(item, fdSet);
      if (isSetsEqual(tracking[item.join('%')], attrSet)) {
        keys.push(item);
        console.log(keys);
      }
    }
  });

  return keys;
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
