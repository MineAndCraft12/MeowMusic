/** Utilities for mathematical calculations */

export {
    Tau,

    clamp,

    sinusoid,
    average, weightedAverage,
    presenceSensitiveAverage
}


// Mathematical Constants

/**
 * Equal to Pi times 2
 * @type {number}
 */
const Tau = Math.PI * 2;


// Basic Calculations

/**
 * Returns the value, but not lower than min and not higher than max, inclusive.
 * 
 * @param {number} value - The original value
 * @param {number} min - Keep value at or above this
 * @param {number} max - Keep value at or below this
 * @returns {number}
 */
function clamp(value, min, max) {
    return Math.min(Math.max(min, value), max);
}


// Array Calculations

/**
 * Applies a Sinusoid filter to an array of values. Originally from AaronOS Music.
 * 
 * Pulls low values down and high values up, making midranges more exaggerated.
 * 
 * @param {Array.<number>} values - An array of numbers
 * @param {number} max - The maximum value that could appear in values
 * @param {number} start - Array index to start at
 * @param {number} end - Array index to end before
 * @returns {Array.<number>}
 */
function sinusoid(values, max, start, end) {
    let array = new Array(end - start);

    let divisor    = max *  2;
    let multiplier = max / -2;
    let addend     = max /  2;

    for (let value = start; value < end; value++) {
        array[value] = Math.cos(values[value] * Tau / divisor) * multiplier + addend;
    }

    return array;
}

/**
 * Calculates the average value from an array of values.
 * 
 * @param {Array.<number>} values - An array of numbers
 * @returns {number}
 */
function average(values) {
    let avg = 0;

    for (let value = 0; value < values.length; value++) {
        avg += values[value];
    }

    return avg / values.length;
}

/**
 * Calculates the "heaviest" index based on the values of an array
 * 
 * @param {Array.<number>} values - An array of numbers
 * @returns {number}
 */
function weightedAverage(values) {
    let avg = 0;
    let weight = 0;

    for (let value = 0; value < values.length; value++) {
        avg += value * values[value];
        weight += values[value];
    }

    if (weight === 0) {
        return values.length / 2;
    } else {
        return avg / weight;
    }
}

/**
 * Calculates the average value from an array of values, adjusted for sensitivity to nonzero values.
 * 
 * Any nonzero value has a substantial impact. Large values have minimal impact over small values.
 * 
 * @param {Array.<number>} values - An array of numbers
 * @param {number} max - The maximum value that could appear in values
 * @param {number} sensitivity - A fraction `(1 / x)` where `x` increases sensitivity
 * @returns {number}
 */
function presenceSensitiveAverage(values, max, sensitivity) {
    let avg = 0;

    let multiplier = Math.pow(max, 1 - sensitivity);
    
    for (let value = 0; value < values.length; value++) {
        avg += Math.pow(values[value], sensitivity) * multiplier;
    }

    return avg / values.length;
}