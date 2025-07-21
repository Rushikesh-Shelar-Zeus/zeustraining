export class PointerEventManager {
    constructor(canvas, scrollContainer, selectionManager, hitTestManager) {
        this.canvas = canvas;
        this.scrollContainer = scrollContainer;
        this.selectionManager = selectionManager;
        this.hitTestManager = hitTestManager;
        this.isDragging = false;
        this.lastPointerX = 0;
        this.lastPointerY = 0;
        this.autoScrollFrameId = null;
        this.onPointerDown = (e) => {
            e.preventDefault();
            this.isDragging = true;
            // Get the canvas coordinates from the pointer event
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            //Check for the Hit Test
            const hit = this.hitTestManager.hitTest(x, y);
            // Delegate the hit test result to the selection manager
            if (hit) {
                this.selectionManager.handlePointerDown(hit);
            }
            else {
                console.log("No hit detected");
            }
        };
        this.onPointerMove = (e) => {
            e.preventDefault();
            if (!this.isDragging)
                return;
            this.lastPointerX = e.clientX;
            this.lastPointerY = e.clientY;
            // Get the canvas coordinates from the pointer event
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Check for the Hit Test
            const hit = this.hitTestManager.hitTest(x, y);
            // Delegate the hit test result to the selection manager
            if (hit) {
                this.selectionManager.handlePointerMove(hit);
            }
            else {
                console.log("No hit detected");
            }
            this.startAutoScrollLoop();
        };
        this.onPointerUp = (e) => {
            if (!this.isDragging)
                return;
            this.isDragging = false;
            e.preventDefault();
            const { x, y } = this.getCanvasCoords(e);
            const hit = this.hitTestManager.hitTest(x, y);
            if (hit)
                this.selectionManager.handlePointerUp(hit);
            if (this.autoScrollFrameId !== null) {
                cancelAnimationFrame(this.autoScrollFrameId);
                this.autoScrollFrameId = null;
            }
        };
        this.attachListeners();
    }
    attachListeners() {
        this.scrollContainer.addEventListener("pointerdown", this.onPointerDown);
        this.scrollContainer.addEventListener("pointermove", this.onPointerMove);
        this.scrollContainer.addEventListener("pointerup", this.onPointerUp);
    }
    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    startAutoScrollLoop() {
        if (this.autoScrollFrameId !== null)
            return;
        const scrollSpeed = 20;
        const edgeThreshold = 30;
        const loop = () => {
            if (!this.isDragging) {
                this.autoScrollFrameId = null;
                return;
            }
            const rect = this.scrollContainer.getBoundingClientRect();
            let scrolled = false;
            if (this.lastPointerX - rect.left < edgeThreshold) {
                this.scrollContainer.scrollLeft -= scrollSpeed;
                scrolled = true;
            }
            else if (rect.right - this.lastPointerX < edgeThreshold) {
                this.scrollContainer.scrollLeft += scrollSpeed;
                scrolled = true;
            }
            if (this.lastPointerY - rect.top < edgeThreshold) {
                this.scrollContainer.scrollTop -= scrollSpeed;
                scrolled = true;
            }
            else if (rect.bottom - this.lastPointerY < edgeThreshold) {
                this.scrollContainer.scrollTop += scrollSpeed;
                scrolled = true;
            }
            if (scrolled) {
                const { x, y } = this.getCanvasCoords({
                    clientX: this.lastPointerX,
                    clientY: this.lastPointerY
                });
                const hit = this.hitTestManager.hitTest(x, y);
                if (hit)
                    this.selectionManager.handlePointerMove(hit);
            }
            this.autoScrollFrameId = requestAnimationFrame(loop);
        };
        this.autoScrollFrameId = requestAnimationFrame(loop);
    }
}
