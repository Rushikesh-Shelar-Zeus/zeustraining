import { Grid } from "../Grid.js";
import { HitTestResult } from "../hittest/index.js";
import { SelectionHandler } from "./index.js";

export class CellSelectionHandler implements SelectionHandler {
    constructor(
        private readonly grid: Grid,
        private readonly onSelectionChange: () => void
    ) { }

    onPointerDown(hit: HitTestResult): void {
        // Only handle cell selections
        if (hit.type !== "cell") {
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