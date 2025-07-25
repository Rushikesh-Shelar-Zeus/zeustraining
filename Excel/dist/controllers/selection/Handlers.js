export class SelectEverythingHandler {
    /**
     * Constructor for the SelectEverythingHandler.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Function} onSelectionChange - Callback to trigger on selection change.
     */
    constructor(grid, onSelectionChange) {
        this.grid = grid;
        this.onSelectionChange = onSelectionChange;
    }
    onPointerDown(hit) {
        if (!hit || hit.type !== "all") {
            return;
        }
        // Set the selection to cover the entire grid
        this.grid.selection = {
            type: "all",
            startRow: 0,
            startCol: 0,
            endRow: this.grid.totalRows - 1,
            endCol: this.grid.totalCols - 1,
            originRow: 0,
            originCol: 0
        };
        // Trigger the selection change callback
        this.onSelectionChange();
    }
}
/**
 * Cell Selection Handler
 * This class implements the SelectionHandler interface to handle cell selection
 * based on hit test results. It updates the grid's selection state and triggers rendering.
 * @implements {SelectionHandler}
 */
export class CellSelectionHandler {
    /**
     * Constructor for the CellSelectionHandler.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Function} onSelectionChange - Callback to trigger on selection change.
     */
    constructor(grid, onSelectionChange) {
        this.grid = grid;
        this.onSelectionChange = onSelectionChange;
    }
    /**
     * Handles pointer down events for cell selection.
     * It checks if the hit test result is valid and updates the grid's selection state.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     */
    onPointerDown(hit) {
        // Only handle cell selections
        if (!hit || hit.type !== "cell") {
            return;
        }
        // Set the cell selection
        this.grid.selection = {
            type: "cell",
            startRow: hit.row,
            startCol: hit.col,
            endRow: hit.row,
            endCol: hit.col,
            originRow: hit.row,
            originCol: hit.col
        };
        // Trigger the selection change callback
        this.onSelectionChange();
    }
}
/**
 * Cell Range Selection Handler
 * This class implements the SelectionHandler interface to handle range selection
 * based on hit test results. It updates the grid's selection state and triggers rendering.
 * @implements {SelectionHandler}
 */
export class CellRangeSelectionHandler {
    /**
     * Constructor for the CellRangeSelectionHandler.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Function} onSelectionChange - Callback to trigger on selection change.
     */
    constructor(grid, onSelectionChange) {
        this.grid = grid;
        this.onSelectionChange = onSelectionChange;
        /** @type {number} - The starting row for the selection */
        this.startRow = -1;
        /** @type {number} - The starting column for the selection */
        this.startCol = -1;
        /** @type {number} - Last row selected */
        this.lastRow = -1;
        /** @type {number} - Last column selected */
        this.lastCol = -1;
        /** @type {boolean} - Indicates if the render is scheduled */
        this.isRenderScheduled = false;
    }
    /**
     * Handles pointer down events for cell range selection.
     * It initializes the starting row and column for the selection.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerDown(hit) {
        if (hit?.type !== "cell") {
            return;
        }
        // Initialize the starting row and column for the selection
        this.startRow = hit.row;
        this.startCol = hit.col;
        // Set the initial selection state
        this.grid.selection = {
            type: "cell",
            startRow: hit.row,
            startCol: hit.col,
            endRow: hit.row,
            endCol: hit.col,
            originRow: hit.row,
            originCol: hit.col
        };
        // Trigger the selection change callback (Rendering the grid)
        this.onSelectionChange();
    }
    /**
     * Handles pointer move events for cell range selection.
     * It updates the selection based on the current hit test result.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerMove(hit) {
        if (hit?.type !== "cell") {
            return;
        }
        if (this.startRow === -1 || this.startCol === -1) {
            // If the starting row or column is not set, do nothing
            return;
        }
        if (this.lastCol === hit.col && this.lastRow === hit.row) {
            // If the same cell is hovered, do not change the selection
            return;
        }
        // Update the last row and column selected
        this.lastRow = hit.row;
        this.lastCol = hit.col;
        // Update the selection based on the current hit test result
        const newSelection = {
            type: "cell",
            startRow: Math.min(this.startRow, hit.row),
            startCol: Math.min(this.startCol, hit.col),
            endRow: Math.max(this.startRow, hit.row),
            endCol: Math.max(this.startCol, hit.col),
            originRow: this.startRow,
            originCol: this.startCol
        };
        // Update the grid's selection state
        this.grid.selection = newSelection;
        // Trigger the selection change callback
        this.scheduleRender();
    }
    /**
     * Handles pointer up events for cell range selection.
     * It resets the starting row and column for the selection.
     * @returns {void}
     */
    onPointerUp() {
        this.startRow = -1;
        this.startCol = -1;
    }
    scheduleRender() {
        if (!this.isRenderScheduled) {
            this.isRenderScheduled = true;
            requestAnimationFrame(() => {
                console.time("selectionRender");
                this.onSelectionChange();
                console.timeEnd("selectionRender");
                this.isRenderScheduled = false;
            });
        }
    }
}
/**
 * Row Selection Handler
 * This class implements the SelectionHandler interface to handle row selection
 * based on hit test results. It updates the grid's selection state and triggers rendering.
 * @implements {SelectionHandler}
 */
