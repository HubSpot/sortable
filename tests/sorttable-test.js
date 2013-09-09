wru.test([
    {
        name: "Testing sorttable",
        test: function () {
            var tbl = document.querySelector("table.sortable");

            /* Check the test was set up right: that is, that we
               have the same number of tuples in SORTRESULTS as
               we do columns, and that a SORTRESULTS tuple has the
               same number of entries as there are rows in a column 
               (note that there will be one extra row, because
               of the column headers) 
            */

            wru.assert("SORTRESULTS has an entry per column " +
                "(comparing number of SORTRESULTS=" +
                SORTRESULTS.length + " with number of cells in table row 0=" +
                tbl.rows[0].cells.length + ")",
                SORTRESULTS.length === tbl.rows[0].cells.length);
            wru.assert("SORTRESULTS entries have one item per row",
                SORTRESULTS[0].length === tbl.rows.length - 1);

            var evObj;
            for (var columnindex=0; columnindex < SORTRESULTS.length; columnindex++) {
                // Generate a click on the column header
                evObj = document.createEvent('MouseEvents');
                evObj.initEvent( 'click', true, true );
                tbl.rows[0].cells[columnindex].dispatchEvent(evObj);

                // Now check each item in column 1 against SORTRESULTS
                // The -1 stuff in here is because the rows in the *table* go
                // from 1 to N and skip 0 because that's where the column headers are
                // but the entries in the SORTRESULTS tuple go from 0 to N-1
                for (var rowindex=1; rowindex < tbl.rows.length; rowindex++) {
                    wru.assert("Sorted on column " + (columnindex+1) + "; " +
                        "comparing row " + rowindex + " predicted value '" +
                        SORTRESULTS[columnindex][rowindex-1] +
                        "' with actual value '" +
                        tbl.rows[rowindex].cells[0].innerHTML + "'",
                        tbl.rows[rowindex].cells[0].innerHTML == SORTRESULTS[columnindex][rowindex-1]);
                }
            }

            // Bizarrely, if we remove this async test, the test suite fails.
            setTimeout(wru.async(function () {
                wru.assert("this is also true", true);
            }), 1000);
        }
    }
]);
