export class Renderer {
    constructor(canvas, ctx, grid) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.grid = grid;
    }
    getVisibleRange(sizes, offset, viewSize) {
        let start = 0;
        let end = sizes.length;
        let total = 0;
        // Find start index
        for (let i = 0; i < sizes.length; i++) {
            if (total + sizes[i] > offset) {
                start = i;
                break;
            }
            total += sizes[i];
        }
        // Now continue from current total to find end index
        let visiblePixels = total;
        for (let i = start; i < sizes.length; i++) {
            visiblePixels += sizes[i];
            if (visiblePixels > offset + viewSize) {
                end = i + 1;
                break;
            }
        }
        return [start, end];
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
        const [visibleColStart, visibleColEnd] = this.getVisibleRange(colWidths, viewport.scrollX, viewport.width);
        const [visibleRowStart, visibleRowEnd] = this.getVisibleRange(rowHeights, viewport.scrollY, viewport.height);
        // Calculate pixel offset for first visible col/row
        let xOffset = options.headerWidth;
        for (let i = 0; i < visibleColStart; i++)
            xOffset += colWidths[i];
        let yOffset = options.headerHeight;
        for (let i = 0; i < visibleRowStart; i++)
            yOffset += rowHeights[i];
        // Top-left corner cell
        this.ctx.fillStyle = '#e0e0e0';
        this.ctx.fillRect(0, 0, options.headerWidth, options.headerHeight);
        this.ctx.strokeStyle = '#bbb';
        this.ctx.strokeRect(0, 0, options.headerWidth, options.headerHeight);
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#333';
        // Column headers
        let x = xOffset;
        for (let col = visibleColStart; col < visibleColEnd; col++) {
            const width = colWidths[col];
            const drawX = x - viewport.scrollX;
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.fillRect(drawX, 0, width, options.headerHeight);
            this.ctx.strokeStyle = '#bbb';
            this.ctx.strokeRect(drawX, 0, width, options.headerHeight);
            const label = String.fromCharCode(65 + (col % 26));
            this.ctx.fillStyle = '#333';
            this.ctx.fillText(label, drawX + width / 2, options.headerHeight / 2);
            x += width;
        }
        // Row headers
        let y = yOffset;
        for (let row = visibleRowStart; row < visibleRowEnd; row++) {
            const height = rowHeights[row];
            const drawY = y - viewport.scrollY;
            this.ctx.fillStyle = '#f0f0f0';
            this.ctx.fillRect(0, drawY, options.headerWidth, height);
            this.ctx.strokeStyle = '#bbb';
            this.ctx.strokeRect(0, drawY, options.headerWidth, height);
            this.ctx.fillStyle = '#333';
            this.ctx.fillText((row + 1).toString(), options.headerWidth / 2, drawY + height / 2);
            y += height;
        }
    }
    renderBody(colWidths, rowHeights, options, viewport) {
        const [visibleColStart, visibleColEnd] = this.getVisibleRange(colWidths, viewport.scrollX, viewport.width);
        const [visibleRowStart, visibleRowEnd] = this.getVisibleRange(rowHeights, viewport.scrollY, viewport.height);
        // Calculate pixel offset for first visible row/col
        let xOffset = options.headerWidth;
        for (let i = 0; i < visibleColStart; i++)
            xOffset += colWidths[i];
        let yOffset = options.headerHeight;
        for (let i = 0; i < visibleRowStart; i++)
            yOffset += rowHeights[i];
        let y = yOffset;
        for (let row = visibleRowStart; row < visibleRowEnd; row++) {
            const rowHeight = rowHeights[row];
            const drawY = y - viewport.scrollY;
            let x = xOffset;
            for (let col = visibleColStart; col < visibleColEnd; col++) {
                const colWidth = colWidths[col];
                const drawX = x - viewport.scrollX;
                this.ctx.strokeStyle = '#ddd';
                this.ctx.strokeRect(drawX, drawY, colWidth, rowHeight);
                // this.ctx.fillText(`R${row}C${col}`, drawX + 4, drawY + 12); // Optional
                x += colWidth;
            }
            y += rowHeight;
        }
    }
}
