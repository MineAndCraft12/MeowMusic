/** represents audio effects */

import * as audio from "./audio.js";

export { registerDelayNode, registerGainNode }

/**
 * The DelayNode. If undefined it hasn't been registered yet.
 * @type {DelayNode|undefined}
 */
let delay;

/**
 * The GainNode. If undefined it hasn't been registered yet.
 * @type {GainNode|undefined}
 */
let gain;

/**
 * Registers a new DelayNode and returns it for connection to other nodes.
 * 
 * You cannot use the Delay effect until the audio module calls this function.
 * 
 * @param {AudioContext} context - The active AudioContext
 * @returns {DelayNode}
 */
function registerDelayNode(context) {
    delay = context.createDelay();
    return delay;
}

/**
 * Registers a new GainNode and returns it for connection to other nodes.
 * 
 * You cannot use the Gain effect until the audio module calls this function.
 * 
 * @param {AudioContext} context - The active AudioContext
 * @returns {GainNode}
 */
function registerGainNode(context) {
    gain = context.createGain();
    return gain;
}