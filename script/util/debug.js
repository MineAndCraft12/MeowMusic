/** Facilitates debugging through the console */

// Audio
import * as analyser from "../audio/analyser.js";
import * as audio    from "../audio/audio.js";
import * as effects  from "../audio/effects.js";

// Content
import * as menus       from "../content/menus.js";
import * as preferences from "../content/preferences.js";
import * as scenes      from "../content/scenes.js";
import * as themes      from "../content/themes.js";

// Graphics
import * as color      from "../graphics/color.js";
import * as draw       from "../graphics/draw.js";
import * as visualizer from "../graphics/visualizer.js";

// Tracks
import * as library   from "../tracks/library.js";
import * as transport from "../tracks/transport.js";

// User Interface
import * as canvas   from "../ui/canvas.js";
import * as catalog  from "../ui/catalog.js";
import * as config   from "../ui/config.js";
import * as controls from "../ui/controls.js";
import * as modal    from "../ui/modal.js";
import * as view     from "../ui/view.js";

// Utilities
import * as dom   from "./dom.js";
import * as error from "./error.js";
import * as util  from "./util.js";


// Enable visualizer debugging
visualizer.toggleDebug();


// Enable debugging from the console

// Audio
window.analyser = analyser;
window.audio    = audio;
window.effects  = effects;

// Content
window.menus       = menus;
window.preferences = preferences;
window.scenes      = scenes;
window.themes      = themes;

// Graphics
window.color      = color;
window.draw       = draw;
window.visualizer = visualizer;

// Tracks
window.library   = library;
window.transport = transport;

// User Interface
window.canvas   = canvas;
window.catalog  = catalog;
window.config   = config;
window.controls = controls;
window.modal    = modal;
window.view     = view;

// Utilities
window.dom   = dom;
window.error = error;
window.util  = util;


// ^ Console Debugging: Scroll up for the list of available modules. ^

console.warn(
    "Debug Mode is enabled. All modules are global scoped for console debugging.\n" +
    " ⬑ Expand and visit %c debug.js %c for a list of available modules.",
    "background: rgba(127, 127, 127, 0.25); font-weight: bold;    padding: 2px 0;",
    "background: initial;                     font-weight: initial; padding: initial;"
);