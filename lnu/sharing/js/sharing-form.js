/**
 * Created by asoadmin on 2018-06-10.
 */



function initSharingForm(){

    $('input[type=radio][name=filesourceradio]').change(function() {
        $("#dynamicContent").empty();

        if(this.value==0){
            generateHtmlLocalFile();
        }
        else{
            generateHtmlProjectFile();
        }
    });
}



function generateHtmlLocalFile() {

    //generate tool list
    generateToolSelect(function () {

        //generate project list
        generateProjectSelect("Which project this file belongs to?",function () {

            //generate file upload button
            generateUploadButton();

            //share button

            var divEl = document.createElement("div");
            var shareLocalFileButton = document.createElement("button");
            shareLocalFileButton.classList.add("button");
            shareLocalFileButton.classList.add("success");
            shareLocalFileButton.textContent = "Share";
            shareLocalFileButton.addEventListener("click", function (event) {
                //event.preventDefault();
                //event.parent.preventDefault();
                shareLocalFile(function (result) {
                    if(result === "success"){
                        $.Notify({
                            caption: 'Success',
                            content: 'File was upload and shared successfully',
                            type:    null
                        });
                    }
                    else{
                        $.Notify({
                            caption: 'Error',
                            content: 'File upload failed, please try again later',
                            type:    'alert'
                        });
                    }
                    metroDialog.close('#sharing-dialog');
                })
            });
            divEl.appendChild(shareLocalFileButton);
            $("#dynamicContent").append(divEl);

        });


    });

}

function generateUploadButton(){

    var labelEl = document.createElement("label");
    labelEl.classList.add("block");
    labelEl.textContent = "Choose a file";

    var divEl = document.createElement("div");
    divEl.classList.add("input-control");
    divEl.classList.add("file");
    divEl.classList.add("full-size");
    divEl.classList.add("required");
    divEl.setAttribute("data-role","input");

    var fileInput = document.createElement("input");
    fileInput.setAttribute("type","file");
    fileInput.setAttribute("id","fileInput");
    fileInput.setAttribute("data-validate-func","required");

    var buttonFile = document.createElement("button");
    buttonFile.classList.add("button");

    var img = document.createElement("img");
    img.setAttribute("src","images/file-icon.png");

    buttonFile.appendChild(img);
    divEl.appendChild(fileInput).appendChild(buttonFile);

    $("#dynamicContent").append(labelEl).append(divEl);
}

function generateProjectSelect(labelText,callback) {

    getProjects(function (projects) {
        if(projects.length>0){
            var labelEl = document.createElement("label");
            labelEl.classList.add("block");
            labelEl.textContent = labelText;

            var divEl = document.createElement("div");
            divEl.classList.add("input-control");
            divEl.classList.add("select");
            divEl.classList.add("full-size");
            divEl.classList.add("required");
            divEl.setAttribute("data-role","input");

            var selectEl = document.createElement("select");

            selectEl.setAttribute("data-validate-func","required");
            selectEl.setAttribute("name","projectId");

            var option = document.createElement("option");
            option.textContent = "None";
            option.setAttribute("selected", "selected");
            option.setAttribute("value","");
            selectEl.appendChild(option);


            for(var i=0;i<projects.length;i++){
                var option = document.createElement("option");
                option.value = projects[i]["ID"];
                option.textContent = projects[i]["PRJ_NAME"];

                selectEl.appendChild(option);
            }

            divEl.appendChild(selectEl);
            $("#dynamicContent").append(labelEl).append(divEl);
            callback();
        }
    });

}


function generateToolSelect(callback){
    getTools(function (tools) {
        if (tools.length > 0) {

            var labelEl = document.createElement("label");
            labelEl.classList.add("block");
            labelEl.textContent = "Which tool did you use to create this file?";

            var divEl = document.createElement("div");
            divEl.classList.add("input-control");
            divEl.classList.add("select");
            divEl.classList.add("full-size");
            divEl.classList.add("required");
            divEl.setAttribute("data-role", "input");

            var selectEl = document.createElement("select");
            selectEl.setAttribute("data-validate-func", "required");
            selectEl.setAttribute("name", "toolId");

            var option = document.createElement("option");
            option.textContent = "None";
            option.setAttribute("selected", "selected");
            option.setAttribute("value", "");
            selectEl.appendChild(option);

            for (var i = 0; i < tools.length; i++) {
                var option = document.createElement("option");
                option.value = tools[i]["TOOLID"];
                option.textContent = tools[i]["TOOL_NAME"];

                selectEl.appendChild(option);
            }

            divEl.appendChild(selectEl);
            $("#dynamicContent").append(labelEl).append(divEl);
            callback();
        }
    });
}

function generateFileSelect(callback) {
    getNotSharedFiles(function (files) {
        if(files.length>0){
            console.log(files);
            var labelEl = document.createElement("label");
            labelEl.classList.add("block");
            labelEl.textContent = "Select a file to be shared";

            var divEl = document.createElement("div");
            divEl.classList.add("input-control");
            divEl.classList.add("select");
            divEl.classList.add("full-size");
            divEl.classList.add("required");
            divEl.setAttribute("data-role","input");

            var selectEl = document.createElement("select");

            selectEl.setAttribute("data-validate-func","required");
            selectEl.setAttribute("name","fileId");

            var option = document.createElement("option");
            option.textContent = "None";
            option.setAttribute("selected", "selected");
            option.setAttribute("value","");
            selectEl.appendChild(option);


            for(var i=0;i<files.length;i++){
                var option = document.createElement("option");
                option.value = files[i]["ID"];
                option.textContent = files[i]["ORIG_NAME"];

                selectEl.appendChild(option);
            }

            divEl.appendChild(selectEl);
            $("#dynamicContent").append(labelEl).append(divEl);
            callback();
        }
        else{
            $.Notify({
                caption: 'Error',
                content: 'There are no files to be shared',
                type:    'alert'
            });
        }
    });
}



function generateHtmlProjectFile() {

   //generate list of files
    generateFileSelect(function () {

        //share button
        var divEl = document.createElement("div");
        var shareLocalFileButton = document.createElement("button");
        shareLocalFileButton.classList.add("button");
        shareLocalFileButton.classList.add("success");
        shareLocalFileButton.textContent = "Share";
        shareLocalFileButton.addEventListener("click", function (event) {
            //event.preventDefault();
            //event.parent.preventDefault();
            var data = $('#sharingForm').serializeArray();
            //console.log(data);
            saveSharing(data,function (result) {
                if(result === "success"){
                    $.Notify({
                        caption: 'Success',
                        content: 'File was upload and shared successfully',
                        type:    null
                    });
                }
                else{
                    $.Notify({
                        caption: 'Error',
                        content: 'File upload failed, please try again later',
                        type:    'alert'
                    });
                }
                metroDialog.close('#sharing-dialog');
            })
        });
        divEl.appendChild(shareLocalFileButton);
        $("#dynamicContent").append(divEl);
    });

}

