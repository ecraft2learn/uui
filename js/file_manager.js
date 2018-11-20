/*  Function: addFile
   
    Uploads a file to the server. 

    Parameters:
        projectId - ID of the project that this file belongs to (Type: Int)
        toolId - ID of the tool that this file was created with, or the tool that can be used to open this file. (Type: Int)
        fileInputObject - The JS DOM object of the type <input type="file"> that contains the file information. (Type: Object)
        responseHandler - [optional] A *function* which is responsible for handling the response from the AJAX call. If omitted, the function
                          will use the default response handler for addFile which is <handleAddFileResponse>.
		data - The data from the application that will be saved. (Type: String)
    Returns:
        This function does not return any value. It uses the <handleGetUserProjectsResponse> or responseHandler (the last parameter to this function) callback functions to parse the data received from the server. 
        If this function fails before making the AJAX call, then the *errorStatus* field in the *window.sessionStorage* is set to "fail".

    Remarks:
        Tool IDs are preset and are as follows:

        |  1 | General             
        |  2 | eCraft Search       
        |  3 | eCraft Plan         
        |  4 | Trello              
        |  5 | TinkerCad 3D Design 
        |  6 | TinkerCad Circuits  
        |  7 | Beetle Blocks       
        |  8 | 3D Slash            
        |  9 | Cura                
        | 10 | Snap!               
        | 11 | Snap4Arduino        
        | 12 | Ardublock           
        | 13 | Scratch for RPi     
        | 14 | Scratch for Arduino 
        | 15 | App Inventor        
        | 16 | Pocket Code         
        | 17 | NetsBlox            
        | 18 | Arduino IDE         
        | 19 | Thingiverse      
		| 20 | eCraft TODO
		| 21 | Beetleblocks

   
    See Also:
        <handleAddFileResponse>
*/
function addFile(projectId, toolId, fileInputObject, responseHandler) {
	var name = fileInputObject.get('name');
	var data = fileInputObject.get('data');
    var formData = new FormData();
    formData.append("func", "uploadFile");
    formData.append("toolId", toolId);
    formData.append("projectId", projectId);
	
	
	formData.append("name", name);
	formData.append("data", data);
	
	//Data and name is only used for when using the save to cloud function in applications.
	//If data is empty, the addFile function is used by Share my work.
	if(fileInputObject.get('data') == null || fileInputObject.get('data') == '') {
		if (fileInputObject == null || fileInputObject == undefined
			|| $(fileInputObject) == null || $(fileInputObject) == undefined
			|| $(fileInputObject).prop('files') == null || $(fileInputObject).prop('files') == undefined) {
			window.sessionStorage.setItem("errorStatus", "fail");
			return;
		}
		
		var file_data = $(fileInputObject).prop('files')[0];
		formData.append('file', file_data);
		
		if (file_data == null || file_data == undefined) {
			window.sessionStorage.setItem("errorStatus", "fail");
			return;
		}
	}

    if (responseHandler == undefined)
        responseHandler = handleAddFileResponse;
	
    makeAjaxCall(formData, responseHandler);
}

function removeFile(fileId, responseHandler) {
	var formData = new FormData();
    formData.append("func", "removeFile");
    formData.append("fileId", fileId);
	if (responseHandler == undefined)
        responseHandler = handleRemoveFileResponse;
	makeAjaxCall(formData, responseHandler);
}

/*  Function: addProject
   
    Adds a new project for the given user to the database.

    Parameters:
        userId - ID of the user (Type: Int)
        projectName - A string containing the name of the new project. (Type: String)
        responseHandler - [optional] A *function* which is responsible for handling the response from the AJAX call. If omitted, the function
                          will use the default response handler for addProject which is <handleAddProjectResponse>.

    Returns:
        This function does not return any value. It uses the <handleAddProjectResponse> or responseHandler (the last parameter to this function) callback functions to parse the data received from the server.

    Remarks:
        This function does _not_ check for duplicate names in the database. So it is possible that the same user ends up with two different projects with the same name.

    See Also:
        <handleAddProjectResponse>
*/
function addProject(userId, projectName, responseHandler) {
    var formData = new FormData();
    formData.append("func", "createProject");
    formData.append("userId", userId);
    formData.append("projectName", projectName);

    if (responseHandler == undefined)
        responseHandler = handleAddProjectResponse;

    makeAjaxCall(formData, responseHandler);
}

