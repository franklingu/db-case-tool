var fd = {left:[], right:[], type:'fd'};


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
		   
		   var leftArr = left.split(',');
		   fd.left = leftArr;
		   var rightArr = right.split(',');
		   fd.right = rightArr; 
		   fd = {left:[], right:[], type:'fd'};


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

	var dependency = makeTable(inputDataArr[0]);

	makeTable(inputDataArr[0]);
	makeStep(inputDataArr[1]);
	var currentOutput = document.getElementById("step-message");

	if(dependency){
		
		currentOutput.innerText += "\n" + "The schema is dependency preserving";
	}
	else{
	    currentOutput.innerText += "\n" + "The schema is not dependency preserving";
	}
}
function makeTable(inputData){

	var tableArr = [];

	var currentTable = document.createElement("table");
	var currentRow, inputStr, relationLeftBreak, relationRightBreak, fdInput, fdInputArr;
	
	currentTable.setAttribute("border","2");
	currentTable.setAttribute("class", "output_result");
	var inputDataArr = inputData.split(";");
	console.log(inputDataArr);
	for(var i = 0; i < inputDataArr.length; i++){
		var indexOfStart = inputDataArr[i].indexOf('{');
		if(inputDataArr[i].length > 0 && indexOfStart >=0){
			var tableCurrentArr = [];
			currentRow = document.createElement("tr"); 
			inputStr = inputDataArr[i];
			relationLeftBreak = inputStr.indexOf('{');
			relationRightBreak = inputStr.indexOf('}');
			fdInput = inputStr.substring(relationLeftBreak+1, relationRightBreak);
			fdInput = fdInput.trim();
			fdInputArr = fdInput.split(",");
			var currentRelationName = document.createElement("td");
			currentRelationName.setAttribute('style', 'background: rgb(200,200,200); width:15%;');
			currentRelationName.innerHTML = "R" + (i + 1);
			currentRow.appendChild(currentRelationName);
			for( var j = 0; j < fdInputArr.length; j++){
				if(fdInputArr[j] != ""){
				    var currentCol = document.createElement("td");
				    currentCol.innerText = fdInputArr[j];
				    currentRow.appendChild(currentCol);
				    tableCurrentArr.push(fdInputArr[j]);
			    }
			}
		}
		if (currentRow && inputDataArr[i].length > 0 && indexOfStart >=0) {
			currentTable.appendChild(currentRow);
			tableArr.push(tableCurrentArr);
		}

		currentRow = undefined;
	}



	var currentOutput = document.getElementById("output-result-div");
	clearChildren(currentOutput);
	currentOutput.appendChild(currentTable);
	var dependencyPreserving = dbtester.isDependencyPreserving(tableCurrentArr,fd);
	return dependencyPreserving;

}

function makeStep(inputData){
	var currentOutputMsg = $('#step-message');
	currentOutputMsg.html(inputData);
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


