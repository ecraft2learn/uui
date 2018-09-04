/**
 * Created by asoadmin on 2018-09-03.
 */


//"https://cs.uef.fi/~ec2l/lnu.php"
/**
 * Ajax post request - first test
 * @param data - json data
 */
function postAjaxRequest(url,data, callback) {
    //console.log("here");
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
        }

    });
}