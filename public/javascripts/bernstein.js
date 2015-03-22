/* global utility: false, _: false */
'use strict';
if (!window.utility) {
  throw Error('dbtester requires utility to be defined in global scope first');
}

function isSubsetOf(item1,item2){ return (item1&item2)==item1; }

function setExclude(item1,item2){ return setIntersect(item1,~item2); }

function isProperSubsetOf(item1,item2){ return item1!=item2 && isSubsetOf(item1,item2);}

function setUnion(item1,item2){ return item1|item2; }

function setIntersect(item1,item2){ return item1&item2; }

function equivalent(elem1, elem2, closure){
  return isSubsetOf(elem1,closure[b]) && isSubsetOf(elem2,closure[a]);
}

function isMemberOf(p, fd){
  return isSubsetOf(p.right,getClosure(p.left,fd));
}



function max(a,b){
  if(a > b)
    return a;
  else
    return b;
}

function PII(a, b){
  this.left = a;
  this.right = b;
}

function isMemberOf(p, fd){
  return isSubsetOf(p.right,getClosure(p.left,fd));
}
//O(N)
function highestBit(n){ //index starts from 0
  var res=0;
  while(n>=(1<<res))res++;
  return res-1;
}
//O(ND)
function equivalent(a, b, closure){
  return isSubsetOf(a,closure[b]) && isSubsetOf(b,closure[a]);
}
//  for all x, y, if x,y in a, x is subset of y, then y is removed
//  vector is sorted in ascending order after this function call
function removeTrivialSupersets(a){
  sort(a.begin(),a.end());
  for(var i=0;i<a.size();i++)
    for(var j=i+1;j<a.size();)
      if(isSubsetOf(a[i],a[j])) 
        a.erase(a.begin()+j);
      else
        j++;
}
function removeDulplicateSet(a){
  sort(a.begin(),a.end());
  for(var i=1;i<a.size();){
    if(a[i]==a[i-1])
      a.erase(a.begin()+i);
    else
      i++;
  }
}

//O(ND)
function getClosure(attr, fd){
  var res=attr;
  var update;
  do{
    update=false;
    FOR_EACH(fd,a)
            if(isSubsetOf(a.left,res) 
        && setExclude(a.right,res))
      {
        update=true;
        res = setUnion(res,a.right);
      }
  }while(update);
  return res;
}
//O(8^N)?
function getClosure(fd){
  var varNum=0;
  for(var i = 0; i < fd.size(); i++){
    var a = fd[i];
    varNum=max(varNum,highestBit(a.left)+1);
    varNum=max(varNum,highestBit(a.right)+1);
  }
  var n=1<<varNum;
  var g;
  for(var i=0;i<n;i++)g[i]=i;
  for(var i = 0; i < fd.size(); i++){
    var a = fd[i];
    g[a.left]=setUnion(g[a.left],a.right);
  }
  while(1){
    var update=0;
    for(var k=0;k<n;k++)
      for(var i=0;i<n;i++)
        for(var j=0;j<n;j++)
          if(CON(i,k) && CON(k,j) && !CON(i,j)){
            g[i] = setUnion(g[i],j);
            update=1;
          }
    if(!update)break;
  }
  return g;
}
//O(4^N)
function getKeys(closure){
  var keys;
  var n=closure.size();
  for(var i=0;i<n;i++){
    var a=i,b=closure[i];
    if(b==n-1)keys.push_back(a);
  }
  sort(keys.begin(),keys.end());
  for(var i=0;i<keys.size();i++)
    for(var j=i+1;j<keys.size();)
      if(isSubsetOf(keys[i],keys[j])) // j is superkey
        keys.erase(keys.begin()+j);
      else
        j++;
  removeTrivialSupersets(keys);
  return keys;
}
// return FD set of full FDs A->B, |B|==1
// this function has not been used or tested 
function getFullFDs(closure){
  var N=highestBit(closure.size())+1;     //variable number
  var tem;
  for(var i=0;i<closure.size();i++)
    for(var j=0;j<N;j++)
      if(isSubsetOf(1<<j,setExclude(closure[i],i)))
        tem[j].push_back(i);  //candidate A for B==1<<j
  for(var i=0;i<N;i++)removeTrivialSupersets(tem[i]);
  var res;
  for(var i=0;i<N;i++)
    for(var j=0;j<tem[i].size();j++)
      res[tem[i][j]] |= (1<<i);
  return res;
}



