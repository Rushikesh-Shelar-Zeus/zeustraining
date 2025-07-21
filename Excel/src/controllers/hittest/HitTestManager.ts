import { HitTestHandler, HitTestResult } from "./index.js";


export class HitTestManager {
    private handlers: HitTestHandler[];

    constructor(handlers: HitTestHandler[]) {
        this.handlers = handlers;
    }

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