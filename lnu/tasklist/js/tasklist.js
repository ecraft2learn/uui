/**
 * 2018-09-05
 * This file is responsible for the task list interactions
 */


//-----------------------------------------------------------
// Tasklist init
//-----------------------------------------------------------
window.addEventListener("load", function(){
	taskListInit();
});


//-----------------------------------------------------------
// Tasklist methods
//-----------------------------------------------------------


/**
 * Initializes the tasklist
 */
function taskListInit() {
	document.getElementById("tasklist-refresh").addEventListener("click", refreshTaskList);

	var removeBtns   = document.getElementsByClassName("task-remove-btn");
	var undoBtns     = document.getElementsByClassName("task-undo-btn");
	var completeBtns = document.getElementsByClassName("task-complete-btn");

	addEvt(removeBtns, removeTaskElement);
	addEvt(undoBtns, markTaskUncompleted);
	addEvt(completeBtns, markTaskCompleted);
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
}


/**
 * 
 */
function renderTasks() {

}


/**
 * 
 */
function renderTask(taskId, title, description) {

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
}


/**
 * Marks a task as uncompleted/pending and adds the corresponding button (Mark as completed)
 * @param event : MouseEvent
 */
function markTaskUncompleted(event) {
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