/*  Function: addUser
   
    Adds a new user to the database through a synchronous AJAX call. 

    Parameters:
        username - A string containing the username. (Type: String)
        pilotsiteId - ID of the pilot site that the user belongs to. The IDs are described in the remarks below. (Type: Int)
        isGroup - [reserved] Always pass 1 for this parameter. (Type: Boolean)
        responseHandler - [optional] A *function* which is responsible for handling the response from the AJAX call. If omitted, the function
                          will use the default response handler for addUser which is <handleAddUserResponse>.

    Returns:
        This function does not return any value. It uses the <handleAddUserResponse> or responseHandler (the last parameter to this function) callback functions to parse the data received from the server.

    Remarks:
        Currently the IDs for the sites (pilotsiteId parameter) are as follows:
        | 10 | Not at a pilot site        
        | 11 | Pataluoto School           
        | 12 | Lyseo High School          
        | 13 | Athens informal pilot site 
        | 14 | Athens formal pilot site   

    See Also:
        <handleAddUserResponse>
*/
function addUser(username, pilotsiteId, isGroup, responseHandler) {
    var formData = new FormData();
    formData.append("func", "addUser");
    formData.append("username", username);
    formData.append("sessionId", pilotsiteId);
    formData.append("isGroup", isGroup);

    if (responseHandler == undefined)
        responseHandler = handleAddUserResponse;

    makeAjaxCall(formData, responseHandler);
}

/*  Function: getProjectFiles
   
    Gets a list of all the files that belong to a specific project. 

    Parameters:
        projectId - ID of the project which its files should be returned (Type: Int)
        responseHandler - [optional] A *function* which is responsible for handling the response from the AJAX call. If omitted, the function
                          will use the default response handler for getProjectFiles which is <handleGetProjectFilesResponse>.

    Returns:
        This function does not return any value. It uses the <handleGetProjectFilesResponse> or responseHandler (the last parameter to this function) callback functions to parse the data received from the server. 

    See Also:
        <handleGetProjectFilesResponse>, <getUserFiles>
*/
function getProjectFiles(projectId, responseHandler) {
    var formData = new FormData();
    formData.append("func", "getProjectFiles");
    formData.append("projectId", projectId);

    if (responseHandler == undefined)
        responseHandler = handleGetProjectFilesResponse;

    makeAjaxCall(formData, responseHandler);
}

/*  Function: getUserFiles
   
    Gets a list of all the files that belong to a specific user. 

    Parameters:
        userId - ID of the user whose files should be returned (Type: Int)
        responseHandler - [optional] A *function* which is responsible for handling the response from the AJAX call. If omitted, the function
                          will use the default response handler for getUserFiles which is <handleGetUserFilesResponse>.

    Returns:
        This function does not return any value. It uses the <handleGetUserFilesResponse> or responseHandler (the last parameter to this function) callback functions to parse the data received from the server. 

    See Also:
        <handleGetUserFilesResponse>, <getProjectFiles>
*/
function getUserFiles(userId, responseHandler) {
    var formData = new FormData();
    formData.append("func", "getUserFiles");
    formData.append("userId", userId);

    if (responseHandler == undefined)
        responseHandler = handleGetUserFilesResponse;

    makeAjaxCall(formData, responseHandler);
}

