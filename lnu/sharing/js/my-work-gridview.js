/**
 * 2018-06-13
 * This file creates and populates the gridview with data
 */

/**
 * Created by asoadmin on 2018-06-12.
 */
function initGridView(){
    // getUsersSharedFiles(function (result) {
    //
    // });
    getUsersSharedFiles(m_parseData);
    // $('#myWorkTable').DataTable();
}


/**
 * 
 */
function updateStatusIndicator() {

}


/**
 * 
 */
function updateActionMenu() {

}


/**
 * 
 * @param data : obj
 */
function m_parseData(data) {
    // var table = document.getElementsByClassName("gridview-content")[0];

    console.log(data);
    var table = $('#myWorkTable').DataTable({
        columns: [
            // { data: "ID" },//0
            // { data: "TITLE"},//1
            // { data: "PILOTSITE"},//2
            // { data: "DESCRIPTION"},//3
            // { data: "KEYWORDS"},//4
            // { data: "ROLE"},//5
            // { data: "FILEID"},//6
            // { data: "ID" },
            // { data: "TITLE"},
            // { data: "TOOLID"},//10,
            // { data: "USERID"}//12
            // { data: "TIME_STAMP"},//7
            // { data: "IS_AUTHORISED"},//8
            // { data: "PROJECTID"},//9
            // { data: "TOOLID"},//10
            // { data: "TOOL_NAME"},//11
            // { data: "USERID"},//12
            // { data: "FILE_PATH"},//13
            // { data: "ORIG_NAME"},//14
            // { data: "PRJ_NAME"}//15
            // { data: "DESCRIPTION"},//0
            // { data: "FILEID"},//1
            // { data: "FILE_PATH" },//2
            //
            // { data: "IS_AUTHORISED"},//4
            // { data: "KEYWORDS"},//5
            // { data: "ORIG_NAME" },//6
            // { data: "PILOTSITE"},//7
            // { data: "PRJ_NAME" },//8
            // { data: "PROJECTID"},//9
            // { data: "ROLE"},//10
            // { data: "TIME_STAMP"},//11
            //
            // { data: "TOOLID"},//13
            // { data: "TOOL_NAME"},//14
            // { data: "USERID" }//15


          ],
        columnDefs: [
            {
                "targets": [0,1],
                "visible": false,
                "searchable": false,
                "name":"Name"
            }

        ]
    });
    
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            // var row = m_generateRow(data.DATA[i]);
            // table.appendChild(row);
            console.log(data[i]);
            table.row.add(data[i]);
            // console.log(data.DATA[i]);
        }
        table.draw();
    } else {
        m_generateEmptyPrompt();
    }
}

/* 
<tr>
    <td><img class="file-icon" src="./images/tool-icons/ecraft-plan.png"/> Filename 1</td>
    <td>Project name</td>
    <td><span class="sharing-status-indicator sharing-status-awaiting"></span>Awaiting approval</td>
    <td>2018-04-10</td>
    <td>
        <div class="dropdown-button place-right">
            <button class="button dropdown-toggle"><span class="mif-more-vert"></span></button>
            <ul class="split-content d-menu place-right" data-role="dropdown">
                <li><a href="#"><span class="mif-share"></span>Share</a></li>
                <li><a href="#"><span class="mif-cancel"></span>Stop sharing</a></li>
            </ul>
        </div>
    </td>
</tr> 
*/

/**
 * 
 */
function m_generateTable() {

}


/**
 * 
 */
function m_generateRow() {
    var els = [];
    var el = document.createElement("tr");
    els.push( 
        m_generateFileName(), 
        m_generateProjectName(), 
        m_generateStatusIndicator(), 
        m_generateDate(), 
        m_generateActionMenu()
    );
    for (var i = 0; i < els.length; i++) {
        el.appendChild(els[i]);
    }
    return el;
}


/**
 * 
 */
function m_generateTableData() {
    var el = document.createElement("td");
    return el;
}


/**
 * 
 */
function m_generateFileName() {
    var wrapper = m_generateTableData();
    wrapper.appendChild()
}


/**
 * 
 */
function m_generateProjectName() {

}


/**
 * 
 */
function m_generateStatusIndicator() {

}


/**
 * 
 */
function m_generateDate() {

}


/**
 * 
 */
function m_generateActionMenu() {

}


/**
 * 
 */
function m_generateEmptyPrompt() {
    // Somehow display "Sorry, there are no files to show here at the moment :("
}