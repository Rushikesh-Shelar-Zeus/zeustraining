import { HitTestHandler, HitTestResult } from "./index.js";

/**
 * Hit Test Manager
 * This class manages multiple hit test handlers and performs hit testing
 * by delegating to the appropriate handler based on the context.
 */
export class HitTestManager {

    /** @type {HitTestHandler[]} - Array of hit test handlers */
    private handlers: HitTestHandler[];

    /**
     * Constructor for the HitTestManager.
     * @param {HitTestHandler[]} handlers - Array of hit test handlers to manage.
     */
    constructor(handlers: HitTestHandler[]) {
        this.handlers = handlers;
    }

    /**
     * Performs hit testing at the given coordinates (x, y).
     * It iterates through the registered handlers and returns the first non-null result.
     * @param {number} x - The x-coordinate of the pointer event.
     * @param {number} y - The y-coordinate of the pointer event.
     * @returns {HitTestResult | null} - Returns a HitTestResult if a hit is detected, otherwise null.
     */
    hitTest(x: number, y: number): HitTestResult | null {
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