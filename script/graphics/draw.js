/** Cotains the rendering context and helper functions for drawing */
// Note to self: Ideally visualizers should only need to call helper functions,
//     and this module can handle actual drawing on its own.

import * as canvas from "../ui/canvas.js";
import * as visualizer from "./visualizer.js";

export {
    ctx, registerRenderingContext,
    clear, setStroke, setFill,
    fillBar, fillBars
}


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


// Interaction

/** Erase the canvas. */
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Sets the stroke color.
 * @param {string} newColor - A valid CSS color
 */
function setStroke(newColor) {
    ctx.strokeStyle = newColor;
}

/**
 * Sets the fill color.
 * @param {string} newColor - A valid CSS color
 */
function setFill(newColor) {
    ctx.fillStyle = newColor;
}


// Tools

/**
 * Draws one vertical bar as if it were part of a hypothetical `draw.fillBars` set.
 * Maximum data value is 255.
 * 
 * Always aligns to integer positions. Negative dimensions and foot are permitted.
 * 
 * @param {[number, number]} position - Starting (x, y) position for the set.
 * @param {[number, number]} dimensions - Width and height of the set.
 * @param {number} foot - Extra length at the beginning of the bar.
 * @param {number} ratio - Ratio of bar width to empty space.
 * @param {number} totalIndices - Total length of the set.
 * @param {number} index - Index of this bar in the set.
 * @param {number} amount - Value of this bar in the set.
 */
function fillBar(position, dimensions, foot, ratio, totalIndices, index, amount) {
    // Ratio between bar width and empty space
    let width = Math.round(dimensions[0] / totalIndices * ratio);
    let space = Math.round(dimensions[0] / totalIndices * (1 - ratio));
    // Since we round to integers the width is not precise; offset to account for this.
    let nudge = Math.round(((width + space) * totalIndices - dimensions[0]) / 2);
    // Added bar length
    let footHeight = Math.round(width * foot);

    ctx.fillRect(
        Math.round(position[0]) + index * (width + space) - nudge,
        Math.round(position[1]),
        width,
        Math.round(amount / 255 * dimensions[1]) + footHeight
    );
}

/**
 * Draws a full set of vertical bars for a dataset. Maximum data value is 255.
 * 
 * Always aligns to integer positions. Negative dimensions and foot are permitted.
 * 
 * @param {[number, number]} position - Starting (x, y) position for the set.
 * @param {[number, number]} dimensions - Width and height of the set.
 * @param {number} foot - Extra length at the beginning of each bar.
 * @param {number} ratio - Ratio of bar width to empty space.
 * @param {Array.<number>} values - A set of values to render into bars.
 */
function fillBars(position, dimensions, foot, ratio, values) {
    // Ratio between bar width and empty space
    let totalIndices = values.length;
    let width = Math.round(dimensions[0] / totalIndices * ratio);
    let space = Math.round(dimensions[0] / totalIndices * (1 - ratio));
    // Since we round to integers the width is not precise; offset to account for this.
    let nudge = Math.round(((width + space) * totalIndices - dimensions[0]) / 2);
    // Added bar length
    let footHeight = Math.round(width * foot);

    for (var index = 0; index < values.length; index++) {
        ctx.fillStyle = visualizer.theme.mix(values[index], index / (totalIndices - 1));
        ctx.fillRect(
            Math.round(position[0]) + index * (width + space) - nudge,
            Math.round(position[1]),
            width,
            Math.round(values[index] / 255 * dimensions[1] + footHeight)
        );
    }
}