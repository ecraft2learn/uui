
var formId="reflection-form";

/**
 * This function initializes the reflection functionality.
 */
function createReflectionForm(question) {

    //check if question is not empty
    if(question.length>0) {

         //generate reflection form

        // Free text
        var freeText = {
            label: question[0].content,
            input: "textfield",
            id:"reflection"
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


function onSendReflection(event) {
    //avoid page refresh after form submit
    event.preventDefault();

    var answer = $('#reflection').val();
    var question = $('#reflection').parent().find('label').text();

    if (answer!=""){


        //clear the form
        var formId = $(event.target).closest("form").attr('id');
        clearForm(formId);

        //save data in database
        saveReflection(question,answer, function (result) {
            if(result!="error"){
                showNotification(true,"Reflection message was sent successfully!");
            }
            else{
                showNotification(false,"Please try again later.");
            }
        });
    }
    else{
        showNotification(false,"Please provide some reflection text.");
    }

}