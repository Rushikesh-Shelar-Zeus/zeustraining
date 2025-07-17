import { Grid } from './core/Grid.js';
import { DEFAULT_ROW_HEIGHT, DEFAULT_COL_WIDTH, TOTAL_ROWS, TOTAL_COLS, HEADER_HEIGHT, HEADER_WIDTH } from './utils/constants.js';
document.addEventListener('DOMContentLoaded', () => {
    new Grid({
        totalRows: TOTAL_ROWS,
        totalCols: TOTAL_COLS,
        defaultRowHeight: DEFAULT_ROW_HEIGHT,
        defaultColWidth: DEFAULT_COL_WIDTH,
        headerHeight: HEADER_HEIGHT,
        headerWidth: HEADER_WIDTH
    });
});
