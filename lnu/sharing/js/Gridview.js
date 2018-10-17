/**
 * 2018-06-14
 * This file contains the Gridview class which is responsible for 
 * creating and populating a table structure with data
 */


//-----------------------------------------------------------
// Gridview
//-----------------------------------------------------------
class Gridview {
    
    /**
     * @param columns : array
     * @param data    : array
     * @param target  : HTMLTableElement
     */
    constructor(columns, data, target) {
        this.columns = columns;
        this.data    = data;
        this.target  = target;
        this.thead   = this.target.getElementsByClassName("gridview-headers")[0];
        this.tbody   = this.target.getElementsByClassName("gridview-content")[0];
        this.m_createTableStructure();
    }

    //-----------------------------------------------------------
    // Private methods
    //-----------------------------------------------------------

    /**
     * Creates the table headers and populates table with rows that contain data
     */
    m_createTableStructure() {
        this.m_createTableHeaders();
        this.m_populateTableData();
    }


    /**
     * Creates the table column headers
     */
    m_createTableHeaders() {
        var row = this.m_createTableRow();       
        for (var i = 0; i < this.columns.length; i++) {
            var th = this.m_createTableHeader();
            if (this.columns[i].title)    th.textContent = this.columns[i].title;
            if (this.columns[i].sortable) th.classList.add("sortable-column", "sorting_asc");
            row.appendChild(th);
        }
        this.thead.appendChild(row);
    }


    /**
     * Populates the table with rows filled with data.
     * The rowData array contains the information that is being put into the table cells,
     * with three exceptions / special cases: 
     * - The Title has a description that is shown on hover
     * - The Status shows a circle / indicator for the status
     * - The Action menu button.
     */
    m_populateTableData() {
        for (var i = 0; i < this.data.length; i++) {
            var rowData = [];
            for (var j = 0; j < this.columns.length; j++) {
                if (this.columns[j].dataMapping != null && this.data[i].hasOwnProperty(this.columns[j].dataMapping)) {
					if(this.data[i]['PRJ_NAME'] == null)
						this.data[i]['PRJ_NAME'] = 'none';
                    rowData.push(
                        this.m_parseData(
                            this.data[i][this.columns[j].dataMapping], 
                            this.columns[j],
                            this.data[i]
                        )
                    );
                } else if (this.columns[j].actionMenu) {
                    rowData.push(
                        this.m_createActionMenu(this.data[i], this.columns[j])
                    );
                }
            }
            this.tbody.appendChild(this.m_renderRow(rowData, this.data[i]));
        }
    }


    /**
     * Creates a row and fills with data
     * @param rowData  : Array   - Array containing contents for the table, either string or HTML 
     * @param fullData : Object - The full data for the data object (one object)
     */
    m_renderRow(rowData, fullData) {
        var tr = this.m_createTableRow();
        for (var i = 0; i < rowData.length; i++) {
            tr.appendChild(this.m_createTableData(rowData[i]));
        }
        tr.dataset.fileid = fullData.FILEID;
        return tr;
    }


    /**
     * Creates a tr element
     */
    m_createTableRow() {
        return document.createElement("tr");
    }


    /**
     * Creates th element
     */
    m_createTableHeader() {
        return document.createElement("th");
    }


    /**
     * If there are any dataOptions in the config object, this applies 
     * the options / applies functionality for special cases
     * 
     * @param content  : String - The selected string that should be in a table cell
     * @param rules    : Object - Any options that might need to be parsed
     * @param fullData : Object - The full data for the data object (one object)
     */
    m_parseData(content, rules, fullData) {
        if (rules.dataOptions) {
            for (var i = 0; i < rules.dataOptions.length; i++) {

                if (rules.dataOptions[i].hasOwnProperty("subString")) {
                    content = content.substring(rules.dataOptions[i].subString[0], rules.dataOptions[i].subString[1]);
                }

                if (rules.dataOptions[i].hasOwnProperty("statusIndicator")) {
                    content = this.m_createStatusIndicator(content);
                }

                if (rules.dataOptions[i].hasOwnProperty("hint")) {
                    var span = document.createElement("span");
                    span.classList.add("content-hint");
                    span.appendChild(this.m_createFileIcon(fullData));
                    span.appendChild(this.m_createHint(content, fullData, rules.dataOptions[i].hint));
                    content = span;
                }

            }
        }
        return content;
    }


