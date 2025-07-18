import { Grid } from "./controllers/Grid.js";
import { GridOptions } from "./utils/types.js";
import { DEFAULT_COL_WIDTH, DEFAULT_ROW_HEIGHT, HEADER_HEIGHT, HEADER_WIDTH, TOTAL_COLS, TOTAL_ROWS } from "./utils/constants.js";

// This script initializes the grid when the DOM is fully loaded.
// It creates a new Grid instance with the specified options and appends it to the container.
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