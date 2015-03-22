// ------------------------------------
// Name: Zhou Bin
// Date: 10 Mar, 2015
// ------------------------------------


var _variables = [];

// ------------------------------------
// Check the input variable, when detect ',', create a new variable node
// ------------------------------------
document.onkeydown=checkKey;
function checkKey(e) {
    var event = window.event ? window.event : e;
    //alert("here");
    if (true) {
        //alert(event.keyCode)
        if(event.keyCode == 188) {  // 188 is the code for ','

            // check which one is in use
            var input = document.getElementById(e.target.id); // it does not include ','
            if(input.value.length == 0 || input.value==' ') return;
            var origin_value = input.value;
            var input_length = origin_value.length;
            var origin_class_name = input.className;
            var origin_id = input.id;
            //var origin_length = input.maxlength;
            //var origin_size = input.size;
            _variables.push(input.value);

            // Add the variable to the Var_box
            var var_box = document.getElementById('variable_output');
            var_box.value += input.value + ",";

            // Create a div
            var newDiv = document.createElement('div');
            newDiv.draggable="true"; 
            newDiv.setAttribute('ondragstart', 'drag(event)');
            newDiv.align = 'center';
            newDiv.className = 'var_node';
            newDiv.innerHTML = origin_value;

            var temp = document.getElementById(input.parentNode.id).childNodes.length;
            var temp2 = 'var_node' + temp;
            newDiv.id = temp2;

            var temp = input_length * 15;
            var tempS = temp + 'px';
            newDiv.setAttribute('style', 'width:'+tempS);
            document.getElementById(input.parentNode.id).appendChild(newDiv);   

            // Create a new input_box for input
            var newInput = document.createElement('input');
            newInput.id = origin_id;
            newInput.className = origin_class_name;
            newInput.type = 'text';
            newInput.setAttribute('autofocus', 'autofocus');
            //newInput.maxlength = origin_length - input_length;
            //newInput.size = origin_size - 2*input_length;
            document.getElementById(input.parentNode.id).appendChild(newInput);

            // Remove old div
            document.getElementById(e.target.id).remove();

            // test purpose
            //alert(input.value + input.value.length);
        }
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();

    //var data=ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));

    var data=ev.dataTransfer.getData("text");
    var nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = "newId"; /* We cannot use the same ID */
    ev.target.appendChild(nodeCopy);

}


// ------------------------------------
// Add a new relation ship in the "relation_output" textarea
// ------------------------------------
function addRelation () {
    var lhs = document.getElementById('step2_lhs');
    var rhs = document.getElementById('step2_rhs');
    var output = document.getElementById('relation_output');

    if(lhs.childNodes.length==0 || rhs.childNodes.length==0) {
        alert("Cannot be empty.");
        return;
    }

    var relation = '{';
    while(lhs.firstChild) {
        relation += lhs.firstChild.innerHTML + ',';
        lhs.removeChild(lhs.firstChild);
    }
    relation = relation.substring(0, relation.length-1);
    relation += '->';
    while(rhs.firstChild) {
        relation += rhs.firstChild.innerHTML + ',';
        rhs.removeChild(rhs.firstChild);
    }
    relation = relation.substring(0, relation.length-1);

    output.value += relation + '}; ';
}


// ------------------------------------
// Clear all the variables in the 1st step 
// ------------------------------------
function clearVariables () {
    // Clear var_nodes
    var output = document.getElementById('step1_sub');
    var count=1;

    while(output.firstChild) {
        var temp='var_node'+count;
        if(output.firstChild.id == temp) {
            //alert('delete one ');
            output.removeChild(output.firstChild);
            count++;
        } else {
            break;
        }
    }

    // Clear var_box
    var var_box = document.getElementById('variable_output');
    var_box.value = null;

    // Clear the global variable
    _variables = [];
}
// ------------------------------------
// Clear all the relations in the 2nd step(lhs, rhs)
// ------------------------------------
function clearRelations () {
    var lhs = document.getElementById('step2_lhs');
    var rhs = document.getElementById('step2_rhs');

    while(lhs.firstChild)
        lhs.removeChild(lhs.firstChild);
    while(rhs.firstChild)
        rhs.removeChild(rhs.firstChild);
}
// ------------------------------------
// Clear all the relations in the "relation_output"
// ------------------------------------
function clearRelationOutputs () {
    var output = document.getElementById('relation_output');

    output.value = null;
}


// ------------------------------------
// For step 3, there are two features provided.
// This function is to toggle the features.
// ------------------------------------
function updateFeatures (index) {
    //alert(index);
    var div_nf = document.getElementById('feature1');
    var div_t = document.getElementById('feature2');

    if(index == 0) {
        //alert('index is 0');
        div_nf.setAttribute('style', 'display:block');
        div_t.setAttribute('style', 'display:none');
    } else {
        //alert('index is 1');
        div_nf.setAttribute('style', 'display:none');
        div_t.setAttribute('style', 'display:block');
    }
}


// ------------------------------------
// Chose relations option. (1NF, 2NF, 3NF, BCNF)
// ------------------------------------
function choseRelationOption (temp) {
    //var test = document.getElementById('confirm_button');
    //test.value = "good";
    //test.style.fontSize = '10px';

    // if(temp.style.backgroundColor == '')
    //     temp.style.backgroundColor = 'rgb(255, 255, 255)';

    // if(temp.style.backgroundColor == 'rgb(255, 255, 255)') {
    //     temp.style.backgroundColor = '#1b9254';
    //     temp.setAttribute('chosen', 1);
    // } else {
    //     temp.style.backgroundColor = '#ffffff';
    //     temp.setAttribute('chosen', 0);
    // }

    if(temp.id == 'Decomposition'){
        temp.style.backgroundColor = '#1b9254';
        temp.setAttribute('chosen', 1);
        document.getElementById("Berstein").style.backgroundColor = 'rgb(255, 255, 255)';
        document.getElementById("Berstein").setAttribute('chosen', 0);
        document.getElementById("LTK").style.backgroundColor = 'rgb(255, 255, 255)';
        document.getElementById("LTK").setAttribute('chosen', 0);

    }
    else if(temp.id == 'Berstein'){
        temp.style.backgroundColor = '#1b9254';
        temp.setAttribute('chosen', 1);
        document.getElementById("Decomposition").style.backgroundColor = 'rgb(255, 255, 255)';
        document.getElementById("Decomposition").setAttribute('chosen', 0);
        document.getElementById("LTK").style.backgroundColor = 'rgb(255, 255, 255)';
        document.getElementById("LTK").setAttribute('chosen', 0);

    }
    else{
        temp.style.backgroundColor = '#1b9254';
        temp.setAttribute('chosen', 1);
        document.getElementById("Decomposition").style.backgroundColor = 'rgb(255, 255, 255)';
        document.getElementById("Decomposition").setAttribute('chosen', 0);
        document.getElementById("Berstein").style.backgroundColor = 'rgb(255, 255, 255)';
        document.getElementById("Berstein").setAttribute('chosen', 0);
    }

}


// ------------------------------------
// Create a select for variables in pop-up window
// ------------------------------------
function createVarSelect() {
    //alert("In createVarSelect function");
    var select = document.getElementById('Var_Select');
    while(select.firstChild)
        select.removeChild(select.firstChild);

    if(_variables.length == 0) {
        return;
    }
    
    //alert("Variable number: " + _variables.length);
    //alert("Select number: " + select.length);
    var _var_size = _variables.length;
    var select_size = select.length;
    for(var i=0; i<_var_size; i++) {
        //alert("i: " + i);
        var option = document.createElement('option');
        option.text = _variables[i];
        select.appendChild(option);
    }
}


// ------------------------------------
// Create a table based on the variables chosen
// ------------------------------------
function createTable () {
    var result = [];
    var options = document.getElementById('Var_Select');
    var opt;

    //alert("lala: " + options.length);
    for(var i=0; i<options.length; i++) {
        opt = options[i];
        if(opt.selected) {
            result.push(opt.value);
            //alert(opt.value);
        }
    }


    // Create table in step 3
    var table_area = document.getElementById('table_area');
    var new_table = document.createElement('table');
    var new_table_name = document.getElementById('new_table_name').value;
    new_table.setAttribute('style', 'margin-left:80px;');
    new_table.setAttribute('class', 'table');

    // Table head
    if(new_table_name == null || new_table_name == '') new_table_name = 'Table';

    // Table body
    var table_content = document.createElement('tbody');
    var tr2 = document.createElement('tr');
    var th2 = document.createElement('th');
    th2.setAttribute('class', 'th');
    th2.appendChild(document.createTextNode(new_table_name+": "));
    tr2.appendChild(th2);
    for(var i=0; i<options.length; i++) {
        var th2 = document.createElement('th');
        if(i>=result.length) {
            th2.appendChild(document.createTextNode(" "));
            tr2.appendChild(th2);
        } else {
            th2.appendChild(document.createTextNode(result[i]));
            tr2.appendChild(th2);
        }
    }
    table_content.appendChild(tr2);
    new_table.appendChild(table_content);

    table_area.appendChild(new_table);

    closePopup();
}

