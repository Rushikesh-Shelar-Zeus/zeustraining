import { COLORS, CONFIG } from "../utils/constants.js";
import { GridOptions, Viewport, VisibleRange } from "../utils/types.js";
import { Grid } from "./Grid.js";

/**
 * Responsible for rendering the grid including headers, cells, and lines
 * onto the HTML canvas based on the given dimensions and options.
 */
export class Renderer {

    /**
     * Initializes the Renderer instance.
     * @param {GridOptions} options - The grid options containing configuration for the grid.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context for the canvas.
     * @param {Array<number>} columnWidths - The widths of all the columns.
     * @param {Array<number>} rowHeights - The heights of all the rows.
     * @param {Grid} grid - The grid instance to render.
     */
    constructor(
        private readonly options: GridOptions,
        private readonly ctx: CanvasRenderingContext2D,
        private readonly columnWidths: number[],
        private readonly rowHeights: number[],
        private readonly grid: Grid
    ) { }

    /**
     * Handles the rendering of the grid based on the current viewport.
     * Clears the canvas and draws grid lines, headers, and cells.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {void} 
     */
    public render(viewPort: Viewport): void {
        // Clear the canvas for the current viewport
        this.ctx.clearRect(0, 0, viewPort.width, viewPort.height);

        // Render the grid lines first, then selection, then headers on top
        this.renderGridLines(viewPort);
        this.renderHeaders(viewPort);
        this.drawCellSelection(viewPort);
    }

    /**
     * Calculates the dynamic Row header width based on the maximum visible row number.
     * This ensures that row numbers don't overflow the header area.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {number} - The calculated header width.
     */
    private getDynamicHeaderWidth(viewPort: Viewport): number {
        const { endRow } = this.getvisibleRange(viewPort);
        const maxRowNumber = Math.min(endRow + 1, this.options.totalRows);

        // Set font for measurement
        this.ctx.font = CONFIG.headerFont;

        // Measure the width of the largest row number
        const textWidth = this.ctx.measureText(maxRowNumber.toString()).width;

        // Add padding
        const dynamicWidth = textWidth + 20;

        // Use the larger of default header width or calculated width
        return Math.max(this.options.headerWidth, dynamicWidth);
    }

