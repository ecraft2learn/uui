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
    getUserFiles(m_parseData);
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

    data = JSON.parse(data);
    console.log(data);
    var table = $('#myWorkTable').DataTable({
        columns: [
            { data: "ID" }, 
            { data: "PROJECTID" }, 
            { data: "USERID" },
            { data: "FILE_PATH" },
            { data: "PRJ_NAME" },
            { data: "ORIG_NAME" },
            { data: "TOOL_NAME"},
            { data: "TOOLID" }
          ]
    });
    
    if (data.DATA.length > 0) {
        for (var i = 0; i < data.DATA.length; i++) {
            // var row = m_generateRow(data.DATA[i]);
            // table.appendChild(row);
            table.row.add(data.DATA[i]);
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