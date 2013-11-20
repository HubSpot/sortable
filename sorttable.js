/*
  Table v0.1
  Adam Schwartz

  Based on:
  SortTable version 2
  Stuart Langridge, http://www.kryogenix.org/code/browser/Table/, 7th April 2007
*/

Table = {
  numberRegExp: /^-?[£$¤]?[\d,.]+%?$/,

  makeSortable: function(table) {
    var c, r, tHeadRow;

    if (table.tHead.rows.length !== 1) return;

    tHeadRow = table.tHead.rows[0].cells;

    for (c = 0; c < tHeadRow.length; c++) {
      if (tHeadRow[c].getAttribute('data-sort') === 'false') continue;

      tHeadRow[c].sortFunction = Table.guessSortFunctionFromColumn(table, c);

      tHeadRow[c].columnIndex = c;
      tHeadRow[c].tBody = table.tBodies[0];

      tHeadRow[c].addEventListener('click', function(e) {
        var col, rows, rowArray;

        if (this.getAttribute('data-sorted') === 'true') {
          Table.reverse(this.tBody);

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

        rowArray = [];

        col = this.columnIndex;
        rows = this.tBody.rows;

        for (r = 0; r < rows.length; r++) {
          rowArray[rowArray.length] = [Table.getCellValue(rows[r].cells[col]), rows[r]];
        }

        rowArray.sort(this.sortFunction);

        var fragment = document.createDocumentFragment();

        for (r = 0; r < rowArray.length; r++) {
          fragment.appendChild(rowArray[r][1].cloneNode(true));
        }

        this.tBody.innerHTML = '';
        this.tBody.appendChild(fragment);
      });
    }
  },

  guessSortFunctionFromColumn: function(table, column) {
    var i, text, sortFn;

    sortFn = Table.sortAlpha;

    for (i = 0; i < table.tBodies[0].rows.length; i++) {
      text = Table.getCellValue(table.tBodies[0].rows[i].cells[column]);

      if (text !== '' && text.match(Table.numberRegExp)) {
        return Table.sortNumeric;
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

  reverse: function(tBody) {
    var r, fragment;

    fragment = document.createDocumentFragment();

    for (r = tBody.rows.length - 1; r >= 0; r--) {
      fragment.appendChild(tBody.rows[r].cloneNode(true));
    }

    tBody.innerHTML = '';
    tBody.appendChild(fragment);
  },

  sortNumeric: function(a, b) {
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