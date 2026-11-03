/** Top-level script which launches the application */

import * as view from "./ui/view.js";     // REQUIRED: Loads most of the application
import * as config from "./ui/config.js"; // REQUIRED: Loads the config screens
import * as menus from "./ui/menus.js";
import * as modal from "./ui/modal.js";   // REQUIRED: Loads the modal dialogs

// Enables console debugging
// Comment this line for release
import "./util/debug.js";

// Show any errors in a modal dialog
window.onerror = (message, file, line, col, error) => {
    modal.showAlert("Error in " + (file || "Unknown") + " (" + line + ", " + col + "):\n\n" + message, ()=>{});
}

// Show the config screen
view.set("view-config");

// Ask the user to select their music
config.show(menus.musiclibrary);