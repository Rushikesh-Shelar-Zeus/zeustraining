export class HitTestManager {
    constructor(handlers) {
        this.handlers = handlers;
    }
    hitTest(x, y) {
        for (const handler of this.handlers) {
            const result = handler.hitTest(x, y);
            if (result) {
                return result;
            }
        }
        return null; // No hit test result found
    }
}
