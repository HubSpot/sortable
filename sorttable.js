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
    var i, j, tHeadRow;

    if (table.tHead.rows.length !== 1) return;

    tHeadRow = table.tHead.rows[0].cells;

    for (i = 0; i < tHeadRow.length; i++) {
      if (tHeadRow[i].getAttribute('data-sort') === 'false') continue;

      tHeadRow[i].sortFunction = sorttable.guessType(table, i);

      // make it clickable to sort
      tHeadRow[i].columnIndex = i;
      tHeadRow[i].tBody = table.tBodies[0];

      tHeadRow[i].addEventListener('click', function(e) {

        if (this.getAttribute('data-sorted') === 'true') {
          sorttable.reverse(this.tBody);

          if (this.getAttribute('data-sorted-reverse') !== 'true') {
            this.setAttribute('data-sorted-reverse', 'true');
          } else {
            this.setAttribute('data-sorted-reverse', 'false');
          }

          return;
        }

        tHeadRow = this.parentNode;

        Array.prototype.slice.call(tHeadRow.childNodes).forEach(function(cell) {
          if (cell.nodeType == 1) {
            cell.setAttribute('data-sorted', 'false');
            cell.setAttribute('data-sorted-reverse', 'false');
          }
        });

        this.setAttribute('data-sorted', 'true');

        // build an array to sort. This is a Schwartzian transform thing,
        // i.e., we "decorate" each row with the actual sort key,
        // sort based on the sort keys, and then put the rows back in order
        // which is a lot faster because you only do getCellValue once per row
        rowArray = [];
        col = this.columnIndex;
        rows = this.tBody.rows;
        for (var j=0; j<rows.length; j++) {
          rowArray[rowArray.length] = [sorttable.getCellValue(rows[j].cells[col]), rows[j]];
        }

        rowArray.sort(this.sortFunction);

        var fragment = document.createDocumentFragment();

        for (j = 0; j<rowArray.length; j++) {
          fragment.appendChild(rowArray[j][1].cloneNode(true));
        }

        this.tBody.innerHTML = '';
        this.tBody.appendChild(fragment);
      });
    }
  },

  guessType: function(table, column) {
    var i, text, sortFn;

    sortFn = sorttable.sortAlpha;

    for (i = 0; i < table.tBodies[0].rows.length; i++) {
      text = sorttable.getCellValue(table.tBodies[0].rows[i].cells[column]);

      if (text !== '' && text.match(sorttable.numberRegExp)) {
        return sorttable.sortNumeric;
      }
    }

    return sortFn;
  },

  getCellValue: function(node) {
    if (!node) return '';

    if (node.getAttribute('data-value') !== null) {
      return node.getAttribute('data-value');
    }

    return node.innerText.replace(/^\s+|\s+$/g, '');
  },

  reverse: function(tbody) {
    var i, fragment;

    fragment = document.createDocumentFragment();

    for (i = tbody.rows.length - 1; i >= 0; i--) {
      fragment.appendChild(tbody.rows[i].cloneNode(true));
    }

    tbody.innerHTML = '';
    tbody.appendChild(fragment);
  },

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