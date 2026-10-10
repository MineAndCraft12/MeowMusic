/** Creates standardized UI constructs for menus, interfaces, etc. */

import * as util from "../util/util.js";
import * as dom from "./dom.js";

export {
    createParagraph,
    createParagraphContainer,
    createDetails,
    createDirectoryInput
}

/*
    This module does not contain most input fields because they are too varied in implementation.
    In most cases, using this module to create inputs and buttons results in code of similar complexity
        and significantly worse readability compared to simply using dom.create()
    One outlier is the directory input which looks pretty much identical on the DOM no matter how you slice it.
*/

/**
 * Create a basic paragraph node with an optional class list.
 * 
 * @param {string} text - Text for the paragraph node
 * @param {Array.<string>?} classList - An optional array of classNames
 * @returns {HTMLParagraphElement}
 */
function createParagraph(text, classList) {
    return dom.create("p", util.scrubObject({
        text: text,
        classList: classList
    }));
}

/**
 * Creates a paragraph node with an optional class list.
 * 
 * Optionally can be supplied with an array of child nodes.
 * 
 * @param {Array.<string>?} classList - An optional array of classNames
 * @param {Array.<HTMLElement>?} children - An optional array of child nodes
 * @returns 
 */
function createParagraphContainer(classList, children) {
    return dom.create("p", util.scrubObject({
        classList: classList,
        children: children
    }));
}

/**
 * Creates a Details node containing a Summary node, with optional class list.
 * 
 * Can optionally place a child node beside the summary.
 * 
 * @param {*} title - Primary text for the Summary node
 * @param {*} details - Collapsible description text
 * @param {*} classList - Class list for the Details node
 * @param {*} child - Child node for the Summary node
 * @returns 
 */
function createDetails(title, details, classList, child) {
    return dom.create("details", util.scrubObject({
        text: details,
        classList: classList,
        // Summary is prepended because it must come before the text content
        prependChildren: [
            dom.create("summary", util.scrubObject({
                text: title,
                children: util.scrubObject([child]) // TODO: Find a more graceful way to handle this
            }))
        ]
    }));
}

/**
 * Creates a File Input which accepts Directories.
 * 
 * @param {Function} eventListener - Called when onchange event is fired
 * @returns {HTMLInputElement}
 */
function createDirectoryInput(eventListener) {
    return dom.create("input", {
        attributes: {
            "type": "file",
            "webkitdirectory": "true",
            "directory": "true"
        },
        eventListeners: {
            change: eventListener
        }
    });
}