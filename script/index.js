/** Top-level script that launches the application */

// The full contents of this file are currently all debug code...

import * as error from "./util/error.js";
import * as dom from "./ui/dom.js";
import * as color from "./graphics/color.js";
import * as view from "./ui/view.js";
import * as modal from "./ui/modal.js";
import * as config from "./ui/config.js";
import * as menus from "./ui/menus.js";
import * as library from "./tracks/library.js";
import * as transport from "./tracks/transport.js";
import * as audio from "./audio/audio.js";
import * as analyser from "./audio/analyser.js";
import * as effects from "./audio/effects.js";
import * as canvas from "./graphics/canvas.js";
import * as ctx from "./graphics/ctx.js";

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
window.cofig = config;
window.color = color;
window.library = library;
window.transport = transport;
window.audio = audio;
window.analyser = analyser;
window.effects = effects;
window.canvas = canvas;
window.ctx = ctx;

// Debug buttons call this function
function debugView(event) {
    view.set(event.target.innerText);
}

// Create debug buttons
let debugControls = dom.get("#controls");

// Debug event handlers
function setVisualizer() {
    view.set("view-visualizer");
}
function setLibrary() {
    view.set("view-library");
}
function setConfig() {
    view.set("view-config");
}

// Debug visualizer view button
debugControls.appendChild(dom.create("button", {
    textContent: "V",
    eventListeners: {click: setVisualizer}
}));

// Debug transport controls
debugControls.appendChild(dom.create("button", {
    textContent: "|<",
    eventListeners: {click: transport.prev}
}));
debugControls.appendChild(dom.create("button", {
    textContent: ">",
    eventListeners: {click: transport.togglePlaying}
}));
debugControls.appendChild(dom.create("button", {
    textContent: ">|",
    eventListeners: {click: transport.next}
}));

// Debug library and config view buttons
debugControls.appendChild(dom.create("button", {
    textContent: "L",
    eventListeners: {click: setLibrary}
}));
debugControls.appendChild(dom.create("button", {
    textContent: "C",
    eventListeners: {click: setConfig}
}));

// Display the config menu
config.show(menus.musiclibrary);