/** Overall framework for visualizer logic */

import * as canvas from "../ui/canvas.js";
import * as ctx from "./ctx.js";
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

    ctx.raw.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < analyser.usefulRange; i++) {
        ctx.raw.fillStyle = "rgba(255,255,255," + (data[i] / 255) + ")";
        ctx.raw.fillRect(i * 2 + 300, 255 - data[i] + 200, 2, data[i]);
    }

    // Always calls itself to render every frame
    // Initially called from analyser.js
    requestAnimationFrame(frame);
}