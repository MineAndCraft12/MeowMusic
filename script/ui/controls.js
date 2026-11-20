/** Represents the primary controls row */

import * as dom       from "../util/dom.js";
import * as audio     from "../audio/audio.js";
import * as effects   from "../audio/effects.js";
import * as library   from "../tracks/library.js";
import * as transport from "../tracks/transport.js";
import * as view      from  "./view.js";
import * as config    from  "./config.js";

export {
    toggle,
    updateTrackName,
    updateSeekBar,
    updateVolumeIcon
}


// Variables

/**
 * The main content container.
 * @type {HTMLElement}
 */
const main = dom.get("#main");

/**
 * The DOM Node which hosts the top controls row
 * @type {HTMLElement}
 */
const nodeTop = dom.get("#controls-top");

/**
 * The DOM Node which hosts the bottom controls row
 * @type {HTMLElement}
 */
const nodeBottom = dom.get("#controls-bottom");

/**
 * The DOM Node which hosts the seek range input.
 * If null it hasn't been created yet.
 * @type {HTMLInputElement|null}
 */
let seekBar = null;

/**
 * The DOM Node which hosts the volume range input.
 * If null it hasn't been created yet.
 * @type {HTMLInputElement|null}
 */
let volumeBar = null;

/**
 * The DOM Node which hosts the current track title.
 * If null it hasn't been created yet.
 * @type {HTMLSpanElement|null}
 */
let titleContainer = null;

/**
 * Determines the current volume button icon
 * @type {string}
 */
let currentVolumeIcon = "high";


// Methods

/** Show or hide the controls row */
function toggle() {
    nodeTop.classList.toggle("invisible");
    nodeTop.toggleAttribute("inert");

    nodeBottom.classList.toggle("invisible");
    nodeBottom.toggleAttribute("inert");
}


// Event Handlers

/** Set the view to Visualizer */
function setVisualizer() {
    view.set("view-visualizer");
}

/** Set the view to Library */
function setLibrary() {
    if (library.ready) {
        view.set("view-library");
    } else {
        view.set("view-config");
        config.show("musiclibrary");
    }
}

/** Set the view to Config */
function setConfig() {
    view.set("view-config");
}

/** Sets new text in the track title container */
function updateTrackName(name) {
    titleContainer.textContent = name;
}

/** Updates the background on the seek input range */
function updateSeekBar() {
    let progress = (audio.getTime() / audio.getDuration()) || 0;
    seekBar.value = progress;
    seekBar.style.setProperty("--background-position", progress * 100 + "%");
}

/** Updates the volume button icon and its range input's background */
function updateVolumeIcon() {
    let newVolumeIcon = "high";
    let newVolumePosition = effects.volume * 100;

    if (effects.muted) {
        newVolumeIcon = "mute";
        newVolumePosition = 0;

    } else if (effects.volume < 0.001) {
        newVolumeIcon = "off";

    } else if (effects.volume <= 0.5) {
        newVolumeIcon = "low";
    }

    if (newVolumeIcon !== currentVolumeIcon) {
        main.classList.remove("volume-" + currentVolumeIcon);
        currentVolumeIcon = newVolumeIcon;
        main.classList.add("volume-" + newVolumeIcon);
    }

    volumeBar.style.setProperty("--background-position", `${newVolumePosition}%`)
}

// DOM Manipulation

/**
 * Create a button in the DOM.
 * 
 * @param {string} id - HTML ID for the button.
 * @param {Function} eventListener - EventListener for the click event.
 * @param {string|undefined} float - Optional "left" or "right"
 */
function createButton(parent, id, eventListener, float) {
    // Button floats left or right
    if (float) {
        parent.appendChild(dom.create("button", {
            id: "controls-" + id,
            classList: ["icon-button", "float-" + float],
            eventListeners: {click: eventListener}
        }));

    // Button does not float
    } else {
        parent.appendChild(dom.create("button", {
            id: "controls-" + id,
            classList: ["icon-button"],
            eventListeners: {click: eventListener}
        }));
    }
}

/**
 * Create a button in the DOM.
 * 
 * @param {string} id - HTML ID for the button.
 * @param {Function} eventListener - EventListener for the click event.
 * @param {number} initial - Initial value for the element
 * @param {string|undefined} float - Optional "left" or "right"
 * @returns 
 */
function createSlider(id, eventListener, initial, float) {
    // Button floats left or right
    if (float) {
        return dom.create("input", {
            id: "controls-" + id,
            classList: ["controls-slider", "float-" + float],
            eventListeners: {input: eventListener},
            attributes: {
                type: "range",
                min: 0,
                max: 1,
                step: "any",
                value: initial
            }
        });

    // Button does not float
    } else {
        return dom.create("input", {
            id: "controls-" + id,
            classList: ["controls-slider"],
            eventListeners: {input: eventListener},
            attributes: {
                type: "range",
                min: 0,
                max: 1,
                step: "any",
                value: initial
            }
        });
    }
}


// Build UI

// Top Controls - Left Float
titleContainer = dom.create("span", {
    id: "controls-title",
    textContent: "MeowMusic",
    styles: {
        float: "left"
    }
});
nodeTop.appendChild(titleContainer);

// Bottom Controls - Left Float
createButton(nodeBottom, "prev", transport.prev,          "left");
createButton(nodeBottom, "play", transport.togglePlaying, "left");
createButton(nodeBottom, "next", transport.next,          "left");

createButton(nodeBottom, "mute",   effects.toggleMute,                 "left");
volumeBar = createSlider("volume", effects.setVolume,  effects.volume, "left");
nodeBottom.appendChild(volumeBar);
updateVolumeIcon();

// Bottom Controls - Right Float (displayed in reverse order)
createButton(nodeBottom, "visualizer", setVisualizer,         "right");
createButton(nodeBottom, "library",    setLibrary,            "right");
createButton(nodeBottom, "config",     setConfig,             "right");
createButton(nodeBottom, "fullscreen", view.toggleFullscreen, "right");

// Bottom Controls - Seek Bar
seekBar = createSlider("seek", transport.setTime, 0);
nodeBottom.appendChild(seekBar);
updateSeekBar();