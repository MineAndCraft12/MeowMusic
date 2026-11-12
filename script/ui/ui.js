/** Creates standardized UI constructs for menus, interfaces, etc. */

import * as util from "../util/util.js";
import * as dom from "../util/dom.js";

export {
    createParagraph,
    createParagraphContainer,
    createAppLogo,
    createDetails,
    createFieldset,
    createLabel,
    createCheckboxInput,
    createRadioInput,
    createDirectoryInput
}

/*
    This module does not contain button input fields because they are too varied in implementation.
    In most cases, using this module to create buttons results in code of similar complexity
        and significantly worse readability compared to simply using dom.create()
*/


// Content UI

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
 * Create a label node connected to an input's ID.
 * 
 * @param {string} title - Text for the label node
 * @param {string} id - ID of the input element this label belongs to
 * @returns {HTMLLabelElement}
 */
function createLabel(title, id) {
    return dom.create("label", {
        text: title,
        attributes: {
            for: "input-" + id
        }
    });
}

/**
 * Returns the app logo styled like the interface buttons
 * 
 * @returns {HTMLButtonElement}
 */
function createAppLogo() {
    return dom.create("button", {
        classList: ["icon-button", "header-icon", "app-logo"]
    });
}


// Container UI

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
 * @param {string} title - Primary text for the Summary node
 * @param {string} details - Collapsible description text
 * @param {Array.<string>} classList - Class list for the Details node
 * @param {HTMLElement} child - Child node for the Summary node
 * @param {boolean} open - Whether the details element spawns open
 * @returns 
 */
function createDetails(title, details, classList, child, open) {
    return dom.create("details", util.scrubObject({
        text: details,
        classList: classList,
        attributes: util.scrubObject({open: open}), // TODO: Find a more graceful way to handle this
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
 * Creates a Fieldset node with optional class list containing a legend and specified children.
 * 
 * @param {*} title - Text for the fieldset's legend
 * @param {*} classList - Class list for the Fieldset node
 * @param {*} children - Children nodes for the Fieldset node
 * @returns {HTMLFieldSetElement}
 */
function createFieldset(title, classList, children) {
    return dom.create("fieldset", {
        classList: classList,
        prependChildren: [
            dom.create("legend", {
                text: title
            })
        ],
        children: children
    });
}


// Input UI

/**
 * Creates a checked or unchecked Checkbox Input node with a change event listener.
 * 
 * @param {string} id - An ID for the element, appended to the default input ID.
 * @param {boolean} checked - Whether the node spawns checked.
 * @param {Function} eventListener - Event listener for the change event.
 * @returns {HtmlInputElement}
 */
function createCheckboxInput(id, checked, eventListener) {
    return dom.create("input", {
        id: "input-" + id,
        attributes: util.scrubObject({
            type: "checkbox",
            name: id,
            checked: (checked || null)
        }),
        eventListeners: {
            change: eventListener
        }
    });
}

/**
 * Creates a checked or unchecked Radio Input node with a change event listener.
 * 
 * @param {string} id - An ID for the element, appended to the default input ID.
 * @param {boolean} checked - Whether the node spawns checked.
 * @param {string} group - A name for the radio group
 * @param {Function} eventListener - Event listener for the change event.
 * @returns {HTMLInputElement}
 */
function createRadioInput(id, checked, group, eventListener) {
    return dom.create("input", {
        id: "input-" + id,
        attributes: util.scrubObject({
            type: "radio",
            name: group,
            checked: (checked || null)
        }),
        eventListeners: {
            change: eventListener
        }
    });
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