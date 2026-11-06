/** represents the audio frequency analyser */

import * as util from "../util/util.js";
import * as visualizer from "../graphics/visualizer.js";

export {
    node, registerNode,
    getData, bufferLength, usefulRange
}


// Variables

/**
 * The AnalyserNode. If undefined it hasn't been registered yet.
 * @type {AnalyserNode|undefined}
 */
let node;

/**
 * The total actual size of the analyser.getData() array
 * @type {number}
 */
const bufferLength = 1024;

/**
 * Based on my music, most frequencies useful to the visualizer are below this index
 * @type {number}
 */
const usefulRange = bufferLength / 8;

/**
 * Raw data pulled from the AnalyserNode
 * @type {Uint8Array}
 */
const data = new Uint8Array(bufferLength);

/**
 * Filtered data based on data pulled from the AnalyserNode
 * @type {Uint8Array}
 */
const filteredData = new Uint8Array(usefulRange);

/**
 * The most recent frame data was pulled on.
 * @type {number}
 */
let recentFrame = 0;

/**
 * The most recent frame data was filtered on.
 * @type {number}
 */
let filteredFrame = 0;


// Registration

/**
 * Registers a new AnalyserNode and returns it for connection to other nodes.
 * 
 * You cannot use the analyser module until the audio module calls this function.
 * 
 * @param {AudioContext} context - The active AudioContext
 * @returns {AnalyserNode}
 */
function registerNode(context) {
    node = context.createAnalyser();

    // This gives us about 64 or 128 useful values
    node.fftSize = bufferLength * 2;
    // Most of my music peaks around this range
    node.maxDecibels = -20;
    // Most of my music looks like random noise below this range
    node.minDecibels = -60;

    // Launch the visualizer
    requestAnimationFrame(visualizer.setup);

    return node;
}


// Methods

/** Runs the usefulRange of data through a filter and saves to filteredData */
function filterData() { 
    for (let i = 0; i < usefulRange; i++) {
        // Originally from Sinusoid modifier in AaronOS Music
        // Pulls peaks closer to the top
        // Pulls valleys closer to the bottom
        // Results in greater contrast between data values
        // Data value ceiling is 255; 255 * 2 = 510; 255 / 2 = 127.5
        filteredData[i] = -127.5 * Math.cos(util.Tau * data[i] / 510) + 127.5;
    }
}

/**
 * Get data from the AnalyserNode.
 * 
 * If unfiltered, length will be analyser.bufferLength
 * 
 * If filtered, length will be analyser.usefulRange
 * 
 * @param {boolean} filtered - Whether to apply a Sinusoid filter to the data.
 * @returns {Uint8Array}
 */
function getData(filtered) {
    // Do not pull new data multiple times in the same frame
    if (recentFrame !== visualizer.frameCount) {
        node.getByteFrequencyData(data);
        recentFrame = visualizer.frameCount;
    }

    if (filtered) {
        // Do not filter data that we've already filtered
        if (filteredFrame !== visualizer.frameCount) {
            filterData();
            filteredFrame = visualizer.frameCount;
        }

        return filteredData;
    } else {
        return data;
    }
}