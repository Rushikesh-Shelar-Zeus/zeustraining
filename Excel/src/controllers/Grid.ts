import { Renderer } from "./Renderer.js";
import { SelectionManager } from "./selection/SelectionManager.js";
import { HitTestManager } from "./hittest/HitTestManager.js";
import { CellHitTestHandler, ColumnHeaderHitTestHandler, RowHitTestHandler, TopLeftCellHitTestHandler } from "./hittest/Handlers.js";

import {
    CellSelectionConfig,
    GridOptions,
    HitTestContext,
    Viewport
} from "../utils/types.js";
import { PointerEventManager } from "./eventHandlers/pointerEvents.js";
import { EditEventsManager } from "./eventHandlers/editEvents.js";
import { COLORS } from "../utils/constants.js";

/**
 * Grid class that manages the rendering of a grid with scrollable functionality.
 * It initializes a canvas, sets up the viewport, and handles scrolling.
 * Then renders the grid using the Renderer class.
 */
export class Grid {
    /** @type {HTMLCanvasElement} - The canvas element used for rendering the grid */
    private readonly canvas: HTMLCanvasElement;

    /** @type {CanvasRenderingContext2D} - The 2D rendering context for the canvas */
    private readonly ctx: CanvasRenderingContext2D;

    /** @type {HTMLElement} - The scrollable container for the grid */
    private readonly scrollContainer: HTMLElement;

    /** @type {Renderer} - The Renderer instance responsible for rendering the grid */
    private renderer: Renderer;

    /** @type {number} - Device Pixel Ratio for high DPI displays */
    private dpr: number = window.devicePixelRatio || 1;

    /** @type {Array<number>} - Stores the Widths of all the Columns */
    private columnWidths: number[];

    /** @type {Array<number>} - Stores the Heights of all the Rows */
    private rowHeights: number[];

    /** @type {Array<number>} - Prefix Sum of the row heights */
    readonly rowTops: number[] = [];

    /** @type {Array<number>} - Prefix Sum of the column widths */
    readonly colLefts: number[] = [];

    /** @type {CellSelectionConfig | null} - Stores the current cell selection configuration */
    public selection: CellSelectionConfig | null = null;

    /** @type {Viewport} - Stores the Dimension of ViewPort */
    public viewport: Viewport;

    /** @type {SelectionManager} - Manages the Selection for the Grid */
    public selectionManager: SelectionManager;

    /** @type {HitTestManager} - Manages hit testing for the Grid (CELL, ROW, COLUMN, RANGE) */
    public hitTestManager: HitTestManager;

    /** @type {PointerEventManager} - Manages pointer events for the Grid */
    private readonly pointerEventManager: PointerEventManager;

    /** @type {EditEventsManager} - Manages edit events for the Grid */
    private readonly editEventsManager: EditEventsManager;

    /** @type {{ x: number, y: number } | null} - To get the latest Pointer Position for auto-scrolling */
    public currentPointerPosition: { x: number, y: number } | null = null;

    /**
     * Constructor for the Grid class.
     * @param {GridOptions} options - GridOptions containing configuration for the grid.
     */
    constructor(public options: GridOptions) {
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

        // Calculate prefix sums for row heights and column widths

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
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.className = 'scrollable';

        // Calculate the total width and height of the grid based on column and row dimensions
        const { totalWidth, totalHeight } = this.getTotalDimensions(options);

        this.scrollContainer.style.overflow = 'auto';
        this.scrollContainer.style.width = this.viewport.width + 'px';
        this.scrollContainer.style.height = this.viewport.height + 'px';
        this.scrollContainer.style.position = 'relative';

        // Create a content div that defines the scrollable area
        const scrollContent = document.createElement('div');
        scrollContent.style.width = totalWidth + 'px';
        scrollContent.style.height = totalHeight + 'px';
        scrollContent.style.position = 'relative';

        // Append the Canvas to the main container
        container.appendChild(this.canvas);

        // Append the scroll content to scroll container
        this.scrollContainer.appendChild(scrollContent);

        // Append the Scrollable container to the main container
        container.appendChild(this.scrollContainer);

        // Pass the Configuration options to the Renderer
        this.renderer = new Renderer(
            options,
            this.ctx,
            this.columnWidths,
            this.rowHeights,
            this
        );

        // Initialize the HitTestManager with all HitTestHandlers
        this.hitTestManager = new HitTestManager([
            new TopLeftCellHitTestHandler(this),
            new RowHitTestHandler(this),
            new ColumnHeaderHitTestHandler(this),
            new CellHitTestHandler(this),
        ]);

        // Create a SelectionManager instance, handles the Selection Logic
        this.selectionManager = new SelectionManager(this, this.renderer);

        // Rrender the initial grid
        this.renderer.render(this.viewport);

        //Handle scrolling events
        this.scrollHandler(this.scrollContainer);

        // Attach pointer events to the canvas for hit testing and selection
        this.pointerEventManager = new PointerEventManager(
            this.canvas,
            this.scrollContainer,
            this.selectionManager,
            this.hitTestManager
        );

        //Attach Edit Events for Double Click
        this.editEventsManager = new EditEventsManager(
            this.scrollContainer,
            this,
            this.hitTestManager
        );
    }

