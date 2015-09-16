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

If you add tables with JavaScript, call `init` after they are added to the page:

```coffeescript
Sortable.init()
```

##### `initTable`

To initialize an individual table, call `initTable`.

```coffeescript
exampleTable = document.querySelector('#exampleTable')
Sortable.initTable(exampleTable)
```

#### Events

An `CustomEvent` called `Sortable.sorted` is fired whenever a sort is completed.

Here’s an example of how you might listen to this event:

```coffeescript
exampleTable = document.querySelector('#exampleTable')
exampleTable.addEventListener 'Sortable.sorted', -> console.log '#exampleTable was sorted!'
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

##### `th` `data-sortable-type="TYPE_NAME"`

By default, the `type` of data in each column is determined by reading the first cell of a column and trying to `match` it to the list of types. To specify a type directly, use `data-sortable-type`.

The default types supplied by Sortable are `alpha`, `numeric`, and `date`.

```html
<table data-sortable>
    <thead>
        <tr>
            <th data-sortable-type="alpha">Numbers sorted alphabetically</th>
            <!-- ... -->
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>10</td>
            <td>2</td>
            <td>312</td>
            <td>4</td>
        </tr>
        <!-- ... -->
    </tbody>
</table>
```

#### Custom Types

The default types supplied by Sortable are `alpha`, `numeric`, and `date`. To supply you own, call `Sortable.setupTypes(customTypesArray)` and pass in your custom types array.

Here’s how Sortable internally sets up the defaults.

```coffeescript
sortable.setupTypes [{
  name: 'numeric'
  defaultSortDirection: 'descending'
  match: (a) -> a.match numberRegExp
  comparator: (a) -> parseFloat(a.replace(/[^0-9.-]/g, ''), 10) or 0
}, {
  name: 'date'
  defaultSortDirection: 'ascending'
  reverse: true
  match: (a) -> not isNaN Date.parse a
  comparator: (a) -> Date.parse(a) or 0
}, {
  name: 'alpha'
  defaultSortDirection: 'ascending'
  match: -> true
  compare: (a, b) -> a.localeCompare b
}]
```

Each type must specify the following:

- A `name` which is used to identify the type, in particular the `data-sortable-type="NAME"` attibute which can be specified on a `th`.
- A `defaultSortDirection` which can be either `ascending` or `descending`.
- A `match` function which is used to decide which columns are which types (unless `data-sortable-type` is specified).
- Either a `comparator` or a `compare` function for the custom sorting handled by this type:
    - `comparator` is used when you want to simply write a function to process the values before the each sort comparison is made by Sortable.
    - `compare` is used when you want to actually do handle the entire sort comparison yourself.
- Optionally specify `reverse` to change what `ascending` and `descending` mean with respect to the sort direction of the data for this column type.

<!-- Resources for the demos -->
<p style="-webkit-transform: translateZ(0)"></p>
<script src="/sortable/js/sortable.js"></script>
<link rel="stylesheet" href="/sortable/css/sortable-theme-light.css" />
