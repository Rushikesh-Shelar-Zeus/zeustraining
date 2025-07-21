import { HitTestResult } from "../hittest/index.js";

/**
 * Selection Handler Interface
 * This interface defines the contract for selection handlers.
 * It is used to handle selection logic based on hit test results.
 */
export interface SelectionHandler {
    /**
     * Handles pointer down events for selection.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     */
    onPointerDown(hit: HitTestResult): void;

    /**
     * Handles pointer move events for selection.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     */
    onPointerMove?(hit: HitTestResult): void;

    /**
     * Handles pointer up events for selection.
     * @param {HitTestResult} hit - The hit test result from the hit test manager.
     */
    onPointerUp?(hit: HitTestResult): void;
}