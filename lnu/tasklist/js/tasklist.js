/**
 * 2018-09-05
 * This file is responsible for the task list interactions
 */


//-----------------------------------------------------------
// Tasklist init
//-----------------------------------------------------------
window.addEventListener("load", function(){
    //dynamicallyLoadScript("lnu/tasklist/js/api-calls.js");
	taskListInit();
});


//-----------------------------------------------------------
// Tasklist methods
//-----------------------------------------------------------


/**
 * Initializes the tasklist
 */
function taskListInit() {

    loadTasks();

	document.getElementById("tasklist-refresh").addEventListener("click", refreshTaskList);

	// var removeBtns   = document.getElementsByClassName("task-remove-btn");
	// var undoBtns     = document.getElementsByClassName("task-undo-btn");
	// var completeBtns = document.getElementsByClassName("task-complete-btn");
    //
	// addEvt(removeBtns, removeTaskElement);
	// addEvt(undoBtns, markTaskUncompleted);
	// addEvt(completeBtns, markTaskCompleted);
}


/**
 * Helper function, adds eventlisteners to buttons.
 * @param els : HTMLCollection - List of elements to apply the callback function as click event on
 * @param callback : function - The function that will be called on click
 */
function addEvt(els, callback) {
	for (var i = 0; i < els.length; i++) {
		els[i].addEventListener("click", callback);

	}
}


/**
 * 
 */
function refreshTaskList(event) {
	document.getElementById("tasklist-refresh").getElementsByTagName("span")[0].classList.toggle("ani-spin");
	loadTasks();
}

/**
 * Load tasks from database
 */
function loadTasks(){

    getTasks(function(tasks){
        renderTasks(tasks);
    });
}

/**
 * 
 */
function renderTasks(tasks) {

    //clear the task list
    /*var $container = $('#tasklist-accordion-content'),
        $noRemove = $container.find('#sampleNewTask,#sampleDoneTask');
    $container.html($noRemove);*/

    document.getElementById("accordionRow").innerHTML = "";

    //create according
    var tasklist_accordion_content = document.createElement("div");
    tasklist_accordion_content.setAttribute("id","tasklist-accordion-content");
    tasklist_accordion_content.setAttribute("data-role","accordion");



    $.each(tasks,function(index){
        var status = 0;

        if (this["STATUS"]!=null && this["USERID"]===window.sessionStorage.getItem("userId")){
            status =this["STATUS"];
        }

        renderTask(tasklist_accordion_content,this["ID"],this["TITLE"],this["DESCRIPTION"],status);
    });

    var accordion = document.getElementById("accordionRow").appendChild(tasklist_accordion_content);


}


/**
 * 
 */
function renderTask(according_element,taskId, title, description,status) {

	//not completed task
    if(status === "0"){

        var taskItem =  document.createElement("div");
        taskItem.setAttribute("id",taskId);
        taskItem.setAttribute("data-task-id",taskId);
        taskItem.classList.add("frame");

        var taskHeading = document.createElement("div");
        taskHeading.innerHTML= title+ '<span class="task-icon float-right"></span>';
        taskHeading.classList.add("heading");

        var taskContent = document.createElement("div");
        taskContent.classList.add("content","fg-white");

        var taskContentP = document.createElement("div");
        taskContentP.textContent=description;
        taskContentP.classList.add("p-2");



        //Completed button
        var completBtn = document.createElement("button");
        completBtn.innerHTML='<span class="mif-checkmark"></span> Complete task';
        completBtn.classList.add("button", "primary", "float-right", "task-complete-btn");
        completBtn.setAttribute("data-role","hint");
        completBtn.setAttribute("data-hint-text","Mark task as completed");
        completBtn.setAttribute("data-cls-hint","bg-cyan fg-white drop-shadow");

        completBtn.addEventListener("click", markTaskCompleted);


        taskContent.appendChild(taskContentP);
        taskContent.appendChild(completBtn);

        taskItem.appendChild(taskHeading);
        taskItem.appendChild(taskContent);

        according_element.appendChild(taskItem);
	}
	else{
    	//completed task
        var taskItem =  document.createElement("div");
        taskItem.setAttribute("id",taskId);
        taskItem.setAttribute("data-task-id",taskId);
        taskItem.classList.add("frame","task-completed");

        var taskHeading = document.createElement("div");
        taskHeading.innerHTML= title+ '<span class="task-icon mif-checkmark float-right"></span>';
        taskHeading.classList.add("heading");

        var taskContent = document.createElement("div");
        taskContent.classList.add("content","fg-white");

        var taskContentP = document.createElement("div");
        taskContentP.textContent=description;
        taskContentP.classList.add("p-2");

        //Undo button
        var unduBtn = document.createElement("button");
        unduBtn.innerHTML='<span class="mif-undo"></span>Undo';
        unduBtn.classList.add("button", "secondary", "float-right", "task-undo-btn");
        unduBtn.setAttribute("data-role","hint");
        unduBtn.setAttribute("data-hint-text","Mark task as pending");
        unduBtn.setAttribute("data-cls-hint","bg-cyan fg-white drop-shadow");
        unduBtn.addEventListener("click", markTaskUncompleted);


        //Remove button
        var removeBtn = document.createElement("button");
        removeBtn.innerHTML='<span class="mif-cross"></span>  Remove task';
        removeBtn.classList.add("button", "link", "float-left","fg-white", "task-remove-btn");
        removeBtn.addEventListener("click", removeTaskElement);



        taskContent.appendChild(taskContentP);
        taskContent.appendChild(removeBtn);
        taskContent.appendChild(unduBtn);

        taskItem.appendChild(taskHeading);
        taskItem.appendChild(taskContent);

        according_element.appendChild(taskItem);


	}
}


