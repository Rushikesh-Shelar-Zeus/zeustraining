export class SelectionManager {
    constructor(grid, renderer) {
        this.grid = grid;
        this.renderer = renderer;
    }
    handleCellSelection(hit) {
        if (!hit || hit.type !== "cell") {
            console.log("No valid cell hit detected");
            return; // Only handle cell selections
        }
        console.log(`Cell selected: row ${hit.row}, col ${hit.col}`);
        this.grid.selection = {
            type: "cell",
            startRow: hit.row,
            startCol: hit.col,
            endRow: hit.row,
            endCol: hit.col
        };
        console.log("Selection set, re-rendering...");
        this.renderer.render(this.grid.viewport);
    }
}
