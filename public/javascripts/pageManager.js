var _variables = [];
var _fds = [];

$(document).ready(function () {
  $('#var_inputbox1').keypress(function (e) {
    if(String.fromCharCode(e.which) === ',') {
      e.preventDefault();
      var input = $(e.target);
      var origin_value = input.val().trim();
      var input_length = origin_value.length;
      if (!input_length || _variables.indexOf(origin_value) !== -1) {
        return;
      }
      var origin_class_name = input.attr('class');
      _variables.push(origin_value);

      // Add the variable to the Var_box
      var var_box = $('#variable_output');
      var_box.val(var_box.val() + origin_value + ',');

      // Create a div
      var newDiv = document.createElement('div');
      newDiv.draggable = 'true';
      newDiv.setAttribute('ondragstart', 'drag(event)');
      newDiv.align = 'center';
      newDiv.className = 'var_node';
      newDiv.innerHTML = origin_value;

      var temp = input.parent().children().length;
      var temp2 = 'var_node' + temp;
      newDiv.id = temp2;

      temp = input_length * 15;
      var tempS = temp + 'px';
      newDiv.setAttribute('style', 'width:'+tempS);
      input.val('');
      $(newDiv).insertBefore(input);
    }
  });

  $('#select_option').change(function () {
    var selectedFeature = $('#select_option').val();
    if (selectedFeature === 'Feature 1') {
      $('#feature1').show();
      $('#feature2').hide();
    } else {
      $('#feature2').show();
      $('#feature1').hide();
    }
  });
  
  $('.relation_option_button').click(function () {
    var opt = $(this);
    opt.parent().find('button.relation_option_button').each(function () {
      $(this).removeClass('relation-option-selected').addClass('relation-option-unselected');
      $(this).attr('chosen', '0');
    });
    opt.removeClass('relation-option-unselected').addClass('relation-option-selected');
    opt.attr('chosen', '1');
  });

  $('#clear_tables').click(function () {
    $('#table_area').html('');
  });

  $('.process_button').click(function () {
    function displayBernsteinAlgoResults(result) {
      var outputForResult = '';
      //var outputForResultStep = 'Generated tables: \n';
      var outputForResultStep = 'Steps: \n';

      for (var i = result.tables.length - 1; i >= 0; i--) {
        outputForResult += '{' + (result.tables[i]) + '};';
        //outputForResultStep += '{' + (result.tables[i]) + '};\n';
      }

      for (i = 0; i <= result.steps.length; i++) {
        if (result.steps[i]) {
          // outputForResult += 'Step ' + (i + 1) + ':' + JSON.stringify(result.steps[i]) + '<br>';
        }
      }
      makeTable(outputForResult);
    }

    var selectedFeature = $('#tabs>li>a.selected').html();
    var bernsteinAlgoResult;
    if (selectedFeature === 'Feature 1') {
      if (!$('.relation_option_button.relation-option-selected').length) {
        return window.alert('Please choose an option in step 3');
      }
      var chosenOptId = $('.relation_option_button.relation-option-selected').attr('id');
      if (chosenOptId === 'Berstein') {
        bernsteinAlgoResult = bernstein.generateBernsteinAlgoResults(_variables, _fds, false);
        displayBernsteinAlgoResults(bernsteinAlgoResult);
      } else if (chosenOptId === 'BersteinSelf') {
        bernsteinAlgoResult = bernstein.generateBernsteinAlgoResults(_variables, _fds, true);
        displayBernsteinAlgoResults(bernsteinAlgoResult);
      } else if (chosenOptId === 'Decomposition'){
        getBCNFDecomposition();
      } else if (chosenOptId === 'LTK'){
        getLTK();
      }
    } else if (selectedFeature === 'Feature 2') {
      var is2NF = true, is3NF = true, isBCNF = true, isLossless = true, isPreserving = true;
      var tablesToTest = [];
      $('#table_area').find('table').each(function () {
        var attrs = [];
        $(this).find('td').each(function () {
          attrs.push($(this).html());
        });
        tablesToTest.push(attrs);
        if (is2NF && !dbtester.is2NF(attrs, _fds)) {
          is2NF = false;
          is3NF = false;
          isBCNF = false;
        }
        if (is3NF && !dbtester.is3NF(attrs, _fds)) {
          is3NF = false;
          isBCNF = false;
        }
        if (isBCNF && !dbtester.isBCNF(attrs, _fds)) {
          isBCNF = false;
        }
      });
      isLossless = dbtester.isLossless(tablesToTest, _fds);
      isPreserving = dbtester.isDependencyPreserving(tablesToTest, _fds);
      var outputForNFTests = '';
      outputForNFTests += ('The table is ' + (is2NF ? '' : 'not ') + 'in second normal form<br>');
      outputForNFTests += ('The table is ' + (is3NF ? '' : 'not ') + 'in third normal form<br>');
      outputForNFTests += ('The table is ' + (isBCNF ? '' : 'not ') + 'in Boyce Codd normal form<br>');
      outputForNFTests += ('The table is ' + (isLossless ? '' : 'not ') + 'lossless<br>');
      outputForNFTests += ('The table is ' + (isPreserving ? '' : 'not ') + 'dependency preserving<br>');
      $('#output-algo-2').html(outputForNFTests);
    } else {
      window.alert('Please select a feature');
    }
  });
});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
    ev.preventDefault();

    var data=ev.dataTransfer.getData('text');
    var nodeCopy = document.getElementById(data).cloneNode(true);
    nodeCopy.id = 'newId'; /* We cannot use the same ID */
    ev.target.appendChild(nodeCopy);
}


