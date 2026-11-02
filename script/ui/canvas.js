/** Represents the visualizer's virtual screen and presentation */

import * as dom from "../util/dom.js";

export { getContext, width, height, resize }


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

let width = 0;

let height = 0;


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
    width = container.offsetWidth
    height = container.offsetHeight;
    node.setAttribute("width", width);
    node.setAttribute("height", height);
    node.style.width = width + "px";
    node.style.height = height + "px";
}
window.addEventListener("resize", resize);
resize();