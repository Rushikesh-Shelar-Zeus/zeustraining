import { GridOptions, Viewport } from '../utils/types.js';
import { Renderer } from './Renderer.js';

export class Grid {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private dpr = window.devicePixelRatio || 1;

    private options: GridOptions;
    private viewport: Viewport;

    private columnWidths: number[];
    private rowHeights: number[];

    private renderer: Renderer;

    constructor(options: GridOptions) {
        this.options = options;

        const container = document.getElementById('container');
        if (!container) throw new Error('Container not found');
        container.style.position = 'relative';

        this.columnWidths = new Array(options.totalCols).fill(options.defaultColWidth);
        this.rowHeights = new Array(options.totalRows).fill(options.defaultRowHeight);

        // Create scrollable inner div
        const scrollContainer = document.createElement('div');
        scrollContainer.style.width = this.getTotalContentWidth() + 'px';
        scrollContainer.style.height = this.getTotalContentHeight() + 'px';
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.position = 'relative';
        scrollContainer.style.zIndex = '1';
        container.appendChild(scrollContainer);

        // Create canvas absolutely positioned over scrollContainer
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '2';
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

        this.renderer = new Renderer(this.canvas, this.ctx, this);

        this.attachScrollHandler(scrollContainer);
        this.observeResize(container);
        this.render();
    }

    private attachScrollHandler(scrollContainer: HTMLElement) {
        scrollContainer.addEventListener('scroll', () => {
            this.viewport.scrollX = scrollContainer.scrollLeft;
            this.viewport.scrollY = scrollContainer.scrollTop;

            // Shift canvas so it moves with scroll (like sticky rendering)
            this.canvas.style.transform = `translate(${-this.viewport.scrollX}px, ${-this.viewport.scrollY}px)`;
            console.log(`Scroll X: ${this.viewport.scrollX}, Scroll Y: ${this.viewport.scrollY}`);
            this.render();
        });
    }

    private observeResize(container: HTMLElement) {
        const resizeObserver = new ResizeObserver(() => {
            this.viewport.width = container.clientWidth;
            this.viewport.height = container.clientHeight;

            this.canvas.width = this.viewport.width * this.dpr;
            this.canvas.height = this.viewport.height * this.dpr;
            this.canvas.style.width = this.viewport.width + 'px';
            this.canvas.style.height = this.viewport.height + 'px';

            this.ctx.scale(this.dpr, this.dpr);

            this.render();
        });

        resizeObserver.observe(container);
    }


    public getColumnWidths() {
        return this.columnWidths;
    }

    public getRowHeights() {
        return this.rowHeights;
    }

    public getViewport(): Viewport {
        return this.viewport;
    }

    public getOptions(): GridOptions {
        return this.options;
    }

    private render() {
        this.renderer.render();
    }

    private getTotalContentWidth(): number {
        return this.columnWidths.reduce((a, b) => a + b, this.options.headerWidth);
    }

    private getTotalContentHeight(): number {
        return this.rowHeights.reduce((a, b) => a + b, this.options.headerHeight);
    }
}