// ------------------------------------
// Add a new relation ship in the 'relation_output' textarea
// Display 'relation_output' textarea if it was empty
// ------------------------------------
function addRelation () {
  var lhs = document.getElementById('step2_lhs');
  var rhs = document.getElementById('step2_rhs');
  var output = document.getElementById('relation_output');

  if(lhs.childNodes.length==0 || rhs.childNodes.length==0) {
    alert('Function dependency left hand side or right hand side cannot be empty.');
    return;
  }

  // Display confirmed fd area if it was empty and invisible
  var area = document.getElementById('confirmed_fd');
  area.setAttribute('style', 'display:block');

  // Display relation in the relation_box
  var fd = {left:[] , right:[], type:'fd'};
  var relation = '{';
  while(lhs.firstChild) {
    fd.left.push(lhs.firstChild.innerHTML);
    relation += lhs.firstChild.innerHTML + ',';
    lhs.removeChild(lhs.firstChild);
  }
  relation = relation.substring(0, relation.length-1);
  relation += '->';
  while(rhs.firstChild) {
    fd.right.push(rhs.firstChild.innerHTML);
    relation += rhs.firstChild.innerHTML + ',';
    rhs.removeChild(rhs.firstChild);
  }
  relation = relation.substring(0, relation.length-1);

  output.value += relation + '}; ';
  _fds.push(fd);
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

    // Clear fd-box
    clearRelations();

    // Clear confirmed-box
    clearRelationOutputs();
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
// Clear all the relations in the 'relation_output'
// ------------------------------------
function clearRelationOutputs () {
  var output = document.getElementById('relation_output');

  output.value = null;
  _fds = [];

  // Hide confirmed fd area when it is empty
  var area = document.getElementById('confirmed_fd');
  area.setAttribute('style', 'display:none');
}

// ------------------------------------
// Create a select for variables in pop-up window
// ------------------------------------
function createVarSelect() {
    //alert('In createVarSelect function');
    var select = document.getElementById('Var_Select');
    while(select.firstChild)
        select.removeChild(select.firstChild);

    if(_variables.length == 0) {
        return;
    }
    
    //alert('Variable number: ' + _variables.length);
    //alert('Select number: ' + select.length);
    var _var_size = _variables.length;
    var select_size = select.length;
    for(var i=0; i<_var_size; i++) {
        //alert('i: ' + i);
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

  for(var i=0; i<options.length; i++) {
      opt = options[i];
      if(opt.selected) {
          result.push(opt.value);
      }
  }


  // Create table in step 3
  var table_area = document.getElementById('table_area');
  var new_table = document.createElement('table');
  var new_table_name = document.getElementById('new_table_name').value;
  new_table.setAttribute('style', 'margin-left:5%;');
  new_table.setAttribute('class', 'output_result');

  // Table head
  if(new_table_name == null || new_table_name == '') new_table_name = 'Table';

  // Table body
  var table_content = document.createElement('tbody');
  var tr2 = document.createElement('tr');
  var th2 = document.createElement('th');
  var td2;
  //th2.setAttribute('class', 'th');
  th2.setAttribute('style', 'background: rgb(200,200,200); width:15%;');
  th2.appendChild(document.createTextNode(new_table_name+': '));
  tr2.appendChild(th2);
  for(var i=0; i<result.length; i++) {
    td2 = document.createElement('td');
    td2.appendChild(document.createTextNode(result[i]));
    tr2.appendChild(td2);
  }
  table_content.appendChild(tr2);
  new_table.appendChild(table_content);

  table_area.appendChild(new_table);
  $('#clear_tables').show();

  closePopup();
}

