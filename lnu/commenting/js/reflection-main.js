/**
 * Created by asoadmin on 2018-06-01.
 */
/**
 * Created by asoadmin on 2018-05-24.
 */
/**
 * This function initializes the reflection functionality.
 */
function initReflection() {

    var sessionId = sessionStorage.getItem("pilotsite");
    getQuestions({"sessionId":sessionId},function (result) {
        //console.log(result);
        var questions = result;
        for(var i=0;i<questions.length;i++){
            if(questions[i].content!=""){
                questionHtmlGenerator(questions[i].content);
            }

        }
        if(questions.length>0){

            // Send button
            var sendButton = {
                label: null,
                input: "button",
                inputSettings: [
                    {
                        // The text on the button
                        buttonLabel: "Send my reflection",

                        // The callback method that will run once the button is pressed
                        callback: onSend
                    }
                ]
            };

            document.getElementById("uui-reflection").appendChild(m_createButton(sendButton))
        }

    });
}

/**
 * Gets reflection questions
 * @param data
 * @param callback
 */

function getQuestions(data,callback){
//    http://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_reflection_pilot_2.php
    $.ajax({
        type: "POST",
        url: "https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_reflection_pilot_2.php",
        data: data,
        success: function (data,result) {

            callback(JSON.parse(data));
        }
    });

}

function questionHtmlGenerator(questionHtml) {

    document.getElementById("uui-reflection").innerHTML+= questionHtml;

    var el = document.createElement("textarea");
    el.id = "reflection-freetext";
    document.getElementById("uui-reflection").appendChild(el); // put it into the DOM
}


function onSend() {
    console.log("send answers to Tapani's API");
}