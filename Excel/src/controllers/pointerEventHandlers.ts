import { Grid } from "./Grid.js";
import { HitTestManager } from "./hittest/HitTestManager.js";
import { SelectionManager } from "./selection/SelectionManager.js";

export function attachPointerEvents(
    canvas: HTMLCanvasElement,
    selectionManager: SelectionManager,
    hitTestManager: HitTestManager
) {
    canvas.addEventListener("pointerdown", (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        console.log(`Pointer down at canvas coordinates: (${x}, ${y})`);

        const hit = hitTestManager.hitTest(x, y);
        console.log("Hit test result:", hit);
        
        if (hit) {
            selectionManager.handleCellSelection(hit);
        } else {
            console.log("No hit detected");
        }
    });
}
