export type HitTestResult =
    | {
        type: "cell";
        row: number;
        col: number;
    }

export interface HitTestHandler {
    hitTest(x: number, y: number): HitTestResult | null;
}   