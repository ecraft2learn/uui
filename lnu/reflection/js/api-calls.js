/**
 * Created by asoadmin on 2018-10-17.
 */
//"https://cs.uef.fi/~ec2l/lnu.php"
//var LOCAL_SERVER_URL   = "https://localhost/lnu.php";
var SERVER_URL = "https://cs.uef.fi/~ec2l/lnu.php";
/**
 * Ajax post request - first test
 * @param data - json data
 */
function postAjaxRequest(url,data, callback) {

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (data,result) {
            console.log(data);
            callback(JSON.parse(data),result);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            callback("error");
        }

    });
}

/**
 * Save reflection answer to database
 * @param question - reflection questioin from Tapani's API
 * @param answer - student answer on the reflection question
 * @param toolId - tool id
 * @param callback
 */
function saveReflection(question,answer,toolId,callback) {
    //console.log(window.sessionStorage);
    //data to be sent: {question, answer,pilotsite,userid,timestamp, func}
    var userId = window.sessionStorage.getItem("userId");
    var pilotsite = window.sessionStorage.getItem("pilotsite");
    var func = "addReflection";
    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    //console.log(userId);
    var data = {"toolId":toolId,"pilotsite":pilotsite,"userId":userId,"answer":answer,"question":question,"timestamp":timestamp,"func":func};
    //console.log(data);
    postAjaxRequest(SERVER_URL,data,callback);
}