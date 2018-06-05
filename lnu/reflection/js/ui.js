/**
 * Created by asoadmin on 2018-05-24.
 */
/**
 * This function initializes the reflection functionality.
 */
function initReflection() {
    postRequest({"sessionId":11},function (result) {
        console.log(result);
        var questions = result;
        for(var i=0;i<questions.length;i++){
            if(questions[i].content!=""){
                console.log("here");
                questionHtmlGenerator(questions[i].content);
            }

        }
        if(questions.length>0){
            document.getElementById("uui-reflection").appendChild(m_createButton("Send",onSend))
        }

    });
}

/**
 * Gets reflection questions
 * @param data
 * @param callback
 */

function postRequest(data,callback){
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


/**
 * Creates and returns the send answers on questions button
 * @param options : The input object configuration
 */
function m_createButton(lableText,callback) {
    var el;
    el = document.createElement("button");
    el.id = "reflection-btn";
    el.textContent = lableText;
    el.addEventListener("click", callback);
    return el;
}

function onSend() {
    console.log("send answers");
}