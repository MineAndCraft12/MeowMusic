/** Facilitates debugging through the console */

// Utilities
import * as error from "./error.js";
import * as util from "./util.js";
import * as dom from "./dom.js";

// User Interface
import * as view from "../ui/view.js";
import * as controls from "../ui/controls.js";
import * as config from "../ui/config.js";
import * as menus from "../ui/menus.js";
import * as catalog from "../ui/catalog.js";
import * as canvas from "../ui/canvas.js";
import * as modal from "../ui/modal.js";

// Audio
import * as audio from "../audio/audio.js";
import * as effects from "../audio/effects.js";
import * as analyser from "../audio/analyser.js";

// Tracks
import * as library from "../tracks/library.js";
import * as transport from "../tracks/transport.js";

// Graphics
import * as color from "../graphics/color.js";
import * as draw from "../graphics/draw.js";
import * as visualizer from "../graphics/visualizer.js";


// Enable debugging from the console

// Utilities
window.error = error;
window.util = util;
window.dom = dom;

// User Interface
window.view = view;
window.controls = controls;
window.config = config;
window.menus = menus;
window.catalog = catalog;
window.canvas = canvas;
window.modal = modal;

// Audio
window.audio = audio;
window.effects = effects;
window.analyser = analyser;

// Tracks
window.library = library;
window.transport = transport;

// Graphics
window.color = color;
window.draw = draw;
window.visualizer = visualizer;