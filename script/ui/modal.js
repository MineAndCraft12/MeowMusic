/** Represents the modal popup */

import * as dom from "./dom.js";
import * as ui from "./ui.js";
import * as error from "../util/error.js";
import * as color from "../graphics/color.js";

export {
    getState, getValue,
    submit, cancel,
    showAlert,
    promptString,
    promptNumber,
    promptChoice,
    promptColor
}


// Variables

/**
 * The DOM node which hosts the modal dialog.
 * @type {HTMLDialogElement}
 */
const node = dom.get("#modal");

/**
 * Current callback set by template functions
 * @type {Function}
 */
let currentCallback;

/**
 * Current colorspace set by template functions
 * @type {string}
 */
let currentColorspace;


// Getters

/**
 * Returns modal DOM node attribute 'open'
 * @returns {boolean} 'true' if dialog is open, 'false' if dialog is closed.
 */
function getState() {
    return node.open;
}

/**
 * Returns modal DOM node property 'returnValue'
 * @returns {string}
 */
function getValue() {
    return node.returnValue;
}


// Dialog Manipulation

/** Clears modal DOM node property 'returnValue' */
function clearValue() {
    node.returnValue = '';
}

/** Deletes all children of the modal DOM node */
function clearContent() {
    node.replaceChildren();
}

/** Shows the modal dialog */
function show() {
    node.showModal();
}

/**
 * Submits the form and closes the modal dialog
 * @param {string} value - A return value
 */
function submit(value) {
    node.close(value);
}

/** Closes the modal dialog without submitting the form */
function cancel() {
    node.requestClose();
}


// Event Handlers

/** Responds to modal DOM node event 'close' */
function onclose() {
    if (currentCallback !== undefined) {
        currentCallback(getValue());
        currentCallback = undefined;
    }
    clearValue();
    clearContent();
}
node.addEventListener('close', onclose);

/** Responds to modal DOM node event 'cancel' */
function oncancel() {
    currentCallback = undefined;
}
node.addEventListener('cancel', oncancel);

/** Routes tab focus to top of modal because Cancel is at the bottom */
function cancelTabHandler(event) {
    if (event.key === "Tab") {
        event.preventDefault();
        // Iterate through each of <dialog#modal>'s child <p> nodes
        for (var highNode = 0; highNode < node.childNodes.length; highNode++) {
            // Iterates through a <p> node's children for the first instance of <input> or <button>
            for (var lowNode = 0; lowNode < node.childNodes[highNode].childNodes.length; lowNode++) {
                // A node at this depth could only be a TextNode, an <input>, or a <button>
                let tag = node.childNodes[highNode].childNodes[lowNode].tagName;
                if (tag === "INPUT" || tag === "BUTTON") {
                    node.childNodes[highNode].childNodes[lowNode].focus();
                    // Escape after we've focused only one node.
                    return;
                }
                // If we did not find an <input> or <button>, move on to the next <p> node.
            }
        }
    }
}

/**
 * Handles the enter key on the string input
 * 
 * @param {Event} event 
 */
function handleStringEnterKey(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        dom.get("#modal-string-submit").click();
    }
}


// DOM Node Construction

/**
 * Creates a paragraph node containing a cancel button for use in the modal.
 * 
 * @param {string} text - A message to display on the button; defaults to "Okay"
 * @returns {HTMLParagraphElement}
 */
function createCancelNode(text) {
    let node = ui.createParagraphContainer(["modal-container", "modal-controls"], [
        dom.create("button", {
            id: "modal-cancel",
            classList: ["immersive-button"],
            textContent: text || "Cancel",
            eventListeners: {
                "click": cancel,
                "keydown": cancelTabHandler
            }
        })
    ]);

    // Return the container node
    return node;
}

