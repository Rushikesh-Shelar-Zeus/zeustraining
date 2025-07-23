import { HitTestManager } from "./hittest/HitTestManager.js";
import { SelectionManager } from "./selection/SelectionManager.js";

/**
 * PointerEventManager class that manages pointer events for the grid.
 * It handles pointer down, move, and up events, including auto-scrolling.
 */
export class PointerEventManager {
    /** @type {boolean} - Indicates if the pointer is currently dragging */
    private isDragging: boolean = false;

    /** @type {boolean} - Whether dragging started in the header area */
    private isInHeaderDrag: boolean = false;

    /** @type {"cell" | "row" | "col" | null} - Dragging mode */
    private dragMode: "cell" | "row" | "col" | null = null;

    /** @type {number} - Last pointer X coordinate */
    private lastPointerX: number = 0;

    /** @type {number} - Last pointer Y coordinate */
    private lastPointerY: number = 0;

    /** @type {number | null} - ID of the auto-scroll animation frame */
    private autoScrollFrameId: number | null = null;

    /**
     * Constructor for the PointerEventManager.
     * @param {HTMLCanvasElement} canvas - The canvas element to attach pointer events to.
     * @param {HTMLElement} scrollContainer - The container element that can be scrolled.
     * @param {SelectionManager} selectionManager - The selection manager to handle selections.
     * @param {HitTestManager} hitTestManager - The hit test manager to perform hit tests.
     */
    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly scrollContainer: HTMLElement,
        private readonly selectionManager: SelectionManager,
        private readonly hitTestManager: HitTestManager
    ) {
        // Attach pointer event listeners to the canvas and scroll container
        this.attachListeners();
    }

    /**
     * Attaches pointer event listeners to the canvas and scroll container.
     */
    private attachListeners() {
        this.scrollContainer.addEventListener("pointerdown", this.onPointerDown);
        this.scrollContainer.addEventListener("pointermove", this.onPointerMove);
        this.scrollContainer.addEventListener("pointerup", this.onPointerUp);
    }

    /**
     * Handles pointer down events.
     * It starts the dragging state and performs hit testing to update selection.
     * @param {PointerEvent} e - The pointer down event.
     */
    private onPointerDown = (e: PointerEvent) => {

        // Ignore clicks on the scrollbar
        if (this.isScrollbarClick(e, this.scrollContainer)) return;

        e.preventDefault();
        this.isDragging = true;

        // Get the canvas coordinates from the pointer event
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        //Check for the Hit Test
        const hit = this.hitTestManager.hitTest(x, y);

        // Detect selection type for scroll direction
        if (hit?.type === "row") {
            this.dragMode = "row";
        } else if (hit?.type === "col") {
            this.dragMode = "col";
        } else if (hit?.type === "cell") {
            this.dragMode = "cell";
        } else {
            this.dragMode = null;
        }

        // Delegate the hit test result to the selection manager
        if (hit) {
            // If the hit test is in the header area, set the dragging state
            this.isInHeaderDrag = hit.type === "col" || hit.type === "row";
            this.selectionManager.handlePointerDown(hit);
        } else {
            console.log("No hit detected");
        }
    }

    /**
     * Handles pointer move events.
     * It updates the selection based on the current pointer position.
     * @param {PointerEvent} e - The pointer move event.
     */
    private onPointerMove = (e: PointerEvent) => {

        // Ignore clicks on the scrollbar
        if (this.isScrollbarClick(e, this.scrollContainer)) return;

        e.preventDefault();

        if (!this.isDragging) return;

        // Update the last pointer coordinates
        this.lastPointerX = e.clientX;
        this.lastPointerY = e.clientY;

        // Get the canvas coordinates from the pointer event
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check for the Hit Test
        const hit = this.hitTestManager.hitTest(x, y);

        // Delegate the hit test result to the selection manager
        if (hit) {
            this.selectionManager.handlePointerMove(hit);
        } else {
            console.log("No hit detected");
        }

        // Start the auto-scroll loop if dragging
        this.startAutoScrollLoop();
    }

    /**
     * Handles pointer up events.
     * It stops the dragging state and finalizes the selection.
     * @param {PointerEvent} e - The pointer up event.
     */
    private onPointerUp = (e: PointerEvent) => {

        // Ignore clicks on the scrollbar
        if (this.isScrollbarClick(e, this.scrollContainer)) return;

        e.preventDefault();

        if (!this.isDragging) return;
        this.isDragging = false;

        this.isInHeaderDrag = false;

        this.dragMode = null;


        // Get the canvas coordinates from the pointer event
        const { x, y } = this.getCanvasCoords(e);

        // Check for the Hit Test
        const hit = this.hitTestManager.hitTest(x, y);

        // Delegate the hit test result to the selection manager
        if (hit) this.selectionManager.handlePointerUp(hit);

        if (this.autoScrollFrameId !== null) {
            cancelAnimationFrame(this.autoScrollFrameId);
            this.autoScrollFrameId = null;
        }
    };

    /**
     * Converts pointer event coordinates to canvas coordinates.
     * @param {PointerEvent} e - The pointer event.
     * @returns {{ x: number, y: number }} - The canvas coordinates.
     */
    private getCanvasCoords(e: PointerEvent): { x: number; y: number; } {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    /**
     * Starts the auto-scroll loop if the pointer is dragging near the edges of the scroll container.
     * It continuously scrolls the container while the pointer is near the edges.
     */
    private startAutoScrollLoop() {
        if (this.autoScrollFrameId !== null) return;

        // Define the scroll speed and edge threshold
        const scrollSpeed = 20;
        const edgeThreshold = 30;

        const loop = () => {
            if (!this.isDragging) {
                this.autoScrollFrameId = null;
                return;
            }

            const rect = this.scrollContainer.getBoundingClientRect();
            let scrolled = false;

            if (this.dragMode !== "row") {
                if (this.lastPointerX - rect.left < edgeThreshold) {
                    this.scrollContainer.scrollLeft -= scrollSpeed;
                    scrolled = true;
                } else if (rect.right - this.lastPointerX < edgeThreshold) {
                    this.scrollContainer.scrollLeft += scrollSpeed;
                    scrolled = true;
                }
            }

            if (this.dragMode !== "col") {
                if (this.lastPointerY - rect.top < edgeThreshold) {
                    this.scrollContainer.scrollTop -= scrollSpeed;
                    scrolled = true;
                } else if (rect.bottom - this.lastPointerY < edgeThreshold) {
                    this.scrollContainer.scrollTop += scrollSpeed;
                    scrolled = true;
                }
            }

            if (scrolled) {
                const { x, y } = this.getCanvasCoords({
                    clientX: this.lastPointerX,
                    clientY: this.lastPointerY
                } as PointerEvent);
                const hit = this.hitTestManager.hitTest(x, y);
                if (hit) this.selectionManager.handlePointerMove(hit);
            }

            this.autoScrollFrameId = requestAnimationFrame(loop);
        };

        this.autoScrollFrameId = requestAnimationFrame(loop);
    }

    private isScrollbarClick(e: PointerEvent, container: HTMLElement): boolean {
        const bounds = container.getBoundingClientRect();

        const isVerticalScrollbar =
            e.clientX > bounds.left + container.clientWidth;

        const isHorizontalScrollbar =
            e.clientY > bounds.top + container.clientHeight;

        return isVerticalScrollbar || isHorizontalScrollbar;
    }
}