export class RowSelectionHandler {
    /**
     * Constructor for the RowSelectionHandler.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Function} onSelectionChange - Callback to trigger on selection change.
     */
    constructor(grid, onSelectionChange) {
        this.grid = grid;
        this.onSelectionChange = onSelectionChange;
        /** @type {boolean} - Indicates if the render is scheduled */
        this.isRenderScheduled = false;
        /** @type {number} - The starting row for the selection */
        this.startRow = -1;
        /** @type {number} - Last row selected */
        this.lastRow = -1;
    }
    /**
     * Handles pointer down events for row selection.
     * It initializes the starting row for the selection and updates the grid's selection state.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerDown(hit) {
        if (!hit || hit.type !== "row") {
            return;
        }
        // Initialize the starting row for the selection (Based on hit test result)
        this.startRow = hit.row;
        // Set the row Selection
        this.grid.selection = {
            type: "row",
            startRow: hit.row,
            endRow: hit.row,
            originRow: hit.row,
            startCol: -1,
            endCol: -1,
            originCol: 0
        };
        // Trigger the selection change callback
        this.onSelectionChange();
    }
    /**
     * Handles pointer move events for row selection.
     * It updates the selection based on the current hit test result.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerMove(hit) {
        if (!hit || hit.type !== "row" || this.startRow === -1)
            return;
        if (this.lastRow === hit.row) {
            // If the same row is hovered, do not change the selection
            return;
        }
        this.lastRow = hit.row;
        // Update the selection based on the current hit test result
        this.grid.selection = {
            type: "row",
            startRow: this.startRow,
            endRow: hit.row,
            originRow: this.startRow,
            startCol: -1,
            endCol: -1,
            originCol: 0
        };
        // Trigger the selection change callback
        this.scheduleRender();
    }
    /**
     * Handles pointer up events for row selection.
     * It resets the starting row for the selection.
     * @returns {void}
     */
    onPointerUp() {
        // Reset the starting row for the selection
        this.startRow = -1;
    }
    scheduleRender() {
        if (!this.isRenderScheduled) {
            this.isRenderScheduled = true;
            requestAnimationFrame(() => {
                console.time("selectionRender");
                this.onSelectionChange();
                console.timeEnd("selectionRender");
                this.isRenderScheduled = false;
            });
        }
    }
}
export class ColumnSelectionHandler {
    /**
     * Constructor for the ColumnSelectionHandler.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Function} onSelectionChange - Callback to trigger on selection change.
     */
    constructor(grid, onSelectionChange) {
        this.grid = grid;
        this.onSelectionChange = onSelectionChange;
        /** @type {boolean} - Indicates if the render is scheduled */
        this.isRenderScheduled = false;
        /** @type {number} - The starting column for the selection */
        this.startCol = -1;
        /** @type {number} - Last column selected */
        this.lastCol = -1;
    }
    /**
     * Handles pointer down events for column selection.
     * It initializes the starting column for the selection and updates the grid's selection state.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerDown(hit) {
        if (!hit || hit.type !== "col") {
            return;
        }
        // Initialize the starting column for the selection (Based on hit test result)
        this.startCol = hit.col;
        // Set the column Selection
        this.grid.selection = {
            type: "col",
            startRow: -1,
            endRow: -1,
            originRow: 0,
            startCol: hit.col,
            endCol: hit.col,
            originCol: hit.col
        };
        // Trigger the selection change callback
        this.onSelectionChange();
    }
    /**
     * Handles pointer move events for column selection.
     * It updates the selection based on the current hit test result.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerMove(hit) {
        if (!hit || hit.type !== "col" || this.startCol === -1)
            return;
        if (this.lastCol === hit.col) {
            // If the same column is hovered, do not change the selection
            return;
        }
        this.lastCol = hit.col;
        this.grid.selection = {
            type: "col",
            startRow: -1,
            endRow: -1,
            originRow: 0,
            startCol: this.startCol,
            endCol: hit.col,
            originCol: this.startCol
        };
        // Trigger the selection change callback
        this.scheduleRender();
    }
    /**
     * Handles pointer up events for column selection.
     * It resets the starting column for the selection.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerUp(hit) {
        // Reset the starting column for the selection
        this.startCol = -1;
    }
    scheduleRender() {
        if (!this.isRenderScheduled) {
            this.isRenderScheduled = true;
            requestAnimationFrame(() => {
                console.time("selectionRender");
                this.onSelectionChange();
                console.timeEnd("selectionRender");
                this.isRenderScheduled = false;
            });
        }
    }
}
