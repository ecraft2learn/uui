/**
 * This file manage opening and closing of feedback window for each tool
 * Requirement: one feedback window per tool
 *
 */


//global variables
feedbackWindows = {}; //associative javascript array {'toolName':'feedback_window_id'}

/**
 * This function assigns for each tool one feedback window
 * @param toolName: String
 * @param windowId: String
 */
function addFeedbackWindow(toolName, windowId){
   feedbackWindows[toolName] = windowId;
   console.log(feedbackWindows);
}


/**
 * This function opens feedback window if it not open already
 * @param toolUrl: String
 * @param toolName: String
 * @param event
 */
function openFeedbackWindow(toolUrl, toolName, event){
     if(feedbackWindows[toolName]===undefined){
         openIframeWindowRightBottom(toolUrl,toolName,event);
     }
}



/**
 * This function opens ifram window in right bottom corner
 * Draggable option available in Metro UI v.4 right now used Mentro UI v.3
 * @param toolUrl : String
 * @param toolName : String
 * @param event
 * @returns {*}
 */
function openIframeWindowRightBottom(toolUrl, toolName, event) {
    docWidth = 300;
    docHeight = 200;

    var toolTile = $(event.srcElement).closest('[data-role], tile');
    var bgColor = toolTile.css("background-color");

    if(bgColor=="rgba(0, 0, 0, 0)" || bgColor=="rgb(255, 255, 255)")
        bgColor="rgb(64,64,64)";

    activeWindow = $.Dialog({
        title: "<span class='text-medium fg-white notranslate' translate='no'> Feedback "+toolName+"</span><span class='btn-min' onclick='minimizeWindow(this)'></span> <span class='btn-max' onclick='maximizeWindow(this)'></span> <span class='btn-close' onclick='closeWindow(this);'></span>",
        content: "<iframe id='iframeWindow' src='"+toolUrl+"' frameborder='0' style='margin:0px;' width='300' height='400'  />",
        padding: 0,
        options: {
            modal: false,
            closeButton: false,
            width: docWidth,
            height: docHeight,
            place:"bottom-right"


        }
    }).css("background-color", bgColor);

    var toolIcon = toolTile.find('img').attr('src');

    var frame = new WinIFrame(activeWindow.position().left, activeWindow.position().top, activeWindow.width(), activeWindow.height(), toolUrl, toolIcon, bgColor, toolName);

    activeWindow.data('winData', frame);
    addFeedbackWindow(toolName,activeWindow.attr('id'));
    //using jquery draggable function to make commenting window draggable
    //NOTE! in Metro UI v.4 this should be removed and used original draggable option of the dialog
    activeWindow.draggable();

    return activeWindow;
}
/**
 * Close feedback window
 * @param closeBtn
 */
function closeWindow(closeBtn){
    var winDiv = $(closeBtn).parent().closest('[data-role], .dialog');
    metroDialog.close(winDiv);

    //find tool name based on feedback window id and remove it from feedbackWidnows array
     for(var k in feedbackWindows){
         if(feedbackWindows[k]===winDiv.attr('id')){
             delete feedbackWindows[k];
         }
     }

}