/*  Function: getUserProjects
   
    Gets a list of all the projects that belong to a givem user.

    Parameters:
        userId - ID of the user (Type: Int)
        responseHandler - [optional] A *function* which is responsible for handling the response from the AJAX call. If omitted, the function
                          will use the default response handler for getUserProjects which is <handleGetUserProjectsResponse>.

    Returns:
        This function does not return any value. It uses the <handleGetUserProjectsResponse> or responseHandler (the last parameter to this function) callback functions to parse the data received from the server. 
   
    See Also:
        <handleGetUserProjectsResponse>
*/
function getUserProjects(userId, responseHandler) {
    var formData = new FormData();
    formData.append("func", "getUserProjects");
    formData.append("userId", userId);

    if (responseHandler == undefined)
        responseHandler = handleGetUserProjectsResponse;

    makeAjaxCall(formData, responseHandler);
}

/*  Function: selectUser
   
    Sends a username and pilot site ID to the server and receives an ID, if such a user exists. 

    Parameters:
        username - A string containing the username. (Type: String)
        pilotsiteId - ID of the pilot site that the user belongs to. The IDs are described in the remarks below. (Type: Int)
        responseHandler - [optional] A *function* which is responsible for handling the response from the AJAX call. If omitted, the function
                          will use the default response handler for selectUser which is <handleSelectUserResponse>.

    Returns:
        This function does not return any value. It uses the <handleSelectUserResponse> or responseHandler (the last parameter to this function) callback functions to parse the data received from the server.

    Remarks:
        Use this function to check if a user exists or not. You may call the *<addUser>* function afterwards to add the user, if they do not exist.

    See Also:
        <handleSelectUserResponse>, <addUser>
*/
function selectUser(username, pilotsiteId, responseHandler) {
    var formData = new FormData();
    formData.append("func", "selectUser");
    formData.append("username", username);
    formData.append("sessionId", pilotsiteId);
	
    if (responseHandler == undefined)
        responseHandler = handleSelectUserResponse;

    makeAjaxCall(formData, responseHandler);
}

//##################################################################################
//##################################################################################
//
// R E S P O N S E   H A N D L E R S 
//
//##################################################################################
//##################################################################################

/*  Function: handleAddFileResponse
   
    Handles the response from the AJAX call to the *<addFile>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It stores the results in the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *uploadedFileId*: ID of the recently uploaded file.
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail* and the following are also set:

        - *uploadedFileId*: this value will be set to -1.

    See Also:
        <addFile>
*/
function handleAddFileResponse(php_script_response) {
    var respObj = JSON.parse(php_script_response);

    if (!checkJsonData(respObj))
        window.sessionStorage.setItem("errorStatus", "fail");
    else {
        var fileId = parseInt(respObj.DATA.ID);
        window.sessionStorage.setItem("uploadedFileId", fileId);
        window.sessionStorage.setItem("errorStatus", "success");
    }
}

//##################################################################################
//##################################################################################
//
// R E S P O N S E   H A N D L E R S 
//
//##################################################################################
//##################################################################################

/*  Function: handleRemoveFileResponse
   
    Handles the response from the AJAX call to the *<addFile>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It removes the file from the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *projectFiles*: Updated list with the existing project files.
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail* and the following are also set:

        - *userFiles*: Updated list with the existing user files.

    See Also:
        <addFile>
*/
function handleRemoveFileResponse(php_script_response) {
    var respObj = JSON.parse(php_script_response);
	
    if (!checkJsonData(respObj))
        window.sessionStorage.setItem("errorStatus", "fail");
    else {
        var fileId = parseInt(respObj.DATA.ID);
        var files = JSON.parse(window.sessionStorage.getItem("projectFiles"));
		for(var i = 0; i < files.length; ++i) {
			if(files.DATA[i].ID == fileId) {
				delete files.DATA[i];
				break;
			}
		}
		window.sessionStorage.setItem("userFiles", JSON.stringify(files));
		
		files = JSON.parse(window.sessionStorage.getItem("userFiles"));
		for(var i = 0; i < files.length; ++i) {
			if(files.DATA[i].ID == fileId) {
				delete files.DATA[i];
				break;
			}
		}
		window.sessionStorage.setItem("userFiles", JSON.stringify(files));
		
        window.sessionStorage.setItem("errorStatus", "success");
    }
}

