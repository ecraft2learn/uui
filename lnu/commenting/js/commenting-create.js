
/**
 * This file creates commenting form
 */
function createCommentingForm() {

    // Free text
    var freeText = {
        label: "Comment:",
        input: "textfield",
        id:"comment"
    };

    // Send button
    var sendButton = {
        label: null,
        input: "button",
        inputSettings: [
            {
                // The text on the button
                buttonLabel: "Send Comment",

                // The callback method that will run once the button is pressed
                callback: onSendComment,

                //Button Id
                btnId:"commenting-btn"
            }
        ]
    };


    // Compiling the input objects in an array
    var settings = {
        inputs: [freeText, sendButton]
    };

    initCreation(settings,"commenting-form","uui-commenting");
}

function onSendComment(event) {


    //avoid page refresh after form submit
    event.preventDefault();

    var comment = $('#comment').val();

    if(comment!=""){
        //clear comment textarea
        var formId = $(event.target).closest("form").attr('id');
        clearForm(formId);

        //save comment in database
        saveComment(comment, function (result) {
            if(result!="error"){
                showNotification(true,"Comment was sent successfully!");
            }
            else{
                showNotification(false,"Please try again later.");
            }
        });
    }
    else{
        showNotification(false,"Please provide your comment");
    }



}