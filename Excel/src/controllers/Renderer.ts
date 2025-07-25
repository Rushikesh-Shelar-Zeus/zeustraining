import { COLORS, CONFIG } from "../utils/constants.js";
import { CellSelectionConfig, GridOptions, Viewport, VisibleRange } from "../utils/types.js";
import { Grid } from "./Grid.js";

/**
 * Responsible for rendering the grid including headers, cells, and lines
 * onto the HTML canvas based on the given dimensions and options.
 */
export class Renderer {

    /** @type {Array<number>} - Prefix Sum of the row heights */
    private readonly rowTops: number[] = [];

    /** @type {Array<number>} - Prefix Sum of the column widths */
    private readonly colLefts: number[] = [];

    /** @type {number | null} - Last dynamic header width calculated */
    private lastHeaderWidth: number | null = null;


    /**
     * Constructor to initialize the Renderer instance.
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
    ) {

        // Cache the Cumulative Offset for rows and columns
        let y = this.options.headerHeight;
        for (let i = 0; i < this.rowHeights.length; i++) {
            this.rowTops[i] = y;
            y += this.rowHeights[i];
        }

        let x = this.getDynamicHeaderWidth(this.grid.viewport);
        for (let i = 0; i < this.columnWidths.length; i++) {
            this.colLefts[i] = x;
            x += this.columnWidths[i];
        }

    }

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

        // Draw the cell selection rectangle
        this.drawCellRangeSelection(viewPort);

        // Draw row and column selections
        this.drawRowSelection(viewPort);
        this.drawColumnSelection(viewPort);

        //Draw all Selected Cells
        this.drawSelectAll(viewPort);
    }

    /**
     * Updates the cached column left positions if the dynamic header width has changed.
     * @param {Viewport} viewport - The current viewport dimensions and scroll position.
     */
    public updateColLeftsIfNeeded(viewport: Viewport) {
        const currentHeaderWidth = this.getDynamicHeaderWidth(viewport);

        if (this.lastHeaderWidth !== currentHeaderWidth) {
            let x = currentHeaderWidth;
            for (let i = 0; i < this.columnWidths.length; i++) {
                this.colLefts[i] = x;
                x += this.columnWidths[i];
            }
            this.lastHeaderWidth = currentHeaderWidth;
        }
    }

    /**
     * Calculates the dynamic Row header width based on the maximum visible row number.
     * This ensures that row numbers don't overflow the header area.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {number} - The calculated header width.
     */
    public getDynamicHeaderWidth(viewPort: Viewport): number {
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
            this.ctx.moveTo(x + 0.5, this.options.headerHeight);
            this.ctx.lineTo(x + 0.5, viewPort.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines - offset by header height to start after column headers
        for (let row = startRow; row <= endRow; row++) {
            // Calculate the y position for the horizontal line
            const y = row * this.options.defaultRowHeight - viewPort.scrollY + this.options.headerHeight;
            this.ctx.beginPath();

            // Start after row headers
            this.ctx.moveTo(dynamicHeaderWidth, y + 0.5);
            this.ctx.lineTo(viewPort.width, y + 0.5);
            this.ctx.stroke();
        }
    }

    /**
     * Clips the drawing context to only the row header area,
     * excluding the top-left corner cell.
    */
    private clipRowHeadersOnly(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);
        ctx.beginPath();
        ctx.rect(
            0,
            this.options.headerHeight, // Start below column header
            dynamicHeaderWidth,
            viewport.height - this.options.headerHeight
        );
        ctx.clip();
    }

