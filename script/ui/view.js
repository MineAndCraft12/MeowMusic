/** Represents the view modes of the primary content */

import * as dom from "./dom.js";
import * as error from "../util/error.js";
import * as canvas from "../graphics/canvas.js";

export { options, get, set }


// Variables

/**
 * The DOM node which hosts view modes.
 * @type {HTMLElement}
 */
const node = dom.get("#main");

/** List of all valid view mode options. */
const options = ["view-visualizer", "view-library", "view-config"];


// Methods

/**
 * Gets the current view mode from the DOM.
 * 
 * @returns {string} The current view mode.
 */
function get() {
    let classes = node.classList;
    for (let i = 0; i < classes.length; i++) {
        if (classes[i].indexOf("view-") === 0) {
            return classes[i];
        }
    }
};

/**
 * Changes the view mode class on the DOM node.
 * 
 * @param {string} mode - See view.options for list of acceptable view modes
 */
function set(mode) {
    // Error handling
    if (typeof mode !== "string") {
        throw error.type("view.set", "mode", "string", typeof mode);
    }
    if (options.indexOf(mode) === -1){
        throw error.range("view.set", "mode", `expects a valid mode (see 'ui/view.options'), instead got '${mode}'`);
    }

    node.classList.remove(get());
    node.classList.add(mode);
    canvas.resize();
}