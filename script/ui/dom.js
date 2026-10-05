/** Contains utils to help manipulate the DOM */

import * as error from "../util/error.js";

export { get, create }

/**
 * Returns DOM Element(s) matching an ID, a Class name, or a Tag name.
 * 
 * @example
 *                   dom.get("#my-element") // => HTMLElement from ID
 *                   dom.get(".my-class")   // => HTMLCollection from Class name
 *                   dom.get("div")         // => HTMLCollection from Tag name
 * dom.get("button", dom.get("#my-parent")) // => HTMLButtonElement child of #my-parent
 *                   dom.get("#no-result")  // => null from target ID not found
 *                   dom.get(".no-results") // => empty HTMLCollection from targets not found
 * 
 * @param {string} target - An `"#id"`, a `".class-name"`, or a `"tag-name"`.
 * @param {HtmlElement} parent - (Optional) An `HTMLElement`, or by default the `HTMLDocument`
 * 
 * @returns {(HTMLElement|HTMLCollection|null)}
 */
function get(target, parent) {
    let prefix;

    // Handle parameter 'target'
    if (typeof target === "string") {
        if (target.length !== 0) {
            // Select search type
            prefix = target[0];
        } else {
            throw error.empty("dom.get", "target");
        }
    } else {
        throw error.type("dom.get", "target", "string", typeof target);
    }

    // Handle parameter 'parent'
    if (parent instanceof HTMLElement) {
        // Avoid searching a parent node for an ID
        if (prefix === "#") {
            console.warn("Parameter 'parent' in 'dom.get': Cannot search a node for a child by ID, searching the full document instead");
            parent = document;
        }
    } else if (parent === undefined) {
        // Default parent is document
        parent = document;
    } else if (parent !== document) {
        throw error.type("dom.get", "parent", ["HTMLElement", "'document'", "undefined"], typeof parent);
    }

    // Perform element search
    if (prefix === ".") {
        return parent.getElementsByClassName(target.substring(1));
    } else if (prefix === "#") {
        return parent.getElementById(target.substring(1));
    } else {
        return parent.getElementsByTagName(target);
    }
}

/**
 * Returns a new DOM Element constructed from the supplied options
 * 
 * @param {string} tagName - The HTML tag of the type of element to create
 * @param {Object} options - Optional properties to set on the element
 * @param {string} options.id - An optional unique element ID
 * @param {Array.<string>} options.classList - An optional class name or list of class names
 * @param {any} options.textContent - An optional string or string[] of text content, fast but doesn't support newlines
 * @param {any} options.innerText - An optional string or string[] of text content, slow but supports newlines
 * @param {{attribute: string}} options.attributes - An optional set of attribute values
 * @param {{property: string}} options.styles - An optional set of style declarations
 * @param {{eventListener: Function}} options.eventListeners - An optional set of event listener callbacks
 * 
 * @returns {HTMLElement}
 */
function create(tagName, options) {
    // Handle parameter 'tag'
    if (typeof tagName === "string") {
        if (tagName.length === 0) {
            throw error.empty("dom.create", "tagName");
        }
    } else {
        throw error.type("dom.create", "tagName", "string", typeof tagName);
    }

    // Create the node
    let node = document.createElement(tagName);

    // Handle parameter 'options'
    if (typeof options !== "object" && options !== undefined) {
        throw error.type("dom.create", "options", ["object", "undefined"], typeof options);
    } else if (options !== undefined) {
        // Check for ID
        if (Object.hasOwn(options, "id")) {
            // Handle errors
            if (typeof options.id !== "string") {
                throw error.type("dom.create", "options.id", ["string", "undefined"], typeof options.id);
            }

            // Set ID
            node.id = options.id;
        }

        // Check for classes
        if (Object.hasOwn(options, "classList")) {
            // Handle errors
            if (typeof options.classList !== "object") {
                throw error.type("dom.create", "options.classList", ["string[]", "undefined"], typeof options.classList);
            }

            // Iterate classes
            for (let item in options.classList){
                // Handle errors
                if (typeof options.classList[item] !== "string") {
                    throw error.type("dom.create", "options.classList[" + item + "]", "string", typeof options.classList[item]);
                }

                // Add class
                node.classList.add(options.classList[item]);
            }
        }

        // Check for text content
        if (Object.hasOwn(options, "textContent")) {
            if (typeof options.textContent === "string") {
                node.textContent = options.textContent;
            } else if (Array.isArray(options.textContent)) {
                node.textContent = options.textContent.join(", ");
            } else {
                node.textContent = String(options.textContent);
            }
        }

        // Check for inner text
        if (Object.hasOwn(options, "innerText")) {
            if (typeof options.innerText === "string") {
                node.innerText = options.innerText;
            } else if (Array.isArray(options.innerText)) {
                node.innerText = options.innerText.join(", ");
            } else {
                node.innerText = String(options.innerText);
            }
        }

        // Check for attributes
        if (Object.hasOwn(options, "attributes")) {
            // Handle errors
            if (typeof options.attributes !== "object") {
                throw error.type("dom.create", "options.attributes", "object", typeof options.attributes);
            }

            // Iterate attributes
            for (let item in options.attributes) {
                // If attribute value is not one of these types...
                if (["string", "boolean", "number"].indexOf(typeof options.attributes[item]) === -1) {
                    throw error.type("dom.create", "options.attributes." + item, ["string", "boolean", "number"], typeof options.attributes[item]);
                }

                // Add attribute
                node.setAttribute(item, options.attributes[item]);
            }
        }

        // Check for style declarations
        if (Object.hasOwn(options, "styles")) {
            // Handle errors
            if (typeof options.styles !== "object") {
                throw error.type("dom.create", "options.styles", "object", typeof options.styles);
            }

            // Iterate attributes
            for (let item in options.styles) {
                // If property value is not one of these types...
                if (["string", "number"].indexOf(typeof options.styles[item]) === -1) {
                    throw error.type("dom.create", "options.styles." + item, ["string", "number"], typeof options.styles[item]);
                }

                // If style declaration exists...
                if (Object.hasOwn(node.style, item)) {
                    // Add style declaration
                    node.style[item] = options.styles[item];
                } else {
                    console.warn("Parameter 'options.styles." + item + "' in 'dom.create': " +
                        item + " is not a valid CSS property and will not be applied");
                }
            }
        }

        // Check for event listeners
        if (Object.hasOwn(options, "eventListeners")) {
            // Handle errors
            if (typeof options.eventListeners !== "object") {
                throw error.type("dom.create", "options.eventListeners", "object", typeof options.eventListeners);
            }

            // Iterate event listeners
            for (let item in options.eventListeners) {
                // Handle errors
                if (typeof options.eventListeners[item] !== "function") {
                    throw error.type("dom.create", "options.styles." + item, "Function", typeof options.eventListeners[item]);
                }

                // Add event listener
                node.addEventListener(item, options.eventListeners[item]);
            }
        }
    }

    return node;
}