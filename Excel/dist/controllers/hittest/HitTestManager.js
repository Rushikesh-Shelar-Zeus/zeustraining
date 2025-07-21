/**
 * Hit Test Manager
 * This class manages multiple hit test handlers and performs hit testing
 * by delegating to the appropriate handler based on the context.
 */
export class HitTestManager {
    /**
     * Constructor for the HitTestManager.
     * @param {HitTestHandler[]} handlers - Array of hit test handlers to manage.
     */
    constructor(handlers) {
        this.handlers = handlers;
    }
    /**
     * Performs hit testing at the given coordinates (x, y).
     * It iterates through the registered handlers and returns the first non-null result.
     * @param {number} x - The x-coordinate of the pointer event.
     * @param {number} y - The y-coordinate of the pointer event.
     * @returns {HitTestResult | null} - Returns a HitTestResult if a hit is detected, otherwise null.
     */
    hitTest(x, y) {
        for (const handler of this.handlers) {
            const result = handler.hitTest(x, y);
            if (result) {
                return result;
            }
        }
        // No hit test result found
        return null;
    }
}
