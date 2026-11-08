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
 * Calculates common values across multiple bars in a set.
 * 
 * Helper function for `fillBar` and `fillBars`.
 * 
 * @param {[number, number]} position - Starting (x, y) position for the set.
 * @param {[number, number]} dimensions - Width and height of the set.
 * @param {number} foot - Extra length at the beginning of the bar.
 * @param {number} ratio - Ratio of bar width to empty space.
 * @param {number} totalIndices - Total length of the set.
 * @returns {Object} width, space, footHeight, left, top
 */
function calculateBars(position, dimensions, foot, ratio, totalIndices) {
    let width = Math.round(dimensions[0] / totalIndices * ratio);
    let space = Math.round(dimensions[0] / totalIndices * (1 - ratio));
    // Since we round to integers the total width is not precise; offset to account for this.
    let nudge = Math.round(((width + space) * totalIndices - dimensions[0]) / 2);

    return {
        width: width,
        space: space,
        footHeight: Math.round(width * foot),
        left: Math.round(position[0]) - nudge,
        top: Math.round(position[1])
    };
}

/**
 * Draws a single bar in a set.
 * 
 * Helper function for `fillBar` and `fillBars`.
 * 
 * @param {Object} calculated - Common values from `calculateBars`
 * @param {number} heightDimension - Height of the set.
 * @param {number} totalIndices - Total length of the set.
 * @param {number} index - Index of this bar in the set.
 * @param {number} amount - Value of this bar in the set.
 * @param {number|undefined} bobber - An optional bobber on top of the bar.
 */
function drawBar(calculated, heightDimension, totalIndices, index, amount, bobber) {
    let offset = index * (calculated.width + calculated.space);
    let height = Math.round(amount / 255 * heightDimension);

    if (bobber != null) {
        let bobberTop = Math.round(bobber / 255 * heightDimension);

        // Draw the bobber
        ctx.fillStyle = visualizer.theme.mix(bobber, index / (totalIndices - 1));
        ctx.fillRect(
            calculated.left + offset,
            calculated.top + bobberTop,
            calculated.width,
            calculated.footHeight
        );

        // Draw the bar (minus foot because bobber is the foot)
        ctx.fillStyle = visualizer.theme.mix(amount, index / (totalIndices - 1));
        ctx.fillRect(
            calculated.left + offset,
            calculated.top,
            calculated.width,
            height
        );
    } else {
        // Draw the bar
        ctx.fillStyle = visualizer.theme.mix(amount, index / (totalIndices - 1));
        ctx.fillRect(
            calculated.left + offset,
            calculated.top,
            calculated.width,
            calculated.footHeight + height
        );
    }
}

/**
 * Draws one vertical bar with automatic color as if it were part of a `draw.fillBars` set.
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
 * @param {number|undefined} bobber - An optional bobber on top of the bar.
 */
function fillBar(position, dimensions, foot, ratio, totalIndices, index, amount, bobber) {
    drawBar(
        calculateBars(position, dimensions, foot, ratio, totalIndices),
        dimensions[1], totalIndices, index, amount, bobber
    );
}

/**
 * Draws a full set of vertical bars with automatic color. Maximum data value is 255.
 * 
 * Always aligns to integer positions. Negative dimensions and foot are permitted.
 * 
 * @param {[number, number]} position - Starting (x, y) position for the set.
 * @param {[number, number]} dimensions - Width and height of the set.
 * @param {number} foot - Extra length at the beginning of each bar.
 * @param {number} ratio - Ratio of bar width to empty space.
 * @param {Array.<number>} values - A set of values to render into bars.
 */
function fillBars(position, dimensions, foot, ratio, values, bobbers) {
    let totalIndices = values.length;
    let calculated = calculateBars(position, dimensions, foot, ratio, totalIndices);
    let useBobbers = (bobbers != null);

    if (useBobbers) {
        for (var index = 0; index < totalIndices; index++) {
            drawBar(calculated, dimensions[1], totalIndices, index, values[index], bobbers[index]);
        }
    } else {
        for (var index = 0; index < totalIndices; index++) {
            drawBar(calculated, dimensions[1], totalIndices, index, values[index]);
        }
    }
}