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
    document.getElementsByName("title")[0].addEventListener("input", updateCharCount);
    document.getElementsByName("keywords")[0].addEventListener("input", updateCharCount);
    // Temporarily disable the character counter for the description field since the metro upgrade (3 -> 4) broke the behaviour by adding a clear input button
    // - v.heijler 2018-09-03
    // document.getElementsByName("description")[0].addEventListener("input", updateCharCount);
}

// NOTE: This requires the element that holds the counter values in the HTML to be right after the input element like follows.
// Also the input element must have a maxLength attribute. And the element that holds the information must have class charCount
// Exemple:
// <input name="title" maxlength="32">
// <span class="charCount"></span>
function updateCharCount(event) {
    event.target.nextElementSibling.innerHTML = event.target.value.length + "/" + event.target.maxLength;

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
                        Metro.notify.create("File was uploaded and shared successfully!", "Success", {});
                        // $.Notify({
                        //     caption: 'Success',
                        //     content: 'File was upload and shared successfully',
                        //     type:    null
                        // });
                    }
                    else{
                        Metro.notify.create("File upload failed, please try again later", "Error", {
                            cls: "alert"
                        });
                        // $.Notify({
                        //     caption: 'Error',
                        //     content: 'File upload failed, please try again later',
                        //     type:    'alert'
                        // });
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



    var fileInput = document.createElement("input");
    fileInput.setAttribute("type","file");
    fileInput.setAttribute("id","fileInput");
    fileInput.setAttribute("data-role", "file");
    fileInput.setAttribute("data-caption", "<span class='mif-folder'></span>");
    fileInput.setAttribute("data-caption-position", "right");
    fileInput.setAttribute("data-validate","required");


    $("#dynamicContent").append(labelEl).append(fileInput);
}

function generateProjectSelect(labelText,callback) {

    getProjects(function (projects) {
        //if(projects.length>0){
            console.log("here");
            var labelEl = document.createElement("label");
            labelEl.classList.add("block");
            labelEl.textContent = labelText;



            var selectEl = document.createElement("select");

            selectEl.setAttribute("data-validate","required");
            selectEl.setAttribute("name","projectId");
            selectEl.setAttribute("data-role", "select");
            selectEl.setAttribute("data-filter", "false");

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

            // divEl.appendChild(selectEl);
            // $("#dynamicContent").append(labelEl).append(divEl);
            $("#dynamicContent").append(labelEl).append(selectEl);
            callback();
        //}
    });

}


function generateToolSelect(callback){
    getTools(function (tools) {
        if (tools.length > 0) {

            var labelEl = document.createElement("label");
            labelEl.classList.add("block");
            labelEl.textContent = "Which tool did you use to create this file?";

            var selectEl = document.createElement("select");
            //selectEl.setAttribute("data-validate", "required");
            selectEl.setAttribute("name", "toolId");
            selectEl.setAttribute("data-role", "select");
            selectEl.setAttribute("data-filter", "false");

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

            // divEl.appendChild(selectEl);
            // $("#dynamicContent").append(labelEl).append(divEl);
            $("#dynamicContent").append(labelEl).append(selectEl);
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

            selectEl.setAttribute("data-validate","required");
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

            Metro.toast.create("There are no files to be shared", null, null, "alert");
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
            saveSharing(data,window.sessionStorage.getItem("userId"),function (result) {
                if(result === "success"){
                    Metro.toast.create("File was uploaded and shared successfully", null, null, "success");

                }
                else{
                    Metro.toast.create("File upload failed, please try again later", null, null, "alert");

                }
                metroDialog.close('#sharing-dialog');
            })
        });
        divEl.appendChild(shareLocalFileButton);
        $("#dynamicContent").append(divEl);
    });

}

