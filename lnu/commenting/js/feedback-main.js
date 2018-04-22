/**
 * This file is main javascript file for commenting feature
 * It contains:
 *  - function of sending the feedback to the server via AJAX call
 *  - function of requesting pre-defined feedback sentences in a specific language  
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
    // postFeedback(1, 2, 3, 4, 5, 6);
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
 * This function handles the retrieving of the specified sentences
 * @param response : XMLHttpRequest.responseText
 */
function handleSentences(response) {
    response = JSON.parse(response);
}


/**
 * This function posts the feedback to the server
 * @param toolID : int
 * @param username : String
 * @param pilotsite : int
 * @param feedback : int
 * @param rating : int
 * @param language : String
 */
function postFeedback(toolID, username, pilotsite, feedback, rating, language) {
    var data = "1" + "2" + "3...";
    XHRcall("POST", url, handleFeedback, onError, data);
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
