/**
 * This file is main javascript file for commenting feature
 * It contains:
 *  - function of sending the feedback to the server via AJAX call
 *  - function of requesting pre-defined feedback sentences in a specific language
 *  - function of requesting tool id by tool name
 *  - function of requesting tool name
 */


 /**
  * This function initializes the feedback functionality.
  */
function initFeedback() {
    document.getElementById("feedback-btn").addEventListener("click", onSend);
}


/**
 * This function runs when the send button is clicked.
 * @param event : MouseEvent
 */
function onSend(event) {
    console.log("Sending feedback...");
    var userID = parseInt(window.sessionStorage.getItem('userId')) || 1;
    var pilotsite = parseInt(window.sessionStorage.getItem('pilotsite'));
    var language = 'en';
    var feedback = parseInt($('#sentence-select').val());
    var rating = parseInt($('input[name=rating]:checked').val());
    var func = "addFeedback";
    var projectID = parseInt(window.sessionStorage.getItem('projectId')) || 1;
    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if(feedback != undefined) {
        var toolName = getToolName();
              //get toolid
              if(toolName != undefined){
                  getToolId(toolName,function (result) {
                      if(result["DATA"].length > 0){
                          var toolID = parseInt(result["DATA"][0]["TOOLID"]);
                          var data = {"toolID":toolID,"userID":userID,"pilotsite":pilotsite,"feedback":feedback,"rating":rating,"language":language,"func":func,"projectID":projectID,"timestamp":timestamp};
                          console.log(data);
                          //postFeedback(data);
                            postRequest(data);
                      }
                  });
              }
              else{
                  console.log("ERROR,could not find tool name, could not send feedback");
              }
    }
}

/**
 * Ajax post request - first test
 * @param data - json data
 */
function postRequest(data) {
    $.ajax({
        type: "POST",
        url: "https://localhost/lnu.php",
        data: data,
        success: function (error,data) {
            if(data === "success"){
                $(".feedback-component #feedback-result").text("Your feedback was send successfully.");
            }
            else{
                $(".feedback-component #feedback-result").text("Your feedback was not send successfully.");
            }
            setTimeout(function(){
                $(".feedback-component #feedback-result").text(" ");
            }, 3000);
        }
    });
}


/**
 * This function retrieves the sentences for a specified language.
 * @param language : String
 */
function getSentences(language) {
    // Perhaps this should work with a language ID instead?
    var url = "lnu.php?lang=" + language;
    XHRcall("GET", url, handleSenteces, onError);
}
/**
 * This function gets tool id by tool name
 * @param toolname - name of the tool
 * @param callback - tool id
 */
function getToolId(toolname, callback) {

    var toolname = toolname;
    var func = "getToolId";
    var data = {"toolname":toolname,"func":func};
    $.ajax({
        type: "POST",
        url: "https://localhost/lnu.php",
        data: data,
        success: function (data) {
            //console.log(data);
            callback(JSON.parse(data));
        }
    });
}



/**
 * This function handles the retrieving of the specified sentences
 * @param response : XMLHttpRequest.responseText
 */
function handleSentences(response) {
    response = JSON.parse(response);
}


/**
 * This function posts the feedback to the server
 * @param data : json data
 */
function postFeedback(data) {
    XHRcall("POST", "https://localhost/lnu.php", handleFeedback, onError, data);
}



/**
 * This function handles from sending the feedback
 * @param response 
 */
function handleFeedback(response) {
    response = JSON.parse(response);
}



/**
 * This function prints the status code on failed XHR.
 * @param error : int
 */
function onError(error) {
    console.log("XHR fail, status code:", "error");
}



 /**
  * This function performs a XMLHttpRequest to a specified method, and url, and 
  * takes callback methods for success and error.
  * 
  * example usage:  
  * - XHRcall("GET", requestURL, onSuccess, onError);
  * - XHRcall("POST", requestURL, onSuccess, onError, data);
  * @param method : String
  * @param url : String
  * @param successCallback : Function
  * @param errorCallback : Function
  * @param data : String (optional);
  * @returns XMLHttpRequest object
  */
 function XHRcall(method, url, successCallback, errorCallback, data) {
    data = data || null;
    var request = (XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        request.open(method, url, true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(data);
        request.addEventListener("readystatechange", function(event) {
            if ( request.readyState == XMLHttpRequest.DONE && 
                (request.status == 200 || request.status == 201 ) && 
                successCallback !== null ) {
                successCallback(request.responseText);
            } else {
                errorCallback(request.status);
            }
        });
    return request;
}


/**
 * This function gets tool name based on feedback dialog window id
 * @returns {string}- tool name
 */
function getToolName() {

    var iframeId = window.parent.activeWindow.attr('id');
    var feedbackWindows = parent.feedbackWindows;

    for (var key in feedbackWindows) {
        if(feedbackWindows[key].toString() == iframeId.toString()){
            var toolName = key;
            //this is temporal fix of inconsistency of the tool names
            switch (toolName){
                case "eCraft Idea":
                    toolName = "eCraft Plan";
                    break;
                case "TinkerCad 3D Dsign":
                    toolName = "TinkerCad 3D Design";
                    break;
                case "TinkerCad Circuit Design":
                    toolName = "TinkerCad Circuits";
                    break;
                default: break;
            }
            return toolName;
        }
    }
}