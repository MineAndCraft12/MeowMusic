/** Represents the config menu */

import * as error from "../util/error.js";
import * as dom from "../util/dom.js";
import * as ui from "./ui.js";
import * as menus from "../content/menus.js";
import * as themes from "../content/themes.js";
import * as scenes from "../content/scenes.js";
import * as visualizer from "../graphics/visualizer.js";

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
    show(event.target.id.split("-")[2]);
}


// DOM Node Construction

/**
 * Creates a link to a menu
 * @param {string} menuName
 * @returns {HTMLParagraphElement}
 */
function createMenuLink(menuName) {
    let menu;
    let linkType;
    let title;
    let node;

    // Determine if this is a back button or regular link
    if (menuName == null) {
        menu = menus.landing;
        linkType = "config-return";
        title = "Back"
        node = dom.create("button", {
            id: "config-linkto-landing",
            classList: ["config-return", "icon-button", "header-icon"],
            eventListeners: {click: handleMenuLink}
        })
    } else {
        node = ui.createParagraphContainer(["config-container", "config-link"], [
            dom.create("button", {
                id: "config-linkto-" + menuName,
                textContent: menus[menuName].title,
                classList: ["config-link-button", "immersive-button"],
                eventListeners: {click: handleMenuLink}
            })
        ]);
    }

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
 * @param {string?} menuName - A menu from menus module
 */
function show(menuName) {
    let menu;
    // Handle parameter
    if (menuName == null) {
        menu = menus.landing;
    } else if (typeof menuName !== "string"){
        throw error.type("config.show", "menuName", ["string", "undefined"], typeof menuName);
    } else {
        menu = menus[menuName];
    }

    clearContent();

    // Create the app logo
    node.appendChild(ui.createAppLogo());

    // Create a back button if we're not at home
    if (menu !== menus.landing) {
        node.appendChild(createMenuLink());
    }

    node.appendChild(ui.createParagraph(menu.title, ["config-title"]));

    // In the current menu, look at every entry...
    for (let item in menu) {
        // The menu title is not an entry...
        if (item !== "title") {
            let current;
            let fieldset;
            
            switch (menu[item].type) {
                // Link to another menu
                case "link":
                    node.appendChild(createMenuLink(menu[item].target));
                    break;

                // Display basic information
                case "simple":
                    node.appendChild(
                        ui.createParagraphContainer(
                            ["config-container", "config-simple"],
                            [ui.createParagraph(menu[item].details)]
                        )
                    );
                    break;

                // Show options for a theme or scene
                case "options":
                    current = visualizer[menu[item].target];

                    fieldset = ui.createFieldset(
                        `${menu[item].title}: <i>${current.title}</i>`,
                        ["config-fieldset"],
                        []
                    );

                    let optionCount = 0;
                    for (let option in current.options) {
                        optionCount++;

                        // Boolean option
                        if (typeof current.options[option].default === "boolean") {
                            fieldset.appendChild(
                                ui.createParagraphContainer(
                                    ["config-container", "config-checkbox"],
                                    [
                                        ui.createCheckboxInput( // Implement checkbox input
                                            `${menu[item].target}-${option}`,
                                            current.options[option].value,
                                            menu[item].onchange
                                        ),
                                        ui.createLabel(
                                            current.options[option].title,
                                            `${menu[item].target}-${option}`
                                        )
                                    ]
                                )
                            );

                        // Unrecognized option
                        } else {
                            fieldset.appendChild(
                                ui.createParagraphContainer(["config-container", "config-simple"], [
                                    ui.createParagraph(`Unknown option configuration for "${option}"`)
                                ])
                            );
                        }
                    }

                    if (optionCount === 0) {
                        fieldset.appendChild(
                            ui.createParagraphContainer(["config-container", "config-simple"], [
                                ui.createParagraph(`This ${menu[item].target} has no options.`)
                            ])
                        );
                    }

                    node.appendChild(fieldset);
                    break;

                // List all themes or scenes
                case "list":
                    fieldset = ui.createFieldset(
                        `${menu[item].title}`,
                        ["config-fieldset"],
                        []
                    );

                    if (menu[item].target === "theme") {
                        current = themes;
                    } else {
                        current = scenes;
                    }

                    for (let option in current) {
                        fieldset.appendChild(
                            ui.createParagraphContainer(
                                ["config-container", "config-radio"],
                                [
                                    ui.createRadioInput(
                                        `select-${menu[item].target}-${option}`,
                                        (current[option] === visualizer[menu[item].target]),
                                        `select-${menu[item].target}`,
                                        menu[item].onchange
                                    ),
                                    ui.createLabel(
                                        `<img src="image/${menu[item].target}/${option}.png"> ${current[option].title}`,
                                        `select-${menu[item].target}-${option}`
                                    )
                                ]
                            )
                        );
                        
                        node.appendChild(fieldset);
                    }
                    break;

                // Directory File Input for the tracklist
                case "directory":
                    node.appendChild(
                        ui.createFieldset(
                            menu[item].title,
                            ["config-fieldset"],
                            [
                                ui.createParagraphContainer(
                                    ["config-container", "config-directory-input"],
                                    [ui.createDirectoryInput(menu[item].onchange)]
                                ),
                                ui.createParagraphContainer(
                                    ["config-container", "config-simple"],
                                    [ui.createParagraph(menu[item].details)]
                                )
                            ]
                        )
                    );
                    break;

                // Menu type not recognized
                default:
                    ui.createParagraphContainer(["config-container", "config-simple"], [
                        ui.createParagraph(`Unknown menu option "${menu[item].type}"`)
                    ]);
            }
        }
    }
}