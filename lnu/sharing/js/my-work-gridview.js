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
                { label: "Download",     icon: "mif-download", callback: downloadCallback }
            ]
        }
    ];

    getUsersSharedFiles(function(data) {
        MYFILES = data;
        var gv = new Gridview(columns, data, document.getElementById("myWorkTable"));
        var table = $('#myWorkTable').DataTable();
    });
}


/**
 * 
 * @param event 
 * @param fileid 
 */
function shareCallback(event, fileid) {
    console.log("shareCallback", fileid);
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
function downloadCallback(event, fileid) {
    //console.log("downloadCallback", fileid);

    var file = MYFILES.find(function (file) {
       return parseInt(file["FILEID"])===parseInt(fileid);
    });

    var filename = file["FILE_PATH"].split("/")[1];

    download(filename);
}

/**
 * Stop sharing a file
 * @param id - record id in the table
 * @param message - feedback message
 */
function stopSharingDialog(id,message) {
    stopSharing(id,function (result) {
        console.log(result);
         if(result==="success"){
             $.Notify({
                 caption: 'Success',
                 content: message,
                 type:    null
             });
         }
         else{
             $.Notify({
                 caption: 'Error',
                 content: 'Some issues occur, please try again later.',
                 type:    'alert'
             });
         }
    });
}