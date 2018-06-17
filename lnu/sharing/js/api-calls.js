/**
 * Created by asoadmin on 2018-06-11.
 * This file implements API calls to the server
 * Following post methods are:
 *   - getTools: gets list of tools (uui_tools table)
 *   - getProjects: gets user projects (uui_projects table)
 *   - getUserFiles: gets users files that he/she upload in the server (uui_files table)
 *   - shareLocalFile: uploads user file to the server and saved it in sharing table in database (uui_files and uui_sharing table)
 *   - getUsersSharedFiles: gets user shared files from uui_sharing table (uui_sharing and uui_files table)
 *   - getSharedFiles: gets public files (uui_sharing and uui_files table)
 */

var SERVER_URL   = "https://localhost/lnu.php";
var SERVER_URL_2 = "https://localhost/fileman.php";


//GET TOOL LIST
/**
 * This function gets list of tools
 * @param callback - return array of tools
 */
function getTools(callback){
    var data = {"func":"getTools"};

    $.ajax({
        type: "POST",
        url: SERVER_URL,
        data: data,
        success: function (data,result) {
            console.log(data);
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
/**
 * This function gets list of user projects by userId
 * @param callback - returns array of projects
 */
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


//GET USER FILES UPLOADED ON THE SERVER
/**
 * This function gets files that user manually upload on the server
 * @param callback - array of files
 * File: { ID, PROJECTID,TOOLID,USERID,FILE_PATH,ORIG_NAME,TOOL_NAME,PRJ_NAME}
 */
function getUserFilesAPI(callback) {
    var userId = window.sessionStorage.getItem("userId");
    var formData = new FormData();
    formData.append("userId",userId);
    formData.append("func","getUserFiles");

    $.ajax({
        //url: 'https://cs.uef.fi/~ec2l/fileman.php',
        url:SERVER_URL_2,
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
/**
 * This function upload the file to the server and saves it in sharing table in database
 * @param callback - returns "success" or "error"
 */
function shareLocalFile(callback) {

    var data = $('#sharingForm').serializeArray();
    console.log($('#sharingForm').serializeArray());
    if(data.length>0){


        var projectId = data.find(function (field) {
            return field.name ==="projectId";
        });

        var toolId = data.find(function (field) {
            return field.name ==="toolId";
        });

        if(projectId.value!=""){

            var formData = new FormData();
            formData.append("file", $("#fileInput")[0].files[0]);
            formData.append("projectId",projectId.value);
            formData.append("toolId",toolId.value);
            formData.append("func","uploadFile");
            //upload file to the server
            $.ajax({
                //url: 'https://cs.uef.fi/~ec2l/fileman.php',
                url:SERVER_URL_2,
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
                    saveSharing(data,callback);
                }
            });
        }

    }

}


/**
 * Add file to sharing table
 * @param data
 * @param callback - success or error
 */
function saveSharing(data,callback) {

    var formData = new FormData();
    formData.append("userId",window.sessionStorage.getItem("userId"));
    formData.append("pilotsite",window.sessionStorage.getItem("pilotsite"));

    if(data.length>0){


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
            url: SERVER_URL,
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
}


//GET USERS SHARED FILES
/**
 * This function gets users shared files
 * @param callback returns array of files
 * returns [{ ID, TITLE, DESCRIPTION, KEYWORDS, IS_AUTHORISED, FILEID,TIME_STAMP, PROJECTID,TOOLID,USERID,FILE_PATH,ORIG_NAME,TOOL_NAME,PRJ_NAME}]
 */
function getUsersSharedFiles(callback){
    var formData = new FormData();
    formData.append("userId",window.sessionStorage.getItem("userId"));
    formData.append("func","getUsersSharedFiles");

    $.ajax({
        type: "POST",
        url: SERVER_URL,
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: false,
        success: function (data,result) {
            console.log(data);

            callback(JSON.parse(data)["DATA"]);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            callback([]);
        }

    });
}

//GET SHARED FILES
/**
 * Get public or all available shared files
 * @param callback
 */
function getSharedFiles(callback) {
    var formData = new FormData();
    formData.append("pilotsite",window.sessionStorage.getItem("pilotsite"));
    formData.append("role",0);
    formData.append("func","getSchoolSharedFiles");

    $.ajax({
        type: "POST",
        url: SERVER_URL,
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: false,
        success: function (data,result) {
            console.log(data);
            callback(JSON.parse(data)["DATA"]);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            callback([]);
        }

    });
}


//GET NOT SHARED FILES
function getNotSharedFiles(callback) {
    var formData = new FormData();
    formData.append("userId",window.sessionStorage.getItem("userId"));
    formData.append("func","getNotSharedFiles");

    $.ajax({
        type: "POST",
        url: SERVER_URL,
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: false,
        success: function (data,result) {
            console.log(data);
            callback(JSON.parse(data)["DATA"]);
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR);
            console.log(exception);
            callback([]);
        }

    });
}

//DOWNLOAD FILE
function download(filename) {
    var element = document.createElement('a');
    element.setAttribute('href', "https://localhost/download_file.php?file=" + filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

//REMOVE FILE FROM SHARING TABLE
function stopSharing(ID,callback) {
    var formData = new FormData();
    formData.append("id",ID);
    formData.append("func","stopSharing");

    $.ajax({
        type: "POST",
        url: SERVER_URL,
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
            //callback([]);
            callback("error");
        }

    });
}
