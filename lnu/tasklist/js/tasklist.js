/**
 * 2018-09-05
 * This file is responsible for the task list interactions
 */

window.addEventListener("load", function(){
	taskListInit();
});

/**
 * Initializes the tasklist
 */
function taskListInit() {
    loadTasks();
	document.getElementById("tasklist-refresh").addEventListener("click", refreshTaskList);
}


/**
 * Callback on refresh icon press
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
        
        // This makes the refresh icon stop spinning once retrieving of tasks have been attempted.
        document.getElementById("tasklist-refresh").getElementsByTagName("span")[0].classList.remove("ani-spin");
    });
}


/**
 * 
 */
function renderTasks(tasks) {
    
    if(tasks != undefined){
        
        //create accordion
        var tasklist_accordion_content = document.createElement("div");
        tasklist_accordion_content.setAttribute("id","tasklist-accordion-content");
        tasklist_accordion_content.setAttribute("data-role","accordion");

        if (tasks.length > 0) {
            document.getElementById("accordionRow").innerHTML = "";
            $.each(tasks,function(index){
                var status = 0;
                if (this["STATUS"]!=null && this["STUDENTID"]===window.sessionStorage.getItem("userId")){
                    status =this["STATUS"];

                }

                if(this["IS_VISIBLE"]==="1"){
                    renderTask(tasklist_accordion_content,this,status);
                }
            });

            var accordion = document.getElementById("accordionRow").appendChild(tasklist_accordion_content);
            updateDependecies();
            parseTaskDependence();
        }
    }
}


/**
 * 
 */
function renderTask(accordion_element,task,status) {
    if(status === 0 || status === "0"){
        var taskItem =  document.createElement("div");
        taskItem.setAttribute("id",task["ID"]);
        taskItem.setAttribute("data-task-id",task["ID"]);
        taskItem.classList.add("frame");

        if(task["SUBTITLE"]!=""){
            taskItem.setAttribute("data-dependent-on-task", task["TASK_DEPENDENT_ID"]);
        }

        var taskHeading = document.createElement("div");
        taskHeading.innerHTML= task["TITLE"]+ '<span class="task-icon float-right"></span>';
        taskHeading.classList.add("heading");



        var taskContent = document.createElement("div");
        taskContent.classList.add("content","fg-white");

        //check if task is reflection task
        var taskDescription = task["DESCRIPTION"];
        if(task["IS_REFLECTION"]>0){
            taskDescription+="<p>Use this " + generateReflectionLink() + " to do reflection</p>";
        }
        if(task["SUBTITLE"]!=""){
            taskDescription+="<p class='lnu-dependend-info'><span class='mif-info'></span> " + task["SUBTITLE"] + " </p>";
        }

        var taskContentP = document.createElement("div");
        taskContentP.innerHTML=taskDescription;
        taskContentP.classList.add("p-2");



        //Completed button
        var completBtn = document.createElement("button");
        completBtn.innerHTML='<span class="mif-checkmark"></span> Complete action';
        completBtn.classList.add("button", "primary", "float-right", "task-complete-btn");
        completBtn.setAttribute("data-role","hint");
        completBtn.setAttribute("data-hint-text","Mark task as completed");
        completBtn.setAttribute("data-cls-hint","bg-cyan fg-white drop-shadow");

        completBtn.addEventListener("click", markTaskCompleted);

        if(task["SUBTITLE"]!="" && task['TYPE'] == "1"){
            completBtn.disabled = true
        }



        taskContent.appendChild(taskContentP);
        taskContent.appendChild(completBtn);

        taskItem.appendChild(taskHeading);
        taskItem.appendChild(taskContent);

        accordion_element.appendChild(taskItem);
	}
	else{
    	//completed task
        var taskItem =  document.createElement("div");
        taskItem.setAttribute("id",task["ID"]);
        taskItem.setAttribute("data-task-id",task["ID"]);
        taskItem.classList.add("frame","task-completed");

        if(task["SUBTITLE"]!=""){
            taskItem.setAttribute("data-dependent-on-task", task["TASK_DEPENDENT_ID"]);
        }

        var taskHeading = document.createElement("div");
        taskHeading.innerHTML= task["TITLE"]+ '<span class="task-icon mif-checkmark float-right"></span>';
        taskHeading.classList.add("heading");

        var taskContent = document.createElement("div");
        taskContent.classList.add("content","fg-white");


        //check if task is reflection task
        var taskDescription = task["DESCRIPTION"];

        if(task["IS_REFLECTION"]>0){
            taskDescription+=" <p>Use this " + generateReflectionLink() + " to do reflection</p>";
        }

        if(task["SUBTITLE"]!=""){
            taskDescription+="<p class='lnu-dependend-info hidden'><span class='mif-info'></span> " + task["SUBTITLE"] + " </p>";
        }
        var taskContentP = document.createElement("div");
        taskContentP.innerHTML=taskDescription;
        taskContentP.classList.add("p-2");

        //Undo button
        var undoBtn = document.createElement("button");
        undoBtn.innerHTML='<span class="mif-undo"></span> Undo';
        undoBtn.classList.add("button", "secondary", "float-right", "task-undo-btn");
        undoBtn.setAttribute("data-role","hint");
        undoBtn.setAttribute("data-hint-text","Mark task as pending");
        undoBtn.setAttribute("data-cls-hint","bg-cyan fg-white drop-shadow");
        undoBtn.addEventListener("click", markTaskUncompleted);


        //Remove button
        var removeBtn = document.createElement("button");
        removeBtn.innerHTML='<span class="mif-cross"></span>  Remove action';
        removeBtn.classList.add("button", "link", "float-left","fg-white", "task-remove-btn");
        removeBtn.addEventListener("click", removeTaskElement);



        taskContent.appendChild(taskContentP);
        taskContent.appendChild(removeBtn);
        taskContent.appendChild(undoBtn);

        taskItem.appendChild(taskHeading);
        taskItem.appendChild(taskContent);

        accordion_element.appendChild(taskItem);
	}
}


