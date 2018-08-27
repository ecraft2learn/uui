function setActivityCategories(result, status) {

    var list = JSON.parse(result);

    $('#activityTitle').append(list.DATA[0].Title);
    $('#activitiDesc').append(list.DATA[0].Description);

    for (i = 0; i < list.DATA.length; i++) {
        var riga = list.DATA[i];
        if (riga.CategoryId) {

            var html = "<div id=\"category_" + riga.CategoryId + "\" class=\"category row-fluid container-fluid form-horizontal\">";
            html += "<div class=\"row-fluid  container-fluid category-header\">    <div class=\"categoryTitle col-xs-12\">";
            html += "<h4>" + riga.CategoryName + "</h4>    </div> </div> <div class=\"row-fluid  container-fluid category-body\">";

            //category criteria
            html += "<div id=\"category_" + riga.CategoryId + "-criterias\" class=\"col-sm-6 col-md-5\" style=\"padding-left: 0px; padding-right:opx;\"> </div>";

            //students remarks
            html += "<div class=\"col-sm-4 col-md-5 form-group\" > <label for=\"category_" + riga.CategoryId + "_remark\">Students remarks:</label>  <textarea name=\"remark\" id=\"category_" + riga.CategoryId + "_remark\" rows=\"5\" class=\"form-control\" placeholder=\"Students remarks\"></textarea>    </div>";

            //self-evaluation
            html += "<div class=\"col-sm-2 form-group\">  <label for=\"category_" + riga.CategoryId + "_selfEvaluation\">Self-evaluation:</label> <select name=\"selfEvaluation\" class=\"form-control selfevaluation\" id=\"category_" + riga.CategoryId + "_selfEvaluation\" placeholder=\"self-evaluation\" required='true'><option value=''></option> <option value='1'>1</option> <option value='2'>2</option> <option value='3'>3</option> <option value='4'>4</option> <option value='5'>5</option> </select>";
            html += "</div> </div>";

            //teacher evaluation
            html += "<div class=\"row-fluid container-fluid category-footer\">    <div class=\"col-md-2 container-fluid\">        <span><strong>Teacher's evaluation: </strong></span>        <span>";
            html += "<label id=\"category_" + riga.CategoryId + "-teacherEvaluation\" class=\"form-control\" style=\"text-align:center;\" disabled> </label>        </span>    </div>";

            //teacher remark
            html += "<div class=\"col-md-10\" style=\"text-align: justify; text-justify: inter-word;\">        <p id=\"category_" + riga.CategoryId + "-teacherNote\">            <strong> Teacher's note: </strong></p>    </div></div></div>";

            $('#categoryContainer').append(html);

            getCategoryCriterias(riga.CategoryId, addCriterias);
        }
    }

    getSelfEvaluation(getActivityId(), setSelfEvaluation);

    if (!riga.CategoryId) {
        $("#activityLoadingAnimation").hide();
        $("#activityContainer").show();
    }
}



function setSelfEvaluation(result, status) {

    if (result) {
        var list = JSON.parse(result);

        if (list.DATA.length > 0) {
            $('#whatWeKnow').val(list.DATA[0].WhatWeKnow);
            $('#notClear').val(list.DATA[0].NotClear);
        }
    }
}

function addCriterias(result, status) {

    var list = JSON.parse(result);

    var gruppedCriterias = groupCriteriaValues(list.DATA);

    var html = "";


    $.each(gruppedCriterias, function (index, criteria) {
        html += "<div class=\"row-fluid container-fluid form-group\" style=\"width: 100%; padding-bottom: 5px; padding-right: 0px; padding-left: 0px; margin:0px; \">";
        //html += "<div class=\"col-md-8\">" + criteria.Name + "</div>  <div class=\"col-md-4\">  <select id=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "-value\" class=\"form-control\"> <option value=\"\">-</option>";
        html += "<label for=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "_value\">" + criteria.Name + "</label>  <select id=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "_value\" name=\"criteria\" class=\"form-control\"> <option value=\"\">-</option>";

        for (i = 0; i < criteria.CritValues.length; i++) {
            html += "<option value=\"" + criteria.CritValues[i] + "\">" + criteria.CritValues[i] + "</option>";
        }

        //html += "</select></div> </div>";
        html += "</select> </div>";
    });


    if (list.DATA[0]) {
        $('#category_' + list.DATA[0].Category + '-criterias').append(html);
        getCategorySelfEvaluation(getActivityId(), list.DATA[0].Category, setCategorySelfEvaluation);
    }
    else {

        $("#activityLoadingAnimation").hide();
        $("#activityContainer").show();
    }

}

