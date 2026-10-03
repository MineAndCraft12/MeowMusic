/** represents the audio frequency analyser */

import * as audio from "./audio.js";

export { node, registerNode }

/**
 * The AnalyserNode. If undefined it hasn't been registered yet.
 * @type {AnalyserNode|undefined}
 */
let node;

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
    return node;
}