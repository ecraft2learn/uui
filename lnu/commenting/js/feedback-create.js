/**
 * Creates the specified form elements, specifies settings for the inputs
 * @param sentences - is predefined sentences
 */
var formId ="feedback-form";

function createFeedbackForm() {

    // Free text
    var freeText = {
        label: "Feedback:",
        input: "textfield"
    };

    // Ratings
    var ratings = {
        label: "Rating:",
        input: "rating",
        inputSettings: [
            {
                // Radio button value
                value: 1,

                // Radio button label
                label: "1"
            },
            {
                value: 2,
                label: "2"
            },
            {
                value: 3,
                label: "3"
            },
            {
                value: 4,
                label: "4"
            },
            {
                value: 5,
                label: "5"
            }
        ]
    };



    // Send button
    var sendButton = {
        label: null,
        input: "button",
        inputSettings: [
            {
                // The text on the button
                buttonLabel: "Send Feedback",

                // The callback method that will run once the button is pressed
                callback: onSendFeedback,
                //Button Id
                btnId:"feedback-btn"
            }
        ]
    };

    // Compiling the input objects in an array
    var settings = {
        inputs: [ freeText, ratings, sendButton]
    };

    initCreation(settings,"feedback-form","uui-feedback");
}


/**
 * This function runs when the send button is clicked.
 * @param event : MouseEvent
 */
function onSendFeedback(event) {
    event.preventDefault();



    var userID = parseInt(window.sessionStorage.getItem('userId')) || 1;
    var pilotsite = parseInt(window.sessionStorage.getItem('pilotsite'));
    var rating = parseInt($('input[name=rating]:checked').val());
    var free_text = $('#feedback-freetext').val();
    var func = "addFeedback";
    var projectID = parseInt(window.sessionStorage.getItem('projectId')) || 1;
    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');


    if(rating != undefined || free_text!=undefined) {
        var toolName = getToolName();
        //get toolid
        if(toolName != undefined){
            getToolId(toolName,function (result) {
                if(result["DATA"].length > 0){

                    var toolID = parseInt(result["DATA"][0]["TOOLID"]);
                    var data = {"toolID":toolID,"userID":userID,"pilotsite":pilotsite,"feedback":1,"rating":rating,"func":func,"projectID":projectID,"timestamp":timestamp,"free_input":free_text};

                    postAjaxRequest("https://cs.uef.fi/~ec2l/lnu.php",data,function(data,result){

                        var formId = $(event.target).closest("form").attr('id');
                        clearForm(formId);



                        if(result === "success"){

                            showNotification(true,'Your feedback was send successfully');
                        }
                        else{
                            showNotification(false,'Your feedback was not send successfully');
                        }
                    });
                }
            });
        }
        else{
            console.log("ERROR,could not find tool name, could not send feedback");
        }
    }
}
