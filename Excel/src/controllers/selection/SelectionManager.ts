import { Grid } from "../Grid.js";
import { HitTestResult } from "../hittest/index.js";
import { Renderer } from "../Renderer.js";
import { CellRangeSelectionHandler, CellSelectionHandler } from "./Handlers.js";
import { SelectionHandler } from "./index.js";

/**
 * SelectionManager class that manages selection logic for the grid.
 * It uses different selection handlers based on the hit test result type.
 */
export class SelectionManager {
    /** @type {Record<string, SelectionHandler>} */
    private handlersMap: {
        cell?: SelectionHandler;
    };

    private currentHandler: SelectionHandler | null = null;

    /**
     * Constructor for the SelectionManager.
     * @param {Grid} grid - The Grid instance to manage selection for.
     * @param {Renderer} renderer - The Renderer instance to trigger rendering on selection change.
     */
    constructor(
        private readonly grid: Grid,
        private readonly renderer: Renderer
    ) {
        // Initialize the handlers with the CellSelectionHandler
        this.handlersMap = {
            cell: new CellRangeSelectionHandler(grid, () => this.renderer.render(grid.viewport))
        };
    }

    /**
     * Handle pointer down events.
     * @param {HitTestResult} hit - The hit test result. 
     */
    handlePointerDown(hit: HitTestResult): void {
        if (!hit) {
            console.warn("No hit test result provided");
            return;
        }

        // Delegate to the appropriate handler based on hit type
        const handler = this.handlersMap[hit.type];
        if (handler) {
            this.currentHandler = handler;
            handler.onPointerDown(hit);
        }
    }

    /**
     * Handle pointer move events.
     * @param {HitTestResult} hit - The hit test result.
     */
    handlePointerMove(hit: HitTestResult): void {
        if (!hit) {
            console.warn("No hit test result provided");
            return;
        }

        if (!this.currentHandler) {
            console.warn("No current selection handler set");
            return;
        }
        // Call the onPointerMove method of the current handler if it exists
        this.currentHandler?.onPointerMove?.(hit);
    }

    /**
     * Handle pointer up events.
     * @param {HitTestResult} hit - The hit test result.
     */
    handlePointerUp(hit: HitTestResult): void {
        if (!this.currentHandler) {
            return;
        }
        // Call the onPointerUp method of the current handler if it exists
        this.currentHandler?.onPointerUp?.(hit);
        this.currentHandler = null;
    }
}