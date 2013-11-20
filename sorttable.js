/*
  SortTable
  version 2
  7th April 2007
  Stuart Langridge, http://www.kryogenix.org/code/browser/sorttable/

  Instructions:
  Download this file
  Add <script src="sorttable.js"></script> to your HTML
  Add class="sortable" to any table you'd like to make sortable
  Click on the headers to sort

  Thanks to many, many people for contributions and suggestions.
  Licenced as X11: http://www.kryogenix.org/code/browser/licence.html
  This basically means: do what you want with it.
*/



sorttable = {
  numberRegExp: /^-?[£$¤]?[\d,.]+%?$/,

  makeSortable: function(table) {
    var i, j;

    if (table.tHead.rows.length !== 1) return;

    tHeadRow = table.tHead.rows[0].cells;

    for (i = 0; i < tHeadRow.length; i++) {
      if (tHeadRow[i].getAttribute('data-sort') === 'false') { continue; }

      tHeadRow[i].sortFunction = sorttable.guessType(table, i);

      // make it clickable to sort
      tHeadRow[i].sorttable_columnindex = i;
      tHeadRow[i].sorttable_tbody = table.tBodies[0];
      tHeadRow[i].addEventListener('click', function(e) {
        if (this.className.search(/\bsorttable_sorted\b/) != -1) {
          // if we're already sorted by this column, just
          // reverse the table, which is quicker
          sorttable.reverse(this.sorttable_tbody);
          this.className = this.className.replace('sorttable_sorted',
                                                  'sorttable_sorted_reverse');
          this.removeChild(document.getElementById('sorttable_sortfwdind'));
          sortrevind = document.createElement('span');
          sortrevind.id = "sorttable_sortrevind";
          sortrevind.innerHTML = '&nbsp;&#x25B4;';
          this.appendChild(sortrevind);
          return;
        }
        if (this.className.search(/\bsorttable_sorted_reverse\b/) != -1) {
          // if we're already sorted by this column in reverse, just
          // re-reverse the table, which is quicker
          sorttable.reverse(this.sorttable_tbody);
          this.className = this.className.replace('sorttable_sorted_reverse',
                                                  'sorttable_sorted');
          this.removeChild(document.getElementById('sorttable_sortrevind'));
          sortfwdind = document.createElement('span');
          sortfwdind.id = "sorttable_sortfwdind";
          sortfwdind.innerHTML = '&nbsp;&#x25BE;';
          this.appendChild(sortfwdind);
          return;
        }

        // remove sorttable_sorted classes
        theadrow = this.parentNode;
        Array.prototype.slice.call(theadrow.childNodes).forEach(function(cell) {
          if (cell.nodeType == 1) { // an element
            cell.className = cell.className.replace('sorttable_sorted_reverse','');
            cell.className = cell.className.replace('sorttable_sorted','');
          }
        });
        sortfwdind = document.getElementById('sorttable_sortfwdind');
        if (sortfwdind) { sortfwdind.parentNode.removeChild(sortfwdind); }
        sortrevind = document.getElementById('sorttable_sortrevind');
        if (sortrevind) { sortrevind.parentNode.removeChild(sortrevind); }

        this.className += ' sorttable_sorted';
        sortfwdind = document.createElement('span');
        sortfwdind.id = "sorttable_sortfwdind";
        sortfwdind.innerHTML = '&nbsp;&#x25BE;';
        this.appendChild(sortfwdind);

        // build an array to sort. This is a Schwartzian transform thing,
        // i.e., we "decorate" each row with the actual sort key,
        // sort based on the sort keys, and then put the rows back in order
        // which is a lot faster because you only do getCellValue once per row
        row_array = [];
        col = this.sorttable_columnindex;
        rows = this.sorttable_tbody.rows;
        for (var j=0; j<rows.length; j++) {
          row_array[row_array.length] = [sorttable.getCellValue(rows[j].cells[col]), rows[j]];
        }

        row_array.sort(this.sortFunction);

        tb = this.sorttable_tbody;
        for (j = 0; j<row_array.length; j++) {
          tb.appendChild(row_array[j][1]);
        }

        delete row_array;
      });
    }
  },

  guessType: function(table, column) {
    var i, sortfn;

    sortfn = sorttable.sortAlpha;

    for (i = 0; i < table.tBodies[0].rows.length; i++) {
      text = sorttable.getCellValue(table.tBodies[0].rows[i].cells[column]);

      if (text !== '' && text.match(sorttable.numberRegExp)) {
        return sorttable.sortNumeric;
      }
    }

    return sortfn;
  },

  getCellValue: function(node) {
    if (!node) return '';

    if (node.getAttribute('data-value') !== null) {
      return node.getAttribute('data-value');
    }

    return node.innerText.replace(/^\s+|\s+$/g, '');
  },

  reverse: function(tbody) {
    // reverse the rows in a tbody
    var i;
    newrows = [];
    for (i=0; i<tbody.rows.length; i++) {
      newrows[newrows.length] = tbody.rows[i];
    }
    for (i=newrows.length-1; i>=0; i--) {
       tbody.appendChild(newrows[i]);
    }
    delete newrows;
  },

  /* sort functions
     each sort function takes two parameters, a and b
     you are comparing a[0] and b[0] */
  sortNumeric: function(a,b) {
    var aa = parseFloat(a[0].replace(/[^0-9.-]/g, '')),
        bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''))
    ;
    if (isNaN(aa)) aa = 0;
    if (isNaN(bb)) bb = 0;
    return aa - bb;
  },

  sortAlpha: function(a, b) {
    var aa = a[0].toLowerCase(),
        bb = b[0].toLowerCase()
    ;
    if (aa === bb) return 0;
    if (aa < bb) return -1;
    return 1;
  }
};