/** Represents the visualizer's virtual screen and presentation */

import * as dom from "../ui/dom.js";

export { getContext, resize }


// Variables

/**
 * The parent node above the canvas
 * @type {HTMLElement}
 */
const container = dom.get("#visualizer");

/**
 * The canvas itself
 * @type {HTMLCanvasElement}
 */
const node = dom.get("#canvas");


// Getters

/**
 * Gets the 2D canvas rendering context with alpha disabled.
 * 
 * @returns {CanvasRenderingContext2d}
 */
function getContext() {
    return node.getContext("2d", {alpha: "false"});
}


// Event Handlers

/**
 * Resize the canvas to fit the current viewport.
 * 
 * Clears the contents of the canvas.
 */
function resize() {
    node.setAttribute("width", container.offsetWidth);
    node.setAttribute("height", container.offsetHeight);
    node.style.width = container.offsetWidth + "px";
    node.style.height = container.offsetHeight + "px";
}
window.addEventListener("resize", resize);
resize();