import { CellSelectionHandler } from "./Handlers.js";
/**
 * SelectionManager class that manages selection logic for the grid.
 * It uses different selection handlers based on the hit test result type.
 */
export class SelectionManager {
    /**
     * Constructor for the SelectionManager.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Renderer} renderer - The Renderer instance to trigger rendering on selection change.
     */
    constructor(grid, renderer) {
        this.grid = grid;
        this.renderer = renderer;
        // Initialize the handlers with the CellSelectionHandler
        this.handlers = {
            cell: new CellSelectionHandler(grid, () => this.renderer.render(grid.viewport))
        };
    }
    /**
     * Handle pointer down events.
     * @param {HitTestResult} hit - The hit test result.
     */
    handlePointerDown(hit) {
        if (!hit) {
            console.warn("No hit test result provided");
            return;
        }
        // Delegate to the appropriate handler based on hit type
        const handler = this.handlers[hit.type];
        if (handler) {
            handler.onPointerDown(hit);
        }
    }
}
