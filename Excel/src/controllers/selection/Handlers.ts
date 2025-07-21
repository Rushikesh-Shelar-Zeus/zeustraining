import { Grid } from "../Grid.js";
import { HitTestResult } from "../hittest/index.js";
import { SelectionHandler } from "./index.js";


/**
 * Cell Selection Handler
 * This class implements the SelectionHandler interface to handle cell selection
 * based on hit test results. It updates the grid's selection state and triggers rendering.
 * @implements {SelectionHandler}
 */
export class CellSelectionHandler implements SelectionHandler {

    /**
     * Constructor for the CellSelectionHandler.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Function} onSelectionChange - Callback to trigger on selection change.
     */
    constructor(
        private readonly grid: Grid,
        private readonly onSelectionChange: () => void
    ) { }

    /**
     * Handles pointer down events for cell selection.
     * It checks if the hit test result is valid and updates the grid's selection state.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     */
    onPointerDown(hit: HitTestResult): void {
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
 * This class extends the SelectionHandler interface to handle range selection
 * based on hit test results. It updates the grid's selection state and triggers rendering.
 * @implements {SelectionHandler}
 */
export class CellRangeSelectionHandler implements SelectionHandler {
    /** @type {number} - The starting row for the selection */
    private startRow: number = -1;

    /** @type {number} - The starting column for the selection */
    private startCol: number = -1;

    /**
     * Constructor for the CellRangeSelectionHandler.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Function} onSelectionChange - Callback to trigger on selection change.
     */
    constructor(
        private readonly grid: Grid,
        private readonly onSelectionChange: () => void
    ) { }


    /**
     * Handles pointer down events for cell range selection.
     * It initializes the starting row and column for the selection.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     * @returns {void}
     */
    onPointerDown(hit: HitTestResult): void {
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
    onPointerMove(hit: HitTestResult): void {
        if (hit?.type !== "cell") {
            return;
        }
        // Update the selection based on the current hit test result
        const newSelection = {
            type: "cell" as const,
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
        this.onSelectionChange();
    }

    /**
     * Handles pointer up events for cell range selection.
     * It resets the starting row and column for the selection.
     * @returns {void}
     */
    onPointerUp(): void {
        this.startRow = -1;
        this.startCol = -1;
    }
}