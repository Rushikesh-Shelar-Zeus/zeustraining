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
            e.preventDefault();
            this.isDragging = true;
            // Get the canvas coordinates from the pointer event
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            //Check for the Hit Test
            const hit = this.hitTestManager.hitTest(x, y);
            // Delegate the hit test result to the selection manager
            if (hit) {
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
            e.preventDefault();
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
            // Delegate the hit test result to the selection manager
            if (hit) {
                this.selectionManager.handlePointerMove(hit);
            }
            else {
                console.log("No hit detected");
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
            e.preventDefault();
            if (!this.isDragging)
                return;
            this.isDragging = false;
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
        this.scrollContainer.addEventListener("pointermove", this.onPointerMove);
        this.scrollContainer.addEventListener("pointerup", this.onPointerUp);
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
        const scrollSpeed = 20;
        const edgeThreshold = 30;
        const loop = () => {
            if (!this.isDragging) {
                this.autoScrollFrameId = null;
                return;
            }
            const rect = this.scrollContainer.getBoundingClientRect();
            let scrolled = false;
            if (this.lastPointerX - rect.left < edgeThreshold) {
                this.scrollContainer.scrollLeft -= scrollSpeed;
                scrolled = true;
            }
            else if (rect.right - this.lastPointerX < edgeThreshold) {
                this.scrollContainer.scrollLeft += scrollSpeed;
                scrolled = true;
            }
            if (this.lastPointerY - rect.top < edgeThreshold) {
                this.scrollContainer.scrollTop -= scrollSpeed;
                scrolled = true;
            }
            else if (rect.bottom - this.lastPointerY < edgeThreshold) {
                this.scrollContainer.scrollTop += scrollSpeed;
                scrolled = true;
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
}
