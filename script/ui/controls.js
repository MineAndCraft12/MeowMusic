/** Represents the primary controls row */

import * as dom from "../util/dom.js";
import * as view from "./view.js";
import * as library from "../tracks/library.js";
import * as transport from "../tracks/transport.js";

export { toggle }


// Variables

/**
 * The DOM Node which hosts the controls row
 * @type {HTMLElement}
 */
const node = dom.get("#controls");


// Methods

/** Show or hide the controls row */
function toggle() {
    node.classList.toggle("invisible");
    node.toggleAttribute("inert");
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


// DOM Manipulation

/**
 * Create a button in the DOM.
 * 
 * @param {string} id - HTML ID for the button.
 * @param {Function} eventListener - EventListener for the click event.
 * @param {string|undefined} float - Optional "left" or "right"
 */
function createButton(id, eventListener, float) {
    if (float) {
        node.appendChild(dom.create("button", {
            id: "controls-" + id,
            classList: ["float-" + float],
            eventListeners: {click: eventListener}
        }));
    } else {
        node.appendChild(dom.create("button", {
            id: "controls-" + id,
            eventListeners: {click: eventListener}
        }));
    }
    
}


// Build UI

// Left Float
createButton("fullscreen", view.toggleFullscreen, "left");

// Center
createButton("prev",       transport.prev         );
createButton("play", transport.togglePlaying);
createButton("next", transport.next         );

// Right Float (displayed in reverse order)
createButton("visualizer", setVisualizer, "right");
createButton("library",    setLibrary,    "right");
createButton("config",     setConfig,     "right");