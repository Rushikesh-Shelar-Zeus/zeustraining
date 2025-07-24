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
    } |
    {
        type: "row";
        row: number;
    } |
    {
        type: "col";
        col: number;
    } |
    {
        type: "all";
    } | null;

/**
 * Hit Test Handler Interface
 * This interface defines the contract for hit test handlers.
 */
export interface HitTestHandler {
    /**
     * Handles pointer down events for hit testing.
     * @param {number} x - The x-coordinate of the pointer.
     * @param {number} y - The y-coordinate of the pointer.
     * @return {HitTestResult | null} - The result of the hit test, which can be a cell hit or null.
     */
    hitTest(x: number, y: number): HitTestResult | null;
}   