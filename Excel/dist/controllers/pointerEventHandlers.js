export function attachPointerEvents(canvas, selectionManager, hitTestManager) {
    canvas.addEventListener("pointerdown", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        console.log(`Pointer down at canvas coordinates: (${x}, ${y})`);
        const hit = hitTestManager.hitTest(x, y);
        console.log("Hit test result:", hit);
        if (hit) {
            selectionManager.handleCellSelection(hit);
        }
        else {
            console.log("No hit detected");
        }
    });
}
