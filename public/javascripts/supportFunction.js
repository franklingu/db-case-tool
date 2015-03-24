var attribute_JSON = {"attribute": [
        {"table":"test1", "name": "test1"}
    ]
};

var fd_JSON = {"fd": [
        {"table":"test1", "left": "", "right": "", "type": ""}
    ]
};

function isSubsetOf(attr1,attr2){ return (attr1&attr2)==attr1; }

function isProperSubsetOf(attr1,attr2){ return attr1!=attr2 && isSubsetOf(attr1,attr2);}

function setUnion(attr1,attr2){ return attr1|attr2; }

function setIntersect(attr1,attr2){ return attr1&attr2; }

function setExclude(attr1,attr2){ return setIntersect(attr1,~attr2); }

function max(attr1,attr2){
	if(attr1 > attr2)
		return attr1;
	else
		return attr2;
}

function addAttribute(table_name, attr_name)
{
	
	var attribute_to_insert = {"table": table_name, "name": attr_name};
	attribute_JSON.attribute.push(attribute_to_insert);
}

/* functional dependency */
function insertFD(table_name, left, right, type)
{

	var fd_to_insert = {"table": table_name, "left": left, "right": right, "type": type};
	fd_JSON.fd.push(fd_to_insert);
}

function getFD(table_name)
{
	var ret = {"fd": []};
	for(var i = 0; i < fd_JSON.fd.length; i++)
	{
		ret.fd.push(fd_JSON.fd[i]);
	}
	return ret;
}

function getFDNumber(table_name)
{
	var ret = [];
	var fd = getFD(table_name).fd;
	var attribute = getAttribute(table_name).attribute;
	for(var i = 0; i < fd.length; i++)
	{
		if (fd[i].type=="0")
		{
			var retObj = {"left":"", "right":""};
			retObj.left = 0;
			retObj.right = 0
			var left_array = fd[i].left.split(',');
			var right_array = fd[i].right.split(',');
			
			for(var j = 0; j<left_array.length; j++) retObj.left+=Math.pow(2, retLocation(attribute, left_array[j]));
			for(var j = 0; j<right_array.length; j++) retObj.right+=Math.pow(2, retLocation(attribute, right_array[j]));
			
			ret.push(retObj);
		}
	}
	return ret;
}

function retLocation(array, object)
{
	for(var i = 0; i<array.length; i++)
	{
		if (array[i].name == object) return array.length-i-1;
	}
	return -1;
}

function getAttribute(table_name)
{
		
	var ret = {"attribute": []};
	
	for(var i = 0; i < attribute_JSON.attribute.length; i++)
	{
		if (!attribute_JSON.attribute[i]) continue;
		if (attribute_JSON.attribute[i].table == table_name)
		{
			ret.attribute.push(attribute_JSON.attribute[i]);
		}
	}
	return ret;
}

function numToAttribute(table_name, num)
{
	var attribute = getAttribute(table_name).attribute;
	var ret = "";
	var i = 0;
	while(num>0)
	{
		if(num&1)
		{
			ret += attribute[attribute.length-i-1].name + ",";
		}
		num>>=1;
		i++;
	}
	ret = ret.split("").reverse().join("");
	ret = ret.substr(1, ret.length);
	ret = ret.split("").reverse().join("");
	return ret;
}

// JavaScript Document



//define integer pair called PII
function getClosure(fd, tableName){
	var varNum = 0;
	varNum = getAttribute(tableName).attribute.length;
	
	//allocate the space for p (all possible combinations)
	var n=1<<varNum;
	var g = [];
	//add in the rhs
	for(var i = 0;i<n;i++)g[i]=i;
	for(var i = 0; i < fd.length; i++){
		var a = fd[i]; 
		g[a.left]=setUnion(g[a.left],a.right);
	}
	//check the transitivity
	while(true){
		var update=false;
		for(var k=0;k<n;k++)
			for(var i=0;i<n;i++)
				for(var j=0;j<n;j++)
					if(isSubsetOf(k,g[i]) && isSubsetOf(j,g[k]) && !isSubsetOf(j,g[i])){
						g[i] = setUnion(g[i],j);
						update=true;
					}
		if(!update)break;
	}
	
	return g;
}

