
/**
 * This file creates commenting form
 */

var options = [ {text:"Select a comment",value:0},
                {text:"This looks smashing, awesome job",value:5},
                {text:"Looking really good, excellent job",value:4},
                {text:"Way to go! Good job",value:3},
                {text:"Nice job, keep on trying for more",value:2},
                {text:"Nice try, ok",value:1}];

// ������= awesome job
// ����= looking really good, excellent job
// ����=  good job, keep on trying for more
//     ��=nice try, ok


function createCommentingForm(comments) {

    var mainDiv = document.createElement("DIV");


    //leave a comment elements

    var commentDiv = document.createElement("DIV");


    var userIcon = document.createElement("IMG");
    userIcon.setAttribute("src", "./commenting/images/user-icon2.png");
    userIcon.setAttribute("class", "user-icon");

    var selectDiv = document.createElement("div");
    selectDiv.setAttribute("class", "input-control select");
    var commentSelect = document.createElement("select");
    commentSelect.setAttribute("id", "commentSelect");
    commentSelect.setAttribute("class", "commentSelect");

    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = options[i].text;
        option.value = options[i].value;
        commentSelect.appendChild(option);
    }
    selectDiv.appendChild(commentSelect);


    var ratingDiv = document.createElement("div");
    ratingDiv.setAttribute("class", "rating small");
    ratingDiv.setAttribute("data-role", "rating");
    ratingDiv.setAttribute("data-size", "small");
    ratingDiv.setAttribute("data-score-title", "Rate:");
    ratingDiv.setAttribute("id", "rating");
    ratingDiv.setAttribute("data-static", true);

    var sendCommentBtn = document.createElement("button");
    sendCommentBtn.setAttribute("class", "button send-button");
    sendCommentBtn.textContent = "Send";
    sendCommentBtn.setAttribute("id", "sendCommentBtn");


    commentDiv.appendChild(userIcon);
    commentDiv.appendChild(selectDiv);
    commentDiv.appendChild(sendCommentBtn);

    mainDiv.appendChild(commentDiv);
    mainDiv.appendChild(ratingDiv);


    //Comment List
    var commentListDiv = document.createElement("DIV");
    commentListDiv.setAttribute("class", "listview");
    commentListDiv.setAttribute("data-role", "listview");

    var listgroupDiv = document.createElement("DIV");
    listgroupDiv.setAttribute("class", "list-group");

    var listTitle = document.createElement("span");
    listTitle.setAttribute("class", "list-group-toggle list-header");
    listTitle.setAttribute("id", "countComments");
    listTitle.innerHTML = comments.length + " Comments";

    var groupListDiv = document.createElement("DIV");
    groupListDiv.setAttribute("class", "list-group-content");
    groupListDiv.setAttribute("id", "groupList");

    for (var i = 0; i < comments.length; i++) {

        var listItem = document.createElement("DIV");
        listItem.setAttribute("class", "list");

        var userIconL = document.createElement("IMG");
        userIconL.setAttribute("src", "./commenting/images/user-icon2.png");
        userIconL.setAttribute("class", " list-icon");



        var userName = document.createElement("span");
        userName.setAttribute("class", "list-title user-name");
        userName.innerHTML = comments[i]["USERNAME"];

        if (comments[i]["rating"] > 0) {

            var ratingStaticDiv = document.createElement("div");
            ratingStaticDiv.setAttribute("class", "rating small");
            ratingStaticDiv.setAttribute("data-role", "rating");
            ratingStaticDiv.setAttribute("data-size", "small");
            ratingStaticDiv.setAttribute("data-show-score", false);
            ratingStaticDiv.setAttribute("data-static", true);
            ratingStaticDiv.setAttribute("data-value", comments[i]["rating"]);
            userName.innerHTML += ratingStaticDiv.outerHTML;
        }

        var comment = document.createElement("p");
        comment.innerHTML = comments[i]["COMMENT"];
        comment.setAttribute("class", "comment");

        listItem.appendChild(userIconL);
        listItem.appendChild(userName);
        listItem.appendChild(comment);

        groupListDiv.appendChild(listItem);
    }

    listgroupDiv.appendChild(listTitle);
    listgroupDiv.appendChild(groupListDiv);

    commentListDiv.appendChild(listgroupDiv);

    mainDiv.appendChild(commentListDiv);

    //leave a comment elements
    /* var commentDiv = document.createElement("DIV");
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
 
     mainDiv.appendChild(commentListDiv);*/


    return mainDiv.outerHTML;
}



function sendComment(fileId) {
    if($("#rating").data('rating').value()>0){


        var comment = $("#commentSelect").find("option:selected").text();
        var rating = $("#rating").data('rating').value();
        var username = window.sessionStorage.getItem("username");
        var userId = window.sessionStorage.getItem("userId");
        var pilotsite = window.sessionStorage.getItem("pilotsite");

        //clear rating and comment
        $("#rating").data('rating').value(0);
        $("#commentSelect").val(0);


        sendCommentAPI(fileId, comment, username, userId, pilotsite, rating, function (result) {

            if (result["RESULT"] === "SUCCESS") {
                insertComment(comment, rating, username);

                showNotification(true, "Your comment has been saved", "Thank you for your feedback");
            }
            else {
                showNotification(false, "Please try again later.", "Something went wrong");
            }
        })

    }
    /*var comment = document.getElementById("comment").value;

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
    }*/


}

function getComments(fileId, callback) {
    getCommentsByFileId(fileId, callback);
}


function insertComment(comment_text, rating, username) {
    var listItem = document.createElement("DIV");
    listItem.setAttribute("class", "list");

    var userIconL = document.createElement("IMG");
    userIconL.setAttribute('src', './commenting/images/user-icon2.png');
    userIconL.setAttribute("class", " list-icon");



    var userName = document.createElement("span");
    userName.setAttribute("class", "list-title user-name");
    userName.innerHTML = username;

    if (rating > 0) {

        var ratingStaticDiv = document.createElement("div");
        ratingStaticDiv.setAttribute("class", "rating small");
        ratingStaticDiv.setAttribute("data-role", "rating");
        ratingStaticDiv.setAttribute("data-size", "small");
        ratingStaticDiv.setAttribute("data-show-score", false);
        ratingStaticDiv.setAttribute("data-static", true);
        ratingStaticDiv.setAttribute("data-value", rating);
        userName.innerHTML += ratingStaticDiv.outerHTML;
    }

    var comment = document.createElement("p");
    comment.innerHTML = comment_text;
    comment.setAttribute("class", "comment");

    listItem.appendChild(userIconL);
    listItem.appendChild(userName);
    listItem.appendChild(comment);

    //var firstChild = groupListDiv.firstChild;
    //mainDiv.appendChild(listItem);
    $("#groupList").prepend(listItem.outerHTML);
    $("#countComments").text($("#groupList").children().length + " Comments");

}


/**
 * This function shows notification
 * @param isSuccess- boolean parameter: true or false
 * @param message - message to display
 * @param title - notification title string, defaults to 'Notification'
 */
function showNotification(isSuccess, message, title = 'Notification') {
    if (isSuccess) {
        $.Notify({
            caption: title,
            content: message,
            type: 'success'
        });
    }
    else {
        $.Notify({
            caption: title,
            content: message,
            type: 'alert'
        });
    }
}
