/** represents audio effects */

import * as audio       from  "./audio.js";
import * as controls    from "../ui/controls.js";
import * as preferences from "../content/preferences.js";

export {
    delay, gain, registerDelayNode, registerGainNode,
    volume, setVolume,
    muted, toggleMute
}


// Variables

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
 * Current volume for the gain node
 * @type {number}
 */
let volume = preferences.load("effects.volume", 1);

/**
 * Determines whether audio should be muted
 * @type {boolean}
 */
let muted = preferences.load("effects.muted", false);


// Registration

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
    // TODO: Make this editable
    // fftSize / likely sample rate / halfway through sample window
    delay.delayTime.value = 2048 / 44100 / 2;
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
    requestAnimationFrame(applyVolume);
    return gain;
}


// Methods

/** Apply the current audio configuration to the gain node */
function applyVolume() {
    let targetVolume;

    if (muted) {
        targetVolume = 0;
    } else {
        // Human volume perception is logarithmic... approximate with square
        targetVolume = volume ** 2;
    }

    controls.updateVolumeIcon();
    
    // We can't just set the gain value instantly because the audio pops from the sudden change.
    // Tons of applications use 15ms, as recommended by "Web Audio: the ugly click and the human ear"
    gain.gain.setTargetAtTime(targetVolume, audio.getTime(), 0.015);
}


// Event Listeners

/**
 * Sets the volume to a new value on the gain effect
 * @param {Event} event - Event on a range input between 0 and 1
 */
function setVolume(event) {
    volume = event.target.value;

    if (muted) {
        toggleMute();
    } else {
        applyVolume();
    }

    preferences.save("effects.volume", volume);
}

/** Toggle mute on the gain effect */
function toggleMute() {
    muted = !muted;
    applyVolume();

    preferences.save("effects.muted", muted);
}