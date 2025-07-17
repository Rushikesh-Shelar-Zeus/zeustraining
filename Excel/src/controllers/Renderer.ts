import { GridOptions, Viewport } from "./Grid";

export class Renderer {

    constructor(
        private readonly options: GridOptions,
        private readonly ctx: CanvasRenderingContext2D,
        private readonly viewport: Viewport,
        private readonly columnWidths: number[],
        private readonly rowHeights: number[]
    ) { }

    public render(viewPort: Viewport) {
        const offsetX = viewPort.scrollX % this.options.defaultColWidth;
        const offsetY = viewPort.scrollY % this.options.defaultRowHeight;

        // Clear the canvas for the current viewport
        this.ctx.clearRect(0, 0, viewPort.width, viewPort.height);


        console.log(`Rendering grid at scrollX: ${viewPort.scrollX}, scrollY: ${viewPort.scrollY}`);
        // Render the grid lines
        this.renderGridLines(viewPort, offsetX, offsetY);
        this.renderHeaders(viewPort);
    }

    public renderGridLines(viewPort: Viewport, offsetX: number, offsetY: number) {
        //Calculate the start and end rows and columns based on the viewport dimensions
        const startCol = Math.floor(viewPort.scrollX / this.options.defaultColWidth);
        const endCol = Math.ceil((viewPort.scrollX + viewPort.width) / this.options.defaultColWidth);
        const startRow = Math.floor(viewPort.scrollY / this.options.defaultRowHeight);
        const endRow = Math.ceil((viewPort.scrollY + viewPort.height) / this.options.defaultRowHeight);

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#ccc"; // Light gray color for grid lines

        // Draw vertical lines
        for (let col = startCol; col <= endCol; col++) {
            const x = col * this.options.defaultColWidth - offsetX;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, viewPort.height);
            this.ctx.stroke();
        }

        // Draw horizontal lines
        for (let row = startRow; row <= endRow; row++) {
            const y = row * this.options.defaultRowHeight - offsetY;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(viewPort.width, y);
            this.ctx.stroke();
        }
    }

    private renderHeaders(viewPort: Viewport) {
        // Render column headers
        this.ctx.fillStyle = "#f0f0f0"; // Light gray background for headers
        this.ctx.fillRect(0, 0, viewPort.width, this.options.headerHeight);

        // Render row headers
        this.ctx.fillRect(0, 0, this.options.headerWidth, viewPort.height);

        // Set text styles for headers
        this.ctx.fillStyle = "#000"; // Black text color
        this.ctx.font = "14px Arial";

        // Render column headers
        this.renderColumnHeaders(viewPort, this.columnWidths);

        // Render row headers
        this.renderRowHeaders(viewPort, this.rowHeights);
    }

    private renderColumnHeaders(viewPort: Viewport, columnWidths: number[]) {
        // Render column headers based on the viewport and column widths
        const startCol = Math.floor(viewPort.scrollX / this.options.defaultColWidth);
        const endCol = Math.ceil((viewPort.scrollX + viewPort.width) / this.options.defaultColWidth);

        for (let col = startCol; col <= endCol; col++) {
            const x = col * this.options.defaultColWidth;
            const label = this.getColumnLabel(col);
            this.ctx.fillText(`${label}`, x + 5, this.options.headerHeight - 5);
        }
    }

    private renderRowHeaders(viewPort: Viewport, rowHeights: number[]) {
        // Render row headers based on the viewport and row heights
        const startRow = Math.floor(viewPort.scrollY / this.options.defaultRowHeight);
        const endRow = Math.ceil((viewPort.scrollY + viewPort.height) / this.options.defaultRowHeight);

        for (let row = startRow; row <= endRow; row++) {
            const y = row * this.options.defaultRowHeight;
            this.ctx.fillText(`${row}`, 5, y + 15);
        }
    }

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
}