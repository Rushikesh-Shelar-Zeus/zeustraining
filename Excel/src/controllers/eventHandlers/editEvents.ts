import { Grid } from "../Grid";
import { HitTestManager } from "../hittest/HitTestManager";

/**
 * Manages double-click events on the scroll container to show an edit box for cells.
 * This class listens for double-click events and uses the HitTestManager to determine
 * if a cell was clicked. If a cell is clicked, it triggers the grid to show an edit box for that cell.
 */
export class EditEventsManager {
    /**
     * Constructor for EditEventsManager.
     * @param {HTMLElement} scrollContainer - The container element that holds the grid.
     * @param {Grid} grid - The grid instance that will show the edit box.  
     * @param {HitTestManager} hitTestManager - The hit test manager to determine cell hits.
     */
    constructor(
        private readonly scrollContainer: HTMLElement,
        private readonly grid: Grid,
        private readonly hitTestManager: HitTestManager
    ) {
        this.attachListeners();
    }

    /**
     * Attaches double-click event listeners to the scroll container.
     * When a double-click occurs, it checks if a cell was clicked and shows the edit box for that cell.
     */
    private attachListeners() {
        this.scrollContainer.addEventListener("dblclick", this.handleDoubleClick.bind(this));
    }

    /**
     * Handles double-click events on the scroll container.
     * It calculates the click position relative to the scroll container and uses the hit test manager
     * to determine if a cell was clicked. If a cell is clicked, it shows the edit box for that cell.
     * @param {MouseEvent} event - The mouse event triggered by the double-click.
     */
    private handleDoubleClick(event: MouseEvent) {
        const rect = this.scrollContainer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const hit = this.hitTestManager.hitTest(x, y);

        if (hit && hit.type === "cell") {
            this.grid.showEditBox(hit.row, hit.col);
        }
    }

}