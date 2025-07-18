export class CellHitTestHandler {
    constructor(grid) {
        this.grid = grid;
    }
    hitTest(x, y) {
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
        console.log(`Adjusted coordinates: (${offsetX}, ${offsetY})`);
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
        console.log(`Hit detected at cell (${row}, ${col})`);
        return {
            type: "cell",
            row: row,
            col: col
        };
    }
}
