/** Represents the config menu */

import * as dom from "./dom.js";
import * as ui from "./ui.js";
import * as error from "../util/error.js";
import * as menus from "./menus.js";

export { show }


// Variables

/**
 * The DOM node which hosts the config menu.
 * @type {HTMLElement}
 */
const node = dom.get("#config");


// Event Handlers

/**
 * Handles clicks on links to menus
 * @param {Event} event 
 */
function handleMenuLink(event) {
    show(event.target.parentNode.linkedMenu);
}


// DOM Node Construction

/**
 * Creates a link to a menu
 * @param {Object} menu 
 * @returns {HTMLParagraphElement}
 */
function createMenuLink(menu) {
    let linkType;

    // Determine if this is a back button or regular link
    if (menu == null) {
        menu = menus.landing;
        linkType = "config-return";
    } else {
        linkType = "config-link";
    }

    let node = ui.createParagraphContainer(["config-container", linkType], [
        // TODO: I don't like that this solution is practically invisible unless you know where to look... fix it.
        document.createComment(" The target menu is stored in the linkedMenu property of this .config-container's JS node "),
        dom.create("button", {
            textContent: menu.title,
            classList: ["config-link-button", "immersive-button"],
            eventListeners: {click: handleMenuLink}
        })
    ]);
    node.linkedMenu = menu;

    return node;
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

    // Create a back button if we're not at home
    if (menu !== menus.landing) {
        node.appendChild(createMenuLink());
    }

    node.appendChild(ui.createParagraph(menu.title, ["config-title"]));

    // In the current menu, look at every entry...
    for (let item in menu) {
        // The menu title is not an entry...
        if (item !== "title") {
            // Ideally "simple" is just a display of basic information
            if (menu[item].type === "simple") {
                node.appendChild(
                    ui.createParagraphContainer(["config-container", "config-simple"], [
                        ui.createParagraph(menu[item].details)
                    ])
                );
            }

            // Link to another menu
            if (menu[item].type === "link") {
                node.appendChild(createMenuLink(menu[item].target));
            }

            // Directory File Input for the tracklist
            if (menu[item].type === "directory") {
                node.appendChild(
                    ui.createParagraphContainer(["config-container", "config-directory-input"], [
                        ui.createDetails(
                            menu[item].title, menu[item].details, ["config-details"],
                            ui.createDirectoryInput(menu[item].onchange)
                        )
                    ])
                )
            }
        }
    }
}