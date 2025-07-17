export class Renderer {
    constructor(canvas, ctx, grid) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.grid = grid;
    }
    render() {
        const options = this.grid.getOptions();
        const viewport = this.grid.getViewport();
        const colWidths = this.grid.getColumnWidths();
        const rowHeights = this.grid.getRowHeights();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.renderHeaders(colWidths, rowHeights, options, viewport);
        this.renderBody(colWidths, rowHeights, options, viewport);
    }
    renderHeaders(colWidths, rowHeights, options, viewport) {
        // Top-left corner cell
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.fillRect(0, 0, options.headerWidth, options.headerHeight);
        this.ctx.strokeStyle = '#bbb';
        this.ctx.strokeRect(0, 0, options.headerWidth, options.headerHeight);
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText('', options.headerWidth / 2, options.headerHeight / 2); // Empty top-left
        // Column headers
        let x = options.headerWidth - viewport.scrollX;
        for (let col = 0; col < colWidths.length && x < viewport.width; col++) {
            const width = colWidths[col];
            if (x + width >= 0) {
                this.ctx.fillStyle = '#f0f0f0';
                this.ctx.fillRect(x, 0, width, options.headerHeight);
                this.ctx.strokeStyle = '#bbb';
                this.ctx.strokeRect(x, 0, width, options.headerHeight);
                this.ctx.fillStyle = '#333';
                // Excel-style column label (A, B, C...)
                const label = String.fromCharCode(65 + col);
                this.ctx.fillText(label, x + width / 2, options.headerHeight / 2);
            }
            x += width;
        }
        // Row headers
        let y = options.headerHeight - viewport.scrollY;
        for (let row = 0; row < rowHeights.length && y < viewport.height; row++) {
            const height = rowHeights[row];
            if (y + height >= 0) {
                this.ctx.fillStyle = '#f0f0f0';
                this.ctx.fillRect(0, y, options.headerWidth, height);
                this.ctx.strokeStyle = '#bbb';
                this.ctx.strokeRect(0, y, options.headerWidth, height);
                this.ctx.fillStyle = '#333';
                this.ctx.fillText((row + 1).toString(), options.headerWidth / 2, y + height / 2);
            }
            y += height;
        }
    }
    renderBody(colWidths, rowHeights, options, viewport) {
        let y = options.headerHeight - viewport.scrollY;
        for (let row = 0; row < rowHeights.length && y < viewport.height; row++) {
            const rowHeight = rowHeights[row];
            if (y + rowHeight >= 0) {
                let x = options.headerWidth - viewport.scrollX;
                for (let col = 0; col < colWidths.length && x < viewport.width; col++) {
                    const colWidth = colWidths[col];
                    if (x + colWidth >= 0) {
                        this.ctx.strokeStyle = '#ddd';
                        this.ctx.strokeRect(x, y, colWidth, rowHeight);
                        this.ctx.fillStyle = '#222';
                    }
                    x += colWidth;
                }
            }
            y += rowHeight;
        }
    }
}
