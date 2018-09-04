/**
 * This file is main javascript file for commenting feature
 * It contains:
 *  - function of sending the feedback to the server via AJAX call
 *  - function of requesting pre-defined feedback sentences in a specific language
 *  - function of requesting tool id by tool name
 *  - function of requesting tool name
 */


/**
 * This function initializes the commenting functionality.
 */
function initCommenting() {
    createCommentingForm();
}


 /**
  * This function initializes the feedback functionality.
  */
function initFeedback() {
     createFeedbackForm();
}

/**
 * This function initializes the reflection functionality.
 */
function initReflection() {

    getReflectionQuestion(function (question,result) {
        createReflectionForm(question);
    });

}

/**
 * Gets reflection questions
 * @param data
 * @param callback
 */

function getReflectionQuestion(callback){
    var sessionId = sessionStorage.getItem("pilotsite");
    var data = {"sessionId":sessionId};
    postAjaxRequest("https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_reflection_pilot_2.php",data,callback);

}



// /**
//  * This function retrieves the sentences for a specified language.
//  * @param language : String
//  */
// function getSentences(language,callback) {
//     // Perhaps this should work with a language ID instead? -> we do noe have language ID, we have sentence ID in database
//     //we have three languages: english, greece, and finish
//
//     var data = {"language":language,"func":"getFeedbackSentences"};
//     postAjaxRequest("https://cs.uef.fi/~ec2l/lnu.php",data,callback)
//
//     //var url = "lnu.php?lang=" + language;
//     //XHRcall("GET", url, handleSenteces, onError);
// }


/**
 * This function gets tool id by tool name
 * @param toolname - name of the tool
 * @param callback - tool id
 */
function getToolId(toolname, callback) {

    var toolname = toolname;
    var func = "getToolId";
    var data = {"toolname":toolname,"func":func};
    postAjaxRequest("https://cs.uef.fi/~ec2l/lnu.php",data,callback);
   /* $.ajax({
        type: "POST",
        url: "https://cs.uef.fi/~ec2l/lnu.php",
        data: data,
        success: function (data) {
            console.log("here");
            console.log(data);
            callback(JSON.parse(data));
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
        }
    });*/
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