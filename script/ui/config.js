/** Represents the config menu */

// TODO: Something about this doesn't feel right. It tastes like spaghetti.
// Remember to revise this when you feel like digging through DOM.
// Idea: Create a module for spawning standardized GUI constructs;
//  the config and other screens should not be inventing their own DOM layouts.

import * as dom from "./dom.js";
import * as error from "../util/error.js";
import * as menus from "./menus.js";

export { show }


// Variables

const node = dom.get("#config");


// DOM Node Construction
// TODO: Rewrite this standardized in ui.js

/**
 * Creates a message paragraph node for use in the config menus.
 * @param {string} message - A message to display to the user
 * 
 * @returns {HTMLParagraphElement}
 */
function createTitleNode(title) {
    return dom.create("p", {
        classList: ["config-title"],
        textContent: title || ""
    });
}

/**
 * Creates an empty container paragraph node
 * 
 * @param {string} className - A class name for the paragraph node
 * @returns {HTMLParagraphElement}
 */
function createContainerNode(className) {
    return dom.create("p", {
        classList: ["config-container", className]
    });
}

function createDetailsNode(summary, details) {
    let node = dom.create("details", {
        classList: ["config-details"],
        textContent: details
    });
    node.prepend(dom.create("summary", {textContent: summary}));
    return node;
}

function createDescriptionNode(summary) {
    let node = dom.create("p");
    node.innerHTML = summary;
    return node;
}

function handleMenuLink(event) {
    show(event.target.parentNode.linkedMenu);
}

function createMenuLink(menu) {
    let node;
    if (menu === undefined) {
        menu = menus.landing;
        node = createContainerNode("config-return");
    } else {
        node = createContainerNode("config-link");
    }

    node.appendChild(document.createComment(" The target menu is stored in the linkedMenu property of this .config-link's JS node "));
    node.appendChild(dom.create("button", {
        classList: ["config-link-button", "immersive-button"],
        textContent: menu.title,
        eventListeners: {"click": handleMenuLink}
    }));
    node.linkedMenu = menu;

    return node;
}

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


// Config Menu Operation

/** Deletes all children of the config DOM node */
function clearContent() {
    node.replaceChildren();
}

/**
 * Shows a menu from menus module, by default menus.landing
 * 
 * @param {Object?} menu - A menu from menus module
 */
function show(menu) {
    // Handle parameter
    if (menu === undefined) {
        menu = menus.landing;
    } else if (typeof menu !== "object"){
        throw error.type("config.show", "menu", ["object", "undefined"], typeof menu);
    }

    clearContent();

    if (menu !== menus.landing) {
        node.appendChild(createMenuLink());
    }

    node.appendChild(createTitleNode(menu.title));

    for (let item in menu) {
        if (item !== "title") {

            if (menu[item].type === "simple") {
                let container = createContainerNode("config-simple");
                let details = createDescriptionNode(menu[item].details);
                container.appendChild(details);
                node.appendChild(container);
            }

            if (menu[item].type === "link") {
                node.appendChild(createMenuLink(menu[item].target));
            }

            if (menu[item].type === "directory") {
                let container = createContainerNode("config-directory-input");
                let details = createDetailsNode(menu[item].title, menu[item].details);
                details.firstChild.appendChild(createDirectoryInput(menu[item].onchange));
                container.appendChild(details);
                node.appendChild(container);
            }

        }
    }
}