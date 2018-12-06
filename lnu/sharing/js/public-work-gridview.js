
/**
 * 2018-06-13
 * This file creates and populates the gridview with data
 */

//global variables
var PUBLICFILES; //array of my work files

function initGridView2() {
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
            title: "Author",
            sortable: true,
            dataMapping: "USERNAME"
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
                { label: "Download",     icon: "mif-download", callback: downloadCallback },
                { label: "Comment",     icon: "mif-bubbles", callback: commentPublicWorkCallback }
            ]
        }
    ];

    getSharedFiles(function(data) {
        PUBLICFILES = data;
        // console.log(PUBLICFILES);
        var gv = new Gridview(columns, data, document.getElementById("publicWorkTable"));
        var table = $('#publicWorkTable').DataTable();
    });
}


/**
 * Download file from server
 * @param event
 * @param fileid - file id
 */
function downloadCallback(event, fileid) {
    //console.log("downloadCallback", fileid);

    var file = PUBLICFILES.find(function (file) {
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
function commentPublicWorkCallback(event,fileid){
    var file = PUBLICFILES.find(function (file) {
        return parseInt(file["FILEID"])===parseInt(fileid);
    });
    //console.log(file);
    openCommentingDialog(file["TITLE"],file["FILEID"])
}