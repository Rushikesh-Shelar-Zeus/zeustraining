/**
 * Hit Test Result Type
 * Defines the structure of the result returned by hit test operations.
 * It can either be a cell hit or null if no hit was detected.
 */
export type HitTestResult =
    | {
        type: "cell";
        row: number;
        col: number;
    } | null;

/**
 * Hti Test Handler Interface
 * This interface defines the contract for hit test handlers.
 */
export interface HitTestHandler {
    hitTest(x: number, y: number): HitTestResult | null;
}   