    /**
     * Creates the Action menu
     * 
     * @param fullData : Object - The current data object (one object)
     * @param options  : Object - The options for the action menu object
     */
    m_createActionMenu(fullData, options) {
        var el     = document.createElement("div");
        var button = document.createElement("button");
        var span   = document.createElement("span");
        var ul     = document.createElement("ul");

        el.classList.add    ("dropdown-button", "place-right");
        button.classList.add("button", "dropdown-toggle");
        span.classList.add  ("mif-more-vert");
        ul.classList.add    ("split-content", "d-menu", "place-right");
        ul.setAttribute     ("data-role", "dropdown");
        for (var i = 0; i < options.menuItems.length; i++) {
            ul.appendChild(
                this.m_createActionMenuItem(
                    options.menuItems[i].label, 
                    options.menuItems[i].icon,
                    options.menuItems[i].callback,
                    fullData.FILEID
                )
            );
        };

        button.appendChild(span);
        el.appendChild(button);
        el.appendChild(ul);

        return el;
    }


    /**
     * Creates the menu items for the action menu
     * 
     * @param label    : String   - The menu item label/text
     * @param icon     : String   - The menu item icon class eg. (Metro Icon Font, mif-iconname)
     * @param callback : function - The callback that will run on click on a menuitem
     * @param fileid   : int      - the fileID of the file that the buttons take action on
     */
    m_createActionMenuItem(label, icon, callback, fileid) {
        var el     = document.createElement("li");
        var anchor = document.createElement("a");
        var span   = document.createElement("span");
        
        span.classList.add(icon);
        anchor.appendChild(span);
        anchor.href = "#";

        anchor.addEventListener("click", function(event) {
            callback(event, fileid);
        });

        anchor.innerHTML += label;
        
        el.appendChild(anchor);
        return el;
    }


    /**
     * Creates the status indicator
     * 
     * @param content : String - The selected string that should be in a table cell
     */
    m_createStatusIndicator(content) {
        var span = document.createElement("span");
        span.classList.add("sharing-status-indicator");
        switch (content) {
            case "0":
                span.textContent = "Pending authorization";
                break;

            case "1":
                span.classList.add("sharing-status-approved");
                span.textContent = "Authorized";
                break;

            case "2":
                span.classList.add("sharing-status-rejected");
                span.textContent = "Authorization rejected";
                break;

            case "3":
                span.classList.add("sharing-status-awaiting-removal")
                span.textContent = "Pending authorization to stop sharing";
                break;
        
            default:
                break;
        }
        return span;
    }


    /**
     * Creates the description hint that displays on 
     * hover of the Title of the file
     * @param content   : String - The selected string that should be in a table cell 
     * @param fullData  : Object - The current data object (one object)
     * @param hintLabel : String - The label for the hint
     */
    m_createHint(content, fullData, hintLabel) {
        var span = document.createElement("span");

        span.setAttribute("data-role", "hint");
        span.setAttribute("data-hint-background", "bg-blue");
        span.setAttribute("data-hint-color", "fg-white");
        span.setAttribute("data-hint-mode", "1");
        span.setAttribute("data-hint", hintLabel + "|" + fullData.DESCRIPTION);
        span.innerHTML += content;
        return span;
    }

    /**
     * Creates a fileicon base on the toolID property
     * @param fullData : Object - The current data object (one object)
     */
    m_createFileIcon(fullData) {
        var span = document.createElement("span");
            span.setAttribute("data-role", "hint");
            span.setAttribute("data-hint-background", "bg-blue");
            span.setAttribute("data-hint-color", "fg-white");
            span.setAttribute("data-hint-mode", "2");
            span.setAttribute("data-hint-position", "right");
            span.setAttribute("data-hint", "fullData.TOOLID");
        var img = document.createElement("img");
            img.classList.add("file-icon");
            img.src = "../sharing/images/tool-icons-redux/" + fullData.TOOLID + ".png";
        return img;
    }

    /**
     * Creates td element and appends the content
     * @param data : string | HTMLNode - Data can either be string eg. "2018-05-12", "Project title" or some HTMLNode eg. (Title, Status, ActionMenu)
     */
    m_createTableData(data) {
        var el = document.createElement("td");
        if (typeof data == "string") {
            el.textContent = data;
        } else {
            el.appendChild(data);
        }
        return el;
    }
}
