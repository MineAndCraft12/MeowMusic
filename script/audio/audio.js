/** represents the audio system */

import * as analyser from "./analyser.js";
import * as effects from "./effects.js";

export {
    setSrc,
    getPlaying, play, pause,
    getTime, setTime, getDuration
}

/**
 * The actual audio track element.
 * @type {HTMLAudioElement}
 */
let element = new Audio();

/**
 * The AudioContext.
 * @type {AudioContext}
 */
let context = new AudioContext();

/**
 * Routes the output of audio.element through the analyser and effect layers.
 * @type {MediaElementAudioSourceNode}
 */
let track = context.createMediaElementSource(element);

/*
    Connect the audio source to the analyser, effects, and destination.
    We pass the AudioContext to the modules and pass their AudioNodes back here to connect them.
    Otherwise other modules cannot access this module's AudioContext.
*/
track.connect(analyser.registerNode(context))
    .connect(effects.registerDelayNode(context))
    .connect(effects.registerGainNode(context))
    .connect(context.destination);

/**
 * Describes whether audio has ever been played this session.
 * 
 * true: Audio has not been played yet.
 * 
 * false: Audio has been played at least once.
 * @type {boolean}
 */
let firstPlay = true;

/**
 * When a new audio track is loaded, automatically play it, except when this would break popup etiquette.
 */
function canplaythrough() {
    if (!firstPlay) {
        play();
    }
}
element.addEventListener("canplaythrough", canplaythrough);

/**
 * Pauses the audio, replaces the current audio source and loads its data.
 * 
 * @param {string} newSrc - ObjectURL for the desired audio file.
 */
function setSrc(newSrc) {
    element.pause();
    element.src = newSrc;
    element.load();
}

/**
 * Use a variety of heuristics to determine whether the audio is currently playing.
 * 
 * @returns {boolean}
 */
function getPlaying() {
    return ( // Hassan Mahmud on StackOverflow
        element &&
        element.currentTime > 0 &&
        !element.paused &&
        !element.ended &&
        element.readyState >= 2
    );
}

/**
 * Check whether the AudioContext has been suspended and attempts to resume it.
 */
function checkSuspension() {
    if (context.state === "suspended") {
        context.resume();
    }
}

/**
 * Resume the AudioContext and play the audio.
 */
function play() {
    checkSuspension();
    element.play();
    firstPlay = false;
}

/**
 * Suspend the AudioContext and pause the audio.
 */
function pause() {
    context.suspend();
    element.pause();
}

/**
 * Get the current audio timestamp in seconds.
 * 
 * @returns {number}
 */
function getTime() {
    return element.currentTime;
}

/**
 * Set a new audio timestamp in seconds.
 * 
 * @param {number} newTime - New timestamp
 */
function setTime(newTime) {
    element.currentTime = newTime;
}

/**
 * Get the audio duration in seconds.
 * 
 * @returns {number}
 */
function getDuration() {
    return element.duration;
}