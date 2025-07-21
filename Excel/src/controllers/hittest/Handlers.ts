import { Grid } from "../Grid.js";
import { HitTestHandler, HitTestResult } from "./index.js";

/**
 * Cell Hit Test Handler
 * This class implements the HitTestHandler interface to handle hit testing for cells.
 * It determines if a pointer event hits a cell in the grid and returns the corresponding hit test result.
 * @implements {HitTestHandler}
 */
export class CellHitTestHandler implements HitTestHandler {

    /**
     * Constructor for the CellHitTestHandler.
     * @param {Grid} grid - The Grid instance to perform hit testing on.
     */
    constructor(private readonly grid: Grid) { }

    /**
     * Performs hit testing based on the provided x and y coordinates.
     * It checks if the coordinates fall within the bounds of any cell in the grid.
     * @param {number} x - The x coordinate of the pointer event.
     * @param {number} y - The y coordinate of the pointer event.
     * @returns {HitTestResult | null} - Returns a HitTestResult if a cell is hit, otherwise null.
     */
    hitTest(x: number, y: number): HitTestResult | null {
        const { headerHeight, headerWidth, rowHeights, columnWidths, scrollX, scrollY, } = this.grid.getHitTestContext;

        console.log(`Hit test at (${x}, ${y}), header: ${headerWidth}x${headerHeight}, scroll: (${scrollX}, ${scrollY})`);

        // Ignore the header area
        if (x < headerWidth || y < headerHeight) {
            console.log("Click in header area, ignoring");
            return null;
        }

        // Adjust coordinates for scroll position and header offset
        let offsetX = x - headerWidth + scrollX;
        let offsetY = y - headerHeight + scrollY;

        // Locate the Row
        let cum = 0, row = -1;
        for (let i = 0; i < rowHeights.length; i++) {
            cum += rowHeights[i];
            if (offsetY < cum) {
                row = i;
                break;
            }
        }

        // If row is not found, return null
        if (row === -1) {
            console.log("Row not found");
            return null;
        }

        // Locate the Column
        cum = 0;
        let col = -1;
        for (let i = 0; i < columnWidths.length; i++) {
            cum += columnWidths[i];
            if (offsetX < cum) {
                col = i;
                break;
            }
        }

        // If column is not found, return null
        if (col === -1) {
            console.log("Column not found");
            return null;
        }

        return {
            type: "cell",
            row: row,
            col: col
        }
    }
}