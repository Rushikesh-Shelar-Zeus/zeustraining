export class CellSelectionHandler {
    constructor(grid, onSelectionChange) {
        this.grid = grid;
        this.onSelectionChange = onSelectionChange;
    }
    onPointerDown(hit) {
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
