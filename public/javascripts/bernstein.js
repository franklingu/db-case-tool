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


function PII(elem1, elem2){
  this.left = elem1;
  this.right = elem2;
}


function getClosure(fd){
  var varNum=0;
  for(var i = 0; i < fd.size(); i++){
    var item = fd[i];
    varNum=max(varNum,highestBit(item.left)+1);
    varNum=max(varNum,highestBit(item.right)+1);
  }
  var n=1<<varNum;
  var g;
  for(var i=0;i<n;i++)g[i]=i;
  for(var i = 0; i < fd.size(); i++){
    var item = fd[i];
    g[item.left]=setUnion(g[item.left],item.right);
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

function allSubsets(item){
  //  return vector of all subsets of a except empty set
  var t,res;
  while(item){
    t.push_back(item - ( item & ( item-1 ) ));
    item &= item-1;
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



var bernstein = (function () {
  var bernstein = {};
  bernstein.generateBernsteinAlgoResults = function (attrs, fds) {
    var attrSet = utility.removeDuplicates(attrs);
    var fdSet = utility.removeDuplicates(fds);
    var tables = [];
    var fd=fds;
    var closure=getClosure(fd);

    function removeExtraneousAttrs() {
      // TODO
      
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


    }

    function findCovering() {
      // TODO
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
    }

    function partition() {
      // TODO
      sort(fd.begin(),fd.end());
      for(var i=1;i<fd.size();){
          if(fd[i].left == fd[i-1].left){
             fd[i-1].right |= fd[i].right;
             fd.erase(fd.begin()+i);
            }else{
                 i++;
            }
         }
    }

    function mergeEquivalentKeys() {
      // TODO
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

          }
         for(var i=0;i<H.size();i++){
             var t=0;
             for(var j=0;j<H[i].size();j++)
                t|=H[i][j].left;
                for(var j=0;j<H[i].size();j++)
                    H[i][j].right=setExclude(H[i][j].right,t);
                    removeEmptyFD(H[i]);
            }

    }

    function eliminateTransitiveDependencies() {
      // TODO
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
                        }
                      else{
                          HJ[ct].right |= k;
                          }
                                }
                    }
                   ct++;
                }
             }
    }

    function generateTables() {
      // TODO
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
      }



      //push into tables
      for(var i=0;i<H.size();i++){
    
          var attr=0;
          for(var j=0;j<H[i].size();j++){
             attr |= H[i][j].left;
             attr |= H[i][j].right;
          }
          //cout<<"Attributes: "<<set2str(attr)<<endl;
          var ckeys = getCandidateKeys(attr,closure);
          //cout<<"Candidate Keys: ";
          for(var i=0;i<ckeys.size();i++){
          if(i)cout<<", ";
             cout<<set2str(ckeys[i]);
        }
        cout<<endl;
        tables[i]=attr;
      }

    function addBackLostAttrs() {
      // TODO
    }

    removeExtraneousAttrs();
    findCovering();
    partition();
    mergeEquivalentKeys();
    eliminateTransitiveDependencies();
    generateTables();
    addBackLostAttrs();

    return tables;
  };
}());
