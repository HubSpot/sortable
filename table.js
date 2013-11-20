(function() {
  var Table;
  Table = {
    numberRegExp: /^-?[£$¤]?[\d,.]+%?$/,
    makeSortable: function(table) {
      var i, th, ths, _len;
      if (table.tHead.rows.length !== 1) {
        return;
      }
      ths = table.querySelectorAll('th');
      for (i = 0, _len = ths.length; i < _len; i++) {
        th = ths[i];
        if (th.getAttribute('data-sort') !== 'false') {
          Table.setupClickableTH(table, th, i);
        }
      }
      return table;
    },
    setupClickableTH: function(table, th, i) {
      var sortFunction;
      sortFunction = Table.getSortFunctionFromColumnIndex(table, i);
      return th.addEventListener('click', function(e) {
        var fragment, r, rowArray, tBody, th, ths, _i, _len;
        tBody = table.tBodies[0];
        if (this.getAttribute('data-sorted') === 'true') {
          Table.reverse(table);
          this.setAttribute('data-sorted-reverse', this.getAttribute('data-sorted-reverse') !== 'true' ? 'true' : 'false');
          return;
        }
        ths = this.parentNode.querySelectorAll('th');
        for (_i = 0, _len = ths.length; _i < _len; _i++) {
          th = ths[_i];
          th.setAttribute('data-sorted', 'false');
          th.setAttribute('data-sorted-reverse', 'false');
        }
        this.setAttribute('data-sorted', 'true');
        rowArray = [];
        r = 0;
        while (r < tBody.rows.length) {
          rowArray[rowArray.length] = [Table.getNodeValue(tBody.rows[r].cells[i]), tBody.rows[r]];
          r++;
        }
        rowArray.sort(sortFunction);
        fragment = document.createDocumentFragment();
        r = 0;
        while (r < rowArray.length) {
          fragment.appendChild(rowArray[r][1].cloneNode(true));
          r++;
        }
        tBody.innerHTML = '';
        return tBody.appendChild(fragment);
      });
    },
    getSortFunctionFromColumnIndex: function(table, i) {
      var r, sortFn, text;
      sortFn = Table.sortAlpha;
      r = 0;
      while (r < table.tBodies[0].rows.length) {
        text = Table.getNodeValue(table.tBodies[0].rows[r].cells[i]);
        if (text !== '' && text.match(Table.numberRegExp)) {
          return Table.sortNumeric;
        }
        r++;
      }
      return sortFn;
    },
    getNodeValue: function(node) {
      if (!node) {
        return '';
      }
      if (node.getAttribute('data-value') !== null) {
        return node.getAttribute('data-value');
      }
      if (typeof node.innerText !== 'undefined') {
        return node.innerText.replace(/^\s+|\s+$/g, '');
      }
      return node.textContent.replace(/^\s+|\s+$/g, '');
    },
    reverse: function(table) {
      var fragment, r, tBody;
      tBody = table.tBodies[0];
      fragment = document.createDocumentFragment();
      r = tBody.rows.length - 1;
      while (r >= 0) {
        fragment.appendChild(tBody.rows[r].cloneNode(true));
        r--;
      }
      tBody.innerHTML = '';
      return tBody.appendChild(fragment);
    },
    sortNumeric: function(a, b) {
      var aa, bb;
      aa = parseFloat(a[0].replace(/[^0-9.-]/g, ''));
      bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''));
      if (isNaN(aa)) {
        aa = 0;
      }
      if (isNaN(bb)) {
        bb = 0;
      }
      return aa - bb;
    },
    sortAlpha: function(a, b) {
      var aa, bb;
      aa = a[0].toLowerCase();
      bb = b[0].toLowerCase();
      if (aa === bb) {
        return 0;
      }
      if (aa < bb) {
        return -1;
      }
      return 1;
    }
  };
  window.Table = Table;
}).call(this);
