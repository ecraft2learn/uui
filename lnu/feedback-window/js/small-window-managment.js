/**
 * This file manage opening and closing of feedback window for each tool
 * Requirement: one feedback window per tool
 *
 */


var feedbackWindows = {};

/**
 * This function opens feedback window if it not open already
 * @param toolUrl: String
 * @param event
 */
function openSmallWindow(toolUrl, title, toolName, event) {

         openIframeWindowRightBottom(toolUrl, title,toolName,event);
}



/**
 * This function opens ifram window in right bottom corner
 * Draggable option available in Metro UI v.4 right now used Mentro UI v.3
 * @param toolUrl : String
 * @param event
 * @returns {*}
 */
function openIframeWindowRightBottom(toolUrl,title,toolName,event) {

    docWidth = 360;

    docHeight = 320;

    var dialogTitle = title;

    var toolTile = $(event.srcElement).closest('[data-role], tile');

    var bgColor = toolTile.css("background-color");

    //var bgColor = toolTile.css("background-color");
    //hsla(0, 0%, 30%, 0.15)

    Metro.window.create({
        title: "<span class='text-medium' translate='no'>"+dialogTitle+"</span>",
        content: "<iframe id='iframeWindow' src='"+toolUrl+"' frameborder='0' style='margin:0px;' height='100%' width='100%' />",
        draggable: true,
        resizable: false,
        top: $(window).height() * 0.1 + $(window).scrollTop(),
        left: $(window).height() * 0.1,
        width: docWidth,
        height: docHeight,
        place:"bottom-right",
        clsWindow: 'p-0'
    });
    activeWindow = $('.window').last();

    var frame = new WinIFrame(activeWindow.position().left, activeWindow.position().top, '100%', '100%', toolUrl, null, "rgb(204,211,214)", dialogTitle);
    activeWindow.data('winData', frame);
    activeWindow.data('winWidth', activeWindow.width());
    activeWindow.data('winHeight', activeWindow.height());
    activeWindow.find('.window-caption').css("background-color", "rgb(23, 119, 179)");

    feedbackWindows[activeWindow.attr('id')] = toolName;
    return activeWindow;


}




