import { DEFAULT_ROW_HEIGHT, DEFAULT_COL_WIDTH, TOTAL_ROWS, TOTAL_COLS } from '../constants.js';
export class ScrollManager {
    constructor(canvas) {
        this.canvas = canvas;
    }
    getScrollOffset() {
        const scrollLeft = this.canvas.parentElement.scrollLeft;
        const scrollTop = this.canvas.parentElement.scrollTop;
        return { scrollLeft, scrollTop };
    }
    getVisibleRange() {
        const { scrollLeft, scrollTop } = this.getScrollOffset();
        const clientWidth = this.canvas.parentElement.clientWidth;
        const clientHeight = this.canvas.parentElement.clientHeight;
        const startCol = Math.floor(scrollLeft / DEFAULT_COL_WIDTH);
        const endCol = Math.min(TOTAL_COLS, Math.ceil((scrollLeft + clientWidth) / DEFAULT_COL_WIDTH));
        const startRow = Math.floor(scrollTop / DEFAULT_ROW_HEIGHT);
        const endRow = Math.min(TOTAL_ROWS, Math.ceil((scrollTop + clientHeight) / DEFAULT_ROW_HEIGHT));
        return { startRow, endRow, startCol, endCol };
    }
}