function bitNumCmp(a, b){
  var na=0,nb=0;
  while(a){
    a &= a-1;
    na++;
  }
  while(b){
    b &= b-1;
    nb++;
  }
  return na < nb;
}
function allSubsets(a){
  //  return vector of all subsets of a except empty set
  var t,res;
  while(a){
    t.push_back(a - ( a & ( a-1 ) ));
    a &= a-1;
  }
  var n=t.size();
  for(var i=1;i<(1<<n);i++){
    var k=0;
    for(var j=0;j<n;j++)
      if(i & (1<<j))
        k|=t[j];
    res.push_back(k);
  }
  sort(res.begin(),res.end(),bitNumCmp);
  return res;
}
function removeEmptyFD(fd){
  for(var j=0;j<fd.size();)
    if(fd[j].right==0)
      fd.erase(fd.begin()+j);
    else
      j++;
}
function getCandidateKeys(attr, closure){
  var keys=allSubsets(attr);
  for(var i=0;i<keys.size();)
    if(isSubsetOf(attr,closure[keys[i]]))
      i++;
    else
      keys.erase(keys.begin()+i);
  removeTrivialSupersets(keys);
  return keys;
}
function isDependencyPreserving(tables, closure, fds0){
  var fds;
  for(var i=0;i<tables.size();i++){
    var ss=allSubsets(tables[i]);
    for(var j=0;j<ss.size();j++){
      var a=ss[j],b=setExclude(closure[a],a);
      if(b)fds.push_back(PII(a,b));
    }
  }
  for(var i=0;i<fds0.size();i++)
    if(!isMemberOf(fds0[i],fds))
      return false;
  return true;
}
function isLossless(tables, closure){
  var update;
  do{
    update=false;
    for(var i=0;i<tables.size();i++){
      for(var j=i+1;j<tables.size();){
        var k=setvarersect(tables[i],tables[j]);
        //  if common part of two tables determins at least one of the table,
        //  then can join the two tables;
        if(isSubsetOf(tables[i],closure[k]) 
          || isSubsetOf(tables[j],closure[k])){
          update=1;
          tables[i] |= tables[j];
          tables.erase(tables.begin()+j);
        }else j++;
      }
    }
  }while(update);
  return tables.size()==1 && tables[0]==closure.size()-1;
}
function Bernstein(_fd){
  var fd=_fd;
  var closure=getClosure(fd);
  // step 1, for each A->B, find the smallest subset of A
  // such that A'->B is within the closure
  for(var i=0;i<fd.size();i++){
    var l=allSubsets(fd[i].left);
    for(var j=0;j<l.size();j++)
      if(isSubsetOf(fd[i].right,closure[l[j]])){
        fd[i].left=l[j];
        break;
      }
  }
  prvarFDs(fd,"Bernstein step 1");
  // step 2, for each A->B, find the minimal subset of B such that
  // replacing it with A->B' doesn't change closure
  for(var i=0;i<fd.size();i++){
    for(var j=0;(1<<j)<=fd[i].right;j++){
      if((1<<j) & fd[i].right){
        fd[i].right ^= (1<<j);
        var p = PII(fd[i].left,1<<j);
        if(!isMemberOf(p,fd))
          fd[i].right |= (1<<j);
      }
    }
  }
  removeEmptyFD(fd);
  prvarf("----------\n");
  prvarFDs(fd,"Bernstein step 2");
  // step 3, group fds with the same lhs
  sort(fd.begin(),fd.end());
  for(var i=1;i<fd.size();){
    if(fd[i].left == fd[i-1].left){
      fd[i-1].right |= fd[i].right;
      fd.erase(fd.begin()+i);
    }else{
      i++;
    }
  }
  prvarf("----------\n");
  prvarFDs(fd,"Bernstein step 3");
  // set 4, find equivalent lhs, group them together
  var J;
  var H;
  for(var i=0;i<fd.size();i++)
    for(var j=i+1;j<fd.size();j++)
      if(equivalent(fd[i].left,fd[j].left,closure)){
        J.push_back(PII(fd[i].left,fd[j].left));
        J.push_back(PII(fd[j].left,fd[i].left));
      }
  for(var i=0;i<fd.size();i++){
    var id=-1;
    for(var j=0;j<H.size();j++){
      if(equivalent(H[j][0].left,fd[i].left,closure)){
        id=j;
        break;
      }
    }
    if(id==-1){
      //bug
  //    H.push_back(var(1,fd[i]));
    }else{
      //bug
  //    H[id].push_back(fd[i]);
    }
  }
  for(var i=0;i<H.size();i++){
    var t=0;
    for(var j=0;j<H[i].size();j++)
      t|=H[i][j].left;
    for(var j=0;j<H[i].size();j++)
      H[i][j].right=setExclude(H[i][j].right,t);
    removeEmptyFD(H[i]);
  }
  prvarf("----------\n");
  prvarf("Bernstein step 4\n");
  prvarFDs(J,"J");
  for(var i=0;i<H.size();i++){
    var name;
    sprvarf(name,"H%d",i+1);
    prvarFDs(H[i],name);
  }
  // step 5, for each H[i], eliminate rhs attributes as much as possible without changing
  // closure of H union J
  var HJ;
  for(var i=0;i<H.size();i++) HJ.insert(HJ.end(),H[i].begin(),H[i].end());
  HJ.insert(HJ.end(),J.begin(),J.end());
  var ct=0;
  for(var i=0;i<H.size();i++){
    for(var j=0;j<H[i].size();j++){
      assert(HJ[ct].left==H[i][j].left);
      assert(HJ[ct].right==H[i][j].right);
      var rhs=H[i][j].right;
      for(var k=1;k<=rhs;k<<=1){
        if(rhs & k){
          HJ[ct].right ^= k;
          if(isMemberOf(PII(H[i][j].left,k),HJ)){
            H[i][j].right ^= k;
          }else{
            HJ[ct].right |= k;
          }
        }
      }
      ct++;
    }
  }
  prvarf("----------\n");
  prvarf("Bernstein step 5\n");
  prvarFDs(J,"J");
  for(var i=0;i<H.size();i++){
    var name;
    sprvarf(name,"H%d",i+1);
    prvarFDs(H[i],name);
  }
  //step 6 
  // Add corresponding FD in J varo H[i]
  for(var i=0;i<H.size();i++)
    for(var j=0;j<H[i].size();j++)
      for(var k=0;k<J.size();)
        if(J[k].left == H[i][j].left){
          H[i].push_back(J[k]);
          J.erase(J.begin()+k);
        }else{
          k++;
        }
        
  for(var i=0;i<H.size();i++) removeEmptyFD(H[i]);
  prvarf("----------\n");
  prvarf("Bernstein step 6: %d tables\n",H.size());
  var tables;
  for(var i=0;i<H.size();i++){
    prvarf("table %d\n",i+1);
    var attr=0;
    for(var j=0;j<H[i].size();j++){
      attr |= H[i][j].left;
      attr |= H[i][j].right;
    }
    cout<<"Attributes: "<<set2str(attr)<<endl;
    var ckeys = getCandidateKeys(attr,closure);
    cout<<"Candidate Keys: ";
    for(var i=0;i<ckeys.size();i++){
      if(i)cout<<", ";
      cout<<set2str(ckeys[i]);
    }
    cout<<endl;
    tables.push_back(attr);
  }
}


