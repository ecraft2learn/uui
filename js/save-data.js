function openDialog(toolName, ext) {
	var toolId = toolNameToId(toolName);
	var html = '<form id="save_form" class="m-5"  data-role="validator" action="javascript:">'+
		'<div class="row">'+
			'<div class="cell-3 p-0">'+
				'<button id="load_cloud" class="loc_btn active button mb-1 primary rounded">Cloud</button>'+
				'<br>'+
				'<button id="load_local" class="loc_btn button primary mb-1 rounded">Local</button>'+
			'</div>'+
			'<div class="cell-9">'+
				'<div class="row">'+
					'<div class="cell">'+
						'<p class="mb-2 local">Save / Load local file</p>'+
						'Filename:'+
						'<input id="file_name" type="text"'+
							'data-validate="required minlength=1"'+
							'placeholder="Enter name">'+
						'<span class="invalid_feedback">'+
							'Input correct name with min length 1 symbol'+
						'</span>'+
					'</div>'+
				'</div>'+
				'<div class="row mt-2">'+
					'<div class="cell local">'+
						'<button id="save_file_local" class="button primary m-1 rounded">Save</button>'+
						'<button id="load_file_local" class="button primary m-1 rounded">Load</button>'+
						'<input type="file" id="load_local_file" accept="'+ext+'" style="display:none;"/>'+
						'<br><span id="invalid_local_file" class="invalid_feedback"><p class="mt-3">Could not load file.</p></span><span id="invalid_local_ext" class="invalid_feedback"><p class="mt-3">Invalid file.</p></span>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="row cloud">'+
			'<div class="cell">'+
				'<br>Saved cloud files:'+
			'</div>'+
		'</div>'+
		'<div class="row cloud">'+
			'<div class="cell">'+
				'<div class="mt-2 no-p rounded panel-x" data-role="panel" data-height="150">'+
					'<ul class="files" data-role="listview" data-view="content" data-select-node="true">'+	
						getCloudFiles(toolId)+
					'</ul>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'<div class="row mt-1 cloud">'+
			'<div class="cell">'+
				'<button id="save_file" class="button primary m-1 rounded">Save</button>'+
				'<button id="load_file" class="button primary m-1 rounded">Load</button>'+
			'</div>'+
		'</div>'+
	'</form>'
	;

	Metro.infobox.create(html);
	$('.info-box').last().css('top', '10%');
	$('.local').hide();
}
function toolNameToId(toolName) {
	switch(toolName) {
		case 'eCraft Search':
			return 2;
			break;
		case 'eCraft Plan':
			return 3;
			break;
		case 'eCraft Todo':
			return 20;
			break;
		default:
			return 1;
			break;
	}
}
function getProjectCloudFiles(toolId) {
	var projId = window.sessionStorage.getItem('currentProjectId');
	getProjectFiles(projId);
	files = window.sessionStorage.getItem('projectFiles');
	if(window.sessionStorage.getItem('projectFiles') == null)
		return '';
	arr = JSON.parse(files);
	var html = '';
	html += '<li data-caption="Project file(s)"><ul>';
	for(var i = 0; i < arr.DATA.length; ++i) {
		if(arr.DATA[i]['TOOLID'] != toolId)
			continue;
		html += '<li data-icon="<span class=\'mif-file-empty\'>"'+
				'data-caption="'+arr.DATA[i]['ORIG_NAME']+'"'+
				'data-content="<span class=\'text-muted\'>eCraft Idea</span>"><input class="file_id" type="hidden" name="proj" value="'+i+'"></li>';
	}
	html += '</ul></li>';
	return html;
}
function getAllCloudFiles(toolId) {
	getUserFiles(window.sessionStorage.getItem('userId'));
	files = window.sessionStorage.getItem('userFiles');
	arr = JSON.parse(files);
	var html = '';
	html += '<li data-caption="All file(s)"><ul>';
	for(var i = 0; i < arr.DATA.length; ++i) {
		if(arr.DATA[i]['TOOLID'] != toolId)
			continue;
		html += '<li data-icon="<span class=\'mif-file-empty\'>"'+
				'data-caption="'+arr.DATA[i]['ORIG_NAME']+'"'+
				'data-content="<span class=\'text-muted\'>eCraft Idea</span>"><input class="file_id" type="hidden" name="all" value="'+i+'"></li>';
	}
	html += '</ul></li>';
	return html;
}
function getCloudFiles(toolId){
	//Project files
	var html = '';
	html += getProjectCloudFiles(toolId);
	
	//All files
	html += getAllCloudFiles(toolId);
	
	return html;
};
function saveDataToCloud(data, name, toolName) {
	var toolId = toolNameToId(toolName);
	var formData = new FormData();
	formData.append('func', 'uploadFile');
	formData.append('data', data);
	formData.append('users', window.sessionStorage.getItem('username'));
	formData.append('sessionId', window.sessionStorage.getItem('pilotsite'));
	formData.append('name', name);
	addFile(window.sessionStorage.getItem("currentProjectId"), toolId, formData);
}
function saveDataToLocal(data, name, toolName, ext) {
	var a = document.createElement('a');
	var toolId = toolNameToId(toolName);
	var obj = {};
	var formData = new FormData();
	formData.append('data', data);
	formData.append('name', name);
	formData.append('toolid', toolId);
	formData.forEach(function(value, key){
		obj[key] = value;
	});
	var json = JSON.stringify(obj);
	var file = new Blob([json], {type: 'text/plain'});
	a.href = URL.createObjectURL(file);
	a.download = name+ext;
	a.click();
}
$(document).on('click', 'button', function(e){
	e.preventDefault();
});
$(document).on('click', '.loc_btn', function(e){
	$('.loc_btn').removeClass('active');
	$(this).addClass('active');
});
$(document).on('click', '#load_local', function(e){
	$('.cloud').hide();
	$('.local').show();
});
$(document).on('click', '#load_cloud', function(e){
	$('.local').hide();
	$('.cloud').show();
});
$(document).on('click', '#load_file_local', function(e){
	$('#load_local_file').click();
});
$(document).on('click', '.files .node', function(){
	$('#file_name').val($(this).children('.data').children('.caption').text());
});
$(document).on('click', '#file_name', function(){
	$('.files .current-select').removeClass('current').removeClass('current-select');
});