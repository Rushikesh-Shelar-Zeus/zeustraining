import { Renderer } from "./Renderer.js";
import { SelectionManager } from "./selection/SelectionManager.js";
import { HitTestManager } from "./hittest/HitTestManager.js";
import { CellHitTestHandler } from "./hittest/Handlers.js";
import { PointerEventManager } from "./pointerEventHandlers.js";
/**
 * Grid class that manages the rendering of a grid with scrollable functionality.
 * It initializes a canvas, sets up the viewport, and handles scrolling.
 * Then renders the grid using the Renderer class.
 */
export class Grid {
    /**
     * Constructor for the Grid class.
     * @param {GridOptions} options - GridOptions containing configuration for the grid.
     */
    constructor(options) {
        this.options = options;
        /** @type {number} - Device Pixel Ratio for high DPI displays */
        this.dpr = window.devicePixelRatio || 1;
        /** @type {CellSelectionConfig | null} - Stores the current cell selection configuration */
        this.selection = null;
        /** @type {{ x: number, y: number } | null} - To get the latest Pointer Position for auto-scrolling */
        this.currentPointerPosition = null;
        const container = document.getElementById('container');
        if (!container) {
            throw new Error('Container element not found');
        }
        // Set up the viewport dimensions based on the container size
        this.viewport = {
            scrollX: 0,
            scrollY: 0,
            width: container.clientWidth,
            height: container.clientHeight
        };
        // Initialize column widths and row heights based on options
        this.columnWidths = Array(options.totalCols).fill(options.defaultColWidth);
        this.rowHeights = Array(options.totalRows).fill(options.defaultRowHeight);
        // Create the Canvas element dynamically
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
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
        scrollContainer.className = 'scrollable';
        // Calculate the total width and height of the grid based on column and row dimensions
        const { totalWidth, totalHeight } = this.getTotalDimensions(options);
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.width = this.viewport.width + 'px';
        scrollContainer.style.height = this.viewport.height + 'px';
        scrollContainer.style.position = 'relative';
        // Create a content div that defines the scrollable area
        const scrollContent = document.createElement('div');
        scrollContent.style.width = totalWidth + 'px';
        scrollContent.style.height = totalHeight + 'px';
        scrollContent.style.position = 'relative';
        // Append the Canvas to the main container
        container.appendChild(this.canvas);
        // Append the scroll content to scroll container
        scrollContainer.appendChild(scrollContent);
        // Append the Scrollable container to the main container
        container.appendChild(scrollContainer);
        // Pass the Configuration options to the Renderer
        this.renderer = new Renderer(options, this.ctx, this.columnWidths, this.rowHeights, this);
        // Initialize the HitTestManager with all HitTestHandlers
        this.hitTestManager = new HitTestManager([
            new CellHitTestHandler(this)
        ]);
        // Create a SelectionManager instance, handles the Selection Logic
        this.selectionManager = new SelectionManager(this, this.renderer);
        // Rrender the initial grid
        this.renderer.render(this.viewport);
        //Handle scrolling events
        this.scrollHandler(scrollContainer);
        // Attach pointer events to the canvas for hit testing and selection
        this.pointerEventManager = new PointerEventManager(this.canvas, scrollContainer, this.selectionManager, this.hitTestManager);
    }
    /**
     * Add a scroll event listener to the scroll container.
     * Handles scroll events to update the viewport and re-render the grid.
     * @param {HTMLDivElement} scrollContainer - The container that will handle scroll events.
     */
    scrollHandler(scrollContainer) {
        scrollContainer.addEventListener('scroll', (event) => {
            this.viewport.scrollX = scrollContainer.scrollLeft;
            this.viewport.scrollY = scrollContainer.scrollTop;
            // Re-render the grid with the updated viewport
            this.renderer.render(this.viewport);
        });
        // Add additional event listeners for debugging
        scrollContainer.addEventListener('wheel', (event) => {
        });
        scrollContainer.addEventListener("pointermove", (event) => {
        });
        // scrollContainer.addEventListener("pointerdown", (event) => {
        //     const rect = this.canvas.getBoundingClientRect();
        //     const x = event.clientX - rect.left;
        //     const y = event.clientY - rect.top;
        //     console.log(`Pointer down at canvas coordinates: (${x}, ${y})`);
        //     const hit = this.hitTestManager.hitTest(x, y);
        //     console.log("Hit test result:", hit);
        //     if (hit) {
        //         this.selectionManager.handleCellSelection(hit);
        //     } else {
        //         console.log("No hit detected");
        //     }
        // });
    }
    /**
     * Observe the container for resize events to adjust the viewport and canvas dimensions.
     * @param {HTMLElement} container - The container element to observe for resizing.
     */
    observeResize(container) {
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
    /**
     * Calculate the total dimensions of the grid based on column widths and row heights.
     * @param {GridOptions} options - The grid options containing header dimensions.
     * @returns {Object} - An object containing total width and height of the grid.
     */
    getTotalDimensions(options) {
        const totalWidth = this.columnWidths.reduce((sum, width) => sum + width, options.headerWidth);
        const totalHeight = this.rowHeights.reduce((sum, height) => sum + height, options.headerHeight);
        return { totalWidth, totalHeight };
    }
    scrollBy(deltaX, deltaY) {
        this.viewport.scrollX = Math.max(0, Math.min(this.viewport.scrollX + deltaX, this.getMaxScrollX()));
        this.viewport.scrollY = Math.max(0, Math.min(this.viewport.scrollY + deltaY, this.getMaxScrollY()));
    }
    getMaxScrollX() {
        const { totalWidth } = this.getTotalDimensions(this.options);
        return totalWidth - this.viewport.width;
    }
    getMaxScrollY() {
        const { totalHeight } = this.getTotalDimensions(this.options);
        return totalHeight - this.viewport.height;
    }
    /**
     * Get the HitTestContext for the grid.
     * This context contains information about the grid's header dimensions, scroll position,
     * and the current row heights and column widths.
     * @returns {HitTestContext} - The context used for hit testing.
     */
    get getHitTestContext() {
        return {
            headerWidth: this.options.headerWidth,
            headerHeight: this.options.headerHeight,
            scrollX: this.viewport.scrollX,
            scrollY: this.viewport.scrollY,
            rowHeights: this.rowHeights,
            columnWidths: this.columnWidths
        };
    }
}
