/** Top-level script that launches the application */

// The full contents of this file are currently all debug code...

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

window.onerror = (message, file, line, col, error) => {
    modal.showAlert("Error in " + (file || "Unknown") + " (" + line + ", " + col + "):\n\n" + message, ()=>{});
}

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
for (var i in view.options) {
    debugControls.appendChild(dom.create("button", {
        textContent: view.options[i],
        eventListeners: {
            "click": debugView
        },
        styles: {
            opacity: 0.5
        }
    }));
}

debugControls.appendChild(dom.create("button", {
    textContent: "|<",
    eventListeners: {
        "click": transport.prev
    }
}));
debugControls.appendChild(dom.create("button", {
    textContent: ">",
    eventListeners: {
        "click": transport.togglePlaying
    }
}));
debugControls.appendChild(dom.create("button", {
    textContent: ">|",
    eventListeners: {
        "click": transport.next
    }
}));

// Display the config menu
config.show(menus.musiclibrary);