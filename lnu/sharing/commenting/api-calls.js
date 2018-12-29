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


function getCommentsByFileId(fileId,callback) {
    var func = "getComments";
    var data = {"fileId":fileId,"func":func};

    postAjaxRequest(SERVER_URL,data,callback);
}

/**
 * Save comment in database
 * @param comment - student message
 * @param toolId - tool id
 * @param callback
 */
function sendCommentAPI(fileId,comment,username,userId,pilotsite,rating,callback){

    var func = "addComment";

    var data = {"fileId":fileId,"pilotsite":pilotsite,"userId":userId,"comment":comment,"username":username,"rating":rating,"func":func};

    postAjaxRequest(SERVER_URL,data,callback);

}

