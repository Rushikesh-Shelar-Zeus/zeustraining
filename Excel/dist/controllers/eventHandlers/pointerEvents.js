/**
 * PointerEventManager class that manages pointer events for the grid.
 * It handles pointer down, move, and up events, including auto-scrolling.
 */
export class PointerEventManager {
    /**
     * Constructor for the PointerEventManager.
     * @param {HTMLCanvasElement} canvas - The canvas element to attach pointer events to.
     * @param {HTMLElement} scrollContainer - The container element that can be scrolled.
     * @param {SelectionManager} selectionManager - The selection manager to handle selections.
     * @param {HitTestManager} hitTestManager - The hit test manager to perform hit tests.
     */
    constructor(canvas, scrollContainer, selectionManager, hitTestManager) {
        this.canvas = canvas;
        this.scrollContainer = scrollContainer;
        this.selectionManager = selectionManager;
        this.hitTestManager = hitTestManager;
        /** @type {boolean} - Indicates if the pointer is currently dragging */
        this.isDragging = false;
        /** @type {boolean} - Whether dragging started in the header area */
        this.isInHeaderDrag = false;
        /** @type {"cell" | "row" | "col" | null} - Dragging mode */
        this.dragMode = null;
        /** @type {number} - Last pointer X coordinate */
        this.lastPointerX = 0;
        /** @type {number} - Last pointer Y coordinate */
        this.lastPointerY = 0;
        /** @type {number | null} - ID of the auto-scroll animation frame */
        this.autoScrollFrameId = null;
        /**
         * Handles pointer down events.
         * It starts the dragging state and performs hit testing to update selection.
         * @param {PointerEvent} e - The pointer down event.
         */
        this.onPointerDown = (e) => {
            // Ignore clicks on the scrollbar
            if (this.isScrollbarClick(e, this.scrollContainer))
                return;
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
            }
            else if (hit?.type === "col") {
                this.dragMode = "col";
            }
            else if (hit?.type === "cell") {
                this.dragMode = "cell";
            }
            else {
                this.dragMode = null;
            }
            // Delegate the hit test result to the selection manager
            if (hit) {
                // If the hit test is in the header area, set the dragging state
                this.isInHeaderDrag = hit.type === "col" || hit.type === "row";
                this.selectionManager.handlePointerDown(hit);
            }
            else {
                console.log("No hit detected");
            }
        };
        /**
         * Handles pointer move events.
         * It updates the selection based on the current pointer position.
         * @param {PointerEvent} e - The pointer move event.
         */
        this.onPointerMove = (e) => {
            // Ignore clicks on the scrollbar
            if (this.isScrollbarClick(e, this.scrollContainer))
                return;
            if (!this.isDragging)
                return;
            // Update the last pointer coordinates
            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
            // Get the canvas coordinates from the pointer event
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Check for the Hit Test
            const hit = this.hitTestManager.hitTest(x, y);
            // Handle different drag modes
            if (this.dragMode === "row") {
                // For row selection, create a synthetic hit based on Y coordinate
                // even if pointer is outside the row header area
                const rowHit = this.hitTestManager.hitTest(0, y); // Use x=0 to ensure we hit the row header area
                if (rowHit && rowHit.type === "row") {
                    this.selectionManager.handlePointerMove(rowHit);
                }
                else {
                    // If no row hit at y coordinate, try to find the closest row
                    const syntheticRowHit = this.createSyntheticRowHit(y);
                    if (syntheticRowHit) {
                        this.selectionManager.handlePointerMove(syntheticRowHit);
                    }
                }
            }
            else if (this.dragMode === "col") {
                // For column selection, create a synthetic hit based on X coordinate
                // even if pointer is outside the column header area
                const colHit = this.hitTestManager.hitTest(x, 0); // Use y=0 to ensure we hit the column header area
                if (colHit && colHit.type === "col") {
                    this.selectionManager.handlePointerMove(colHit);
                }
                else {
                    // If no column hit at x coordinate, try to find the closest column
                    const syntheticColHit = this.createSyntheticColHit(x);
                    if (syntheticColHit) {
                        this.selectionManager.handlePointerMove(syntheticColHit);
                    }
                }
            }
            else {
                // For cell selection or other modes, use normal hit testing
                if (hit) {
                    this.selectionManager.handlePointerMove(hit);
                }
                else {
                    console.log("No hit detected");
                }
            }
            // Start the auto-scroll loop if dragging
            this.startAutoScrollLoop();
        };
        /**
         * Handles pointer up events.
         * It stops the dragging state and finalizes the selection.
         * @param {PointerEvent} e - The pointer up event.
         */
        this.onPointerUp = (e) => {
            // Ignore clicks on the scrollbar
            if (this.isScrollbarClick(e, this.scrollContainer))
                return;
            if (!this.isDragging)
                return;
            this.isDragging = false;
            this.isInHeaderDrag = false;
            this.dragMode = null;
            // Get the canvas coordinates from the pointer event
            const { x, y } = this.getCanvasCoords(e);
            // Check for the Hit Test
            const hit = this.hitTestManager.hitTest(x, y);
            // Delegate the hit test result to the selection manager
            if (hit)
                this.selectionManager.handlePointerUp(hit);
            if (this.autoScrollFrameId !== null) {
                cancelAnimationFrame(this.autoScrollFrameId);
                this.autoScrollFrameId = null;
            }
        };
        // Attach pointer event listeners to the canvas and scroll container
        this.attachListeners();
    }
    /**
     * Attaches pointer event listeners to the canvas and scroll container.
     */
    attachListeners() {
        this.scrollContainer.addEventListener("pointerdown", this.onPointerDown);
        window.addEventListener("pointermove", this.onPointerMove, { passive: false });
        window.addEventListener("pointerup", this.onPointerUp);
    }
    /**
     * Converts pointer event coordinates to canvas coordinates.
     * @param {PointerEvent} e - The pointer event.
     * @returns {{ x: number, y: number }} - The canvas coordinates.
     */
    getCanvasCoords(e) {
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
    startAutoScrollLoop() {
        if (this.autoScrollFrameId !== null)
            return;
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
                }
                else if (rect.right - this.lastPointerX < edgeThreshold) {
                    this.scrollContainer.scrollLeft += scrollSpeed;
                    scrolled = true;
                }
            }
            if (this.dragMode !== "col") {
                if (this.lastPointerY - rect.top < edgeThreshold) {
                    this.scrollContainer.scrollTop -= scrollSpeed;
                    scrolled = true;
                }
                else if (rect.bottom - this.lastPointerY < edgeThreshold) {
                    this.scrollContainer.scrollTop += scrollSpeed;
                    scrolled = true;
                }
            }
            if (scrolled) {
                const { x, y } = this.getCanvasCoords({
                    clientX: this.lastPointerX,
                    clientY: this.lastPointerY
                });
                const hit = this.hitTestManager.hitTest(x, y);
                if (hit)
                    this.selectionManager.handlePointerMove(hit);
            }
            this.autoScrollFrameId = requestAnimationFrame(loop);
        };
        this.autoScrollFrameId = requestAnimationFrame(loop);
    }
    isScrollbarClick(e, container) {
        const bounds = container.getBoundingClientRect();
        const isVerticalScrollbar = e.clientX > bounds.left + container.clientWidth;
        const isHorizontalScrollbar = e.clientY > bounds.top + container.clientHeight;
        return isVerticalScrollbar || isHorizontalScrollbar;
    }
    /**
     * Creates a synthetic row hit for the given Y coordinate.
     * This is used when dragging rows but the pointer moves outside the row header area.
     * @param {number} y - The Y coordinate to find the row for.
     * @returns {any | null} - The synthetic row hit or null if no row found.
     */
    createSyntheticRowHit(y) {
        // Try to find a row hit by testing at different X positions in the row header area
        for (let testX = 0; testX < 100; testX += 10) {
            const hit = this.hitTestManager.hitTest(testX, y);
            if (hit && hit.type === "row") {
                return hit;
            }
        }
        return null;
    }
    /**
     * Creates a synthetic column hit for the given X coordinate.
     * This is used when dragging columns but the pointer moves outside the column header area.
     * @param {number} x - The X coordinate to find the column for.
     * @returns {any | null} - The synthetic column hit or null if no column found.
     */
    createSyntheticColHit(x) {
        // Try to find a column hit by testing at different Y positions in the column header area
        for (let testY = 0; testY < 100; testY += 10) {
            const hit = this.hitTestManager.hitTest(x, testY);
            if (hit && hit.type === "col") {
                return hit;
            }
        }
        return null;
    }
}
