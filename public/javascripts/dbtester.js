function getAllPrimeAttributes(keys) {
  var primeAttrs = keys[0];
  function itereteeInner(item) {
    if (!contains(primeAttrs, item)) {
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
function is2NF(attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  var keys = getAllKeys(attrSet, fdSet);
  var primeAttrs = getAllPrimeAttributes(keys);
  return false;  // stuck now. wait on findAllKeys to be completed
}

// return whether a relation is 3NF
// @attrs: []; @fds: [{left: '', right; '', type:''}]
function is3NF(attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  var keys = getAllKeys(attrSet, fdSet);
  var primeAttrs = getAllPrimeAttributes(keys);
  var isIn3NF = true;
  _.forEach(fdSet, function (item) {
    if (!(isSubset(item.left, item.right)
        || isSuperkeyForRelation(item.left, attrSet, fdSet)
        || isSubset(primeAttrs, item.right))) {
      isIn3NF = false;
    }
  });
  return isIn3NF;
}

// return whether a relation is BCNF
// @attrs: []; @fds: [{left: '', right; '', type:''}]
function isBCNF(attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  var isInBCNF = true;
  _.forEach(fdSet, function (item) {
    if (!(isSubset(item.left, item.right)
        || isSuperkeyForRelation(item.left, attrSet, fdSet))) {
      isInBCNF = false;
    }
  });
  return isInBCNF;
}
