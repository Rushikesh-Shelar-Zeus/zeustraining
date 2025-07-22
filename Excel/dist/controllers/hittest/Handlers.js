/**
 * Top Left Cell Hit Test Handler
 * This class implements the HitTestHandler interface to handle hit testing for the top-left cell.
 * It determines if a pointer event hits the top-left cell in the grid and returns the corresponding hit test result.
 * @implements {HitTestHandler}
 */
export class TopLeftCellHitTestHandler {
    /**
     * Constructor for the TopLeftCellHitTestHandler.
     * @param {Grid} grid - The Grid instance to perform hit testing on.
     */
    constructor(grid) {
        this.grid = grid;
    }
    hitTest(x, y) {
        const { headerHeight, headerWidth, scrollX, scrollY } = this.grid.HitTestContext;
        // Check if the click is in the top-left corner (header area)
        if (x < headerWidth && y < headerHeight) {
            return {
                type: "cell",
                row: -1, // Special case for top-left cell
                col: -1 // Special case for top-left cell
            };
        }
        // Not in the top-left corner
        return null;
    }
}
/**
 * Row Hit Test Handler
 * This class implements the HitTestHandler interface to handle hit testing for rows.
 * It determines if a pointer event hits a row in the grid and returns the corresponding hit test result.
 * @implements {HitTestHandler}
 */
export class RowHitTestHandler {
    /**
    * Constructor for the RowHitTestHandler.
    * @param {Grid} grid - The Grid instance to perform hit testing on.
    */
    constructor(grid) {
        this.grid = grid;
    }
    /**
     * Performs hit testing based on the provided x and y coordinates.
     * It checks if the coordinates fall within the bounds of any row in the grid.
     * @param {number} x - The x coordinate of the pointer event.
     * @param {number} y - The y coordinate of the pointer event.
     * @returns {HitTestResult | null} - Returns a HitTestResult if a row is hit, otherwise null.
     */
    hitTest(x, y) {
        const { headerHeight, headerWidth, rowHeights, scrollY } = this.grid.HitTestContext;
        // Only respond to clicks in the row header area (left side, below top header)
        if (x >= headerWidth || y < headerHeight) {
            return null;
        }
        let offsetY = y - headerHeight + scrollY;
        // Find the row index based on offsetY
        let cum = 0;
        for (let i = 0; i < rowHeights.length; i++) {
            cum += rowHeights[i];
            if (offsetY < cum) {
                return {
                    type: "row",
                    row: i,
                };
            }
        }
        // Not within any row bounds
        return null;
    }
}
/**
 * Column Header Hit Test Handler
 * This class implements the HitTestHandler interface to handle hit testing for column headers.
 * It determines if a pointer event hits a column header in the grid and returns the corresponding hit test result.
 * @implements {HitTestHandler}
 */
export class ColumnHeaderHitTestHandler {
    /**
     * Constructor for the ColumnHeaderHitTestHandler.
     * @param {Grid} grid - The Grid instance to perform hit testing on.
     */
    constructor(grid) {
        this.grid = grid;
    }
    /**
     * Performs hit testing based on the provided x and y coordinates.
     * It checks if the coordinates fall within the bounds of any column header in the grid.
     * @param {number} x - The x coordinate of the pointer event.
     * @param {number} y - The y coordinate of the pointer event.
     * @returns {HitTestResult | null} - Returns a HitTestResult if a column header is hit, otherwise null.
     */
    hitTest(x, y) {
        const { headerHeight, headerWidth, columnWidths, scrollX } = this.grid.HitTestContext;
        // Only respond to clicks in the column header area (top side)
        if (y >= headerHeight || x < headerWidth) {
            return null;
        }
        // Adjust X for scroll and offset
        let offsetX = x - headerWidth + scrollX;
        // Find the column index based on offsetX
        let cum = 0;
        for (let i = 0; i < columnWidths.length; i++) {
            cum += columnWidths[i];
            if (offsetX < cum) {
                return {
                    type: "col",
                    col: i,
                };
            }
        }
        // Not within any column bounds
        return null;
    }
}
/**
 * Cell Hit Test Handler
 * This class implements the HitTestHandler interface to handle hit testing for cells.
 * It determines if a pointer event hits a cell in the grid and returns the corresponding hit test result.
 * @implements {HitTestHandler}
 */
export class CellHitTestHandler {
    /**
     * Constructor for the CellHitTestHandler.
     * @param {Grid} grid - The Grid instance to perform hit testing on.
     */
    constructor(grid) {
        this.grid = grid;
    }
    /**
     * Performs hit testing based on the provided x and y coordinates.
     * It checks if the coordinates fall within the bounds of any cell in the grid.
     * @param {number} x - The x coordinate of the pointer event.
     * @param {number} y - The y coordinate of the pointer event.
     * @returns {HitTestResult | null} - Returns a HitTestResult if a cell is hit, otherwise null.
     */
    hitTest(x, y) {
        const { headerHeight, headerWidth, rowHeights, columnWidths, scrollX, scrollY, } = this.grid.HitTestContext;
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
        };
    }
}