/**
 * 
 */
function refreshTask(taskId) {

}


/**
 * Marks a task as completed and adds the corresponding buttons (remove task / undo)
 * @param event : MouseEvent
 */
function markTaskCompleted(event) {



    var task = {"id":event.target.parentNode.parentNode.dataset.taskId,"status":1,"isVisible":1};
    updateTaskStatus(task);

	event.target.parentNode.parentNode.classList.add("task-completed");
	event.target.removeEventListener("click", markTaskCompleted);

	event.target.parentNode.parentNode.getElementsByClassName("task-icon")[0].classList.add("mif-checkmark");

	var removeBtn  = document.createElement("button");
	var removeIcon = document.createElement("span");
	var undoBtn    = document.createElement("button");
	var undoIcon   = document.createElement("span");

	removeBtn.classList.add("button", "link", "float-left", "fg-white", "task-remove-btn");
	undoBtn.classList.add("button", "secondary", "float-right", "task-undo-btn");
	removeIcon.classList.add("mif-cross");
	undoIcon.classList.add("mif-undo");

	removeBtn.addEventListener("click", removeTaskElement);
	undoBtn.addEventListener("click", markTaskUncompleted);
	

	undoBtn.dataset.role = "hint";
	undoBtn.dataset.hintText = "Mark task as pending";
	undoBtn.dataset.clsHint = "bg-cyan fg-white drop-shadow";

	undoBtn.appendChild(undoIcon);
	removeBtn.appendChild(removeIcon);

	undoBtn.innerHTML += " Undo";
	removeBtn.innerHTML += " Remove task";

	event.target.parentNode.appendChild(removeBtn);
	event.target.parentNode.appendChild(undoBtn);
	event.target.parentNode.removeChild(event.target);

	//var task = {"id":event.target}
}


/**
 * Marks a task as uncompleted/pending and adds the corresponding button (Mark as completed)
 * @param event : MouseEvent
 */
function markTaskUncompleted(event) {


    var task = {"id":event.target.parentNode.parentNode.dataset.taskId,"status":0,"isVisible":1};
    updateTaskStatus(task);

	event.target.parentNode.parentNode.classList.remove("task-completed");
	event.target.parentNode.parentNode.getElementsByClassName("task-icon")[0].classList.remove("mif-checkmark");
	event.target.removeEventListener("click", markTaskUncompleted);
	var removeBtn = event.target.parentNode.getElementsByClassName("task-remove-btn")[0];

	var completeBtn = document.createElement("button");
	var completeIcon = document.createElement("span");
	completeIcon.classList.add("mif-checkmark");
	completeBtn.classList.add("button", "primary", "float-right", "task-complete-btn");
	completeBtn.dataset.role = "hint";
	completeBtn.dataset.hintText = "Mark task as completed";
	completeBtn.dataset.clsHint = "bg-cyan fg-white drop-shadow";

	completeBtn.appendChild(completeIcon);
	completeBtn.innerHTML += " Complete task";

	completeBtn.addEventListener("click", markTaskCompleted);

	event.target.parentNode.appendChild(completeBtn);

	event.target.parentNode.removeChild(removeBtn);
	event.target.parentNode.removeChild(event.target);
}


/**
 * Remove a specifik task element
 * @param event: MouseEvent
 */
function removeTaskElement(event) {
    var task = {"id":event.target.parentNode.parentNode.dataset.taskId,"status":1,"isVisible":0};
    updateTaskStatus(task);

	var taskId = event.target.parentNode.parentNode.dataset.taskId;
	var tasks = document.getElementById("tasklist-accordion-content").children;
	for (var i = 0; i < tasks.length; i++) {
		if (tasks[i].dataset.taskId == String(taskId) && tasks[i].dataset.taskId != undefined) {
			tasks[i].parentNode.removeChild(tasks[i]);
		}
	}
}


/**
 * Clears the task list of elements
 */
function removeAllTaskElements() {
	document.getElementById("tasklist-accordion-content").innerHTML = "";
}


