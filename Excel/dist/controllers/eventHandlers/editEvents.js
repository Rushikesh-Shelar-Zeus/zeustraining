export class EditEventsManager {
    constructor(canvas, grid, hitTestManager) {
        this.canvas = canvas;
        this.grid = grid;
        this.hitTestManager = hitTestManager;
        this.attachListeners();
    }
    attachListeners() {
        this.canvas.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    }
    handleDoubleClick(event) {
        console.log("Double-click event triggered!");
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log("Double Click at:", x, y);
        const hit = this.hitTestManager.hitTest(x, y);
        console.log("Hit test result:", hit);
        if (hit && hit.type === "cell") {
            console.log(`Showing edit box for cell (${hit.row}, ${hit.col})`);
            this.grid.showEditBox(hit.row, hit.col);
        }
        else {
            console.log("Double-click not on a cell or no hit detected");
        }
    }
}
