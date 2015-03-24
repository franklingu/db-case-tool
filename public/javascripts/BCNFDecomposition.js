function findFDNotInBCNF(fd, tableName) {
	var FDNotInBCNF = [];
	var lhs = [];
	var closure=getClosure(fd, tableName);
	//alert(closure);
	var keys = getKeys(closure);
	var inBCNF = true;
	
	//find all the lhs not superkey & has some fd and push them into FDNotInBCNF
	for(var i=1;i<closure.length;i++){
		var is_superkey=false;
		for(var j=0;j<keys.length;j++)
			if(isSubsetOf(keys[j],i)){
				is_superkey=true;
				break;
			}
		if(!is_superkey && setExclude(closure[i],i))
			lhs.push(i);
	}
	//alert(FDNotInBCNF.length);
	//alert(FDNotInBCNF[0].left, FDNotInBCNF[0].right);
	
	for(var i=0;i<fd.length;i++)
		for(var j=0;j<lhs.length;j++)
			if(fd[i].left == lhs[j]){
				FDNotInBCNF.push(fd[i]);
			}
	//alert(FDNotInBCNF);
	
	return FDNotInBCNF;
}

function BCNFDecomposition(fd, tableName){
	//find all the FD not in BCNF and store them
	var FDNotInBCNF = [];
	var inBCNF = true;
	var varNum = getAttribute(tableName).attribute.length;
	var mask = (1<<varNum) - 1;
	var step = 1;
	var output = "";
	//output += "BCNF Decomposition Method\n\n";
	
	//find all the fd not in BCNF and push them into FDNotInBCNF
	FDNotInBCNF = findFDNotInBCNF(fd, tableName);
	
	if(FDNotInBCNF.length != 0)
		inBCNF = false;
	else{
		output += "No change\n";
		return output;	
	}
	
	var relations = [];
	
	//suppose no redundancy here (bug here to solve)
	
	//decompose one by one
	while(!inBCNF){
		//decompose on one FD and insert the table
		var fdt = FDNotInBCNF[0];
		FDNotInBCNF.splice(0,1);
		relations.push(fdt.left | fdt.right);
		mask = setExclude(mask, fdt.right);
		
		//output += "Step" + step + ":";
		//output += numToAttribute(tableName, fdt.left) + "->" + numToAttribute(tableName, fdt.right) + " makes the relation not in BCNF\n";
		output += "R" + step + ": {" + numToAttribute(tableName, fdt.left) + "," + numToAttribute(tableName, fdt.right) + "}" + "(keys:" + numToAttribute(tableName, fdt.left) + ");"; 
		
		var count = 0;
		//update the remaining fds
		for(var i=0;i<fd.length;i++){
			if(setIntersect(fd[count].left, fdt.right) || setIntersect(fd[count].right, fdt.right)){
				fd.splice(count,1);
			}
			else
				count++;
		}
		
		//alert("length " + fd.length);
		
		if(fd.length == 0){
			//alert("here");
			inBCNF = true;
			//relations.push(mask);
		}
		else{
			FDNotInBCNF = findFDNotInBCNF(fd, tableName);
			if(FDNotInBCNF.length == 0){
				inBCNF = true;
				//group all the remaining attributes
				//relations.push(mask);
			}
		}
		step++;
		if(inBCNF){
			output += "R" + step + ": {" + numToAttribute(tableName, mask) + "}" + "(keys:" + numToAttribute(tableName, mask) + ")"; 
		}
		
	}
	return output;
}