/**
 * Creates a controls paragraph node containing buttons for use in the modal.
 * 
 * @example
 * createControlsNode(myCallback, {"Choice": 1})
 * // <p> <button --data-value="1">Choice</button>
 * //     <button>Cancel</button> </p>
 * 
 * @param {Function=} controlsHandler - A callback function for after a submit button is pressed.
 * @param {Object} controls - An optional set of control buttons.
 * @param {string} controls.item - The title and value of a control button.
 * 
 * @returns {HTMLParagraphElement}
 */
function createControlsNode(controlsHandler, controls) {
    let node = ui.createParagraphContainer(["modal-container", "modal-controls"]);

    // Check for buttons to make
    if (typeof controls === "object") {
        // Check if a control handler was specified
        if (typeof controlsHandler === "function") {
            // Iterate the controls and build buttons
            for (let item in controls) {
                node.appendChild(dom.create("button", {
                    textContent: controls[item],
                    attributes: {"--data-value": item},
                    eventListeners: {"click": controlsHandler}
                }));
            }
        } else {
            // A control handler must be specified if controls are specified
            throw error.range("modal.createControlsNode", "controlsHandler", "must reference a Function if parameter 'controls' is undefined");
        }
    } else if (controls !== undefined) {
        throw error.type("modal.createControlsNode", "controls", ["object", "undefined"], typeof controls);
    }

    // Return the container node
    return node;
}

/**
 * Creates a paragraph node containing an input and optional submit button for use in the modal.
 * 
 * @example
 * // Creates an input with a Submit button which passes the value to your callback
 * createStringNode(myCallback, "Placeholder", "Initital value");
 * // Creates an input with the specified ID and does not include a Submit button.
 * createStringNode("my-input-id", "Placeholder", "Initial value");
 * 
 * @param {Function|string} stringHandler - A callback function for user submit action, or a string to set as the input's ID.
 * @param {string=} placeholder - The placeholder value of the text input; recommended to be a default value.
 * @param {string=} initialValue - Populates the input with an existing value; useful for modifying an existing value.
 * @returns {HTMLParagraphElement}
 */
function createStringNode(stringHandler, placeholder, initialValue) {
    let node = ui.createParagraphContainer(["modal-container", "modal-string"]);
    
    // If a function is specified, then create input with submit button
    if (typeof stringHandler === "function") {
        // Create the text field
        let input = dom.create("input", {
            id: "modal-string-input",
            eventListeners: {"keydown": handleStringEnterKey},
            attributes: {
                "placeholder": placeholder || "",
                "value": initialValue || ""
            }
        });

        // Create the submit button
        let submitButton = dom.create("button", {
            id: "modal-string-submit",
            textContent: "Submit",
            eventListeners: {"click": stringHandler}
        });

        // Add nodes
        node.appendChild(input);
        node.appendChild(submitButton);
    // If a string is specified instead of a function, do not include a submit button
    } else if (typeof stringHandler === "string") {
        // Create the text field
        let input = dom.create("input", {
            id: stringHandler,
            attributes: {
                "placeholder": placeholder || "",
                "value": initialValue || ""
            }
        });

        // Add node
        node.appendChild(input);
    } else {
        throw error.type("modal.createStringNode", "stringHandler", ["string", "Function"], typeof inputId);
    }

    return node;
}

/**
 * Creates a paragraph node containing an input and optional submit button for use in the modal.
 * 
 * @example
 * // Creates an input with a Submit button which passes the value to your callback
 * createNumberNode(myCallback, 0, 0, [0, 10], 1);
 * // Creates an input with the specified ID and does not include a Submit button.
 * createNumberNode("my-input-id", 0, 0, [0, 10], 1);
 * 
 * @param {Function|string} numberHandler - A callback function for user submit action, or a string to set as the input's ID.
 * @param {string|number=} placeholder - The placeholder value of the text input; recommended to be a default value.
 * @param {string|number=} initialValue - Populates the input with an existing value; useful for modifying an existing value.
 * @param {[number,number]=} range - A minimum and maximum value for the input.
 * @param {number=} step - Specifies how much is added if the user presses the add or subtract buttons.
 * @returns {HTMLParagraphElement}
 */