    /**
     * Handles the rendering of grid lines based on the current viewport.
     * * Calculates the start and end rows and columns based on the viewport dimensions
     * * Draws vertical and horizontal lines for the grid.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    public renderGridLines(viewPort: Viewport): void {
        //Calculate the start and end rows and columns based on the viewport dimensions
        const { startCol, endCol, startRow, endRow } = this.getvisibleRange(viewPort);
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewPort);

        // Set the line width and color for grid lines
        this.ctx.lineWidth = CONFIG.lineWidth
        this.ctx.strokeStyle = COLORS.gridLines

        // Draw vertical lines - offset by dynamic header width to start after row headers
        for (let col = startCol; col <= endCol; col++) {
            // Calculate the x position for the vertical line
            const x = col * this.options.defaultColWidth - viewPort.scrollX + dynamicHeaderWidth;
            this.ctx.beginPath();

            // Start below column headers
            this.ctx.moveTo(x, this.options.headerHeight);
            this.ctx.lineTo(x, viewPort.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines - offset by header height to start after column headers
        for (let row = startRow; row <= endRow; row++) {
            // Calculate the y position for the horizontal line
            const y = row * this.options.defaultRowHeight - viewPort.scrollY + this.options.headerHeight;
            this.ctx.beginPath();

            // Start after row headers
            this.ctx.moveTo(dynamicHeaderWidth, y);
            this.ctx.lineTo(viewPort.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Renders the headers of the grid including column and row headers.
     * * Renders column headers with labels based on the viewport and column widths.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private renderHeaders(viewPort: Viewport): void {
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewPort);

        // Render column headers background (excluding top-left corner)
        this.ctx.fillStyle = COLORS.headerBackground; // Light gray background for headers
        this.ctx.fillRect(dynamicHeaderWidth, 0, viewPort.width - dynamicHeaderWidth, this.options.headerHeight);

        // Render row headers background (excluding top-left corner)
        this.ctx.fillRect(0, this.options.headerHeight, dynamicHeaderWidth, viewPort.height - this.options.headerHeight);

        // Set styles for header text
        this.ctx.fillStyle = COLORS.headerText;
        this.ctx.font = CONFIG.headerFont;
        this.ctx.textBaseline = CONFIG.textBaseline as CanvasTextBaseline;
        this.ctx.textAlign = CONFIG.textAlign as CanvasTextAlign;

        // Render column headers based on the viewport and column widths
        const { startCol, endCol } = this.getvisibleRange(viewPort);
        for (let col = startCol; col <= endCol; col++) {
            const x = col * this.options.defaultColWidth - viewPort.scrollX + dynamicHeaderWidth;
            const label = this.getColumnLabel(col);
            this.ctx.fillText(label, x + this.options.defaultColWidth / 2, this.options.headerHeight / 2);
        }

        this.ctx.textAlign = "right";
        // Render row headers based on the viewport and row heights
        const { startRow, endRow } = this.getvisibleRange(viewPort);
        for (let row = startRow; row <= endRow; row++) {
            const y = row * this.options.defaultRowHeight - viewPort.scrollY + this.options.headerHeight;
            // Center the text vertically within the row
            const textY = y + (this.options.defaultRowHeight / 2);
            this.ctx.fillText(`${row + 1}`, dynamicHeaderWidth - 5, textY);
        }

        // Render header grid lines
        this.renderHeaderGridLines(viewPort);
        // Render top-left corner background (always on top)
        this.ctx.fillStyle = COLORS.headerBackground;// Light gray background for headers
        this.ctx.fillRect(0, 0, dynamicHeaderWidth, this.options.headerHeight);
    }

    /**
     * Renders the grid lines for the header area.
     * Draws vertical and horizontal lines for the header grid.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private renderHeaderGridLines(viewPort: Viewport): void {
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewPort);

        this.ctx.lineWidth = CONFIG.lineWidth;
        this.ctx.strokeStyle = COLORS.gridLines; // Slightly darker gray for header grid lines

        const { startCol, endCol, startRow, endRow } = this.getvisibleRange(viewPort);

        // Draw vertical lines for column headers (separating each column header)
        for (let col = startCol; col <= endCol + 1; col++) {
            const x = col * this.options.defaultColWidth - viewPort.scrollX + dynamicHeaderWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.options.headerHeight);
            this.ctx.stroke();
        }

        // Draw horizontal lines for row headers (separating each row header)
        for (let row = startRow; row <= endRow + 1; row++) {
            const y = row * this.options.defaultRowHeight - viewPort.scrollY + this.options.headerHeight;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(dynamicHeaderWidth, y);
            this.ctx.stroke();
        }

        // Draw the border around the top-left corner (intersection of headers)
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(dynamicHeaderWidth, 0);
        this.ctx.lineTo(dynamicHeaderWidth, this.options.headerHeight);
        this.ctx.lineTo(0, this.options.headerHeight);
        this.ctx.lineTo(0, 0);
        this.ctx.stroke();

        // Draw the vertical line separating row headers from column headers
        this.ctx.beginPath();
        this.ctx.moveTo(dynamicHeaderWidth, 0);
        this.ctx.lineTo(dynamicHeaderWidth, this.options.headerHeight);
        this.ctx.stroke();

        // Draw the horizontal line separating column headers from row headers
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.options.headerHeight);
        this.ctx.lineTo(dynamicHeaderWidth, this.options.headerHeight);
        this.ctx.stroke();
    }

    /**
     * Converts a column index to an Excel-style label (A, B, C, ..., Z, AA, AB, ...).
     * @param {number} col - The column index to convert. (0-based index)
     * @returns {string} - The Excel-style column label.
     */
    private getColumnLabel(col: number): string {
        //Convert column index to Excel-style label (A, B, C, ..., Z, AA, AB, ...)
        let label = '';
        let tempCol = col;
        while (tempCol >= 0) {
            label = String.fromCharCode((tempCol % 26) + 65) + label;
            tempCol = Math.floor(tempCol / 26) - 1;
        }
        return label;
    }

    /**
     * Calculates the visible range of rows and columns based on the current viewport.
     * Computes the start and end indices for rows and columns that are currently visible.
     * This is used to optimize rendering by only drawing the visible parts of the grid.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {VisibleRange} - The visible range of rows and columns.
     */
    private getvisibleRange(viewPort: Viewport): VisibleRange {
        const { scrollX, scrollY, height, width } = viewPort;

        // Compute Visble Rows
        const rowOffsets: number[] = [];
        let sum = this.options.headerHeight; // Skip header
        for (let i = 0; i < this.rowHeights.length; i++) {
            rowOffsets.push(sum);
            sum += this.rowHeights[i];
        }

        const startRow = this.findStartIndex(rowOffsets, scrollY);
        const endRow = this.findStartIndex(rowOffsets, scrollY + height);

        // Calculate dynamic header width for current viewport (for optimization)
        // We need to do a rough calculation without infinite recursion
        const maxVisibleRow = Math.min(Math.floor((scrollY + height) / this.options.defaultRowHeight) + 1, this.options.totalRows);
        this.ctx.font = CONFIG.headerFont;
        const textWidth = this.ctx.measureText(maxVisibleRow.toString()).width;
        const dynamicHeaderWidth = Math.max(this.options.headerWidth, textWidth + 20);

        // Compute Visible Columns
        const colOffsets: number[] = [];
        sum = dynamicHeaderWidth; // Use dynamic header width
        for (let i = 0; i < this.columnWidths.length; i++) {
            colOffsets.push(sum);
            sum += this.columnWidths[i];
        }

        // Find the start and end indices for visible columns
        const startCol = this.findStartIndex(colOffsets, scrollX);
        const endCol = this.findStartIndex(colOffsets, scrollX + width);

        return {
            startRow,
            endRow,
            startCol,
            endCol
        };

    }

