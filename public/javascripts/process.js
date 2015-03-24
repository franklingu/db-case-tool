function getLTK(){

	var result;
	var table = {};
	table = "LTK";
	processData(table);
	result = LTK(getFDNumber(table),table);
	//$('#output-algo').html(result);
	//document.getElementById('result_output').value = result;
	makeTable(result);


}

function getBCNFDecomposition(){

	var result;
	var table = {};
	table = "Decomposition";
	processData(table);
	result = BCNFDecomposition(getFDNumber(table),table);
	if(result == "No"){
		var display = $('#variable_output').val();
		var process = '{'+display.substring(0, display.length)+'}';
		makeTable(result);

	};
	//$('#output-algo').html(result);
	else{
		makeTable(result);
	}
	


	//document.getElementById('result_output').value = result;

}

function processData(table){
	clearCookie();

	var attributeInputArr = getAttributInput();
	console.log(attributeInputArr);
	for(var i = 0 ;i < attributeInputArr.length; i++){
		if(attributeInputArr[i] != ""){
		   addAttribute(table, attributeInputArr[i]);
	    }
	}
	
	var fdInputArr = getFDInput();
	console.log(fdInputArr);
	for(var i = 0 ;i < fdInputArr.length ; i++){
		if(fdInputArr[i] != ""){
		   var tempFD = fdInputArr[i];
		   tempFD = tempFD.trim();
		   tempFD = tempFD.replace(/^\{|\}$/g,"");
		   
		   console.log(tempFD);
		   var leftbreakIndex = tempFD.indexOf("-");
		   var rightStartIndex = leftbreakIndex + 2;

		   var left = tempFD.substring(0, leftbreakIndex);
		   var right = tempFD.substring(rightStartIndex);
		   console.log(left);
		   console.log(right);
		   insertFD(table, left, right , 0);
		}
	}

}

function getAttributInput(){
	var attributeInput = $('#variable_output').val();
	attributeInput = attributeInput.trim();
	var attributeInputArr = attributeInput.split(",");
	return attributeInputArr;
}
function getFDInput(){
	var fdInput = $('#relation_output').val();
    fdInput = fdInput.trim();
    console.log (fdInput);
    var fdInputArr = fdInput.split(";");
    return fdInputArr;

}
function makeTable(inputData){
	var currentTable = document.createElement("table");
	
	//
	currentTable.setAttribute("border","2");

	var inputDataArr = inputData.split(";");
	console.log(inputDataArr);
	for(var i = 0; i < inputDataArr.length; i++){
		if(inputDataArr[i] != ""){
			console.log(inputDataArr[i]);
			var currentRow = document.createElement("tr"); 
			
			var inputStr = inputDataArr[i];
			var relationLeftBreak = inputStr.indexOf('{');
			var relationRightBreak = inputStr.indexOf('}');
			var fdInput = inputStr.substring(relationLeftBreak+1, relationRightBreak);
			fdInput = fdInput.trim();
			var fdInputArr = fdInput.split(",");
			for( var j = 0; j < fdInputArr.length; j++){
				if(fdInputArr[j] != ""){
				    var currentCol = document.createElement("td");
				    currentCol.innerText = fdInputArr[j];
				    currentRow.appendChild(currentCol);
			    }
			}
		}
		currentTable.appendChild(currentRow);
	}

	// var keyLeftBreak = inputStr.indexOf('(');
	// var keyRightBreak = inputStr.indexOf(')');
	// var keyInput = inputStr.substring(keyLeftBreak+1, keyRightBreak);
	// var realKeyLeftBreak = keyInput.indexOf(':');
	// var realKeyInput = keyInput.substring(realKeyLeftBreak+1);

	var currentOutput = document.getElementById("output-result-div");
	clearChildren(currentOutput);
	currentOutput.appendChild(currentTable);

}



function clearChildren(node){
	while (node.hasChildNodes()) {
          node.removeChild(node.lastChild);
      }
}

function clearCookie(){
	attribute_JSON = {"attribute": [
        {"table":"test1", "name": "test1"}
      ]
    };

    fd_JSON = {"fd": [
        {"table":"test1", "left": "", "right": "", "type": ""}
      ]
    };
}