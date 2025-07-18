import { HitTestResult } from "../hittest/index.js";

export interface SelectionHandler {
    onPointerDown(hit: HitTestResult): void;
}