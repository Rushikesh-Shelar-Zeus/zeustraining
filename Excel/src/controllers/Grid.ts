import { Renderer } from "./Renderer.js";

export interface GridOptions {
    totalRows: number;
    totalCols: number;
    defaultRowHeight: number;
    defaultColWidth: number;
    headerHeight: number;
    headerWidth: number;
}

export interface Viewport {
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
}

export class Grid {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private renderer: Renderer;

    private dpr: number = window.devicePixelRatio || 1;

    private viewport: Viewport;

    private columnWidths: number[];
    private rowHeights: number[];

    constructor(options: GridOptions) {
        const container = document.getElementById('container');
        if (!container) {
            throw new Error('Container element not found');
        }

        // Set the Viewport dimensions based on the container size
        this.viewport = {
            scrollX: 0,
            scrollY: 0,
            width: container.clientWidth,
            height: container.clientHeight
        };

        // Initialize the Row and Column dimensions
        this.columnWidths = Array(options.totalCols).fill(options.defaultColWidth);
        this.rowHeights = Array(options.totalRows).fill(options.defaultRowHeight);

        // Create the Canvas element dynamically
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d')!;
        if (!this.ctx) {
            throw new Error('Failed to get canvas context');
        }
        // Set the Canvas dimensions based on the Viewport
        this.canvas.width = this.viewport.width * this.dpr;
        this.canvas.height = this.viewport.height * this.dpr;
        this.canvas.style.width = this.viewport.width + 'px';
        this.canvas.style.height = this.viewport.height + 'px';

        // Scale the context for high DPI displays
        this.ctx.scale(this.dpr, this.dpr);

        // Create a Scrollable container
        const scrollContainer = document.createElement('div');
        const { totalWidth, totalHeight } = this.getTotalDimensions();

        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.width = this.viewport.width + 'px';
        scrollContainer.style.height = this.viewport.height + 'px';

        scrollContainer.style.width = totalWidth + 'px';
        scrollContainer.style.height = totalHeight + 'px';

        // Append the Scrollable container to the main container
        container.appendChild(scrollContainer);

        // Append the Canvas to the container
        scrollContainer.appendChild(this.canvas);


        this.renderer = new Renderer(
            options,
            this.ctx,
            this.viewport,
            this.columnWidths,
            this.rowHeights
        );

        this.renderer.render(this.viewport);
        this.scrollHandler(container);

        console.log(`Canvas created and appended to container
            Values: 
            Width: ${this.viewport.width}, Height: ${this.viewport.height},
            DPR: ${this.dpr},
            Canvas Width: ${this.canvas.width}, Canvas Height: ${this.canvas.height}
            Context: ${this.ctx ? 'Available' : 'Not Available'}
            Column Widths: ${this.columnWidths.length}, Row Heights: ${this.rowHeights.length}
            Total Rows: ${options.totalRows}, Total Cols: ${options.totalCols}
            Default Row Height: ${options.defaultRowHeight}, Default Col Width: ${options.defaultColWidth}
            Header Height: ${options.headerHeight}, Header Width: ${options.headerWidth}
            Viewport: ${JSON.stringify(this.viewport)}
            Renderer: ${this.renderer ? 'Initialized' : 'Not Initialized'}
            `);
    }

    private scrollHandler(scrollContainer: HTMLElement) {
        scrollContainer.addEventListener('scroll', () => {
            this.viewport.scrollX = scrollContainer.scrollLeft;
            this.viewport.scrollY = scrollContainer.scrollTop;

            // Re-render the grid with the updated viewport
            this.renderer.render(this.viewport);
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
        });

        resizeObserver.observe(container);
    }

    private getTotalDimensions(): { totalWidth: number, totalHeight: number } {
        const totalWidth = this.columnWidths.reduce((sum, width) => sum + width, 0);
        const totalHeight = this.rowHeights.reduce((sum, height) => sum + height, 0);
        return { totalWidth, totalHeight };
    }
}