    /**
     * Clips the drawing context to only the column header area,
     * excluding the top-left corner cell.
     */
    private clipColumnHeadersOnly(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);
        ctx.beginPath();
        ctx.rect(
            dynamicHeaderWidth,
            0,
            viewport.width - dynamicHeaderWidth,
            this.options.headerHeight
        );
        ctx.clip();
    }

    private clipOutHeaders(ctx: CanvasRenderingContext2D, viewport: Viewport): void {
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);

        // Could be useful when clipping to whole canvas but excluding (0,0)
        ctx.beginPath();
        ctx.rect(dynamicHeaderWidth, this.options.headerHeight,
            viewport.width - dynamicHeaderWidth,
            viewport.height - this.options.headerHeight
        );
        ctx.clip();
    }

    /**
     * Renders the headers of the grid including column and row headers.
     * Renders column headers with labels based on the viewport and column widths.
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
            this.ctx.moveTo(x + 0.5, 0);
            this.ctx.lineTo(x + 0.5, this.options.headerHeight);
            this.ctx.stroke();
        }

        // Draw horizontal lines for row headers (separating each row header)
        for (let row = startRow; row <= endRow + 1; row++) {
            const y = row * this.options.defaultRowHeight - viewPort.scrollY + this.options.headerHeight;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y + 0.5);
            this.ctx.lineTo(dynamicHeaderWidth, y + 0.5);
            this.ctx.stroke();
        }

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
     * A Binary Search based Function to Find the Start Index of the Visible Range.
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

    /**
     * Draws the cell selection rectangle on the canvas.
     * This method highlights the selected cell area based on the current selection.
     * It draws a rectangle around the selected cell and highlights the row and column headers.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {void}
     */
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

        // Draw the selection rectangle on Headers (Row, Column) with proper clipping
        this.ctx.fillStyle = COLORS.selectedCellBackground;

        // Draw column header highlight only if it doesn't overlap top-left corner
        if (drawX >= dynamicHeaderWidth || drawX + cellWidth > dynamicHeaderWidth) {
            const headerStartX = Math.max(drawX, dynamicHeaderWidth);
            const headerWidth = Math.min(drawX + cellWidth, viewPort.width) - headerStartX;
            if (headerWidth > 0) {
                this.ctx.fillRect(headerStartX, 0, headerWidth, this.options.headerHeight);
            }
        }

        // Draw row header highlight only if it doesn't overlap top-left corner
        if (drawY >= this.options.headerHeight || drawY + cellHeight > this.options.headerHeight) {
            const headerStartY = Math.max(drawY, this.options.headerHeight);
            const headerHeight = Math.min(drawY + cellHeight, viewPort.height) - headerStartY;
            if (headerHeight > 0) {
                this.ctx.fillRect(0, headerStartY, dynamicHeaderWidth, headerHeight);
            }
        }

        // Only draw if the selection is within the visible viewport
        if (drawX + cellWidth > dynamicHeaderWidth &&
            drawY + cellHeight > this.options.headerHeight &&
            drawX < viewPort.width &&
            drawY < viewPort.height) {

            // Save the current canvas state
            this.ctx.save();

            // Create a clipping region to prevent drawing over headers
            this.clipOutHeaders(this.ctx, viewPort);

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
            const headerX = dynamicHeaderWidth;

            // Only draw row header border if it doesn't overlap top-left corner
            if (headerY + headerHeight > this.options.headerHeight) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = COLORS.selectedCellOutline;
                this.ctx.lineWidth = CONFIG.selectedLineWidth;
                const lineStartY = Math.max(headerY, this.options.headerHeight);
                const lineEndY = Math.min(headerY + headerHeight, viewPort.height);
                this.ctx.moveTo(headerX, lineStartY);
                this.ctx.lineTo(headerX, lineEndY);
                this.ctx.stroke();
            }

            // Draw column header horizontal highlight (bottom edge of column header)
            const headerX2 = drawX;
            const headerWidth = cellWidth;
            const headerY2 = this.options.headerHeight;

            // Only draw column header border if it doesn't overlap top-left corner
            if (headerX2 + headerWidth > dynamicHeaderWidth) {
                this.ctx.beginPath();
                const lineStartX = Math.max(headerX2, dynamicHeaderWidth);
                const lineEndX = Math.min(headerX2 + headerWidth, viewPort.width);
                this.ctx.moveTo(lineStartX, headerY2);
                this.ctx.lineTo(lineEndX, headerY2);
                this.ctx.stroke();
            }
        }
    }

    /**
     * Draws the cell range selection rectangle on the canvas.
     * This method highlights the selected cell range based on the current selection.
     * It draws a rectangle around the selected cell range and highlights the row and column headers.
     * @param {Viewport} viewport - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawCellRangeSelection(viewport: Viewport): void {
        const selection = this.grid.selection;
        if (!selection || selection.type !== "cell") return;

        // Update column lefts if needed (since it can change based on dynamic header width)
        this.updateColLeftsIfNeeded(viewport);

        const { startRow, endRow, startCol, endCol, originRow, originCol } = selection;
        const { scrollX, scrollY } = viewport;
        const headerHeight = this.options.headerHeight;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);

        const isSingleCell = startRow === endRow && startCol === endCol;
        if (isSingleCell) {
            // If it's a single cell selection, just draw the cell selection
            this.drawCellSelection(viewport);
            return;
        }


        // Save canvas state
        this.ctx.save();

        // Clip to content area (not headers)
        this.clipOutHeaders(this.ctx, viewport);

        let outerX = Number.MAX_SAFE_INTEGER;
        let outerY = Number.MAX_SAFE_INTEGER;
        let outerX2 = 0;
        let outerY2 = 0;

        for (let row = startRow; row <= endRow; row++) {
            ``
            // Calculate the position of the row header
            let drawY = this.rowTops[row] - scrollY;
            let cellHeight = this.rowHeights[row];

            // Skip off-screen rows
            if (this.rowTops[row] + this.rowHeights[row] < scrollY || this.rowTops[row] > scrollY + viewport.height)
                continue;

            for (let col = startCol; col <= endCol; col++) {
                // Calculate the position of the column header
                let drawX = this.colLefts[col] - scrollX;
                let cellWidth = this.columnWidths[col];

                // Skip off-screen columns
                if (this.colLefts[col] + this.columnWidths[col] < scrollX || this.colLefts[col] > scrollX + viewport.width)
                    continue;

                // Skip off-screen cells
                if (
                    drawX + cellWidth <= dynamicHeaderWidth ||
                    drawY + cellHeight <= headerHeight ||
                    drawX >= viewport.width ||
                    drawY >= viewport.height
                ) {
                    continue;
                }

                // Track outer bounding box
                outerX = Math.min(outerX, drawX);
                outerY = Math.min(outerY, drawY);
                outerX2 = Math.max(outerX2, drawX + cellWidth);
                outerY2 = Math.max(outerY2, drawY + cellHeight);

                // Skip fill for single-cell or origin cell in range
                const isOrigin = row === originRow && col === originCol;
                if (!isSingleCell && !isOrigin) {
                    this.ctx.fillStyle = COLORS.selectedCellOutline;
                    this.ctx.globalAlpha = 0.2;
                    this.ctx.fillRect(drawX, drawY, cellWidth, cellHeight);
                }
            }
        }

        this.ctx.globalAlpha = 1;
        this.ctx.lineWidth = CONFIG.selectedLineWidth;
        this.ctx.strokeStyle = COLORS.selectedCellOutline;

        // Draw border
        const width = outerX2 - outerX;
        const height = outerY2 - outerY;
        this.ctx.strokeRect(outerX, outerY, width, height);

        // Restore canvas state
        this.ctx.restore();

        // Highlight headers
        this.drawHeaderHighlights(selection, viewport, this.rowTops, this.colLefts);
    }

    /**
     * Draws highlights for the headers based on the selected cell range.
     * Highlights the row and column headers for the selected cells.
     * @param {CellSelectionConfig} selected - The selection configuration containing start and end rows/columns.
     * @param {Viewport} viewport - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawHeaderHighlights(selected: CellSelectionConfig, viewport: Viewport, rowTops: number[], colLefts: number[]): void {
        const { scrollX, scrollY } = viewport;

        const { startRow, endRow, startCol, endCol } = selected;
        const headerHeight = this.options.headerHeight;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);

        // Update column lefts if needed (since it can change based on dynamic header width)
        this.updateColLeftsIfNeeded(viewport);

        // Highlight column headers (bottom border)
        for (let col = startCol; col <= endCol; col++) {
            let drawX = colLefts[col] - scrollX;
            let cellWidth = this.columnWidths[col];

            // Skip off-screen columns
            if (drawX + cellWidth < 0 || drawX > viewport.width) continue;


            // Only draw border if it doesn't overlap top-left corner
            if (drawX + cellWidth > dynamicHeaderWidth) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = COLORS.selectedCellOutline;
                this.ctx.lineWidth = CONFIG.selectedLineWidth;
                const lineStartX = Math.max(drawX, dynamicHeaderWidth);
                const lineEndX = Math.min(drawX + cellWidth, viewport.width);
                this.ctx.moveTo(lineStartX, headerHeight);
                this.ctx.lineTo(lineEndX, headerHeight);
                this.ctx.stroke();
            }
        }

        // Highlight row headers (right border)
        for (let row = startRow; row <= endRow; row++) {
            let drawY = rowTops[row] - scrollY;
            let cellHeight = this.rowHeights[row];

            // Skip off-screen rows
            if (drawY + cellHeight < headerHeight || drawY > viewport.height) continue;

            // Only draw border if it doesn't overlap top-left corner
            if (drawY + cellHeight > headerHeight) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = COLORS.selectedCellOutline;
                this.ctx.lineWidth = CONFIG.selectedLineWidth;
                const lineStartY = Math.max(drawY, headerHeight);
                const lineEndY = Math.min(drawY + cellHeight, viewport.height);
                this.ctx.moveTo(dynamicHeaderWidth, lineStartY);
                this.ctx.lineTo(dynamicHeaderWidth, lineEndY);
                this.ctx.stroke();
            }
        }

        this.ctx.fillStyle = COLORS.selectedCellBackground;

        this.ctx.save();
        // Clip to the header area only
        this.clipColumnHeadersOnly(this.ctx, viewport);

        // Fill the Col headers for selected columns
        for (let col = startCol; col <= endCol; col++) {
            let drawX = colLefts[col] - scrollX;
            let cellWidth = this.columnWidths[col];


            this.ctx.fillRect(drawX, 0, cellWidth, this.options.headerHeight); // top header row
        }
        this.ctx.restore(); // Restore context after filling headers

        this.ctx.save();
        // Clip to the header area only
        this.clipRowHeadersOnly(this.ctx, viewport);

        // Fill row headers for selected rows
        for (let row = startRow; row <= endRow; row++) {
            let drawY = rowTops[row] - scrollY;
            let cellHeight = this.rowHeights[row];


            this.ctx.fillRect(0, drawY, dynamicHeaderWidth, cellHeight); // left header column
        }
        this.ctx.restore(); // Restore context after filling headers
    }

    /**
     * Draws the row selection rectangle on the canvas.
     * This method highlights the selected rows based on the current selection.
     * It draws a rectangle around the selected rows and highlights the row headers.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawRowSelection(viewPort: Viewport): void {
        const selected = this.grid.selection;
        if (!selected || selected.type !== "row") {
            return; // Only handle row selections
        }

        // Get the start and end rows from the selection
        const { startRow, endRow, originRow, originCol } = selected;
        const { scrollX, scrollY } = viewPort;
        const headerHeight = this.options.headerHeight;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewPort);
        const { startCol, endCol } = this.getvisibleRange(viewPort);


        // Update column lefts if needed (since it can change based on dynamic header width)
        this.updateColLeftsIfNeeded(viewPort);


        const fromRow = Math.min(startRow, endRow);
        const toRow = Math.max(startRow, endRow);

        this.ctx.save();

        // Create clipping region for the content area (excluding headers)
        this.ctx.beginPath();
        this.ctx.rect(dynamicHeaderWidth, headerHeight, viewPort.width - dynamicHeaderWidth, viewPort.height - headerHeight);
        this.ctx.clip();

        let outerY = Number.MAX_SAFE_INTEGER;
        let outerY2 = 0;

        // Check if the origin column is in the visible range
        const originColVisible = originCol >= startCol && originCol <= endCol;

        // Loop through selected rows and visible columns
        for (let row = fromRow; row <= toRow; row++) {
            let drawY = this.rowTops[row] - scrollY;
            let rowHeight = this.rowHeights[row] || this.options.defaultRowHeight;

            // Skip off-screen rows
            if (drawY + rowHeight <= headerHeight || drawY >= viewPort.height) {
                continue;
            }

            this.ctx.fillStyle = COLORS.selectedCellOutline;
            this.ctx.globalAlpha = 0.2;

            // Loop through all visible columns for this row
            for (let col = startCol; col <= endCol; col++) {
                let drawX = this.colLefts[col] - scrollX;
                let cellWidth = this.columnWidths[col] || this.options.defaultColWidth;

                // Skip off-screen cells
                if (drawX + cellWidth <= dynamicHeaderWidth || drawX >= viewPort.width) {
                    continue;
                }

                // The origin cell is only white if it's the origin row AND origin column AND visible
                const isOrigin = row === originRow && col === originCol && originColVisible;
                if (!isOrigin) {
                    this.ctx.fillRect(drawX, drawY, cellWidth, rowHeight);
                }
            }

            // Track outer bounding box for the selection rectangle
            outerY = Math.min(outerY, drawY);
            outerY2 = Math.max(outerY2, drawY + rowHeight);
        }


        // Draw border around the visible selection area only if there are visible rows
        if (outerY !== Number.MAX_SAFE_INTEGER && outerY2 > outerY) {
            this.ctx.globalAlpha = 1;
            this.ctx.lineWidth = CONFIG.selectedLineWidth;
            this.ctx.strokeStyle = COLORS.selectedCellOutline;

            const contentWidth = viewPort.width - dynamicHeaderWidth;
            const height = outerY2 - outerY;
            this.ctx.strokeRect(dynamicHeaderWidth, outerY, contentWidth, height);
        }

        this.ctx.restore();

        // Draw row and column header highlights
        this.drawRowHeaderHighlights(fromRow, toRow, viewPort, this.rowTops);
        this.drawColumnHeadersForRowSelection(viewPort, this.colLefts);
    }

    /**
     * Draws highlights for the row headers based on the selected row range.
     * Highlights the row headers for the selected rows.
     * @param {number} startRow - The starting row index of the selection.
     * @param {number} endRow - The ending row index of the selection.
     * @param {Viewport} viewport - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawRowHeaderHighlights(startRow: number, endRow: number, viewport: Viewport, rowTops: number[]): void {
        const { headerHeight } = this.options;
        const { scrollY } = viewport;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);

        const fromRow = Math.min(startRow, endRow);
        const toRow = Math.max(startRow, endRow);


        this.ctx.save();

        // Clip to content area (excluding headers)
        this.clipRowHeadersOnly(this.ctx, viewport);

        this.ctx.fillStyle = COLORS.selectedCellBackground;

        for (let row = fromRow; row <= toRow; row++) {
            let drawY = rowTops[row] - scrollY;
            let rowHeight = this.rowHeights[row];

            // Only draw header highlight if the row is visible
            if (drawY + rowHeight >= headerHeight && drawY <= viewport.height) {
                this.ctx.fillRect(0, drawY, dynamicHeaderWidth, rowHeight);
            }
        }

        this.ctx.restore();

        // Draw the right border of the row headers outside the clipped region
        this.ctx.save();
        this.ctx.lineWidth = CONFIG.selectedLineWidth;
        this.ctx.strokeStyle = COLORS.selectedCellOutline;

        for (let row = fromRow; row <= toRow; row++) {
            let drawY = rowTops[row] - scrollY;
            let rowHeight = this.rowHeights[row];

            // Only draw border if the row is visible and doesn't overlap top-left corner
            if (drawY + rowHeight >= headerHeight && drawY <= viewport.height) {
                this.ctx.beginPath();
                // For 2px lines, adjust alignment differently
                const alignX = Math.floor(dynamicHeaderWidth);
                // Ensure the line doesn't extend into the top-left corner
                const lineStartY = Math.max(drawY, headerHeight);
                const lineEndY = Math.min(drawY + rowHeight, viewport.height);
                this.ctx.moveTo(alignX, lineStartY);
                this.ctx.lineTo(alignX, lineEndY);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    /**
     * Draws highlights for the column headers based on the selected row range.
     * Highlights the column headers for the selected rows.
     * @param {Viewport} viewport - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawColumnHeadersForRowSelection(viewport: Viewport, colLefts: number[]): void {
        const { scrollX } = viewport;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);
        const { startCol, endCol } = this.getvisibleRange(viewport);

        this.ctx.save();

        // Clip out the top-left corner
        this.clipColumnHeadersOnly(this.ctx, viewport);

        this.ctx.fillStyle = COLORS.selectedCellBackground;

        // Highlight all visible column headers
        for (let col = startCol; col <= endCol; col++) {
            let drawX = colLefts[col] - scrollX;
            let cellWidth = this.columnWidths[col] || this.options.defaultColWidth;

            // Only draw if the column header is visible
            if (drawX + cellWidth > dynamicHeaderWidth && drawX < viewport.width) {
                this.ctx.fillRect(
                    Math.max(drawX, dynamicHeaderWidth),
                    0,
                    Math.min(cellWidth, viewport.width - Math.max(drawX, dynamicHeaderWidth)),
                    this.options.headerHeight
                );
            }
        }

        this.ctx.restore();

        // Draw the bottom border of the column headers outside the clipped region
        this.ctx.save();
        this.ctx.lineWidth = CONFIG.selectedLineWidth;
        this.ctx.strokeStyle = COLORS.selectedCellOutline;

        for (let col = startCol; col <= endCol; col++) {
            let drawX = colLefts[col] - scrollX;
            let cellWidth = this.columnWidths[col] || this.options.defaultColWidth;

            // Only draw if the column header is visible and doesn't overlap top-left corner
            if (drawX + cellWidth > dynamicHeaderWidth && drawX < viewport.width) {
                this.ctx.beginPath();
                // For 2px lines, adjust alignment differently
                const alignY = Math.floor(this.options.headerHeight);
                // Ensure the line doesn't extend into the top-left corner
                const lineStartX = Math.max(drawX, dynamicHeaderWidth);
                const lineEndX = Math.min(drawX + cellWidth, viewport.width);
                this.ctx.moveTo(lineStartX, alignY);
                this.ctx.lineTo(lineEndX, alignY);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    /**
     * Draws the column selection rectangle on the canvas.
     * This method highlights the selected columns based on the current selection.
     * It draws a rectangle around the selected columns and highlights the row and column headers.
     * @param {Viewport} viewPort - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawColumnSelection(viewPort: Viewport): void {
        const selected = this.grid.selection;
        if (!selected || selected.type !== "col") {
            return; // Only handle column selections
        }

        const { startCol, endCol, originRow, originCol } = selected;
        const { scrollX, scrollY } = viewPort;
        const headerHeight = this.options.headerHeight;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewPort);
        const { startRow, endRow } = this.getvisibleRange(viewPort);

        // Update column lefts if needed (since it can change based on dynamic header width)
        this.updateColLeftsIfNeeded(viewPort);

        const fromCol = Math.min(startCol, endCol);
        const toCol = Math.max(startCol, endCol);

        this.ctx.save();

        // Create clipping region for the content area (excluding headers)
        this.ctx.beginPath();
        this.ctx.rect(dynamicHeaderWidth, headerHeight, viewPort.width - dynamicHeaderWidth, viewPort.height - headerHeight);
        this.ctx.clip();

        let outerX = Number.MAX_SAFE_INTEGER;
        let outerX2 = 0;

        // Check if the origin row is in the visible range
        const originRowVisible = originRow >= startRow && originRow <= endRow;

        // Loop through selected columns and visible rows
        for (let col = fromCol; col <= toCol; col++) {
            let drawX = this.colLefts[col] - scrollX;
            let colWidth = this.columnWidths[col] || this.options.defaultColWidth;

            // Skip off-screen columns
            if (drawX + colWidth <= dynamicHeaderWidth || drawX >= viewPort.width) {
                continue;
            }

            // Loop through all visible rows for this column
            for (let row = startRow; row <= endRow; row++) {
                let drawY = this.rowTops[row] - scrollY;
                let cellHeight = this.rowHeights[row] || this.options.defaultRowHeight;

                // Skip off-screen cells
                if (drawY + cellHeight <= headerHeight || drawY >= viewPort.height) {
                    continue;
                }

                // Use the same origin logic as cell range selection
                // The origin cell is only white if it's the origin row AND origin column AND visible
                const isOrigin = row === originRow && col === originCol && originRowVisible;
                if (!isOrigin) {
                    this.ctx.fillStyle = COLORS.selectedCellOutline;
                    this.ctx.globalAlpha = 0.2;
                    this.ctx.fillRect(drawX, drawY, colWidth, cellHeight);
                }
            }

            // Track outer bounding box
            outerX = Math.min(outerX, drawX);
            outerX2 = Math.max(outerX2, drawX + colWidth);
        }

        // Draw border around the visible selection area only if there are visible columns
        if (outerX !== Number.MAX_SAFE_INTEGER && outerX2 > outerX) {
            this.ctx.strokeStyle = COLORS.selectedCellOutline;
            this.ctx.lineWidth = CONFIG.selectedLineWidth;
            this.ctx.globalAlpha = 1;

            const contentHeight = viewPort.height - headerHeight;
            const height = outerX2 - outerX;
            this.ctx.strokeRect(outerX, headerHeight, height, contentHeight);
        }

        this.ctx.restore();

        // Draw row and column header highlights
        this.drawColumnHeaderHighlights(fromCol, toCol, viewPort, this.colLefts);
        this.drawRowHeaderHighlightsForColumnSelection(viewPort, this.rowTops);
    }

    /**
     * Draws highlights for the column headers based on the selected column range.
     * Highlights the column headers for the selected columns.
     * @param {number} startCol - The starting column index of the selection.
     * @param {number} endCol - The ending column index of the selection.
     * @param {Viewport} viewport - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawColumnHeaderHighlights(startCol: number, endCol: number, viewport: Viewport, colLefts: number[]): void {
        const { headerHeight } = this.options;
        const { scrollX } = viewport;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);

        const fromCol = Math.min(startCol, endCol);
        const toCol = Math.max(startCol, endCol);

        this.ctx.save();

        // Clip out the top-left corner
        this.clipColumnHeadersOnly(this.ctx, viewport);

        this.ctx.fillStyle = COLORS.selectedCellBackground;

        for (let col = fromCol; col <= toCol; col++) {
            let drawX = colLefts[col] - scrollX;
            let colWidth = this.columnWidths[col];

            // Only draw header highlight if the column is visible
            if (drawX + colWidth >= dynamicHeaderWidth && drawX <= viewport.width) {
                this.ctx.fillRect(drawX, 0, colWidth, headerHeight);
            }
        }

        this.ctx.restore();

        // Draw the bottom border of the column headers outside the clipped region
        this.ctx.save();
        this.ctx.lineWidth = CONFIG.selectedLineWidth;
        this.ctx.strokeStyle = COLORS.selectedCellOutline;

        for (let col = fromCol; col <= toCol; col++) {
            let drawX = colLefts[col] - scrollX;
            let colWidth = this.columnWidths[col];

            // Only draw border if the column is visible and doesn't overlap top-left corner
            if (drawX + colWidth >= dynamicHeaderWidth && drawX <= viewport.width) {
                this.ctx.beginPath();
                // For 2px lines, adjust alignment differently
                const alignY = Math.floor(headerHeight);
                // Ensure the line doesn't extend into the top-left corner
                const lineStartX = Math.max(drawX, dynamicHeaderWidth);
                const lineEndX = Math.min(drawX + colWidth, viewport.width);
                this.ctx.moveTo(lineStartX, alignY);
                this.ctx.lineTo(lineEndX, alignY);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }

    /**
     * Draws highlights for the row headers based on the selected column range.
     * Highlights the row headers for the selected columns.
     * @param {Viewport} viewport - The current viewport dimensions and scroll position.
     * @returns {void}
     */
    private drawRowHeaderHighlightsForColumnSelection(viewport: Viewport, rowTops: number[]): void {
        const { scrollY } = viewport;
        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewport);
        const { startRow, endRow } = this.getvisibleRange(viewport);

        this.ctx.save();
        // Clip out the top-left corner
        this.clipRowHeadersOnly(this.ctx, viewport);

        this.ctx.fillStyle = COLORS.selectedCellBackground;

        // Highlight all visible row headers
        for (let row = startRow; row <= endRow; row++) {
            let drawY = rowTops[row] - scrollY;
            let cellHeight = this.rowHeights[row] || this.options.defaultRowHeight;

            // Only draw if the row header is visible
            if (drawY + cellHeight > this.options.headerHeight && drawY < viewport.height) {
                this.ctx.fillRect(0, drawY, dynamicHeaderWidth, cellHeight);
            }
        }

        this.ctx.restore();

        // Draw the right border of the row headers outside the clipped region
        this.ctx.save();
        this.ctx.lineWidth = CONFIG.selectedLineWidth;
        this.ctx.strokeStyle = COLORS.selectedCellOutline;

        for (let row = startRow; row <= endRow; row++) {
            let drawY = rowTops[row] - scrollY;
            let cellHeight = this.rowHeights[row] || this.options.defaultRowHeight;

            // Only draw if the row header is visible and doesn't overlap top-left corner
            if (drawY + cellHeight > this.options.headerHeight && drawY < viewport.height) {
                this.ctx.beginPath();
                // For 2px lines, adjust alignment differently
                const alignX = Math.floor(dynamicHeaderWidth);
                // Ensure the line doesn't extend into the top-left corner
                const lineStartY = Math.max(drawY, this.options.headerHeight);
                const lineEndY = Math.min(drawY + cellHeight, viewport.height);
                this.ctx.moveTo(alignX, lineStartY);
                this.ctx.lineTo(alignX, lineEndY);
                this.ctx.stroke();
            }
        }

        this.ctx.restore();
    }


    private drawSelectAll(viewPort: Viewport): void {
        const selection = this.grid.selection;
        console.log(selection)
        if (!selection || selection.type !== "all") {
            return; // Only handle select all
        }
        // Update column lefts if needed (since it can change based on dynamic header width)
        this.updateColLeftsIfNeeded(viewPort);

        const dynamicHeaderWidth = this.getDynamicHeaderWidth(viewPort);
        const width = viewPort.width - dynamicHeaderWidth;
        const height = viewPort.height - this.options.headerHeight;

        // Calculate the position of the selection rectangle
        const x = dynamicHeaderWidth;
        const y = this.options.headerHeight;

        // Save the current canvas state
        this.ctx.save();
        this.ctx.fillStyle = COLORS.selectedCellBackground;

        // Draw the selection rectangle for the entire grid
        this.ctx.fillRect(x, y, width, height);

        // Check if origin cell (0,0) is visible and clear it if needed
        const { scrollX, scrollY } = viewPort;
        const originCellX = this.colLefts[0] - scrollX;
        const originCellY = this.rowTops[0] - scrollY;
        const originCellWidth = this.columnWidths[0] || this.options.defaultColWidth;
        const originCellHeight = this.rowHeights[0] || this.options.defaultRowHeight;

        // Check if the origin cell (0,0) is actually visible in the viewport
        const isOriginCellVisible = 
            originCellX + originCellWidth > dynamicHeaderWidth && 
            originCellX < viewPort.width &&
            originCellY + originCellHeight > this.options.headerHeight && 
            originCellY < viewPort.height;

        const isOrigin = selection.originRow === 0 && selection.originCol === 0 && isOriginCellVisible;
        if (isOrigin) {
            // Calculate the visible portion of the origin cell
            const visibleX = Math.max(originCellX, dynamicHeaderWidth);
            const visibleY = Math.max(originCellY, this.options.headerHeight);
            const visibleWidth = Math.min(originCellX + originCellWidth, viewPort.width) - visibleX;
            const visibleHeight = Math.min(originCellY + originCellHeight, viewPort.height) - visibleY;
            
            // Only clear if there's a visible portion
            if (visibleWidth > 0 && visibleHeight > 0) {
                this.ctx.clearRect(visibleX, visibleY, visibleWidth, visibleHeight);
            }
        }
        // Draw the border around the selection rectangle
        this.ctx.globalAlpha = 1.0;
        this.ctx.strokeStyle = COLORS.selectedCellOutline;
        this.ctx.lineWidth = CONFIG.selectedLineWidth;
        this.ctx.strokeRect(x, y, width, height);


        //Draw the top header row
        this.ctx.fillStyle = COLORS.selectedCellBackground;
        this.ctx.fillRect(dynamicHeaderWidth, 0, width, this.options.headerHeight);

        // Draw the left header column
        this.ctx.fillRect(0, this.options.headerHeight, dynamicHeaderWidth, height);
    }
}