/*  Function: handleAddProjectResponse
   
    Handles the response from the AJAX call to the *<addProject>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It stores the results in the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *projectId*: int value representing the given ID to the new project.
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail*.

    See Also:
        <addProject>
*/
function handleAddProjectResponse(php_script_response) {
    var respObj = JSON.parse(php_script_response);
    if (!checkJsonData(respObj)) {
        //window.sessionStorage.setItem("projectId", -1);
        window.sessionStorage.setItem("errorStatus", "fail");
    }
    else {
        var projectId = parseInt(respObj.DATA['ID']);
        window.sessionStorage.setItem("projectId", projectId);
        window.sessionStorage.setItem("errorStatus", "success");
    }
}

/*  Function: handleAddUserResponse
   
    Handles the response from the AJAX call to the *<addUser>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It stores the results in the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *userId*: int value representing the user ID
        - *username*: string, the username
        - *pilotsite*: int, ID of the pilot site see <addUser>
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail* and the following are also set:

        - *userId*: this will be set to -1

    See Also:
        <addUser>
*/
function handleAddUserResponse(php_script_response) {
    var userObj = JSON.parse(php_script_response);
    var userId = -1;

    if (!checkJsonData(userObj)) {
        window.sessionStorage.setItem("userId", -1);
        window.sessionStorage.setItem("errorStatus", "fail");
    }
    else {
        userId = parseInt(userObj.DATA[0].USERID);
        window.sessionStorage.setItem("userId", userId);
        window.sessionStorage.setItem("username", userObj.DATA[0].USERNAME);
        window.sessionStorage.setItem("pilotsite", userObj.DATA[0].SITE_ID);
        window.sessionStorage.setItem("isGroup", userObj.DATA[0].IS_GROUP);

        window.sessionStorage.setItem("errorStatus", "success");
    }
}

/*  Function: handleGetProjectFilesResponse
   
    Handles the response from the AJAX call to the *<getProjectFiles>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It stores the results in the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *projectFiles*: This is a JSON object that contains an array poplulated with a list of  files. The array is called DATA. For each file the following fields exist: 
            - ID
            - PROJECTID
            - TOOLID
            - FILE_PATH
            - ORIG_NAME
            - TOOL_NAME

        Note that the field names are ALL CAPS. See the example below on how to use the data stored in sessionStorage:

        --- Code
        var prjsObj = JSON.parse(window.sessionStorage.getItem("projectFiles"));
        for (i=0; i<prjsObj.DATA.length; i++)
            alert( prjsObj.DATA[i].ID + ": " + prjsObj.DATA[i].TOOL_NAME);
        ---
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail*.

    See Also:
        <getProjectFiles>
*/
function handleGetProjectFilesResponse(php_script_response) {
    var respObj = JSON.parse(php_script_response);

    if (!checkJsonData(respObj)) {
		window.sessionStorage.setItem("projectFiles", 0);
		window.sessionStorage.setItem("errorStatus", "fail");
	} else {
        window.sessionStorage.setItem("projectFiles", php_script_response);
        window.sessionStorage.setItem("errorStatus", "success");
    }
}

/*  Function: handleGetUserFilesResponse
   
    Handles the response from the AJAX call to the *<getUserFiles>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It stores the results in the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *userFiles*: This is a JSON object that contains an array populated with a list of  files. The values are stored in an array called DATA. For each file the following fields exist: 
            - ID
            - PROJECTID
            - TOOLID
            - USERID
            - FILE_PATH
            - ORIG_NAME
            - TOOL_NAME
            - PRJ_NAME

        Note that the field names are ALL CAPS. See the example below on how to use the data stored in sessionStorage:

        --- Code
        var prjsObj = JSON.parse(window.sessionStorage.getItem("userFiles"));
        for (i=0; i<prjsObj.DATA.length; i++)
            alert( prjsObj.DATA[i].ID + ": " + prjsObj.DATA[i].TOOL_NAME);
        ---
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail*.

    See Also:
        <getUserFiles>
*/
function handleGetUserFilesResponse(php_script_response) {
    var respObj = JSON.parse(php_script_response);
    if (!checkJsonData(respObj)){
		window.sessionStorage.removeItem("userFiles");
		window.sessionStorage.setItem("errorStatus", "fail");
	} else {
        window.sessionStorage.setItem("userFiles", php_script_response);
        window.sessionStorage.setItem("errorStatus", "success");
    }
}

