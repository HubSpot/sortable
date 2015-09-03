## API Options

#### Initializing sortable

To be properly initialized and pick up the default styling, your table must add the attribute `data-sortable`.

Example:

```html
<table data-sortable>
    <!-- ... -->
</table>
```

##### `init`

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
    onSorted: function(table) {}
}
```

##### `initTable`

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

#### Event Callback Example

This JavaScript will re-adjust 'even' / 'odd' CSS classes of `<tr>` elements in a table after sorting has completed.

```javascript
var fixEvenOdd = function(table) {
    var i, len, row, rows;

    if ('function' === typeof table.querySelectorAll && 'object' === typeof table.classList) {
        rows = table.querySelectorAll('tbody tr');

        for (i = 0, len = rows.length; i < len; i++) {
            row = rows[i];

            if (i % 2 === 0 && row.classList.contains('odd')) {
                row.classList.remove('odd');
                row.classList.add('even');
            } else if (i % 2 === 1 && row.classList.contains('even')) {
                row.classList.remove('even');
                row.classList.add('odd');
            }
        }
    }
};

Sortable.init({
    onSorted: fixEvenOdd
});
```

<!-- Resources for the demos -->
<p style="-webkit-transform: translateZ(0)"></p>
<script src="/sortable/js/sortable.js"></script>
<link rel="stylesheet" href="/sortable/css/sortable-theme-light.css" />
