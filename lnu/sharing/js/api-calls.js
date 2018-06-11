/**
 * Created by asoadmin on 2018-06-11.
 */

//GET TOOL LIST
function getTools(callback){
    var data = {"func":"getTools"};
    $.ajax({
        type: "POST",
        url: "https://localhost/lnu.php",
        data: data,
        success: function (data,result) {
            //console.log(data);
            callback(JSON.parse(data)["DATA"]);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            callback([]);
        }

    });
}

//GET USER PROJECTS

function getProjects(callback) {
    var userId = window.sessionStorage.getItem("userId");
    if(userId!=undefined && userId!=-1){
        getUserProjects(userId, handleGetProjectsResponse);
    }
    function handleGetProjectsResponse(phpResponse){
        var jsonData = JSON.parse(phpResponse);
        console.log(jsonData);
        callback(jsonData["DATA"]);
    }
}

//GET USER FILES
function getUserFiles(callback) {
    var userId = window.sessionStorage.getItem("userId");
    var formData = new FormData();
    formData.append("userId",userId);
    formData.append("func","getUserFiles");

    $.ajax({
        url: 'https://cs.uef.fi/~ec2l/fileman.php',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: false,
        success: function (php_script_response) {
            console.log(php_script_response);
            callback(php_script_response);
        }
    });
}


//SHARE LOCAL FILE
function shareLocalFile(callback) {

    var data = $('#sharingForm').serializeArray();
    //console.log($('#sharingForm').serializeArray());
    var projectId = data.find(function (field) {
        return field.name ==="projectId";
    });

    var toolId = data.find(function (field) {
        return field.name ==="toolId";
    });

    var formData = new FormData();
    formData.append("file", $("#fileInput")[0].files[0]);
    formData.append("projectId",projectId.value);
    formData.append("toolId",toolId.value);
    formData.append("func","uploadFile");

    $.ajax({
        url: 'https://cs.uef.fi/~ec2l/fileman.php',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: false,
        success: function (php_script_response) {
            //console.log(php_script_response);
            var fileId = JSON.parse(php_script_response)["DATA"]["ID"];
            data.push({"name":"fileId","value":fileId});
            shareFile(data,callback);
        }
    });

}

function shareFile(data,callback) {

    var formData = new FormData();
    formData.append("userId",window.sessionStorage.getItem("userId"));
    formData.append("pilotsite",window.sessionStorage.getItem("pilotsite"));


    var title = data.find(function (field) {
        return field.name ==="title";
    });

    var description = data.find(function (field) {
        return field.name ==="description";
    });

    var keywords = data.find(function (field) {
        return field.name ==="keywords";
    });

    var fileId = data.find(function (field) {
        return field.name ==="fileId";
    });

    formData.append("title",title.value);
    formData.append("description",description.value);
    formData.append("keywords",keywords.value);
    formData.append("fileId",fileId.value);
    formData.append("func","shareFile");
    formData.append("role",0);
    var timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    formData.append("timestamp",timestamp);

    $.ajax({
        type: "POST",
        url: "https://localhost/lnu.php",
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: false,
        success: function (data,result) {
            console.log(data);
            callback("success");
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            callback("error");
        }

    });




}