function getClosureWithMVD(fd, mvd, tableName){
	var closure = getClosure(fd,tableName);
	
	//check coalescence rule for MVD
	if(mvd.length != 0){
		while(true){
			var update = false;
			for(var i=0;i<mvd.length;i++){
				var subset = allSubsets(mvd[i].right);
				for(var j=0;j<subset.length;j++){
					for(var k=0;k<closure.length;k++){
						//Z is a subset of Y and W and Y have no intersection
						if(isSubsetOf(subset[j], closure[k]) && !setIntersect(k, mvd[i].right) && !isSubsetOf(subset[j], closure[mvd[i].left])){
							closure[mvd[i].left] |= subset[j];
							update = true;
						}
					}
				}
			}
			if(!update) break;
		}
	}
	
	return closure;
}

function removeTrivialSupersets(a){
	a.sort(function(a,b){return a - b;});
	for(var i=0;i<a.length;i++)
		for(var j=i+1;j<a.length;)
			if(isSubsetOf(a[i],a[j]))	
				a.erase(a.begin()+j);
			else
				j++;
}

function getKeys(closure){
	var keys = [];
	var n=closure.length;
	for(var i=0;i<n;i++){
		var a=i,b=closure[i];
		if(b==n-1)
			keys.push(a);
	}
	keys.sort(function(a,b){return a - b;})
	for(var i=0;i<keys.length;i++)
		for(var j=i+1;j<keys.length;)
			if(isSubsetOf(keys[i],keys[j]))	// j is superkey
				keys.splice(j,1);
			else
				j++;
	//redundant call
	//removeTrivialSupersets(keys);
	return keys;
}

//get closure with a specific attribute
function getClosureForAttribute(attr, fd){
	var res=attr;
	var update;
	do{
		update=false;
		for(var i = 0; i < fd.length; i++){
			var a = fd[i];
			if(isSubsetOf(a.left,res) && setExclude(a.right,res))
			{
				update=true;
				res = setUnion(res,a.right);
			}
		}
	}while(update);
	return res;
}

function isMemberOf(p, fd){
	return isSubsetOf(p.right,getClosureForAttribute(p.left,fd));
}


//test if a has more variables than b
function bitNumCmp(a,b){
	var na=0,nb=0;
	while(a){
		a &= a-1;
		na++;
	}
	while(b){
		b &= b-1;
		nb++;
	}
	return na - nb;
}

//get all the subsets of a
function allSubsets(a){
	//	return vector of all subsets of a except empty set
	var t = [];
	var res = [];
	
	//separate the variables and add them in
	while(a){
		t.push(a - ( a & ( a-1 ) ));
		a &= a-1;
	}
	//the number of variables
	var n=t.length;
	
	//find all the subsets
	for(var i=1;i<(1<<n);i++){
		var k=0;
		for(var j=0;j<n;j++)
			if(i & (1<<j))
				k|=t[j];
		res.push(k);
	}
	//to make sure that smallest number of variables will be tested left
	res.sort(bitNumCmp);
	//alert("res" + res);
	return res;
}

function removeEmptyFD(fd){
	for(var j=0;j<fd.length;)
		if(fd[j].right==0)
			fd.splice(j,1);
		else
			j++;
}

function equivalent(a,b,closure){
	return isSubsetOf(a,closure[b]) && isSubsetOf(b,closure[a]);
}

function printFDs(fd){
	var output = "";
	
	return output;
}


//LTK Algorithm
function PII(a,b){
	var obj = new Object();
	obj.left = a;
	obj.right = b;
	return obj;

}


function removeDulplicateSet(a){
	a.sort();
	for(var i=1;i<a.length;i++){
		if(a[i]==a[i-1])
		{
			a.splice(i,1);
			i--;
		}
	}
	//return a;
}
function getAkey(closure){
	var allAttr=closure.length-1;
	for(var i=0;i<=allAttr;i++)
		if(closure[i]==allAttr)
			return closure[i];
	//alert("never reach here");
}
function findAKeyIn(K,A,fd,tableName){
	var closure=getClosure(fd,tableName);
	//assert(isSubsetOf(A,closure[K]));
	var t=K;
	while(t){
		var B=t - (t & (t-1));
		t-=B;
		if(isSubsetOf(A,closure[K-B]))
			K-=B;
	}
	return K;
}