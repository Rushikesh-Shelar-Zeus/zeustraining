import { Cell } from "./Cell.js";
export class Row {
    constructor(index, columnCount, height = 24) {
        this.index = index;
        this.height = height;
        this.cells = [];
        for (let col = 0; col < columnCount; col++) {
            this.cells.push(new Cell(index, col));
        }
    }
    resize(newHeight) {
        this.height = Math.max(12, newHeight);
    }
    getCell(col) {
        return this.cells[col];
    }
}
