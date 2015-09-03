## API Options

#### Initializing sortable

To be properly initialized and pick up the default styling, your table must add the attribute `data-sortable`.

Example:

```html
<table data-sortable>
    <!-- ... -->
</table>
```

##### `init`(options)

All tables on the page will be automatically initted when the page is loaded.

If you add tables with javascript, call `init` after they are added to the page:

```coffeescript
Sortable.init()
```

##### Default Options

The following are the default options set by the core Sortable library. You may change them by passing new options to `init`.

```coffeescript
{
    selector: 'table[data-sortable]',
    onSort: function(table) {},
    onSorted: function(table) {}
}
```

##### `initTable`(table)

To initialize an individual table, call `initTable`.

```coffeescript
exampleTable = document.querySelector('#exampleTable')
Sortable.initTable(exampleTable)
```

#### Sorting options

##### `data-value`

By default, sortable will automatically detect whether a column contains alpha or numeric data. If you'd rather have a particular column sort on custom data, set the attribute `data-value` on a `<td>`.

```html
<table data-sortable>
    <thead><!-- ... --></thead>
    <tbody>
        <tr>
            <td>Adam</td>
            <td data-value="1384904153699">3 hours ago</td>
            <td><a href="#">New</a></td>
        </tr>
        <!-- ... -->
    </tbody>
</table>
```

##### `th` `data-sortable="false"`

To disable sorting on a particular column, add `data-sortable="false"` to the `<th>` for that column.

```html
<table data-sortable>
    <thead>
        <tr>
            <th>Name</th>
            <th>Date</th>
            <th data-sortable="false">Actions</th>
        </tr>
    </thead>
    <tbody><!-- ... --></tbody>
</table>
```

#### Events

Instead of event callback options in `init`, you may also listen to these fired events:

**Event Type**    | **Description**
----------------- | -----------------------------------------------------------------------
`Sortable.sort`   | This event fires immediately when the column sort is triggered.
`Sortable.sorted` | This event is fired when the sorted column is made visible to the user.

This example JavaScript showcases how to toggle a 'sorted' class on the `<table>` element.

```javascript
var i, table;
var tables = document.querySelectorAll('table[data-sortable]');

for (i = 0; i < tables.length; i++) {
    table = tables[i];

    table.addEventListener('Sortable.sort', function (e) {
        e.target.classList.add('sorting');
    }, false);

    table.addEventListener('Sortable.sorted', function (e) {
        e.target.classList.remove('sorting');
    }, false);
}
```

<!-- Resources for the demos -->
<p style="-webkit-transform: translateZ(0)"></p>
<script src="/sortable/js/sortable.js"></script>
<link rel="stylesheet" href="/sortable/css/sortable-theme-light.css" />
