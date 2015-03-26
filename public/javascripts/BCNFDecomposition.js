function findFDNotInBCNF(fd, tableName, fdt) {
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
	
	for(var i=0;i<fd.length;i++)
		for(var j=0;j<lhs.length;j++)
			if(fd[i].left == lhs[j] && checkIn(fd[i], getAttribute(tableName), tableName)){
				FDNotInBCNF.push(fd[i]);
				return FDNotInBCNF;
			}
	

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
	var stepOutput = "Steps: ";
	var relationAttrArr = [];
	var tableNum = 1;
	var tableArr = [];
	var currentDecomposingTable = "";
	var currentDecomposingFD = "";
	var processedFD = [];
	var currentTable = "";
	var orignalTable = tableName;
	var fdTemp = "";
	//initialize tableArr
	tableArr.push(tableName);

	stepOutput += "BCNF Decomposition Method<br><br>";
	
	//find all the fd not in BCNF and push them into FDNotInBCNF
	FDNotInBCNF = findFDNotInBCNF(fd, tableName, processedFD);

	
	if(FDNotInBCNF.length != 0)
		inBCNF = false;
	else{
		output += "No";
		return output;	
	}
	
	var relations = [];
		
	//decompose one by one
	while(!inBCNF){
		//check through
		currentTable="";
		for(var a = 0; a < tableArr.length; a++){


			FDNotInBCNF = findFDNotInBCNF(getFDNumber(tableArr[a]), tableArr[a], processedFD);

			if(FDNotInBCNF.length>=1){
				currentTable = tableArr[a];

				break;
			}
		}
		
		if(currentTable == ""){
			inBCNF = true;
		}

		else{
			var fdt = FDNotInBCNF[0];

			processedFD.push(fdt);
			var newTableName = currentTable + tableNum;
			tableArr.push(newTableName);
			tableNum ++;
			stepOutput += numToAttribute(currentTable, fdt.left) + "->" + numToAttribute(currentTable, fdt.right)
 		              + " makes the relation not in BCNF<br>";

			fdTemp = decomposeIntoTwoRelations(currentTable, newTableName, numToAttribute(currentTable,fdt.left), numToAttribute(currentTable, fdt.right));
			
			decomposeFD(currentTable, newTableName, fdTemp, tableName);
			
			///stepOutput += numToAttribute(currentTable, fdt.left) + "->" + numToAttribute(currentTable, fdt.right)
 		              //+ " makes the relation not in BCNF<br>";
 		    //deleteFD(currentTable, fdt.left);

			mask = setExclude(mask, fdt.right);
		    
		    var count = 0;
		    //update the remaining fds
		    // for(var i=0;i<fd.length;i++){
			   // if(setIntersect(fd[count].left, fdt.right) || setIntersect(fd[count].right, fdt.right)){
				  //  fd.splice(count,1);
			   // }
			   // else{
				  //  count++;
			   // }
		    // }

		}
	}

	for(var b = 0 ; b < tableArr.length ; b ++){
		output += "R" + b + ": {" + getAttributeString(getAttribute(tableArr[b])) + "};" ; 
	}
	return (output + "|" + stepOutput);

}



function checkIn (fd, attributeArr, tableName){
	var flagLeft = true;
	var flagRight = true;


	var fdLeftArr = numToAttribute(tableName,fd.left).split(',');
	var fdRightArr = numToAttribute(tableName,fd.right).split(',');
	

	for(var i = 0; i < fdLeftArr.length ; i++){
		if(fdLeftArr[i] != ""){
			var currentCheck = false;
			for(var j = 0; j < attributeArr.attribute.length ; j++){
				if(fdLeftArr[i] == attributeArr.attribute[j].name){
					currentCheck = true;
				}
			}
		}

		if(!currentCheck){
			flagLeft = false;
			break;
		}
	}

	for(var i = 0; i < fdRightArr.length ; i++){
		if(fdRightArr[i] != ""){
			var currentCheck = false;
			for(var j = 0; j < attributeArr.attribute.length ; j++){
				if(fdRightArr[i] == attributeArr.attribute[j].name){
					currentCheck = true;
				}

			}
		}

		if(!currentCheck){
			flagRight = false;
			break;
		}
	}

	return (flagLeft && flagRight);
}
function checkFD(fd, fds){
	for (var i = 0; i < fds.length ; i++){
		if (fd == fds[i]){
			return true;
		}
	}
	return false;

}
function decomposeIntoTwoRelations(oldTable, newTable, decomposeFDLeft, decomposeFDRight){

	var decomposeFDLeftArr = decomposeFDLeft.split(',');
    var decomposeFDRightArr = decomposeFDRight.split(',');

    var fdTemp = getFD(oldTable);



    for(var i =0; i< decomposeFDLeftArr.length;i++){
		if(decomposeFDLeftArr[i]!='' && decomposeFDLeftArr[i]){
			addAttribute(newTable,decomposeFDLeftArr[i]);
		}
	}

	for(var i =0; i< decomposeFDRightArr.length;i++){
		if(decomposeFDRightArr[i]!=''){
			deleteAttribute(oldTable, decomposeFDRightArr[i]);
			addAttribute(newTable,decomposeFDRightArr[i]);
		}
	}


	removeEmptyFD(fdTemp);

	return fdTemp;

}
function decomposeFD(oldTable, newTable, fd, tableName){

	
	var oldTableAttr = getAttribute(oldTable);
	var newTableAttr = getAttribute(newTable);


	var oldTableFDArr = getFD(oldTable);
	var newTableFDArr = getFD(newTable);

	while(oldTableFDArr.fd.length > 0){
		oldTableFDArr.fd.splice(0,1);
	}

	while(newTableFDArr.fd.length > 0){
		newTableFDArr.fd.splice(0,1);
	}


	for(var i = 0; i < fd.fd.length ; i++){
		fd.fd[i].table = "";
	}



	for(var i = 0; i < fd.fd.length ; i++){
		if(checkInTwo(fd.fd[i], oldTableAttr)){
			insertFD(oldTable,fd.fd[i].left, fd.fd[i].right,"0");
		}
		else{

		}
	}

	for(var i = 0; i < fd.fd.length ; i++){
		if(checkInTwo(fd.fd[i], newTableAttr)){
			insertFD(newTable, fd.fd[i].left, fd.fd[i].right, "0");
		}
		else{

		}
	}

}

function getAttributeString(attributeArr){
	var str = "";
	for(var i = 0; i < attributeArr.attribute.length; i++){
		str += attributeArr.attribute[i].name;
		str += ",";

	}
	return str;
}

function checkInTwo (fd, attributeArr){
	var flagLeft = true;
	var flagRight = true;

	var fdLeftArr = fd.left.split(',');
    var fdRightArr = fd.right.split(',');

	//check left

	for(var i = 0; i < fdLeftArr.length ; i++){
		if(fdLeftArr[i] != ""){
			var currentCheck = false;
			for(var j = 0; j < attributeArr.attribute.length ; j++){
				if(fdLeftArr[i] == attributeArr.attribute[j].name){
					currentCheck = true;
				}
			}
		}

		if(!currentCheck){
			flagLeft = false;
			break;
		}
	}

	for(var i = 0; i < fdRightArr.length ; i++){
		if(fdRightArr[i] != ""){
			var currentCheck = false;
			for(var j = 0; j < attributeArr.attribute.length ; j++){
				if(fdRightArr[i] == attributeArr.attribute[j].name){
					currentCheck = true;
				}

			}
		}

		if(!currentCheck){
			flagRight = false;
			break;
		}
	}


	return (flagLeft && flagRight);
}



