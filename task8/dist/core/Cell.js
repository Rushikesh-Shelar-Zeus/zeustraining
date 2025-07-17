export class Cell {
    constructor(row, col, value = '') {
        this.editing = false;
        this.row = row;
        this.col = col;
        this.value = value;
    }
}
