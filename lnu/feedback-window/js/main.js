/**
 * This file is main javascript file for feedback feature
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
     createFeedbackForm();
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
    postAjaxRequest("https://cs.uef.fi/~ec2l/lnu.php",data,callback);
}


/**
 * This function gets tool name based on feedback dialog window id
 * @returns {string}- tool name
 */
function getToolName() {

    var iframeId = window.parent.activeWindow.attr('id');

    var feedbackWindows = parent.feedbackWindows;

      for (var key in feedbackWindows) {

          if(key.toString() === iframeId.toString()){

            return feedbackWindows[key];
        }
    }
}