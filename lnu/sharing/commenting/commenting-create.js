
/**
 * This file creates commenting form
 */

function createCommentingForm(comments) {

    var mainDiv = document.createElement("DIV");

   //leave a comment elements
    var commentDiv = document.createElement("DIV");
    var userIcon = document.createElement("IMG");
    userIcon.setAttribute('src', './commenting/images/user-icon2.png');
    userIcon.setAttribute("class", "user-icon");

    var commentText = document.createElement("textarea");
    commentText.setAttribute("class","comment-text");
    commentText.setAttribute("placeholder","Leave a comment");
    commentText.setAttribute("id","comment");

    var sendCommentBtn = document.createElement("button");
    sendCommentBtn.setAttribute("class","button send-button");
    sendCommentBtn.textContent = "Send";
    sendCommentBtn.setAttribute("id","sendCommentBtn");

    commentDiv.appendChild(userIcon);
    commentDiv.appendChild(commentText);
    commentDiv.appendChild(sendCommentBtn);

    mainDiv.appendChild(commentDiv);

   //Comment List
    var commentListDiv = document.createElement("DIV");
    commentListDiv.setAttribute("class","listview");
    commentListDiv.setAttribute("data-role","listview");

    var listgroupDiv = document.createElement("DIV");
    listgroupDiv.setAttribute("class","list-group");

    var listTitle = document.createElement("span");
    listTitle.setAttribute("class","list-group-toggle list-header");
    listTitle.setAttribute("id","countComments");
    listTitle.innerHTML = comments.length + " Comments";

    var groupListDiv = document.createElement("DIV");
    groupListDiv.setAttribute("class","list-group-content");
    groupListDiv.setAttribute("id","groupList");

    for(var i=0;i<comments.length;i++){

       var listItem = document.createElement("DIV");
       listItem.setAttribute("class","list");

       var userIconL = document.createElement("IMG");
       userIconL.setAttribute('src', './commenting/images/user-icon2.png');
       userIconL.setAttribute("class", " list-icon");



       var userName = document.createElement("span");
        userName.setAttribute("class","list-title user-name");
        userName.innerHTML = comments[i]["USERNAME"];

        var comment = document.createElement("p");
        comment.innerHTML = comments[i]["COMMENT"];
        comment.setAttribute("class","comment");

        listItem.appendChild(userIconL);
        listItem.appendChild(userName);
        listItem.appendChild(comment);

        groupListDiv.appendChild(listItem);
    }

    listgroupDiv.appendChild(listTitle);
    listgroupDiv.appendChild(groupListDiv);

    commentListDiv.appendChild(listgroupDiv);

    mainDiv.appendChild(commentListDiv);


    return mainDiv.outerHTML;
}



function sendComment(fileId) {


    var comment = document.getElementById("comment").value;

    if(comment!==""){
        var username = window.sessionStorage.getItem("username");
        var userId = window.sessionStorage.getItem("userId");
        var pilotsite = window.sessionStorage.getItem("pilotsite");


        document.getElementById("comment").value = "";
        insertComment(comment,username);

        sendCommentAPI(fileId,comment,username,userId,pilotsite,function (result) {

            if(result["RESULT"]==="SUCCESS"){
                showNotification(true,"Your comment has been send successfully");
            }
            else{
                showNotification(false,"Please try again later.");
            }
        })
    }


}

function getComments(fileId,callback) {
    getCommentsByFileId(fileId,callback);
}


function insertComment(comment_text,username) {
    var listItem = document.createElement("DIV");
    listItem.setAttribute("class","list");

    var userIconL = document.createElement("IMG");
    userIconL.setAttribute('src', './commenting/images/user-icon2.png');
    userIconL.setAttribute("class", " list-icon");



    var userName = document.createElement("span");
    userName.setAttribute("class","list-title user-name");
    userName.innerHTML = username;

    var comment = document.createElement("p");
    comment.innerHTML = comment_text;
    comment.setAttribute("class","comment");

    listItem.appendChild(userIconL);
    listItem.appendChild(userName);
    listItem.appendChild(comment);

    //var firstChild = groupListDiv.firstChild;
    //mainDiv.appendChild(listItem);
    $("#groupList").prepend(listItem.outerHTML);
    $("#countComments").text($("#groupList").children().length + " Comments");
    //groupListDiv.insertBefore(listItem,firstChild);
}


/**
 * This function shows notification
 * @param isSuccess- boolean parameter: true or false
 * @param message - message to display
 */
function showNotification(isSuccess, message){

    if(isSuccess){
        $.Notify({
            caption: 'Notification',
            content: message,
            type: 'success'
        });
        //Metro.toast.create(message, null, null, "success");

    }
    else{
        $.Notify({
            caption: 'Notification',
            content: message,
            type: 'alert'
        });
    }
}