function setCategorySelfEvaluation(result, status) {

    if (result) {
        var list = JSON.parse(result);

        if (list.DATA.length > 0) {
            //alert("setting eval criterias");
            var gruppedEvaluations = groupEvaluations(list.DATA);

            //$('#whatWeKnow').val(gruppedEvaluations.WhatWeKnow);
            //$('#notClear').val(gruppedEvaluations.NotClear);

            $('#category_' + gruppedEvaluations.Category + '_remark').val(gruppedEvaluations.Remark);
            $('#category_' + gruppedEvaluations.Category + '_selfEvaluation').val(gruppedEvaluations.SelfEvaluation);
            $('#category_' + gruppedEvaluations.Category + '-teacherEvaluation').append(gruppedEvaluations.TeacherEvaluation);
            $('#category_' + gruppedEvaluations.Category + '-teacherNote').append(gruppedEvaluations.TeacherNote);

            $.each(gruppedEvaluations.Criterias, function (index, critEval) {

                $('#category_' + gruppedEvaluations.Category + '-criteria_' + critEval.Criteria + '_value').val(critEval.Value);

                var selId = $('#category_' + gruppedEvaluations.Category + '-criteria_' + critEval.Criteria + '_value > option:selected').prevAll().length;
                var a = selId;

            });
        }
    }

    $("#activityLoadingAnimation").hide();
    $("#activityContainer").show();

}

function groupCriteriaValues(list) {

    var grouppedCritValues = Object.values(list.reduce((result, {
        CritId,
        Name,
        Value,
        Category
    }) => {
        // Create new group
        if (!result[CritId]) result[CritId] = {
            CritId,
            Name,
            Category,
            CritValues: [],
        };
        // Append to group
        result[CritId].CritValues.push(
            Value
        );
        return result;
    }, {}));

    return grouppedCritValues;
}

function groupEvaluations(list) {

    if (list) {
        var grouppedEvaluaion = {
            Category: list[0].Category,
            SelfEvaluation: list[0].SelfEvaluation,
            Remark: list[0].Remark,
            TeacherEvaluation: list[0].TeacherEvaluation,
            TeacherNote: list[0].TeacherNote,
            TeacherSubmissionDate: list[0].TeacherSubmissionDate,
            Criterias: []
        };

        $.each(list, function (index, row) {

            grouppedEvaluaion.Criterias.push(
                {
                    Criteria: row.Criteria,
                    Value: row.Value
                });
        });

        return grouppedEvaluaion;
    }
}

function getActivityId() {
    var parameters = location.search.substring(1).split("&");

    var temp = parameters[0].split("=");
    id = unescape(temp[1]);

    return id;
}

function save() {

    if (validateInput()) {
        var selfEvaluation = {
            Activity: getActivityId(),
            WhatWeKnow: $('#whatWeKnow').val(),
            NotClear: $('#notClear').val(),
            SubmissionDate: new Date(),
            Categories: []
        };


        $.each($('.category'), function (i, category) {

            var category = category.id;
            category = category.split("_")[1];
            var remark = $('#category_' + category + '_remark').val();
            var categoryEvaluation = $('#category_' + category + '_selfEvaluation').val();

            selfEvaluation.Categories.push({
                Category: category,
                Remark: remark,
                SelfEvaluation: categoryEvaluation,
                Criterias: []
            });

            $.each($('#category_' + category + '-criterias > .form-group > select'), function (index, criteria) {
                var criteriaId = criteria.id;
                criteriaId = criteriaId.split("_")[2];

                selfEvaluation.Categories[i].Criterias.push({
                    Criteria: criteriaId,
                    Value: criteria.value
                });

            });

        });
        saveSelfEvaluation(selfEvaluation, succesfullSave);
    }

}

function validateInput() {

    var result = true;

    $.each($(".selfevaluation"), function (index, select) {
        if (!$(this).val())
            result = false;
    });

    return result;
}

function succesfullSave(result, status) {
    $("#saveCompleteModal").modal();
}

function goBack() {
    window.history.back();
}