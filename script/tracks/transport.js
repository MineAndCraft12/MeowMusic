/** represents the loaded track and its controls */

import * as library from "./library.js";
import * as audio from "../audio/audio.js";

export {
    currentTrack,
    loadTrack, reset,
    getPlaying, togglePlaying,
    play, pause,
    prev, next,
    getTime, setTime
}

/**
 * Library playlist index of the currently playing track.
 * @type {number}
 */
let currentTrack = 0;

/**
 * Loads the selected track into the audio player and wraps around the selector
 * if the index is out of the playlist's bounds.
 * 
 * @param {number} selected - Library playlist index of a track to play.
 */
function loadTrack(selected){
    if (library.ready) {
        if (selected >= library.playlist.length) {
            selected = 0
        } else if (selected < 0) {
            selected = library.playlist.length - 1;
        }
        audio.setSrc(library.trackInfoFromPlaylist(selected).src);
        currentTrack = selected;
    }
}

/** Unloads the current audio track. */
function unload(){
    audio.setSrc("");
}

/** Unloads the current audio track and sets the playlist pointer to 0. */
function reset(){
    unload();
    currentTrack = 0;
}

/**
 * Determine whether the audio track is currently playing.
 * 
 * Identical to audio.getPlaying()
 * 
 * @returns {boolean}
 */
function getPlaying(){
    return audio.getPlaying();
}

/**
 * Plays audio if the audio is paused; pauses audio if the audio is playing.
 * 
 * Only plays if the playlist is ready to play, and also returns the new target state.
 * 
 * @returns {boolean}
 */
function togglePlaying() {
    var currState = audio.getPlaying();
    
    if (currState) {
        audio.pause();
        return false;
    } else {
        if (library.ready) {
            audio.play();
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Plays the audio, if the playlist is ready to play.
 */
function play() {
    if (library.ready) {
        audio.play();
    }
}

/**
 * Pauses the audio.
 * 
 * Identical to audio.pause()
 */
function pause() {
    audio.pause();
}

/**
 * If the current timestamp is less than 2 seconds, switches to the previous track and returns true.
 * 
 * Otherwise, sets timestamp to the beginning of the current track and returns false.
 * 
 * @returns {boolean}
 */
function prev() {
    if (audio.getTime() > 2){
        audio.setTime(0);
        return false;
    } else {
        loadTrack(currentTrack - 1);
        return true;
    }
}

/**
 * Switches to the next track.
 */
function next() {
    loadTrack(currentTrack + 1);
}

/**
 * Get the current audio time as a decimal percentage of its duration.
 * 
 * If you need a timestamp in seconds, use audio.getTime() instead.
 * 
 * @returns {number}
 */
function getTime() {
    return audio.getTime() / audio.getDuration();
}

/**
 * Skips to a time at a certain percentage of the audio track's duration.
 * 
 * If you need to use a timestamp in seconds, use audio.setTime() instead.
 * 
 * @example
 * transport.setTime(0.0) // Beginning of the track
 * transport.setTime(0.5) // Halfway through the track
 * transport.setTime(1.0) // End of the track
 * 
 *     audio.setTime(1.0) // One second into the track
 * 
 * @param {number} newTime - Decimal value between 0 and 1
 */
function setTime(newTime) {
    audio.setTime(audio.getDuration() * newTime);
}