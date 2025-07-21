/**
 * Attach Pointer Events to the canvas for hit testing and selection.
 * This function listens for pointer down events on the canvas and performs hit testing
 * to determine if a cell was clicked. If a cell is hit, it calls the selection manager
 * to handle the selection logic.
 * @param {HTMLCanvasElement} canvas - The canvas element where pointer events will be attached.
 * @param {HTMLElement} scrollContainer - The container element for scrolling.
 * @param {SelectionManager} selectionManager - The manager responsible for cell selection.
 * @param {HitTestManager} hitTestManager - The manager responsible for hit testing.
 */
export function attachPointerEvents(canvas, scrollContainer, selectionManager, hitTestManager) {
    // Attach pointer down event to the scroll container
    scrollContainer.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        // Get the canvas coordinates from the pointer event
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        //Check for the Hit Test
        const hit = hitTestManager.hitTest(x, y);
        // Delegate the hit test result to the selection manager
        if (hit) {
            selectionManager.handlePointerDown(hit);
        }
        else {
            console.log("No hit detected");
        }
    });
}
