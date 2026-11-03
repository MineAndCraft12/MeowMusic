/** Top-level script that launches the application */

// The full contents of this file are currently all debug code...

import * as error from "./util/error.js";
import * as util from "./util/util.js";
import * as dom from "./util/dom.js";

import * as view from "./ui/view.js";
import * as controls from "./ui/controls.js";
import * as config from "./ui/config.js";
import * as menus from "./ui/menus.js";
import * as catalog from "./ui/catalog.js";
import * as canvas from "./ui/canvas.js";
import * as modal from "./ui/modal.js";

import * as audio from "./audio/audio.js";
import * as effects from "./audio/effects.js";
import * as analyser from "./audio/analyser.js";

import * as library from "./tracks/library.js";
import * as transport from "./tracks/transport.js";

import * as color from "./graphics/color.js";
import * as draw from "./graphics/draw.js";
import * as visualizer from "./graphics/visualizer.js";


// Set modules to window for the debug console...

// util
window.error = error;
window.util = util;
window.dom = dom;

// ui
window.view = view;
window.controls = controls;
window.config = config;
window.menus = menus;
window.catalog = catalog;
window.canvas = canvas;
window.modal = modal;

// audio
window.audio = audio;
window.effects = effects;
window.analyser = analyser;

// tracks
window.library = library;
window.transport = transport;

// graphics
window.color = color;
window.draw = draw;
window.visualizer = visualizer;


// Popup errors in case I dont notice the console
window.onerror = (message, file, line, col, error) => {
    modal.showAlert("Error in " + (file || "Unknown") + " (" + line + ", " + col + "):\n\n" + message, ()=>{});
}