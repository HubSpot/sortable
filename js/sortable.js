(function() {
  var SorTable, ascending, descending, numberRegExp, trimRegExp;

  ascending = 'ascending';

  descending = 'descending';

  numberRegExp = /^-?[£$¤]?[\d,.]+%?$/;

  trimRegExp = /^\s+|\s+$/g;

  SorTable = {
    init: function(table) {
      var i, th, ths, _i, _len;
      if (table.tHead.rows.length !== 1) {
        return;
      }
      ths = table.querySelectorAll('th');
      for (i = _i = 0, _len = ths.length; _i < _len; i = ++_i) {
        th = ths[i];
        if (th.getAttribute('data-sort') !== 'false') {
          SorTable.setupClickableTH(table, th, i);
        }
      }
      return table;
    },
    setupClickableTH: function(table, th, i) {
      var type;
      type = SorTable.getColumnType(table, i);
      return th.addEventListener('click', function(e) {
        var newSortedDirection, row, rowArray, rowArrayObject, sorted, sortedDirection, tBody, ths, _i, _j, _k, _len, _len1, _len2, _ref, _results;
        sorted = this.getAttribute('data-sorted') === 'true';
        sortedDirection = this.getAttribute('data-sorted-direction');
        if (sorted) {
          newSortedDirection = sortedDirection === ascending ? descending : ascending;
        } else {
          newSortedDirection = type.defaultSortDirection;
        }
        ths = this.parentNode.querySelectorAll('th');
        for (_i = 0, _len = ths.length; _i < _len; _i++) {
          th = ths[_i];
          th.setAttribute('data-sorted', 'false');
          th.removeAttribute('data-sorted-direction');
        }
        this.setAttribute('data-sorted', 'true');
        this.setAttribute('data-sorted-direction', newSortedDirection);
        tBody = table.tBodies[0];
        rowArray = [];
        _ref = tBody.rows;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          row = _ref[_j];
          rowArray.push([SorTable.getNodeValue(row.cells[i]), row]);
        }
        if (sorted) {
          rowArray.reverse();
        } else {
          rowArray.sort(type.compare);
        }
        _results = [];
        for (_k = 0, _len2 = rowArray.length; _k < _len2; _k++) {
          rowArrayObject = rowArray[_k];
          _results.push(tBody.appendChild(rowArrayObject[1]));
        }
        return _results;
      });
    },
    getColumnType: function(table, i) {
      var row, text, _i, _len, _ref;
      _ref = table.tBodies[0].rows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        text = SorTable.getNodeValue(row.cells[i]);
        if (text !== '' && text.match(numberRegExp)) {
          return SorTable.types.numeric;
        }
      }
      return SorTable.types.alpha;
    },
    getNodeValue: function(node) {
      if (!node) {
        return '';
      }
      if (node.getAttribute('data-value') !== null) {
        return node.getAttribute('data-value');
      }
      if (typeof node.innerText !== 'undefined') {
        return node.innerText.replace(trimRegExp, '');
      }
      return node.textContent.replace(trimRegExp, '');
    },
    types: {
      numeric: {
        defaultSortDirection: descending,
        compare: function(a, b) {
          var aa, bb;
          aa = parseFloat(a[0].replace(/[^0-9.-]/g, ''));
          bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''));
          if (isNaN(aa)) {
            aa = 0;
          }
          if (isNaN(bb)) {
            bb = 0;
          }
          return bb - aa;
        }
      },
      alpha: {
        defaultSortDirection: ascending,
        compare: function(a, b) {
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
      }
    }
  };

  window.SorTable = SorTable;

}).call(this);
