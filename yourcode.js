'use strict';

(function () {
    let columnData = {},
        viewportHeight = window.innerHeight;
    const columns = document.getElementsByClassName('column');
    const num_cols = columns.length;

    /**
     * An HTML element
     *
     * @external HTMLElement
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
     */

    /**
     *  Calculate the element's top offset position relative to the document
     *
     *  @param {object} column - DIV element with the "column" class
     *  @param {number} column.offsetTop - Number of pixels from the top of the column's offsetParent
     *  @param {external:HTMLElement} column.offsetParent - An HTML element that wraps this column
     *  @returns {number} - Number of pixels from the top of the document to the top of this column element
     */
    function getTotalOffsetTop(column) {
        let top = column.offsetTop,
            offsetParent = column.offsetParent;

        do {
            top += offsetParent.offsetTop;
            offsetParent = offsetParent.offsetParent;
        }
        while (offsetParent !== null);

        return top;
    };

    // Populate hashmap to keep track of column data
    for (let i=0; i < num_cols; i++) {
        let column = columns[i],
            isVisible = window.getComputedStyle(column).display !== 'none',
            parent = column.offsetParent;

        columnData[column.id] = {
            isVisible: isVisible,
            top: null
        };

        if (isVisible !== 'none' && parent !== null) {
            let columnTop = getTotalOffsetTop(column);
            Object.assign(columnData[column.id], columnData[column.id], {
                top: columnTop,
                middle: columnTop + Math.round(column.offsetHeight / 2) + 1,
                bottom: columnTop + column.offsetHeight,
                seen_top: false,
                seen_middle: false,
                seen_bottom: false
            });
        }
    }

    /**
     * Callback function that executes when a scroll event fires. Announces when certain thresholds (top, middle,
     * bottom) of a column element appear in the viewport.
     *
     */
    function handleScrollEvent () {
        let viewportTop = window.pageYOffset,
            viewportBottom = viewportTop + viewportHeight;

        for (let i=0; i < num_cols; i++) {
            let colId = columns[i].id,
                col = columnData[colId],
                colTop = col.top,
                colMiddle = col.middle,
                colBottom = col.bottom;

            if (col.isVisible) {
                let colTopIsVisible = (viewportTop < colTop) && (colTop < viewportBottom ),
                    colMiddleIsVisible = (viewportTop < colMiddle) && (colMiddle < viewportBottom),
                    colBottomIsVisible = (viewportTop < colBottom) && (colBottom < viewportBottom);

                if (colTopIsVisible && col.seen_top === false) {
                    console.log('Column with id:', colId, 'started to become visible on the page.');
                    columnData[colId]['seen_top'] = true;
                }
                if (colMiddleIsVisible && col.seen_middle === false) {
                    console.log('Column with id:', colId, 'is now more than 50% visible on the page.');
                    columnData[colId]['seen_middle'] = true;
                }
                if (colBottomIsVisible && col.seen_bottom === false) {
                    console.log('Column with id:', colId, 'is now fully visible on the page.');
                    columnData[colId]['seen_bottom'] = true;
                }
            }
        }
    };

    window.addEventListener('scroll', handleScrollEvent);

    handleScrollEvent();

})();
