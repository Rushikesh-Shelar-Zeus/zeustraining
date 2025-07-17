import { Renderer } from './Renderer.js';
export class Grid {
    constructor(options) {
        this.dpr = window.devicePixelRatio || 1;
        this.options = options;
        const container = document.getElementById('container');
        if (!container)
            throw new Error('Container not found');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        this.viewport = {
            scrollX: 0,
            scrollY: 0,
            width: container.clientWidth,
            height: container.clientHeight
        };
        this.canvas.width = this.viewport.width * this.dpr;
        this.canvas.height = this.viewport.height * this.dpr;
        this.canvas.style.width = this.viewport.width + 'px';
        this.canvas.style.height = this.viewport.height + 'px';
        this.ctx.scale(this.dpr, this.dpr);
        this.columnWidths = new Array(options.totalCols).fill(options.defaultColWidth);
        this.rowHeights = new Array(options.totalRows).fill(options.defaultRowHeight);
        this.renderer = new Renderer(this.canvas, this.ctx, this);
        this.attachScrollHandler(container);
        this.render();
    }
    attachScrollHandler(container) {
        container.addEventListener('scroll', () => {
            this.viewport.scrollX = container.scrollLeft;
            this.viewport.scrollY = container.scrollTop;
            this.render();
        });
    }
    getColumnWidths() {
        return this.columnWidths;
    }
    getRowHeights() {
        return this.rowHeights;
    }
    getViewport() {
        return this.viewport;
    }
    getOptions() {
        return this.options;
    }
    render() {
        this.renderer.render();
    }
}
