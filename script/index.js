/** Top-level script which launches the application */

import * as view from "./ui/view.js";                    // REQUIRED: Loads most of the application
import * as config from "./ui/config.js";                // REQUIRED: Loads the config screens

/* Enables console debugging. Comment this line for release.
 * USE WITH CAUTION; places all modules into the global scope.
 * You may forget to import modules, causing crashes in production.
 */
// import "./util/debug.js";

// Show the config screen
view.set("view-config");

// Ask the user to select their music
config.show("musiclibrary");