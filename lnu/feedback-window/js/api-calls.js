/**
 * Created by asoadmin on 2018-09-03.
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
            //console.log(data);
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
 * Save comment in database
 * @param comment - student message
 * @param toolId - tool id
 * @param callback
 */
function saveComment(comment,toolId,callback){
  //data to be sent: {pilotsite,userid,comment,timestamp, func}
    var userId = window.sessionStorage.getItem("userId");
    var pilotsite = window.sessionStorage.getItem("pilotsite");
    var func = "addComment";
    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    var data = {"toolId":toolId,"pilotsite":pilotsite,"userId":userId,"comment":comment,"timestamp":timestamp,"func":func};

    postAjaxRequest(SERVER_URL,data,callback);

}

