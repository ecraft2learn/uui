
var formId="reflection-form";

/**
 * This function initializes the reflection functionality.
 */
function createReflectionForm(question) {


    if(question[0].content!="") {

         //generate reflection form

        // Free text
        var freeText = {
            label: question[0].content,
            input: "textfield"
        };


        // Send button
        var sendButton = {
            label: null,
            input: "button",
            inputSettings: [
                {
                    // The text on the button
                    buttonLabel: "Send Reflection",

                    // The callback method that will run once the button is pressed
                    callback: onSendReflection,
                    //Button Id
                    btnId:"reflection-btn"
                }
            ]
        };

        // Compiling the input objects in an array
        var settings = {
            inputs: [ freeText,sendButton]
        };

        initCreation(settings,"reflection-form","uui-reflection");

    }
    else{
        //nothing to reflect on

    }


}


function onSendReflection() {
    //avoid page refresh after form submit
    event.preventDefault();

    //clear the form
    var formId = $(event.target).closest("form").attr('id');
    clearForm(formId);

    //show notification result
    showNotification(true,"Reflection message was sent successfully!");

    //TODO:save reflection to database


}