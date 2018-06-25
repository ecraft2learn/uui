# Gridview overview
The following servers as a temporary documentation of the gridview feature and is a working document in subject of change.

## My work
Lists the students own work/files.
The view consists of a table that has the following table headers:

- File (name of file)

- Project (name of project)

- Status (Not shared, Approved, Awaiting approval)

- Date (YYYY-MM-DD)

- Action (a menu that should generate automatically)


### Action menu
The action menu lists actions the user can take on their files, currently there are two menu options:
- Share (Active when file is in default state, e.g. not already shared or awaiting approval)

- Stop sharing (Active when file is already shared)

- A third option could potentially be to Cancel a "share approval request".

To disable menu item in action menu make the li element that contains the link have the class "disabled":
```
<li class="disabled">
    <a href="#">
        <span class="mif-cancel"></span>
        Stop sharing
    </a>
</li>
```



--- 

## Public work
Lists the sites files that have been approved for sharing by the teacher.
The view consists of a table that has the following table headers:

- File (name of file)

- Project (name of project)

- Author (name of author)

- Date (YYYY-MM-DD)


---


## CSS classes for status indicator


| Status  | Color  | Description                           | CSS class                                                    |
| ------- | ------ | ------------------------------------- | ------------------------------------------------------------ | 
| 0       | Gray   | Default, pending authorization        | .sharing-status-indicator                                    | 
| 1       | Green  | Authorized to be shared               | .sharing-status-indicator + .sharing-status-approved         | 
| 2       | Red    | Authorization rejected                | .sharing-status-indicator + .sharing-status-rejected         | 
| 3       | Yellow | Pending authorization to stop sharing | .sharing-status-indicator + .sharing-status-awaiting-removal | 



---


## Gridview columns settings

The column settings define what the gridview's columns will be, and in which order they will appear, as well as it defines some special behaviour of the data that will be stored in those columns.

The columns setting is an array containing objects. Each object describes one column of the gridview table.

### Settings description

| Key         | Value Type      | Example                   | Description                                                                      |
| ----------- | --------------- | ------------------------- | -------------------------------------------------------------------------------- |
| title       | String          | "Title"                   | The table heading / title of the column                                          |
| sortable    | Boolean         | true                      | If the column should be sortable                                                 |
| actionMenu  | Boolean         | true                      | If the column will contain an action menu                                        |
| dataMapping | String or null  | "TITLE"                   | This maps the column to contain the data that is described with this property    |
| dataOptions | Array           | [ hint: "DESCRIPTION" } ] | This described the behaviour of the data in the column                           |
| menuItems   | Array           | { label: "Share" ... }    | If the column contains a menu, this describes the menu items that menu will have |


### DataOptions description

The dataOptions array contains objects that describe certain behaviour for the data that will recide in that column. Following are the possible dataOptions listed:

| Key             | Value           | Description                                                                                                                                       |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| hint            | String          | If the data in this column should have a hint on hover, the string will be the title of the hint                                                  |
| statusIndicator | Boolean         | If the data in this column should be a status indicator                                                                                           |
| subString       | Array           | If the data in this column (needs to be string) should be truncated, the first index of the array is start, the second is end index of the string |


### MenuItems description

The menuItems array contains objects that describe the menu items that the action menu will have:


| Key      | Value            | Description                                                                   |
| -------- | ---------------- | ----------------------------------------------------------------------------- |
| label    | String           | The menu item label / text                                                    |
| icon     | String           | The menu icon class, for example mif-share if using MetroUI                   |
| callback | Function         | The function that will be called when the menu item is pressed                |



### Example settings array
```
var columns = [
        {
            title: "Title",
            sortable: true,
            dataMapping: "TITLE",
            dataOptions : [
                { hint: "DESCRIPTION" }
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
                { label: "Share",        icon: "mif-share",    callback: shareCallback    },
                { label: "Stop sharing", icon: "mif-cancel",   callback: cancelCallback   },
                { label: "Download",     icon: "mif-download", callback: downloadCallback }
            ]
        },
    ];
```


Note that the Gridview class must recieve this columns array into it's constructor as follows: 

```
var gv = new Gridview(columns, data, document.getElementById("myWorkTable"));
```