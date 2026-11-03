/** Top-level script that launches the application */

// The full contents of this file are currently all debug code...

import * as error from "./util/error.js";
import * as dom from "./util/dom.js";
import * as color from "./graphics/color.js";
import * as view from "./ui/view.js";
import * as modal from "./ui/modal.js";
import * as config from "./ui/config.js";
import * as menus from "./ui/menus.js";
import * as catalog from "./ui/catalog.js";
import * as library from "./tracks/library.js";
import * as transport from "./tracks/transport.js";
import * as audio from "./audio/audio.js";
import * as analyser from "./audio/analyser.js";
import * as effects from "./audio/effects.js";
import * as canvas from "./ui/canvas.js";
import * as draw from "./graphics/draw.js";
import * as controls from "./ui/controls.js";

// Popup errors in case i dont notice the console
window.onerror = (message, file, line, col, error) => {
    modal.showAlert("Error in " + (file || "Unknown") + " (" + line + ", " + col + "):\n\n" + message, ()=>{});
}

// Set modules to window for debugging sake
window.error = error;
window.dom = dom;
window.color = color;
window.view = view;
window.modal = modal;
window.config = config;
window.menus = menus;
window.catalog = catalog;
window.color = color;
window.library = library;
window.transport = transport;
window.audio = audio;
window.analyser = analyser;
window.effects = effects;
window.canvas = canvas;
window.draw = draw;
window.controls = controls;

// Display the music library upload button
config.show(menus.musiclibrary);