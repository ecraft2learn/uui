
/**
 * This file creates commenting form
 */
function createCommentingForm() {

    // Free text
    var freeText = {
        label: "Comment:",
        input: "textfield"
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

    var formId = $(event.target).closest("form").attr('id');
    clearForm(formId);




    showNotification(true,"Comment was sent successfully!");
    //TODO:save it in database




}