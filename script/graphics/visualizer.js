/** Overall framework for visualizer logic */

import * as canvas from "../ui/canvas.js";
import * as draw from "./draw.js";
import * as analyser from "../audio/analyser.js";

export {
    setup,
    frameCount, frame
}


// Variables

let frameCount = 0;


// Methods

/**
 * Prepare for rendering and render the first frame.
 * Called by analyser.js
 * 
 * This weird chain of events is necessary to prevent race conditions
 */
function setup() {
    draw.registerRenderingContext();
    frame();
}

/**
 * Render a visualizer frame.
 * Called by visualizer.setup
 * 
 * Currently the contents of this function are debug code.
 */
function frame() {
    frameCount++;

    let data = analyser.getData(true);

    draw.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < analyser.usefulRange; i++) {
        draw.ctx.fillStyle = "rgba(255,255,255," + (data[i] / 255) + ")";
        draw.ctx.fillRect(i * 3 + 300, 255 - data[i] + 200, 3, data[i]);
    }

    // Always calls itself to render every frame
    // Initially called from analyser.js
    requestAnimationFrame(frame);
}