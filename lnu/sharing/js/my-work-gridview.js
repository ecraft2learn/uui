/**
 * 2018-06-13
 * This file creates and populates the gridview with data
 */

//global variables
var MYFILES; //array of my work files

function initGridView() {
    var columns = [
        {
            title: "Title",
            sortable: true,
            dataMapping: "TITLE",
            dataOptions : [
                { hint: "Description" }
            ]
        },
        {
            title: "Project",
            sortable: true,
            dataMapping: "PRJ_NAME"
        },
        {
            title: "Status",
            sortable: true,
            dataMapping: "STATUS",
            dataOptions : [
                { statusIndicator: true }
            ]
        },
        {
            title: "Date",
            sortable: true,
            dataMapping: "TIME_STAMP",
            dataOptions : [
                { subString: [0, 10] }
            ]
        },
        {
            title: "Action",
            sortable: false,
            actionMenu: true,
            dataMapping: null,
            menuItems: [
                { label: "Stop sharing", icon: "mif-cancel",   callback: cancelCallback   },
                { label: "Download",     icon: "mif-download", callback: downloadCallbackMyWork },
                { label: "Comment",     icon: "mif-bubbles", callback: commentCallback }
            ]
        }
    ];

    getUsersSharedFiles(function(data) {
        console.log(data);
        MYFILES = data;
        //console.log(MYFILES);
        var gv = new Gridview(columns, data, document.getElementById("myWorkTable"));
        var table = $('#myWorkTable').DataTable();
    });
}



/**
 * Stop sharing the file
 * @param event 
 * @param fileid 
 */
function cancelCallback(event, fileid) {
     console.log("cancelCallback", fileid);

    var file = MYFILES.find(function (file) {
        return parseInt(file["FILEID"])===parseInt(fileid);
    });




    switch (file["STATUS"]){
        case "0":
            //0 - waiting for approval from teacher
            //stop sharing without asking permission in the teacher
            stopSharingDialog(file["ID"],"File is not shared anymore.");
            //remove row in the table;
            removeRow(fileid);
            break;
        case "1":
            //1 - file is approved by a teacher
            //first ask teacher to approve
            stopSharingDialog(file["ID"],"Note, teacher needs to approve it. It will take some time.");
            //TODO:update file status (color,text)->(orange,"waiting for approval")
            break;
        case "2":
            //2 - file was rejected by teacher to be shared
            //stop sharing without asking permission in the teacher
            stopSharingDialog(file["ID"],"File is not shared anymore.");
            removeRow(fileid);
            break;
        case "3":
            //3 - file is waiting to be approved by teacher to stop sharing
            //disable button "Stop Sharing"
            //TODO:disable button "Stop Sharing" if possible
            break;

    }
}

/**
 * This function removes the element (row) from the html table immediately
 * @param fileid
 */
function removeRow(fileid){
    var rows = document.getElementById("myWorkTable").getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].dataset.fileid == fileid) {
            // console.log(fileid, "succesfully removed");
            rows[i].parentElement.removeChild(rows[i]);
        }
    }
}


/**
 * Download file from server
 * @param event 
 * @param fileid - file id
 */
function downloadCallbackMyWork(event, fileid) {
    console.log("downloadCallback", fileid);
    console.log(MYFILES);

    var file = MYFILES.find(function (file) {
       return parseInt(file["FILEID"])===parseInt(fileid);
    });

    var filename = file["FILE_PATH"].split("/")[1];

    download(filename);
}

/**
 * Open commenting window
 * @param event
 * @param fileid
 */
function commentCallback(event,fileid){
    var file = MYFILES.find(function (file) {
        return parseInt(file["FILEID"])===parseInt(fileid);
    });
    console.log(file);
    openCommentingDialog(file["TITLE"],file["FILEID"])
}


/**
 * Stop sharing a file
 * @param id - record id in the table
 * @param message - feedback message
 */
function stopSharingDialog(id,message) {
    stopSharing(id,function (result) {
        // console.log(result);
         if(result==="success"){
            //Metro.notify.create(message, "Success", {});
              $.Notify({
                  caption: 'Success',
                  content: message,
                  type:    null
              });
         }
         else{
            //Metro.notify.create("Work could not be unshared, some issue occurred, please try again later", "Error", {
            //    cls: "alert"
            //})
              $.Notify({
                  caption: 'Error',
                  content: 'Some issues occur, please try again later.',
                  type:    'alert'
              });
         }
    });
}

/**
 * Generate commenting dialog
 * @param fileName
 * @param fileId
 */
function openCommentingDialog(fileName,fileId) {

    getCommentsByFileId(fileId,function(result){


        var commentDialog = metroDialog.create({
            title: 'Commenting "' + fileName + '" work',
            content: createCommentingForm(result["DATA"]),
            options: {
                closeButton:true

            }
        });

        $('.dialog-close-button').click(function (el) {
            // $(el).data('dialog').close();
            commentDialog.data('dialog').close();
        });

        $("#sendCommentBtn").click(function(){
            sendComment(fileId)
        });

        $("#commentSelect").on('change', function() {

            $("#rating").rating('value', this.value);


        });


    });



}