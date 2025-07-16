"use strict";
// Global Variable to Track Dragging State and Offsets
let backgroundDiv;
let box;
let isDragging = false;
let offsetX;
let offsetY;
//Create Background and Box Dynamically
function createElements() {
    backgroundDiv = document.createElement('div');
    backgroundDiv.id = "background-div";
    backgroundDiv.classList.add("background-div");
    box = document.createElement("div");
    box.id = "box";
    box.classList.add("box");
    box.addEventListener("pointerdown", handlePointerDown);
    box.addEventListener("pointerup", handlePointerUp);
    backgroundDiv.appendChild(box);
    backgroundDiv.addEventListener("pointermove", handlePointerMove);
    document.body.appendChild(backgroundDiv);
}
// Load the Background and Box on DOM Load
document.addEventListener("DOMContentLoaded", () => {
    createElements();
    window.addEventListener("resize", handleResize);
});
//Pointer Down event Handler (Start Dragging)
function handlePointerDown(event) {
    isDragging = true;
    const boxDimensions = box.getBoundingClientRect();
    offsetX = event.clientX - boxDimensions.left;
    offsetY = event.clientY - boxDimensions.top;
    box.style.cursor = "grabbing";
    box.setPointerCapture(event.pointerId);
}
// Pointer Move Event Handler (Drag)
function handlePointerMove(event) {
    if (!isDragging)
        return;
    const backgroundDimensions = backgroundDiv.getBoundingClientRect();
    let posLeft = event.clientX - backgroundDimensions.left - offsetX;
    let posTop = event.clientY - backgroundDimensions.top - offsetY;
    let maxLeft = backgroundDimensions.width - box.offsetWidth;
    let maxTop = backgroundDimensions.height - box.offsetHeight;
    posLeft = Math.max(0, Math.min(posLeft, maxLeft));
    posTop = Math.max(0, Math.min(posTop, maxTop));
    box.style.left = `${posLeft}px`;
    box.style.top = `${posTop}px`;
}
// Pointer Up Event Handler (Stop Dragging)
function handlePointerUp(event) {
    if (isDragging) {
        isDragging = false;
    }
    box.style.cursor = "grab";
    box.releasePointerCapture(event.pointerId);
}
// Resize ViewPort Handler
function handleResize() {
    if (!box || !backgroundDiv) {
        console.error("Box or BG not Found");
        return;
    }
    const backgroundDimensions = backgroundDiv.getBoundingClientRect();
    let posLeft = parseFloat(box.style.left || "0");
    let posTop = parseFloat(box.style.top || "0");
    const maxLeft = backgroundDimensions.width - box.offsetWidth;
    const maxTop = backgroundDimensions.height - box.offsetHeight;
    posLeft = Math.max(0, Math.min(posLeft, maxLeft));
    posTop = Math.max(0, Math.min(posTop, maxTop));
    box.style.left = `${posLeft}px`;
    box.style.top = `${posTop}px`;
}