/*  Function: handleGetUserProjectsResponse
   
    Handles the response from the AJAX call to the *<getUserProjects>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It stores the results in the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *userProjects*: This is a JSON object that contains an array populated with list of all the projects. The values are stored in an array called DATA. For each project the following fields exist: 
            - ID 
            - PRJ_NAME. 
            
        Note that the field names are ALL CAPS. See the example below on how to use the data stored in sessionStorage:

        --- Code
        var prjsObj = JSON.parse(window.sessionStorage.getItem("userProjects"));
        for (i=0; i<prjsObj.DATA.length; i++)
            alert( prjsObj.DATA[i].ID + ": " + prjsObj.DATA[i].PRJ_NAME);
        ---
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail*.

    See Also:
        <getUserProjects>
*/
function handleGetUserProjectsResponse(php_script_response) {
    var respObj = JSON.parse(php_script_response);

    if (!checkJsonData(respObj))
        window.sessionStorage.setItem("errorStatus", "fail");
    else {
        window.sessionStorage.setItem("userProjects", php_script_response);
        window.sessionStorage.setItem("errorStatus", "success");
    }
}

/*  Function: handleSelectUserResponse
   
    Handles the response from the AJAX call to the *<selectUser>* function. You will not be directly making calls to this function unless you want to implement your own responseHandler which improves
    the functionality of this function. 

    Parameters:
        php_script_response - The response string received from AJAX call.

    Returns:
        This function does not return any value. It stores the results in the *window.sessionStorage* object.
        
    Remarks:
        Upon success the *errorStatus* field in *window.sessionStorage* is set to *success* and the following are also set:

        - *userId*: int value representing the user ID
        - *username*: string, the username
        - *pilotsite*: int, ID of the pilot site see <addUser>
        - *isGroup*: [reserved]
                
        If the call fails or the response is not parsable the *errorStatus* field in *window.sessionStorage* is set to *fail* and the following are also set:

        - *userId*: this will be set to -1

    See Also:
        <selectUser>
*/
function handleSelectUserResponse(php_script_response) {
    var userObj = JSON.parse(php_script_response);
    var userId = -1;

    if (!checkJsonData(userObj)) {
        window.sessionStorage.setItem("userId", -1);
        window.sessionStorage.setItem("errorStatus", "fail");
    }
    else {
        userId = parseInt(userObj.DATA[0].USERID);
        window.sessionStorage.setItem("userId", userId);
        window.sessionStorage.setItem("username", userObj.DATA[0].USERNAME);
        window.sessionStorage.setItem("pilotsite", userObj.DATA[0].SITE_ID);
        window.sessionStorage.setItem("isGroup", userObj.DATA[0].IS_GROUP);

        window.sessionStorage.setItem("errorStatus", "success");
    }
}

function ping(handler){
    var formData = new FormData();
    formData.append("func", "ping");
    
    makeAjaxCall(formData, handler);
}

function makeAjaxCall(formData, handler) {
    $.ajax({
        url: 'https://cs.uef.fi/~ec2l/fileman.php',
        //url: 'http://localhost/fileman/fileman_basic.php',
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: false,
        //success: function(php_script_response){
        //    $('#result').append(php_script_response + "<br/>");
        //}
        success: function (php_script_response) {
            handler(php_script_response);
        }
    });
}

function checkJsonData(jsonData) {
    if (jsonData == null || jsonData == undefined)
        return false;
    if (jsonData.DATA == null || jsonData.DATA == undefined)
        return false;
    if ((jsonData.DATA[0] == null || jsonData.DATA[0] == undefined) && $.isArray(jsonData.DATA))
        return false;

    return true;
}

function dummyHandler(php_script_response) {
    //Do Nothing
}