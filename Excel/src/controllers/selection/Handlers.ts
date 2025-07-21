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
            endCol: hit.col
        };

        // Trigger the selection change callback
        this.onSelectionChange();
    }
}