    /**
     * Add a scroll event listener to the scroll container.
     * Handles scroll events to update the viewport and re-render the grid.
     * @param {HTMLDivElement} scrollContainer - The container that will handle scroll events.
     */
    private scrollHandler(scrollContainer: HTMLElement) {
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

    /**
     * Show an edit box for the specified cell.
     * This method creates an input element positioned over the cell to allow editing.
     * @param {number} row - The row index of the cell to edit.
     * @param {number} col - The column index of the cell to edit.
     */
    public showEditBox(row: number, col: number): void {

        const { scrollX, scrollY } = this.viewport;

        // Calculate the position of the cell based on its row and column indices
        const cellLeft = this.colLefts[col] - scrollX;
        const cellTop = this.rowTops[row] - scrollY;
        const cellWidth = this.columnWidths[col];
        const cellHeight = this.rowHeights[row];

        //Clean up any existing edit box
        const existingEditBox = document.getElementById("cell-editor");
        if (existingEditBox) {
            existingEditBox.remove();
        }

        //Create a New Input Element for Editing
        const input = document.createElement("input");
        input.id = "cell-editor";
        input.type = "text";

        // Set the input's value to the current cell value
        const inputStyle: Partial<CSSStyleDeclaration> = {
            position: "absolute",
            left: `${cellLeft}px`,
            top: `${cellTop}px`,
            width: `${cellWidth}px`,
            height: `${cellHeight}px`,
            border: `1px solid ${COLORS.selectedCellOutline}`,
            outline: "none",
            padding: "4px",
            boxSizing: "border-box",
            zIndex: "1000",
            backgroundColor: "white",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif"
        };

        Object.assign(input.style, inputStyle);

        // Append to the main container instead of scroll container for proper positioning
        const container = document.getElementById('container');
        if (container) {
            container.appendChild(input);
        }

        // Focus the input and select its content
        requestAnimationFrame(() => {
            input.focus();
            input.select();
        });

        input.addEventListener("blur", () => {
            // TODO: Save data to internal store
            input.remove();
        });


        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                input.blur();
            }
            else if (event.key === "Escape") {
                input.value = "";
                input.remove();
            }
        });
    }

    /**
     * Calculate the total dimensions of the grid based on column widths and row heights.
     * @param {GridOptions} options - The grid options containing header dimensions.
     * @returns {Object} - An object containing total width and height of the grid.
     */
    private getTotalDimensions(options: GridOptions): { totalWidth: number, totalHeight: number } {
        const totalWidth = this.columnWidths.reduce((sum, width) => sum + width, options.headerWidth);
        const totalHeight = this.rowHeights.reduce((sum, height) => sum + height, options.headerHeight);
        return { totalWidth, totalHeight };
    }

    /**
     * Get the maximum scroll limits for the grid.
     * This method calculates the maximum scroll positions based on the total dimensions of the grid.
     * @returns {number} - The maximum scroll position in the x direction.
     */
    private getMaxScrollX(): number {
        const { totalWidth } = this.getTotalDimensions(this.options);
        return totalWidth - this.viewport.width;
    }

    /**
     * Get the maximum scroll position in the y direction.
     * This method calculates the maximum scroll position based on the total height of the grid.
     * @returns {number} - The maximum scroll position in the y direction.
     */
    private getMaxScrollY(): number {
        const { totalHeight } = this.getTotalDimensions(this.options);
        return totalHeight - this.viewport.height;
    }

    /**
     * Scroll the grid by a specified delta in x and y directions.
     * This method updates the viewport's scroll position and ensures it does not exceed the maximum scroll limits.
     * @param {number} deltaX - The amount to scroll in the x direction.
     * @param {number} deltaY - The amount to scroll in the y direction.
     */
    scrollBy(deltaX: number, deltaY: number): void {
        this.viewport.scrollX = Math.max(0, Math.min(this.viewport.scrollX + deltaX, this.getMaxScrollX()));
        this.viewport.scrollY = Math.max(0, Math.min(this.viewport.scrollY + deltaY, this.getMaxScrollY()));
    }

    /**
     * Get the HitTestContext for the grid.
     * This context contains information about the grid's header dimensions, scroll position,
     * and the current row heights and column widths.
     * @returns {HitTestContext} - The context used for hit testing.
     */
    public get HitTestContext(): HitTestContext {
        return {
            headerWidth: this.renderer.getDynamicHeaderWidth(this.viewport),
            headerHeight: this.options.headerHeight,
            scrollX: this.viewport.scrollX,
            scrollY: this.viewport.scrollY,
            rowHeights: this.rowHeights,
            columnWidths: this.columnWidths
        }
    }

    /**
     * Get the total number of rows in the grid.
     */
    public get totalRows(): number {
        return this.options.totalRows;
    }

    /**
     * Get the total number of columns in the grid.
     */
    public get totalCols(): number {
        return this.options.totalCols;
    }

}