/** Contains utils to help with colors */

import * as error from "../util/error.js";
import * as analyser from "../audio/analyser.js";
import * as visualizer from "./visualizer.js";

export {
    getValidColorspaces, getColorspace,
    create, parse,
    gradient
}


// Variables

/**
 * Represents each colorspace. Eventually this will facilitate a 2D color editor.
 * 
 * graphHint represents the best plotting of values in a 2D color-picking interface:
 * - x, y for a square graph's axes
 * - z modifies the square graph
 * - a modifies the alpha
 * 
 * To get valueDef I used https://apps.colorjs.io/picker/oklch
 * Set color to sRGB 1, 0, 0
 * Switch color to desired colorspace
 * Record values in textbox above "OUTPUT"
 */
const colorspaces = {
    rgb: {
        name: "sRGB",
        valueNames: ["Red", "Green", "Blue", "A"],
        valueMin: [  0,   0,   0, 0],
        valueMax: [255, 255, 255, 1],
        valueDef: [255,   0,   0, 1] // sRGB Red
    },
    hsl: { // Should this be the default...? But how does the color mix?
        name: "sRGB HSL",
        valueNames: ["Hue", "Saturation", "Lightness", "Alpha"],
        valueMin: [  0,   0,   0, 0],
        valueMax: [360, 100, 100, 1],
        valueDef: [  0, 100,  50, 1], // sRGB Red
        graphHint: {x: 0, y: 1, z: 2, a: 3}
    },
    hwb: {
        name: "sRGB HWB",
        valueNames: ["Hue", "Whiteness", "Blackness", "Alpha"],
        valueMin: [  0,   0,   0, 0],
        valueMax: [360, 100, 100, 1],
        valueDef: [  0,   0,   0, 1], // sRGB Red
        graphHint: {x: 0, y: 2, z: 1, a: 3}
    },
    lab: {
        name: "CIELab",
        valueNames: ["Lightness", "a", "b", "Alpha"],
        valueMin: [  0, -125, -125, 0],
        valueMax: [100,  125,  125, 1],
        valueDef: [54.291, 80.805, 69.891, 1], // sRGB Red
        graphHint: {x: 1, y: 2, z: 0, a: 3}
    },
    lch: {
        name: "CIELab LCH",
        valueNames: ["Lightness", "Chroma", "Hue", "Alpha"],
        valueMin: [  0,       0,      0,     0],
        valueMax: [100,     150,    360,     1],
        valueDef: [ 54.291, 106.84,  40.858, 1], // sRGB Red
        graphHint: {x: 2, y: 1, z: 0, a: 3}
    },
    oklab: {
        name: "Oklab",
        valueNames: ["Lightness", "a", "b", "Alpha"],
        valueMin: [0,       -0.4,     -0.4,     1],
        valueMax: [1,        0.4,      0.4,     1],
        valueDef: [0.62796,  0.22486,  0.12585, 1], // sRGB Red
        graphHint: {x: 1, y: 2, z: 0, a: 3}
    },
    oklch: { // This color mixes great... but how user-friendly?
        name: "Oklab LCH",
        valueNames: ["Lightness", "Chroma", "Hue", "Alpha"],
        valueMin: [0,       0,         0,     0],
        valueMax: [1,       0.4,     360,     1],
        valueDef: [0.62796, 0.25768,  29.234, 1], // sRGB Red
        graphHint: {x: 2, y: 1, z: 0, a: 3}
    },
}


// Getters

/**
 * Get an array of currently supported colorspaces for the promptColor() function.
 * 
 * @returns {Array.<string>}
 */
function getValidColorspaces() {
    let list = [];
    for (var item in colorspaces) {
        list.push(item);
    }
    return list;
}

/**
 * Get information about a colorspace. Eventually this will facilitate a 2D color editor.
 * 
 * @example
 * let info = getColorspace("hsl");
 * info = { // Returns:
 *     name: "sRB HSL",
 *     valueNames: ["Hue", "Saturation", "Lightness", "Alpha"],
 *     valueMin: [  0,   0,   0, 0], // The minimum value of each property of this colorspace
 *     valueMax: [360, 100, 100, 1], // The maximum value of each property of this colorspace
 *     valueDef: [  0, 100,  50, 1], // A default value for a graphing interface - typically RGB Red
 *     graphHint: {x: 0, y: 1, z: 2, a: 3}
 *     // If the colorspace were to be plotted on a 2D graph (i.e. for user input),
 *     // graphHint suggests value indices as 'x' and 'y' axes for the graph.
 *     // The 'z' axis should modify the graph overall.
 *     // Finally, 'a' points to the alpha field.
 *     // Ideally, Hue and Chroma are along the axes and Lightness is a slider.
 *     // If graphHint is missing, each value should be a slider.
 * }
 * 
 * @param {string} name - The name of a colorspace
 * @returns {Object} A colorspace's information
 */
