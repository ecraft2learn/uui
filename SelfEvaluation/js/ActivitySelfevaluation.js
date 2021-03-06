function setActivityCategories(result, status) {

    var list = JSON.parse(result);

    $('#activityTitle').append(list.DATA[0].Title);
    $('#activitiDesc').append(list.DATA[0].Description);

    for (i = 0; i < list.DATA.length; i++) {
        var riga = list.DATA[i];
        if (riga.CategoryId) {

            var html = "<div id=\"category_" + riga.CategoryId + "\" class=\"category grid form-horizontal\" style='border: 1px solid " + riga.StarsColor + ";'>";
            html += "<div class=\"row category-header\">    <div class=\"categoryTitle cell\">";
            html += "<h3>" + riga.CategoryName + "</h3>    </div> </div> <div class=\"row category-body ml-1\">";

            //category criteria
            html += "<div id=\"category_" + riga.CategoryId + "-criterias\" class=\"cell-sm-6 cell-md-5\" style=\"padding-left: 0px; padding-right:opx;\"> </div>";

            //students remarks
            html += "<div class=\"cell-sm-4 cell-md-5 form-group\" > <label for=\"category_" + riga.CategoryId + "_remark\">Students remarks:</label>  <textarea name=\"remark\" id=\"category_" + riga.CategoryId + "_remark\" rows=\"5\" style=\"width:100%;\" placeholder=\"Students remarks\" data-role=\"textarea\"></textarea>    </div>";

            //self-evaluation
            html += "<div class=\"cell-sm-2 form-group\"> <label for=\"category_" + riga.CategoryId + "_selfEvaluation\">Self-evaluation:</label> <select name=\"selfEvaluation\" class=\"selfevaluation\" id=\"category_" + riga.CategoryId + "_selfEvaluation\" placeholder=\"self-evaluation\" required='true' data-role=\"select\" style=\"width:100%;\"><option value=''></option> <option value='1'>1</option> <option value='2'>2</option> <option value='3'>3</option> <option value='4'>4</option> <option value='5'>5</option> </select>";
            html += "</div> </div>";

            //teacher evaluation
//            html += "<div class=\"row category-footer\">    <div class=\"cell-md-2\">        <span><strong>Teacher's evaluation: </strong></span>        <span>";
 //           html += "<label id=\"category_" + riga.CategoryId + "-teacherEvaluation\" class=\"form-control\" style=\"text-align:center;width:100%;\" disabled> </label>        </span>    </div>";

            //teacher remark
//            html += "<div class=\"cell-md-10\" style=\"text-align: justify; text-justify: inter-word;\">        <p id=\"category_" + riga.CategoryId + "-teacherNote\">            <strong> Teacher's note: </strong></p>    </div></div></div>";

            $('#categoryContainer').append(html);

            getCategoryCriterias(getActivityId(), riga.CategoryId, addCriterias);
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

	console.log(list);

        if (list.DATA.length > 0) {

	   let str = '<h3>Teacher\' evaluation</h3>';

	   if (list.DATA[0].TeacherNote) {

		//console.log(list.DATA);
		//console.log('jaa');
	   	for (let i = 0; i < list.DATA.length; i++) {
	
			str += '<h5>' + list.DATA[i].name + '</h5>';
			str += '<p>Teacher\'s notes: ' + list.DATA[i].TeacherNote + '</p>';
			str += '<p>Teacher\'s evaluation: ' + list.DATA[i].TeacherEvaluation + '</p>';
			str += '<p>Your notes: ' + list.DATA[i].Remark + '</p>';
			str += '<p>Your self-evaluation: ' + list.DATA[i].SelfEvaluation + '</p>';
			str += '<hr>';

	   	}


	   } else
		str = '<h3>Self-evaluated and waiting for teacher\'s evaluation</h3>';

	    //$('#categoryContainer').html('<h2>Self-evaluated and waiting for teacher\'s evaluation.</h2>');
            $('#self-eval-reflect').html('');
            $('#self-eval-btns').html('');
            //$('#whatWeKnow').val(list.DATA[0].WhatWeKnow);
            //$('#notClear').val(list.DATA[0].NotClear);
        
           $('#categoryContainer').html(str);

	}
    }
}

function addCriterias(result, status) {

    var list = JSON.parse(result);

    var gruppedCriterias = groupCriteriaValues(list.DATA);

    var html = "";


    $.each(gruppedCriterias, function (index, criteria) {
        html += "<div class=\"row form-group\" style=\"width: 100%; padding-bottom: 5px; padding-right: 0px; padding-left: 0px; margin:0px; \">";
        //html += "<div class=\"col-md-8\">" + criteria.Name + "</div>  <div class=\"col-md-4\">  <select id=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "-value\" class=\"form-control\"> <option value=\"\">-</option>";
        html += "<label for=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "_value\">" + criteria.Name + "</label>  <select id=\"category_" + criteria.Category + "-criteria_" + criteria.CritId + "_value\" name=\"criteria\"  data-role=\"select\" style=\"width:100%;\"> <option value=\"\">-</option>";

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

	    //$('#categoryContainer').html('<h2>Self-evaluated and waiting for teacher\'s evaluation.</h2>');
	    $('#self-eval-reflect').html('');
	    $('#self-eval-btns').html('');


	    if (gruppedEvaluations.TeacherNote) {
		//$('#categoryContainer').html('');
	        //for (let i = 0; i < list.DATA.length; i++)
	    	//	$('#categoryContainer').append('<h4>Teacher\'s notes</h4><p>' + list.DATA[i].TeacherNote + '</p>');
	    	//$('#categoryContainer').append('<h5>Achievements unlocked</h5>');
	    }
            //$('#category_' + gruppedEvaluations.Category + '_remark').val(gruppedEvaluations.Remark);
            //$('#category_' + gruppedEvaluations.Category + '_selfEvaluation').val(gruppedEvaluations.SelfEvaluation);
            //$('#category_' + gruppedEvaluations.Category + '-teacherEvaluation').append(gruppedEvaluations.TeacherEvaluation);
            //$('#category_' + gruppedEvaluations.Category + '-teacherNote').append(gruppedEvaluations.TeacherNote);

            $.each(gruppedEvaluations.Criterias, function (index, critEval) {

                $('#category_' + gruppedEvaluations.Category + '-criteria_' + critEval.Criteria + '_value').val(critEval.Value);

                var selId = $('#category_' + gruppedEvaluations.Category + '-criteria_' + critEval.Criteria + '_value > option:selected').prevAll().length;
                var a = selId;

            });

            //if (gruppedEvaluations.TeacherEvaluation)
            //    $('#saveBtn').prop("disabled", true);
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

	    let selects = $('#category_' + category + '-criterias').find('select');

	    for (let j = 0; j < selects.length; j++) {
            //$.each($('#category_' + category + '-criterias > .form-group > select'), function (index, criteria) {
	        let criteria = selects[j];
                var criteriaId = criteria.id;
                criteriaId = criteriaId.split("_")[2];

                selfEvaluation.Categories[i].Criterias.push({
                    Criteria: criteriaId,
                    Value: criteria.value
                });

            }

        });
        saveSelfEvaluation(selfEvaluation, succesfullSave);
    }

}

function validateInput() {

    /*
    var result = true;

    $.each($(".selfevaluation"), function (index, select) {
        if (!$(this).val())
            result = false;
    });

    return result;
    */
    return $('#whatWeKnow').val().trim() !== '' && $('#notClear').val().trim() !== '';
}

function succesfullSave(result, status) {
    $("#saveCompleteModal").modal();
}

function goBack() {
    window.history.back();
}
