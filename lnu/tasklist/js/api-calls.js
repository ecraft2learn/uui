/**
 *
 * This file implements API calls to the server
 * Following methods are implemented:
 *   - getTasks: gets list of tasks from the server (uui_task table)
 *   - updateTaskStatus: updates status (done/ nin progress) in database on the server (uui_task_submission table)
 *
 */

var SERVER_URL   = "https://localhost/lnu.php";
//var SERVER_URL_2 = "https://localhost/fileman.php";
// var SERVER_URL   = "https://cs.uef.fi/~ec2l/lnu.php";
// var SERVER_URL_2 = "https://cs.uef.fi/~ec2l/fileman.php";


//GET TASK LIST
/**
 * This function gets list of tasks by pilotsite or session id
 * @param callback - return array of tasks
 */
function getTasks(callback){
    //console.log(window.sessionStorage.getItem("userId"));
    var data = {"userID":window.sessionStorage.getItem("userId"),"func":"getTasks"};

    $.ajax({
        type: "POST",
        url: SERVER_URL,
        data: data,
        success: function (data,result) {
            console.log(data);
            callback(JSON.parse(data)["DATA"]);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            callback([]);
        }

    });
}


//UPDATE TASK STATUS
/**
 * This function updates task status
 */
function updateTaskStatus(task){

    var data = {"taskId":task.id,"status":task.status,"timestamp": new Date().toISOString().slice(0, 19).replace('T', ' '), "userId":window.sessionStorage.getItem("userId"),"isVisible":task.isVisible,"func":"updateTaskStatus"};

    console.log(data);

    $.ajax({
        type: "POST",
        url: SERVER_URL,
        data: data,
        success: function (data,result) {
            console.log(data);
            //callback(JSON.parse(data)["DATA"]);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            //callback([]);
        }

    });
}