    /**
     * A Binary Serach basd Function to Find the Start Index of the Visible Range.
     * This function finds the first index in the offsets array where the value is greater than or equal to the scroll position.
     * @param {Array<number>} offsets - An array of offsets (cumulative widths or heights).
     * @param {number} scroll - The scroll position to find the start index for.
     * @returns {number} - The index of the first offset that is greater than or equal to the scroll position.
     */
    private findStartIndex(offsets: number[], scroll: number): number {
        let low = 0, high = offsets.length - 1;
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (offsets[mid] + 1 < scroll) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }


    private drawCellSelection(viewPort: Viewport): void {
        const selected = this.grid.selection;
        if (!selected || selected.type !== "cell") {
            return; // Only handle cell selections
        }

        // Get the start row and column from the selection
        const { startRow, startCol } = selected;
        // Calculate the position of the selected cell
        const { scrollX, scrollY } = viewPort;

        // Use dynamic header width instead of static header width
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewPort);

        // Calculate the position of the selected cell
        let x = dynamicHeaderWidth;
        for (let col = 0; col < startCol; col++) {
            x += this.columnWidths[col];
        }

        let y = this.options.headerHeight;
        for (let row = 0; row < startRow; row++) {
            y += this.rowHeights[row];
        }

        // Calculate the width and height of the selected cell
        const cellWidth = this.columnWidths[startCol];
        const cellHeight = this.rowHeights[startRow];

        // Adjust for scroll position
        const drawX = x - scrollX;
        const drawY = y - scrollY;

        // Draw the selection rectangle on Headers (Row, Column)
        this.ctx.fillStyle = COLORS.selectedCellBackground;
        this.ctx.fillRect(drawX, 0, cellWidth, this.options.headerHeight);
        this.ctx.fillRect(0, drawY, this.options.headerWidth, cellHeight);

        // Only draw if the selection is within the visible viewport
        if (drawX + cellWidth > dynamicHeaderWidth &&
            drawY + cellHeight > this.options.headerHeight &&
            drawX < viewPort.width &&
            drawY < viewPort.height) {

            // Save the current canvas state
            this.ctx.save();

            // Create a clipping region to prevent drawing over headers
            this.ctx.beginPath();
            this.ctx.rect(
                dynamicHeaderWidth,
                this.options.headerHeight,
                viewPort.width - dynamicHeaderWidth,
                viewPort.height - this.options.headerHeight
            );

            this.ctx.clip();

            // Calculate the actual drawing area (clipped to not overlap headers)
            const clippedX = Math.max(drawX, dynamicHeaderWidth);
            const clippedY = Math.max(drawY, this.options.headerHeight);
            const clippedWidth = Math.min(drawX + cellWidth, viewPort.width) - clippedX;
            const clippedHeight = Math.min(drawY + cellHeight, viewPort.height) - clippedY;

            // Only draw if there's something visible after clipping
            if (clippedWidth > 0 && clippedHeight > 0) {
                // Draw the selection rectangle
                this.ctx.fillStyle = COLORS.selectedCellOutline;

                // Draw selection border
                this.ctx.globalAlpha = 1.0;
                this.ctx.strokeStyle = COLORS.selectedCellOutline;
                this.ctx.lineWidth = CONFIG.selectedLineWidth;
                this.ctx.strokeRect(clippedX, clippedY, clippedWidth, clippedHeight);
            }

            // Restore the canvas state
            this.ctx.restore();

            // Draw row header vertical highlight (right edge of row header)
            const headerY = drawY;
            const headerHeight = cellHeight;
            const headerX = this.options.headerWidth;

            this.ctx.beginPath();
            this.ctx.strokeStyle = COLORS.selectedCellOutline;
            this.ctx.lineWidth = CONFIG.selectedLineWidth;
            this.ctx.moveTo(headerX, headerY);
            this.ctx.lineTo(headerX, headerY + headerHeight);
            this.ctx.stroke();

            // Draw column header horizontal highlight (bottom edge of column header)
            const headerX2 = drawX;
            const headerWidth = cellWidth;
            const headerY2 = this.options.headerHeight;

            this.ctx.beginPath();
            this.ctx.moveTo(headerX2, headerY2);
            this.ctx.lineTo(headerX2 + headerWidth, headerY2);
            this.ctx.stroke();
        }
    }
}