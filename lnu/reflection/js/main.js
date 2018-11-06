
/**
 * This function initializes the reflection functionality.
 */
function initReflection() {

    getReflectionQuestion(function (question,result) {
        createReflectionForm(question);
    });

}

/**
 * Gets reflection questions
 * @param data
 * @param callback
 */

function getReflectionQuestion(callback){
    var sessionId = sessionStorage.getItem("pilotsite");
    var data = {"sessionId":sessionId};
    postAjaxRequest("https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_reflection_pilot_2.php",data,callback);

}