function createNumberNode(numberHandler, placeholder, initialValue, range, step) {
    let node = ui.createParagraphContainer(["modal-container", "modal-number"]);
    
    // Handle range
    if (Array.isArray(range)) {
        if (range.length !== 2) {
            throw error.range("modal.createNumberNode", "range", `must have exactly 2 items, instead got ${range.length}`);
        }
    } else if (range === undefined) {
        range = ["", ""];
    } else {
        throw error.type("modal.createNumberNode", "range", "number[]", typeof range);
    }

    // Handle placeholder
    if (typeof placeholder !== "number" && typeof placeholder !== "string") {
        placeholder = "";
    }

    // Handle initialValue
    if (typeof initialValue !== "number" && typeof initialValue !== "string") {
        initialValue = "";
    }
    
    // If a function is specified, then create input with submit button
    if (typeof numberHandler === "function") {
        // Create the text field
        let input = dom.create("input", {
            id: "modal-string-input",
            eventListeners: {"keydown": handleStringEnterKey},
            attributes: {
                "type": "number",
                "placeholder": placeholder,
                "value": initialValue,
                "min": range[0],
                "max": range[1],
                "step": step || "1"
            }
        });

        // Create the submit button
        let submitButton = dom.create("button", {
            id: "modal-string-submit",
            textContent: "Submit",
            eventListeners: {"click": numberHandler}
        });

        // Add nodes
        node.appendChild(input);
        node.appendChild(submitButton);
    // If a string is specified instead of a function, do not include a submit button
    } else if (typeof numberHandler === "string") {
        // Create the text field
        let input = dom.create("input", {
            id: numberHandler,
            attributes: {
                "type": "number",
                "placeholder": placeholder,
                "value": initialValue,
                "min": range[0],
                "max": range[1],
                "step": step || " 1"
            }
        });

        // Add node
        node.appendChild(input);
    } else {
        throw error.type("modal.createNumberNode", "numberHandler", ["string", "Function"], typeof inputId);
    }

    return node;
}


// Submit Action Handlers

/**
 * Handles a submitted choice prompt
 * 
 * @param {Event} event
 */
function handleChoice(event) {
    submit(event.target.getAttribute("--data-value"));
}

/** Handles a submitted string prompt */
function handleString() {
    submit(dom.get("#modal-string-input").value);
}

/** Handles a submitted number prompt */
function handleNumber() {
    submit(parseFloat(dom.get("#modal-string-input").value));
}

/** Handles a submitted color prompt */
function handleColor() {

}


// Modal Dialog Creation

/**
 * Sets the callback, builds a prompt from given nodes, and displays it.
 * 
 * @param {string} trace - If an error is encountered, references this trace.
 * @param {Function|string} callback - A callback function or "NO CALLBACK"
 * @param {Array.<HTMLParagraphElement>} nodes - A list of nodes to build the prompt from
 */
function showPrompt(trace, callback, nodes) {
    clearContent();

    // Handle callback
    if (typeof callback === "function") {
        currentCallback = callback;
    } else if (callback !== "NO CALLBACK") {
        throw error.type(trace, "callback", "Function", typeof callback);
    }

    for (var item = 0; item < nodes.length; item++) {
        node.appendChild(nodes[item]);
    }

    show();
}

/**
 * Shows an alert dialog
 * 
 * @param {string} message
 * @param {function} callback
 */
function showAlert(message, callback) {
    showPrompt("modal.showAlert", callback, [
        ui.createParagraph(message, ["modal-message"]),
        createCancelNode("Okay")
    ]);

    dom.get("#modal-cancel").focus();
}

