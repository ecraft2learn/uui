/**
 * This file manage opening and closing of feedback window for each tool
 * Requirement: one feedback window per tool
 *
 */





/**
 * This function opens feedback window if it not open already
 * @param toolUrl: String
 * @param event
 */
function openFeedbackWindow(toolUrl) {
         openIframeWindowRightBottom(toolUrl);
}



/**
 * This function opens ifram window in right bottom corner
 * Draggable option available in Metro UI v.4 right now used Mentro UI v.3
 * @param toolUrl : String
 * @param event
 * @returns {*}
 */
function openIframeWindowRightBottom(toolUrl) {
    docWidth = 360;

    docHeight = 320;

    var dialogTitle = "Commenting/Feedback/Reflection";

    var bgColor="rgb(64,64,64)";

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

    var frame = new WinIFrame(activeWindow.position().left, activeWindow.position().top, '100%', '100%', toolUrl, null, bgColor, dialogTitle);
    activeWindow.data('winData', frame);
    activeWindow.data('winWidth', activeWindow.width());
    activeWindow.data('winHeight', activeWindow.height());
    activeWindow.find('.window-caption').css("background-color", bgColor);

    return activeWindow;


}




