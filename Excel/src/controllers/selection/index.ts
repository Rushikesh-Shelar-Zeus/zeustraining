import { HitTestResult } from "../hittest/index.js";

/**
 * Selection Handler Interface
 * This interface defines the contract for selection handlers.
 * It is used to handle selection logic based on hit test results.
 */
export interface SelectionHandler {
    onPointerDown(hit: HitTestResult): void;
}