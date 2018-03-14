var taskInput=document.getElementById("new-task");//Add a new task.
var addButton=document.getElementById('add-task');//first button
var incompleteTaskHolder=document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var completedTasksHolder=document.getElementById("completed-tasks");//completed-tasks

var createNewTaskElement=function(taskString){

	var listItem=document.createElement("li");

	//input (checkbox)
	var checkBox=document.createElement("input");//checkbx
	//label
	var label=document.createElement("label");//label
	//input (text)
	var editInput=document.createElement("textarea");//text
	//button.edit
	var editButton=document.createElement("button");//edit button

	//button.delete
	var deleteButton=document.createElement("button");//delete button

	$(label).html(taskString);

	//Each elements, needs appending
	checkBox.type="checkbox";

	editButton.innerText="Edit";//innerText encodes special characters, HTML does not.
	editButton.className="edit";
	deleteButton.innerText="Delete";
	deleteButton.className="delete";


	//and appending.
	listItem.appendChild(label);
	listItem.appendChild(editInput);

	listItem.appendChild(document.createTextNode('completed'));
	listItem.appendChild(checkBox);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);

	var html = '<select onchange=\'setTaskStatus(this)\'><option value=\'Ongoing\'>On going</option><option value=\'stuck\'>Stuck</option></select>';

	$(listItem).append(html);

	return { list: listItem, editor: editInput };
}

function setTaskStatus(value) {

	var selected = (value.value || value.options[value.selectedIndex].value);
	
	if (selected === 'stuck') {

		$(value.parentNode).addClass('stuck');

	} else
		$(value.parentNode).removeClass('stuck');

}

var addTask=function(){
	var listItem=createNewTaskElement(tinymce.activeEditor.getContent());

	incompleteTaskHolder.appendChild(listItem.list);

	//tinymce.init({ target: listItem.editor });

	tinymce.init({ 
                file_picker_callback: function(cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    // Note: In modern browsers input[type="file"] is functional without 
    // even adding it to the DOM, but that might not be the case in some older
    // or quirky browsers like IE, so you might want to add it to the DOM
    // just in case, and visually hide it. And do not forget do remove it
    // once you do not need it anymore.

    input.onchange = function() {
      var file = this.files[0];
      
      var reader = new FileReader();
      reader.onload = function () {
        // Note: Now we need to register the blob in TinyMCEs image blob
        // registry. In the next release this part hopefully won't be
        // necessary, as we are looking to handle it internally.
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        // call the callback and populate the Title field with the file name
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };
    
    input.click();
  }
        , target: listItem.editor, plugins: 'image insertdatetime media emoticons',  external_plugins: {
                                'mention' : 'http://stevendevooght.github.io/tinyMCE-mention/javascripts/tinymce/plugins/mention/plugin.js' }, 
                mentions: {
                        source: function(query, process, delimeter) {

                                var data = [];

                                for (var i = 0; i < contactList.items.length; i++) {
                                        var obj = {};
                                        var name = contactList.items[i]._values.name;
                                        obj.name = name;
                                        data.push(obj);
                                }
                                // TODO: data from selects

                                if (delimeter === '@')
                                        process(data);
                        }
                }

        } );

 
	bindTaskEvents(listItem.list, taskCompleted);

	tinymce.get('new-task').setContent('');

	tinymce.get(listItem.editor.id).hide();

	$('#' + listItem.editor.id).hide();
}

//Edit an existing task.

var editTask = function(){


	var listItem = this.parentNode;

	var editInput=listItem.querySelector('textarea');
	var label=listItem.querySelector("label");
	var containsClass=listItem.classList.contains("editMode");
		//If class of the parent is .editmode
	if (containsClass){

		for (var i = 0; i < tinymce.editors.length; i++)
			if (tinymce.editors[i].id === editInput.id) {

				tinymce.editors[i].hide();	
				label.innerHTML = tinymce.editors[i].getContent();
				$('#' + editInput.id).hide();	
				break;

			}

		//switch to .editmode
		//label becomes the inputs value.
		
	}else {
	
		for (var i = 0; i < tinymce.editors.length; i++)
                        if (tinymce.editors[i].id === editInput.id) {
                    
				tinymce.editors[i].show();
                                tinymce.editors[i].setContent(label.innerHTML);
                                break;

                        }
		//editInput.value=label.innerText;
	}	

		//toggle .editmode on the parent.
	listItem.classList.toggle("editMode");
}




//Delete task.
var deleteTask=function(){
		console.log("Delete Task...");

		var listItem=this.parentNode;
		var ul=listItem.parentNode;
		//Remove the parent list item from the ul.
		ul.removeChild(listItem);

}


//Mark task completed
var taskCompleted=function(){
		console.log("Complete Task...");
	
	//Append the task list item to the #completed-tasks
	var listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
	listItem.removeChild(listItem.childNodes[5]);
	listItem.removeChild(listItem.childNodes[4]);
	listItem.removeChild(listItem.childNodes[3]);
	listItem.removeChild(listItem.childNodes[4]);
	listItem.removeChild(listItem.childNodes[3]);
	$(listItem).removeClass('stuck');
	

}


var taskIncomplete=function(){
		console.log("Incomplete Task...");
//Mark task as incomplete.
	//When the checkbox is unchecked
		//Append the task list item to the #incomplete-tasks.
		var listItem=this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
			bindTaskEvents(listItem,taskCompleted);
}



var ajaxRequest=function(){
	console.log("AJAX Request");
}

//The glue to hold it all together.


//Set the click handler to the addTask function.
addButton.addEventListener("click",addTask);
addButton.addEventListener("click",ajaxRequest);


var bindTaskEvents=function(taskListItem,checkBoxEventHandler){
	console.log("bind list item events");
//select ListItems children
	var checkBox=taskListItem.querySelector("input[type=checkbox]");
	var editButton=taskListItem.querySelector("button.edit");
	var deleteButton=taskListItem.querySelector("button.delete");


			//Bind editTask to edit button.
			editButton.onclick=editTask;
			//Bind deleteTask to delete button.
			deleteButton.onclick=deleteTask;
			//Bind taskCompleted to checkBoxEventHandler.
			checkBox.onchange=checkBoxEventHandler;
}

//cycle over incompleteTaskHolder ul list items
	//for each list item
	for (var i=0; i<incompleteTaskHolder.children.length;i++){

		//bind events to list items chldren(tasksCompleted)
		bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
	}




//cycle over completedTasksHolder ul list items
	for (var i=0; i<completedTasksHolder.children.length;i++){
	//bind events to list items chldren(tasksIncompleted)
		bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
	}