/**
 * Shows a choice prompt.
 * 
 * @example
 * // You can use an array or object to define your choices.
 * modal.promptChoice(myCallback, "Make a choice please.", ["Apples", "Oranges"]);
 * modal.promptChoice(myCallback, "Make a choice please.", {apple: "Apples", orange: "Oranges"});
 * // Make a choice please. [Apples] [Oranges] [Cancel]
 * // If Apples is clicked, result is 0 or 'apple'. If Oranges is clicked, result is 1 or 'orange'.
 * 
 * @param {Function} callback - This function will be called with a return value if the user responds.
 * @param {string} message - Describes the choice to the user.
 * @param {Object} choices - An object containing values and titles of control buttons.
 * @param {String} choices.item - The key will be forwarded to your callback and the value will be displayed to the button.
 */
function promptChoice(callback, message, choices) {
    showPrompt("modal.promptChoice", callback, [
        ui.createParagraph(message, ["modal-message"]),
        createControlsNode(handleChoice, choices),
        createCancelNode()
    ]);

    dom.get("#modal-cancel").focus();
}

/**
 * Shows a string prompt.
 * 
 * @example
 * modal.promptString(myCallback, "Write something please.", "Default value", "Initial value");
 * // Write something please. [Initial value      ] [Submit] [Cancel]
 * // If a value is submitted, it is returned to callback.
 * 
 * @param {Function} callback - This function will be called with a return value if the user responds.
 * @param {string} message - Describes the choice to the user.
 * @param {string=} placeholder - The default value of the item you're describing.
 * @param {string=} initial - The present value of the item you're describing.
 */
function promptString(callback, message, placeholder, initial) {
    showPrompt("modal.promptString", callback, [
        ui.createParagraph(message, ["modal-message"]),
        createStringNode(handleString, placeholder, initial),
        createCancelNode()
    ]);

    dom.get("#modal-string-input").focus();
}

/**
 * Shows a number prompt.
 * 
 * @example
 * modal.promptString(myCallback, "Choose a number please.", 0, 0, [0, 10], 1);
 * // Choose a number please. [0   ] [Submit] [Cancel]
 * // If a value is submitted, it is returned to callback.
 * 
 * @param {Function} callback - This function will be called with a return value if the user responds.
 * @param {string} message - Describes the choice to the user.
 * @param {number|string=} placeholder - The default value of the item you're describing.
 * @param {number|string=} initial - The present value of the item you're describing.
 * @param {[number,number]=} range - A minimum and maximum value that a user could enter.
 * @param {number|string=} step - How much is added if the user presses the add or subtract buttons.
 */
function promptNumber(callback, message, placeholder, initial, range, step) {
    showPrompt("modal.promptNumber", callback, [
        ui.createParagraph(message, ["modal-message"]),
        createNumberNode(handleNumber, placeholder, initial, range, step),
        createCancelNode()
    ]);

    dom.get("#modal-string-input").focus();
}

/**
 * Shows a color prompt.
 * 
 * WARNING: Not yet implemented.
 * 
 * @example
 * modal.promptColor(myCallback, "Choose a color please.", "rgba", [255, 0, 0, 1])
 * // Choose a color please. [Graphical Color Picker] [Submit] [Cancel]
 * // If a value is submitted, it is returned to callback.
 * 
 * @param {*} callback - This function will be called with a return value if the user responds.
 * @param {*} message - Describes the choice to the user.
 * @param {*} colorspace - Colorspace for the color picker graph to render.
 * @param {*} initial - The present value of the item you're describing.
 */
function promptColor(callback, message, colorspace, initial) {
    // Check if colorspace is specified
    if (colorspace === "undefined") {
        colorspace = "hsl";
    } else if (typeof colorspace === "string") {
        if (color.getValidColorspaces().indexOf(colorspace) === -1) {
            throw error.range("modal.promptColor", "colorspace", `must be a valid colorspace (see modal.validColorspaces). Instead got ${colorspace}`);
        }
    } else {
        throw error.type("modal.promptColor", "colorspace", ["string", "undefined"], typeof colorspace);
    }
    currentColorspace = colorspace;

    // TODO: implement

    showPrompt("modal.promptColor", callback, [
        ui.createParagraph(message + "\n\nWarning: The color picker is not yet implemented.", ["modal-message"]),
        // TODO: implement
        createCancelNode()
    ]);
}