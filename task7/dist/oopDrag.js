"use strict";
class Box {
    constructor(backgroundDiv) {
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.attachEventListeners = () => {
            this.box.addEventListener("pointerdown", this.handlePointerDown);
            this.box.addEventListener("pointerup", this.handlePointerUp);
            this.backgroundDiv.addEventListener("pointermove", this.handlePointerMove);
            window.addEventListener("resize", this.handleResize);
        };
        this.handlePointerDown = (event) => {
            this.isDragging = true;
            const boxDimensions = this.box.getBoundingClientRect();
            this.offsetX = event.clientX - boxDimensions.left;
            this.offsetY = event.clientY - boxDimensions.top;
            this.box.style.cursor = "grabbing";
            this.box.setPointerCapture(event.pointerId);
        };
        this.handlePointerMove = (event) => {
            if (!this.isDragging)
                return;
            const backgroundDimensions = this.backgroundDiv.getBoundingClientRect();
            let posLeft = event.clientX - backgroundDimensions.left - this.offsetX;
            let posTop = event.clientY - backgroundDimensions.top - this.offsetY;
            let maxLeft = backgroundDimensions.width - this.box.offsetWidth;
            let maxTop = backgroundDimensions.height - this.box.offsetHeight;
            posLeft = Math.max(0, Math.min(posLeft, maxLeft));
            posTop = Math.max(0, Math.min(posTop, maxTop));
            this.box.style.left = `${posLeft}px`;
            this.box.style.top = `${posTop}px`;
        };
        this.handlePointerUp = (event) => {
            if (this.isDragging) {
                this.isDragging = false;
            }
            this.box.style.cursor = "grab";
            this.box.releasePointerCapture(event.pointerId);
        };
        this.handleResize = () => {
            if (!this.box || !this.backgroundDiv) {
                console.error("Box or BG not Found");
                return;
            }
            const backgroundDimensions = this.backgroundDiv.getBoundingClientRect();
            let posLeft = parseFloat(this.box.style.left || "0");
            let posTop = parseFloat(this.box.style.top || "0");
            const maxLeft = backgroundDimensions.width - this.box.offsetWidth;
            const maxTop = backgroundDimensions.height - this.box.offsetHeight;
            posLeft = Math.max(0, Math.min(posLeft, maxLeft));
            posTop = Math.max(0, Math.min(posTop, maxTop));
            this.box.style.left = `${posLeft}px`;
            this.box.style.top = `${posTop}px`;
        };
        this.backgroundDiv = backgroundDiv;
        this.box = document.createElement("div");
        this.box.classList.add("box");
        this.box.id = "box";
        this.attachEventListeners();
        this.backgroundDiv.appendChild(this.box);
    }
}
class Background {
    constructor() {
        this.backgroundDiv = document.createElement("div");
        this.backgroundDiv.id = "background-div";
        this.backgroundDiv.classList.add("background-div");
        document.body.appendChild(this.backgroundDiv);
        this.box = new Box(this.backgroundDiv);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new Background();
});
