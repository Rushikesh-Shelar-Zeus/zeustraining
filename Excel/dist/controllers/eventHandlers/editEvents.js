export class EditEventsManager {
    constructor(scrollContainer, grid, hitTestManager) {
        this.scrollContainer = scrollContainer;
        this.grid = grid;
        this.hitTestManager = hitTestManager;
        this.attachListeners();
    }
    attachListeners() {
        this.scrollContainer.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    }
    handleDoubleClick(event) {
        const rect = this.scrollContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const hit = this.hitTestManager.hitTest(x, y);
        if (hit && hit.type === "cell") {
            this.grid.showEditBox(hit.row, hit.col);
        }
    }
}
