function getLTK(){

	var result;
	var table = {};
	table = "LTK";
	processData(table);
	result = LTK(getFDNumber(table),table);
	//$('#output-algo').html(result);
	//document.getElementById('result_output').value = result;
	makeDisplay(result);


}

function getBCNFDecomposition(){

	var result;
	var table = {};
	table = "Decomposition";
	processData(table);
	result = BCNFDecomposition(getFDNumber(table),table);
	if(result == "No"){
		var display = $('#variable_output').val();
		console.log(display);
		var process = '{'+display.substring(0, display.length)+'}';
		makeDisplay(process + '|' + "No Change");

	}
	//$('#output-algo').html(result);
	else{
		console.log(result);
		makeDisplay(result);
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
function makeDisplay(inputData){
	var inputDataArr = inputData.split('|');
	console.log(inputDataArr);
	makeTable(inputDataArr[0]);
	makeStep(inputDataArr[1]);
}
function makeTable(inputData){
	var currentTable = document.createElement("table");
	var currentRow, inputStr, relationLeftBreak, relationRightBreak, fdInput, fdInputArr;
	
	currentTable.setAttribute("border","2");
	currentTable.setAttribute("class", "output_result");
	var inputDataArr = inputData.split(";");
	for(var i = 0; i < inputDataArr.length; i++){
		if(inputDataArr[i] != ""){
			currentRow = document.createElement("tr"); 
			inputStr = inputDataArr[i];
			relationLeftBreak = inputStr.indexOf('{');
			relationRightBreak = inputStr.indexOf('}');
			fdInput = inputStr.substring(relationLeftBreak+1, relationRightBreak);
			fdInput = fdInput.trim();
			fdInputArr = fdInput.split(",");
			var currentRelationName = document.createElement("td");
			currentRelationName.innerHTML = "R" + (i + 1);
			currentRow.appendChild(currentRelationName);
			for( var j = 0; j < fdInputArr.length; j++){
				if(fdInputArr[j] != ""){
				    var currentCol = document.createElement("td");
				    currentCol.innerText = fdInputArr[j];
				    currentRow.appendChild(currentCol);
			    }
			}
		}
		if (currentRow) {
			currentTable.appendChild(currentRow);
		}
		currentRow = undefined;
	}

	var currentOutput = document.getElementById("output-result-div");
	clearChildren(currentOutput);
	currentOutput.appendChild(currentTable);
}

function makeStep(inputData){
	var currentOutputMsg = document.getElementById('step-message');
	currentOutputMsg.innerText = "";
	currentOutputMsg.innerText = inputData;
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
