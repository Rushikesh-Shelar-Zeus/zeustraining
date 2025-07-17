import { Grid, GridOptions } from "./controllers/Grid.js";
import { DEFAULT_COL_WIDTH, DEFAULT_ROW_HEIGHT, HEADER_HEIGHT, HEADER_WIDTH, TOTAL_COLS, TOTAL_ROWS } from "./utils/constants.js";

window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    if (!container) {
        throw new Error("Container element not found");
    }

    // Initialize the Grid with options
    const gridOptions: GridOptions = {
        totalRows: TOTAL_ROWS,
        totalCols: TOTAL_COLS,
        defaultRowHeight: DEFAULT_ROW_HEIGHT,
        defaultColWidth: DEFAULT_COL_WIDTH,
        headerHeight: HEADER_HEIGHT,
        headerWidth: HEADER_WIDTH
    };

    // Create a new Grid instance
    const grid = new Grid(gridOptions);
});