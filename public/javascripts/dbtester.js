// return whether a relation is 2NF
// @attrs: []; @fds: [{left: '', right; '', type:''}]
function is2NF(attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  return false;  // stuck now. wait on findAllKeys to be completed
}

// return whether a relation is 3NF
// @attrs: []; @fds: [{left: '', right; '', type:''}]
function is3NF(attrs, fds) {
  var attrSet = removeDuplicates(attrs);
  var fdSet = removeDuplicates(fds);
  return false;  // stuck now. wait on findAllKeys to be completed
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