/**
 * 
 */
function generateReflectionLink() {
    var link = "<a href='#' onclick=\"openSmallWindow('./lnu/reflection/index.html','Reflection',event);\"> link </a>";
    return link;
}


/**
 * Marks a task as completed and adds the corresponding buttons (remove task / undo)
 * @param event : MouseEvent
 */
function markTaskCompleted(event) {

    enableDependents(event.target.parentNode.parentNode);

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
	removeBtn.innerHTML += " Remove action";

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
    disableDependants(task.id);
    
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
	completeBtn.innerHTML += " Complete action";
    
	completeBtn.addEventListener("click", markTaskCompleted);
    
    event.target.parentNode.appendChild(completeBtn);
	event.target.parentNode.removeChild(removeBtn);
    event.target.parentNode.removeChild(event.target);

    updateDependecies();
}


/**
 * Disables all elements that depends on a specific task
 * @param {*} taskId 
 */
function disableDependants(taskId) {
    var depTasks = getTasksAndGroup()['dependentTasks'];
    for (var i = 0; i < depTasks.length; i++) {
        if (depTasks[i].dataset.dependentOnTask === taskId) {
            toggleDependence(depTasks[i], 'disable');
        }
    }
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


/**
 * This retrieves and groups all the tasks into either independentTasks or dependentTasks.
 * This allows us to be easily retrieve the elements we need.
 */
function getTasksAndGroup() {
    var taskElems = document.getElementById("tasklist-accordion-content").children;
    var tasks = {}, independentTasks = [], dependentTasks = [];
    for (let task of taskElems) {
        task.dataset.dependentOnTask ? dependentTasks.push(task) : independentTasks.push(task);
    }
    tasks.independentTasks = independentTasks;
    tasks.dependentTasks = dependentTasks;
    return tasks;
}


/**
 * This will get an elemenent that is a of a specific type, either 'independentTasks' or 'dependentTasks'.
 * This enables us to get for example the exact independentTask that some other task depends on.
 * @param {*} type either 'independentTasks' or 'dependentTasks'
 * @param {*} taskId id of task to return
 */
function getTask(type, taskId) {
    var tasks = getTasksAndGroup()[type];
    for (let task of tasks) {
        if (task.dataset.taskId === taskId) {
            return task;
        } else {
            return null;
        }
    }
}


/**
 * Adds an id to the data-attribute of specified element.
 * @param {*} taskElem 
 * @param {*} depTaskId 
 */
function addDependent(taskElem, depTaskId) {
    if (taskElem) {
        taskElem.dataset.dependents ? taskElem.dataset.dependents += ',' + depTaskId : taskElem.dataset.dependents = depTaskId;
    }
}


/**
 * Will take all dependent tasks and add their ids to the element they depend on.
 * This will att a data-attribute called dependents to the element they depend on,
 * this enables us to more easily access independent and dependent tasks that are related.
 */
function parseTaskDependence() {
    var dependentTasks = getTasksAndGroup()['dependentTasks'];
    for (let depTask of dependentTasks) {
        addDependent(getTask('independentTasks', depTask.dataset.dependentOnTask), depTask.dataset.taskId);
    }
}


/**
 * Enables dependent tasks to be completed once the masterTask/task they depend on, have been completed
 * @param {*} masterTask 
 */
function enableDependents(masterTask) {
    if (masterTask.dataset.dependents) {
        var dependents = masterTask.dataset.dependents.split(',');
        var dependentTasks = getTasksAndGroup()['dependentTasks'];

        for (var i = 0; i < dependents.length; i++) {
            for (var j = 0; j < dependentTasks.length; j++) {
                if (dependents[i] === dependentTasks[j].dataset.taskId) {
                    toggleDependence(dependentTasks[j], 'enable');
                }
            }
        }
    }
}


/**
 * Takes a task element and toggles info/button shown/enabled or hidden/disabled.
 * @param {*} taskElem 
 * @param {*} action 
 */
function toggleDependence(taskElem, action) {
    if (action == 'enable') {
        taskElem.getElementsByTagName('button')[0].disabled = false;
        taskElem.getElementsByClassName('p-2')[0].getElementsByClassName('lnu-dependend-info')[0].classList.add('hidden');
    } else if (action == 'disable') {
        taskElem.getElementsByTagName('button')[0].disabled = true;
        taskElem.getElementsByClassName('lnu-dependend-info')[0].classList.remove('hidden');
    }
}


/**
 * Handles special cases where a tasklist might be loaded where an independent task
 * is marked as completed and the dependent task should then be enabled to be completed.
 */
function updateDependecies() {
    var depTasks = getTasksAndGroup()['dependentTasks'];
    for (task of depTasks) {
        if (getTask('independentTasks', task.dataset.dependentOnTask).classList.contains('task-completed')) {
            toggleDependence(task, 'enable');
        } else {
            toggleDependence(task, 'disable');
        }
    }
}