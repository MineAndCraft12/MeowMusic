/** represents the audio frequency analyser */

import * as audio from "./audio.js";
import * as visualizer from "../graphics/visualizer.js";

export {
    node, registerNode,
    getData, usefulRange
}


// Variables

/**
 * The AnalyserNode. If undefined it hasn't been registered yet.
 * @type {AnalyserNode|undefined}
 */
let node;

const bufferLength = 1024;

const usefulRange = 128;

const data = new Uint8Array(bufferLength);

const filteredData = new Uint8Array(usefulRange);

let recentFrame = 0;

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
    node.fftSize = 2048;
    // Most of my music peaks around this range
    node.maxDecibels = -20;
    // Most of my music looks like random noise below this range
    node.minDecibels = -60;

    requestAnimationFrame(visualizer.frame);
    return node;
}

// This is not final
function filterData() { 
    for (let i = 0; i < usefulRange; i++) {
        // pulled from Sinusoid modifier in AaronOS Music
        // Pulls peaks closer to the top
        // Pulls valleys closer to the bottom
        // Results in greater contrast between data values
        filteredData[i] = -127.5 * Math.cos(2 * Math.PI * data[i] / 510) + 127.5;
    }
}

function getData() {
    if (recentFrame !== visualizer.frameCount) {
        node.getByteFrequencyData(data);
        recentFrame = visualizer.frameCount;
        filterData();
    }

    return filteredData;
}