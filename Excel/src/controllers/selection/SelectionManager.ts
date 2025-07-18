import { Grid } from "../Grid.js";
import { HitTestResult } from "../hittest/index.js";
import { Renderer } from "../Renderer.js";

export class SelectionManager {
    constructor(
        private readonly grid: Grid,
        private readonly renderer: Renderer
    ) { }

    handleCellSelection(hit: HitTestResult): void {
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