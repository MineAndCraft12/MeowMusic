/** Cotains the rendering context and helper functions for drawing */
// Note to self: Ideally visualizers should only need to call helper functions,
//     and this module can handle actual drawing on its own.

import * as canvas from "../ui/canvas.js";

export { ctx, registerRenderingContext }


// Variables

/**
 * The standard canvas rendering context.
 * If undefined it hasn't been registered yet.
 * @type {CanvasRenderingContext2D|undefined}
 */
let ctx;


// Registration

/**
 * Sets up the rendering context.
 * This is called by visualizer.js
 */
function registerRenderingContext() {
    ctx = canvas.getContext();
}