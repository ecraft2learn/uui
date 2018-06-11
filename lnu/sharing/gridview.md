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

```
Default (gray)             - "sharing-status-indicator"
Awaiting approval (yellow) - "sharing-status-indicator sharing-status-awaiting"
Approved (green)           - "sharing-status-indicator sharing-status-approved"
```

