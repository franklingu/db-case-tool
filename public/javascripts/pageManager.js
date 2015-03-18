// ------------------------------------
// Name: Zhou Bin
// Date: 10 Mar, 2015
// ------------------------------------
// $(document).ready(function(){


// ------------------------------------
// Check the input variable, when detect ',', create a new variable node
// ------------------------------------
document.onkeydown=checkKey;

function checkKey(e) {
    var event = window.event ? window.event : e;
    //alert("here");
    if (true) {
        //alert(event.keyCode)
        if(event.keyCode == 188) { 

            // check which one is in use
            var input = document.getElementById(e.target.id); // it does not include ','
            if(input.value.length == 0 || input.value==' ') return;
            var origin_value = input.value;
            var input_length = origin_value.length;
            var origin_class_name = input.className;
            var origin_id = input.id;
            //var origin_length = input.maxlength;
            //var origin_size = input.size;

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

    var relation = '';
    while(lhs.firstChild) {
        relation += lhs.firstChild.innerHTML;
        lhs.removeChild(lhs.firstChild);
    }
    relation += '->';
    while(rhs.firstChild) {
        relation += rhs.firstChild.innerHTML;
        rhs.removeChild(rhs.firstChild);
    }

    output.value += relation + ', ';
}


// ------------------------------------
// Clear all the variables in the 1st step 
// ------------------------------------
function clearVariables () {
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
    //alert("finish");
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

    if(temp.style.backgroundColor == '')
        temp.style.backgroundColor = 'rgb(255, 255, 255)';

    if(temp.style.backgroundColor == 'rgb(255, 255, 255)') {
        temp.style.backgroundColor = '#1b9254';
        temp.setAttribute('chosen', 1);
    } else {
        temp.style.backgroundColor = '#ffffff';
        temp.setAttribute('chosen', 0);
    }       
}


