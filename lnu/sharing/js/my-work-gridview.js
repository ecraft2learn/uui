/**
 * 2018-06-13
 * This file creates and populates the gridview with data
 */

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
 * 
 * @param event 
 * @param fileid 
 */
function downloadCallback(event, fileid) {
    console.log("downloadCallback", fileid);
}