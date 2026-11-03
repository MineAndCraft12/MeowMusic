/** Represents the primary controls row */

import * as dom from "../util/dom.js";
import * as view from "./view.js";
import * as transport from "../tracks/transport.js";

export { toggle }


// Variables

/**
 * The DOM Node which hosts the controls row
 * @type {HTMLElement}
 */
const node = dom.get("#controls");


// Methods

/** Show or hide the controls row */
function toggle() {
    node.classList.toggle("hidden");
}


// Event Handlers

// Debug Event Handlers
function setVisualizer() {
    view.set("view-visualizer");
}
function setLibrary() {
    view.set("view-library");
}
function setConfig() {
    view.set("view-config");
}


// Actions

// Debug fullscreen button
node.appendChild(dom.create("button", {
    textContent: "F",
    eventListeners: {click: view.toggleFullscreen},
    classList: ["float-left"]
}));

// Debug transport controls
node.appendChild(dom.create("button", {
    textContent: "|<",
    eventListeners: {click: transport.prev}
}));
node.appendChild(dom.create("button", {
    textContent: ">",
    eventListeners: {click: transport.togglePlaying}
}));
node.appendChild(dom.create("button", {
    textContent: ">|",
    eventListeners: {click: transport.next}
}));

// Debug view buttons
node.appendChild(dom.create("button", {
    textContent: "V",
    eventListeners: {click: setVisualizer},
    classList: ["float-right"]
}));
node.appendChild(dom.create("button", {
    textContent: "L",
    eventListeners: {click: setLibrary},
    classList: ["float-right"]
}));
node.appendChild(dom.create("button", {
    textContent: "C",
    eventListeners: {click: setConfig},
    classList: ["float-right"]
}));