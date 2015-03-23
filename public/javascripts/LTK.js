var attribute_JSON = {"attribute": [
        {"table":"test1", "name": "test1"}
    ]
};

var fd_JSON = {"fd": [
        {"table":"test1", "left": "", "right": "", "type": ""}
    ]
};

function preparatory( _fd, tableName){
	var fd=_fd;
	var closure=getClosure(fd,tableName);
	
	//step 1 is the same as step 1 and 2 of Bernstein's algo
	for(var i=0;i<fd.length;i++){
		var l=allSubsets(fd[i].left);
		for(var j=0;j<l.length;j++)
			if(isSubsetOf(fd[i].right,closure[l[j]])){
				fd[i].left=l[j];
				break;
			}
	}
	for(var i=0;i<fd.length;i++){
		for(var j=0;(1<<j)<=fd[i].right;j++){
			if((1<<j) & fd[i].right){
				fd[i].right ^= (1<<j);
				//PII p(fd[i].left,1<<j);
				var p = new Object();
				p.left = fd[i].left;
				p.right = 1<<j
				if(!isMemberOf(p,fd))
					fd[i].right |= (1<<j);
			}
		}
	}
	
	removeEmptyFD(fd);
	//step 2, 3: group fds together by equivalent lhs,
	//build relations and synthesized keys
	//
	var vis = new Array(fd.length);
	var res =[];

	
	for(var i=0;i<fd.length;i++){
		if(vis[i])continue;
		vis[i]=true;
		var p=fd[i];
		var A=p.left | p.right;
		//alert(A);
		var synKeys=new Array();
		synKeys.push(p.left);
		//alert(synKeys);
		for(var j=i+1;j<fd.length;j++){
			if(vis[j])continue;
			var q=fd[j];
			if(equivalent(p.left,q.left,closure)){
				vis[j]=true;
				A |= q.left | q.right;
				synKeys.push(q.left);
				//alert(synKeys);
			}
		}
		
		removeDulplicateSet(synKeys);
		var obj = new Object();
		obj.A=A;
		obj.keys= synKeys;
		res.push(obj);
	}
	//step 4: if not relation's all attributes form a key
	//then add "all key relation" with some minimal key
	var hasKey=false;
	var allAttr=closure.length-1;
	for(var i =0;i<res.length;i++){
		if(closure[res[i].A]==allAttr){
			hasKey=true;
			
			break;
		}
	}
	if(!hasKey){
		var A=getAkey(closure);
		var keys = new Array();
		keys.push(A);
		var obj = new Object();
		obj.A = A;
		obj.keys = keys
		res.push(obj);
	}
	return res;
}



function superfluousAttributeDetection (R, B, I,fd,tableName){
	var Ai=R[I].A;
	var isSup=true;
	//construct Ki prime
	var Ki=R[I].keys;
	var Kip = new Array();
	var Kipr = new Array();
	for(var i=0;i<Ki.length;i++){
		if(!isSubsetOf(B,Ki[i]))
			Kip.push(Ki[i]);
		else
			Kipr.push(Ki[i]);
	}
	if(Kip.length ==0) {var c= new Array();return c;}
	//construct Gi(B) prime
	var GiBp = new Array();
	for(var i=0;i<R.length;i++){ 
		//alert(R.length);
		var tAi=R[i].A;
		var K=R[i].keys;
		for(var j=0;j<K.length;j++){
			var t=setExclude(tAi,K[j]);
			if(i==I){
				t=setExclude(t,B);
				if(isSubsetOf(B,K[j]))continue;
			}
			
			GiBp.push(PII(K[j],t));
			//alert(PII(K[j],t));
		}
	}
	for(var i=0;i<Kip.length;i++){
		if(isMemberOf(PII(Kip[i],B),GiBp)){
			//step 3
			for(var j=0;j<Kipr.length;j++){
				var K=Kipr[j];
				if(!isMemberOf(PII(K,Ai),GiBp)){
					var M=getClosure(K,GiBp,tableName);
					if(isMemberOf(PII(setExclude(setIntersect(M,Ai),B),Ai),fd)){
						isSup=false;
						break;
					}else{
						Kip.push(findAKeyIn(setExclude(setUnion(M,Ai),B),R[i].A,fd,tableName));
					}
				}
			}
			return Kip;
		}
	}
	var c=[];
	return c;
}
function LTK( fd,tableName){
	console.log(tableName);
	var R=preparatory(fd,tableName);
	var resultString = "Preparatory result: \n" ;
	for(var i=0;i<R.length;i++){
		resultString += "R" + (i+1) +"{" + numToAttribute(tableName,R[i].A)+"}\n" ;
		resultString += "Keys: ";
		
		var keys=R[i].keys;
		for(var j=0;j<keys.length;j++)
			resultString += "" +numToAttribute(tableName,keys[j]) + "\n";
		resultString += "\n" ;
	}
	for(var i=0;i<R.length;i++){
		var temp=R[i].A;
		var synKeys=R[i].keys;
		var t=temp;
		while(t){
			var B=t - (t & (t-1));
			t-=B;
			
			var res=superfluousAttributeDetection(R,B,i,fd,tableName);
			if(res.length){
				temp^=B;
				synKeys=res;
				R[i].A=temp;
				R[i].keys=synKeys;
			}
		}
	}
	
	for(var i=0;i<R.length;i++) removeDulplicateSet(R[i].keys);
	var result= "Final result: \n" ;
	for(var i=0;i<R.length;i++){
		result += "R" +(i+1)+":{" +
			numToAttribute(tableName,R[i].A) +"} ";
		result+="keys:"
		var keys=R[i].keys;
		for(var j=0;j<keys.length;j++)
			result += " (" +numToAttribute(tableName,keys[j]) + ").";
		result+= "\n";
	}
	return (resultString + result);
}



