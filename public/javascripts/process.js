function getLTK(){

	var result;
	var table = {};
	table = "LTK";
	processData(table);
	result = LTK(getFDNumber(table),table);
	$('#output-algo').html(result);
	//document.getElementById('result_output').value = result;


}

function getBCNFDecomposition(){

	var result;
	var table = {};
	table = "Decomposition";
	processData(table);
	result = BCNFDecomposition(getFDNumber(table),table);
	$('#output-algo').html(result);

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
		   var tempFD = tempFD.replace(/^\{|\}$/g,"");
		   tempFD = tempFD.trim();
		   console.log(tempFD);
		   var leftbreakIndex = tempFD.indexOf("-");
		   var rightStartIndex = leftbreakIndex + 2;

		   var left = tempFD.substring(1, leftbreakIndex);
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
    var fdInputArr = fdInput.split(";");
    return fdInputArr;

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