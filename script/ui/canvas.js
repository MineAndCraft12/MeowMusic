/** Represents the visualizer's virtual screen and presentation */

import * as dom from "../util/dom.js";
import * as controls from "./controls.js";
import * as visualizer from "../graphics/visualizer.js";

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

/**
 * Width of the drawing area.
 * @type {number}
 */
let width = 0;

/**
 * Height of the drawing area.
 * @type {number}
 */
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
    width = container.offsetWidth * devicePixelRatio;
    height = container.offsetHeight * devicePixelRatio;
    node.setAttribute("width", width);
    node.setAttribute("height", height);
    node.style.width = container.offsetWidth + "px";
    node.style.height = container.offsetHeight + "px";

    if (visualizer.frameCount > 0) {
        visualizer.setupContent();
    }
}
window.addEventListener("resize", resize);
resize();


// Actions

container.addEventListener("click", controls.toggle);