/** Represents the config menu */

import * as dom from "./dom.js";
import * as ui from "./ui.js";
import * as error from "../util/error.js";
import * as menus from "./menus.js";

export { show }


// Variables

/**
 * The DOM node which hosts the config menu.
 * @type {HTMLSectionElement}
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

    if (menu == null) {
        menu = menus.landing;
        linkType = "config-return";
    } else {
        linkType = "config-link";
    }

    let node = ui.createParagraphContainer(["config-container", linkType], [
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

    if (menu !== menus.landing) {
        node.appendChild(createMenuLink());
    }

    node.appendChild(ui.createParagraph(menu.title, ["config-title"]));

    for (let item in menu) {
        if (item !== "title") {
            if (menu[item].type === "simple") {
                node.appendChild(
                    ui.createParagraphContainer(["config-container", "config-simple"], [
                        ui.createParagraph(menu[item].details)
                    ])
                );
            }

            if (menu[item].type === "link") {
                node.appendChild(createMenuLink(menu[item].target));
            }

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