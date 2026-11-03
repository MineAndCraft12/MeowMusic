/** Overall framework for visualizer logic */

import * as canvas from "../ui/canvas.js";
import * as draw from "./draw.js";
import * as analyser from "../audio/analyser.js";

export {
    frameCount,
    frame
}

let frameCount = 0;

// Currently all debug logic
function frame() {
    frameCount++;

    let data = analyser.getData();

    draw.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < analyser.usefulRange; i++) {
        draw.ctx.fillStyle = "rgba(255,255,255," + (data[i] / 255) + ")";
        draw.ctx.fillRect(i * 3 + 300, 255 - data[i] + 200, 3, data[i]);
    }

    // Always calls itself to render every frame
    // Initially called from analyser.js
    requestAnimationFrame(frame);
}