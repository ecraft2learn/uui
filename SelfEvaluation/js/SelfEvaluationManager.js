

function getActivities(pilotSite, responseHandler) {
    if (pilotSite == null || pilotSite == undefined) {
        window.sessionStorage.setItem("errorStatus", "fail");
        return;
    }


    var formData = new FormData();
    formData.append("func", "getActivities");
    formData.append("pilotSite", pilotSite);

    makeAjaxCall(formData, responseHandler);
}


function getActivityCategories(activityId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getActivityCategories");
    formData.append("activity", activityId);
    formData.append("pilotSite", window.sessionStorage.getItem('pilotsite'));

    makeAjaxCall(formData, responseHandler);
}

function getCategoryCriterias(categoryId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getCategoryCriterias");
    formData.append("category", categoryId);

    makeAjaxCall(formData, responseHandler);
}

function getSelfEvaluation(activityId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getSelfEvaluation");
    formData.append("activity", activityId);
    formData.append("group", window.sessionStorage.getItem("userId"));

    makeAjaxCall(formData, responseHandler);
}

function getCategorySelfEvaluation(activityId, categoryId, responseHandler) {
    var formData = new FormData();

    formData.append("func", "getCategorySelfEvaluation");
    formData.append("activity", activityId);
    formData.append("category", categoryId);
    formData.append("group", window.sessionStorage.getItem("userId"));

    makeAjaxCall(formData, responseHandler);
}

function saveSelfEvaluation(selfEvaluation, responseHandler) {
    var formData = new FormData();

    formData.append("func", "saveSelfEvaluation");
    selfEvaluation.Group = window.sessionStorage.getItem("userId");
    formData.append("selfEvaluation", JSON.stringify(selfEvaluation));

    makeAjaxCall(formData, responseHandler);
}



function ping(handler) {
    var formData = new FormData();
    formData.append("func", "ping");

    makeAjaxCall(formData, handler);
}

var url = "http://localhost/php/selfEvaluationManager.php"; //'https://cs.uef.fi/~ec2l/WebDocs/SelfEvaluationManger.php'
function makeAjaxCall(formData, handler, async = true) {
    $.ajax({
        url: url,
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        async: async,
        success: function (php_script_response) {
            handler(php_script_response);
        }
    });
}