function getColorspace(name) {
    if (Object.hasOwn(colorspaces, name)) {
        return colorspaces[name];
    } else {
        throw error.range("color.getColorspace", "name", `must be a valid colorspace (see color.getValidColorspaces), instead got ${name}`);
    }
}


// Utilities

/*
    Regarding color.create()...
    I unit-tested many different methods here and found this to be the fastest by 2x over the next fastest option.

    - Fastest when 'values' is passed as an array, NOT as individual parameters
        (Is the compiler caching the array and somehow optimizing repeated fetches??)
    - Fastest when 'colorspace' is passed individually, NOT as a member of 'values'
        (Is the compiler somehow optimizing the array if it only contains numbers??)
    - Fastest when using + operator, NOT backtick literals or especially array join
        (Seems the brute force is just fastest??)
    - No discernable difference compared to using += on a temp variable
        (Perhaps they both compile to the same code)

    Tested via https://jsperf.app/ with Chrome 145.0.0 on Steam Deck.
*/

/**
 * Constructs a CSS color from a set of values.
 * 
 * @example
 * color.create("oklch", [0.4, 0.4, 0, 1]);
 * // => "oklch(0.4 0.4 0 / 1)" (white)
 * 
 * @param {string} colorspace - A valid CSS colorspace.
 * @param {[number,number,number,number]} values - A set of four color values; three parameters and alpha.
 * @returns {string} - A constructed CSS color.
 */
function create(colorspace, values) {
    return colorspace + "(" +
        values[0] + " " +
        values[1] + " " +
        values[2] + " / " +
        values[3] + ")";
}

/**
 * Parses a set of values from a CSS color.
 * 
 * @example
 * color.parse("rgba(4, 3, 2, 1)")
 * // Returns:
 * {
 *     colorspace: "rgba",
 *     values: [4, 3, 2, 1]
 * }
 * 
 * @returns {Object}
 */
function parse(string) {
    let split = string.split(",");
    return {
        colorspace: string.substring(0, string.indexOf("(") - 1),
        values: [
            Math.parseFloat(split[0].substring(split[0].indexOf("(") + 1)),
            Math.parseFloat(split[1]),
            Math.parseFloat(split[2]),
            Math.parseFloat(split[3].substring(0, split[3].indexOf(")") - 1))
        ]
    };
}

/**
 * Calculates a value from a given point in a gradient with any number of stops.
 * 
 * A gradient is an array of arrays representing color stops.
 * 
 * The first index of the sub-array is the stop position. The second index is the stop value.
 * 
 * 
 * @example
 * color.gradient(
 *     [[0, 0], [255, 10]],
 *     127
 * ); // => 5
 * 
 * 
 * @param {Array.<[number,number]>} map - A gradient map as described above.
 * @param {number} amount - How far into the gradient is your value?
 * @returns {number} The value at your amount on the gradient
 */
function gradient(map, amount) {
    // for each stop on the map...
    for (let pointer = 0; pointer < map.length; pointer++) {

        // if the stop is equal to the amount, we're done.
        if (map[pointer][0] === amount) {
            return map[pointer][1];

        // if the stop is lower than the amount...
        } else if (map[pointer][0] < amount) {
            // if this is the last stop, we're done.
            if (pointer === map.length - 1) {
                return map[pointer][1];
            }
            // otherwise, loop to the next stop

        // if the stop is higher than the amount...
        } else {
            // if this is the first stop, we're done.
            if (pointer === 0) {
                return map[pointer][1];
            // otherwise, we must calculate the gradient...
            } else {
                // Grab our stop points.
                let stopA = map[pointer - 1];
                let stopB = map[pointer];
                // How far between A and B are we?
                let weight = (  amount - stopA[0]) /
                             (stopB[0] - stopA[0]);
                // Weigh the stops based on how close we are to them.
                return stopA[1] * (1 - weight) +
                       stopB[1] *      weight;
            }
        }
    }

    // If by some crazy circumstances the loop failed, I probably earned this.
    console.warn({map, amount});
    throw error.custom("color.gradient", "That gradient map is leaking colors! Failed to calculate the gradient.");
}