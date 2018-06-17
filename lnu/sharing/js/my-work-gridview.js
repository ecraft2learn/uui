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
            dataMapping: "IS_AUTHORISED",
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
        },
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
 * 
 * @param event 
 * @param fileid 
 */
function cancelCallback(event, fileid) {
    console.log("cancelCallback", fileid);
}


/**
 * Download file from server
 * @param event 
 * @param fileid - file id
 */
function downloadCallback(event, fileid) {
    //console.log("downloadCallback", fileid);

    var filePath = MYFILES.find(function (file) {
       return parseInt(file["FILEID"])===parseInt(fileid);
    });

    var filename = filePath["FILE_PATH"].split("/")[1];

    download(filename);
}