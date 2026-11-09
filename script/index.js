/** Top-level script which launches the application */

import * as view from "./ui/view.js";     // REQUIRED: Loads most of the application
import * as config from "./ui/config.js"; // REQUIRED: Loads the config screens
import * as modal from "./ui/modal.js";   // REQUIRED: Loads the modal dialogs
import * as menus from "./content/menus.js";

// Enables console debugging
// Comment this line for release
import "./util/debug.js";

// Show the config screen
view.set("view-config");

// Ask the user to select their music
config.show("musiclibrary");