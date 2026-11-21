/** Top-level script which launches the application */

import * as view   from "./ui/view.js";   // REQUIRED: Loads most of the application
import * as config from "./ui/config.js"; // REQUIRED: Loads the config screens

// Show the config screen
view.set("view-config");

// Ask the user to select their music
config.show("musiclibrary");

/**
 * Global var which tracks whether debug is enabled.
 * @type {boolean}
 */
window.debugMode = false;

/**
 * Global function which enables debug mode.
 * Intended to be called from the developer console.
 */
window.enableDebug = function enableDebug(){
    if (!window.debugMode) {
        import("./util/debug.js");
        window.debugMode = true;
        return "Success";
    } else {
        return "Debug Mode is already enabled.";
    }
}

console.log(
    "To enable console debugging, use %c enableDebug() ",
    "background: rgba(127, 127, 127, 0.25); font-weight: bold; padding: 2px 0;"
);