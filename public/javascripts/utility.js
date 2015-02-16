// returns whether set contains elem
// @set: []; elem: any
function contains(set, elem) {
  return _.indexOf(set, elem) !== -1;
}

// return whether set2 is a subset of set1
// @set1: []; @set2; []
function isSubset(set1, set2) {
  return _.intersection(set1, set2).length === set2.length;
}

// return whether two sets are equals
// @set1: []; @set2; []
function isSetsEqual(set1, set2) {
  return isSubset(set1, set2) && isSubset(set2, set1);
}

// return whether set2 is a proper subset of set1
// @set1: []; @set2: []
function isProperSubset(set1, set2) {
  return set1.length > set2.length && isSubset(set1, set2);
}

// return the union of two sets
// @set1: []; @set2: []
function getUnion(set1, set2) {
  return _.union(set1, set2);
}

// return the intersection of two sets
// @set1: []; @set2: []
function getIntersection(set1, set2) {
  return _.intersection(set1, set2);
}

// remove duplicates in the given set and return the result
// @set: []
function removeDuplicates(set) {
  return _.uniq(set);
}

// calculate set1 - set2 and return the result
// @set1: []; @set2: []
function getDifference(set1, set2) {
  return _.difference(set1, set2);
}

function getClosureForAttr(attr, fd) {
  var fdSet = removeDuplicates(fd);
  var update = true;
  var closure = removeDuplicates(attr);
  do {
    update = false;
    _.forEach(fdSet, function (item) {
      if (isSubset(closure, item.left) && !isSubset(closure, item.right)) {
        closure = getUnion(item.right, closure);
        update = true;
      }
    });
  } while (update);

  return closure;
}
