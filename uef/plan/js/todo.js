var todo = todo || {},

data = data || {};

(function(todo, data, $) {

    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
	    todoUsers: 'users',
            todoDate: "task-date",
            todoDescription: "task-description",
            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div"
        }, codes = {
            "1" : "#pending",
            "2" : "#inProgress",
            "3" : "#completed"
        };

    todo.elements = [];

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(data, function (index, params) {
            generateElement(params);
        });

        $.each(codes, function (index, value) {
            $(value).droppable({
                drop: function (event, ui) {
                        var element = ui.helper,
                            css_id = element.attr("id"),
                            id = css_id.replace(options.taskId, ""),
                            object = data[id];

                            removeElement(object);

                            object.code = index;

                            generateElement(object);
			    
                            data[id] = object;

                            $("#" + defaults.deleteDiv).hide();
                    }
            });
        });

        $("#" + options.deleteDiv).droppable({
            drop: function(event, ui) {
                var element = ui.helper,
                    css_id = element.attr("id"),
                    id = css_id.replace(options.taskId, ""),
                    object = data[id];

                removeElement(object);

                delete data[id];

                $("#" + defaults.deleteDiv).hide();
            }
        })

    };

    var generateElement = function(params){

	var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

	var id = params.id;
	data[id] = params;

        wrapper = $("<div />", {
            "class" : defaults.todoTask,
            "id" : defaults.taskId + params.id,
            "data" : params.id
        }).appendTo(parent);

        $("<div />", {
            "class" : defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoDate,
            "text": 'Due ' + params.date
        }).appendTo(wrapper);

	$('<span>', {

	  	'class': 'users',
		'text': '@' + params.users + ': '

	}).appendTo(wrapper);

        $("<div />", {
            "class" : defaults.todoDescription,
            "text": params.description
        }).appendTo(wrapper);

	    wrapper.draggable({
            start: function() {
                $("#" + defaults.deleteDiv).show();
            },
            stop: function() {
                $("#" + defaults.deleteDiv).hide();
            },
	        revert: "invalid",
	        revertDuration : 200
        });

	todo.elements.push(params);

    };

    todo.generateElement = generateElement;

    var removeElement = function (params) {

        $("#" + defaults.taskId + params.id).remove();

	for (let i = todo.elements.length - 1; i >= 0; i--)
		if (todo.elements[i].id === params.id) {
			todo.elements.splice(i, 1);
			break;
		}

    };

    todo.add = function() {
	var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, tempData, users;

        if (inputs.length !== 6) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;
	users = inputs[3].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id : id,
            code: "1",
            title: title,
            date: date,
            description: description,
	    users: users
        };

        data[id] = tempData;
        generateElement(tempData);

        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
	inputs[3].value = '';
    };

    var generateDialog = function (message) {
        var responseId = "response-dialog",
            title = "Messaage",
            responseDialog = $("#" + responseId),
            buttonOptions;

        if (!responseDialog.length) {
            responseDialog = $("<div />", {
                    title: title,
                    id: responseId
            }).appendTo($("body"));
        }

        responseDialog.html(message);

        buttonOptions = {
            "Ok" : function () {
                responseDialog.dialog("close");
            }
        };

	    responseDialog.dialog({
            autoOpen: true,
            width: 400,
            modal: true,
            closeOnEscape: true,
            buttons: buttonOptions
        });
    };

    todo.clear = function () {
        data = {};
        $("." + defaults.todoTask).remove();
    };

    var sessionId = window.sessionStorage.getItem('pilotsite');
    var users = window.sessionStorage.getItem('username');

    todo.save = function() {

	var data = JSON.stringify(todo.elements);

	$.ajax({

		type: 'POST',
		data: 'data=' + data + '&sessionId=' + sessionId + '&users=' + users,
		url: 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/put_plans_pilot_2.php',
		success: (data) => {


		},
		error: (error) => {

			console.log(error);

		}

	});
saveDataToCloud(data, 'eCraft Todo', 'eCraft Todo');
    };
	
	getProjectFiles(window.sessionStorage.getItem('currentProjectId'));
	var storage = window.sessionStorage.getItem('projectFiles');
	var arr = JSON.parse(storage);

	if (arr && arr.DATA && arr.DATA.length) {
	
		for(let i = 0; i < arr.DATA.length; ++i) {
			if(arr.DATA[i].TOOLID == 20) {
				var tasks = JSON.parse(arr.DATA[i]['FILE_PATH']);
				for (let x = 0; x < tasks.length; x++)
					data[tasks[x].id] = tasks[x];
				break;
			}
		}

	}

	return;

    $.ajax({

	type: 'POST',
	url: 'https://cs.uef.fi/~tapanit/ecraft2learn/api/pilot_2/get_plans_pilot_2.php',
	data: 'sessionId=' + sessionId + '&users=' + users,
	success: (data) => {
		
		var tasks = JSON.parse(data);

		tasks = JSON.parse(tasks[0].data);

		
		for (let i = 0; i < tasks.length; i++)
			todo.generateElement(tasks[i]);
	},
	error: (error) => {

		console.log(error);
	}

    });

})(todo, data, jQuery);
