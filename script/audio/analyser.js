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
 * Range of values outside of usefulRange
 * @type {number}
 */
const trebleRange = bufferLength - usefulRange;

/**
 * Raw data pulled from the AnalyserNode
 * @type {Uint8Array}
 */
const data = new Uint8Array(bufferLength);

/**
 * Filtered data based on data pulled from the AnalyserNode
 * @type {Uint8Array}
 */
const filteredData = new Array(usefulRange);

/**
 * Average of frequencies above usefulRange
 * @type {number}
 */
let trebleData = 0;

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

/**
 * The most recent frame treble was calculated on.
 * @type {number}
 */
let trebleFrame = 0;

/**
 * Raises low values in the treble data bucket.
 * @type {number}
 */
const trebleDataExponent = 1 / 3;

/**
 * Brings value ceiling back to baseline after trebleDataExponent is applied.
 * @type {number}
 */
const trebleDataMultiplier = Math.pow(255, 1 - trebleDataExponent);


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
        filteredData[i] = -127.5 * Math.cos(util.Tau * data[i] / 510) + 127.5;
    }
}

/**
 * Calculates the avarage of frequencies above usefulRange and saves to trebleData.
 * Prioritizes wide sweeps of weak frequencies over sharp peaks of strong frequencies.
 */
function calculateTreble() {
    trebleData = 0;
    for (let i = usefulRange; i < bufferLength; i++) {
        trebleData += Math.pow(data[i], trebleDataExponent) * trebleDataMultiplier;
    }
    trebleData = trebleData / trebleRange;
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
function getData(mode) {
    // Do not pull new data multiple times in the same frame
    if (recentFrame !== visualizer.frameCount) {
        node.getByteFrequencyData(data);
        recentFrame = visualizer.frameCount;
    }

    if (mode === "filter") {
        // Do not filter data that we've already filtered
        if (filteredFrame !== visualizer.frameCount) {
            filterData();
            filteredFrame = visualizer.frameCount;
        }

        return filteredData;
    } else if (mode === "treble") {
        // Do not calculate treble that we've already calculated
        if (trebleFrame !== visualizer.frameCount) {
            calculateTreble();
            trebleFrame = visualizer.frameCount;
        }

        return trebleData;
    } else {
        return data;
    }
}