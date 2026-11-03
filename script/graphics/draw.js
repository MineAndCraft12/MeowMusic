/** Cotains the rendering context and helper functions for drawing */
// Note to self: Ideally visualizers should only need to call helper functions,
//     and this module can handle actual drawing on its own.

import * as canvas from "../ui/canvas.js";

export { ctx }


// Variables

/**
 * The standard canvas rendering context.
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext();