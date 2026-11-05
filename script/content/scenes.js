/** Represents visualizer scenes */

import * as analyser from "../audio/analyser.js";
import * as canvas from "../ui/canvas.js";
import * as draw from "../graphics/draw.js";
import * as visualizer from "../graphics/visualizer.js";

export { bars }

const bars = {
    title: "Bars",
    options: {
        bobbers: {
              title: "Bobbers",
              value: true,
            default: true
        }
    },
    peaks: null,
    peakFrames: null,
    setup: function() {
        this.peaks = new Uint8Array(analyser.usefulRange);
        this.peakFrames = new Array(analyser.usefulRange);
    },
    frame: function() {
        let data = analyser.getData(true);

        let left = canvas.width * 0.1;
        let base = canvas.height * 0.75;
        let width = canvas.width * 0.8;
        let height = canvas.height * -0.5;
        let foot = -1 / 5;
        let ratio = 5 / 6;

        if (this.options.bobbers.value) {
            // Bobber frames at 60fps
            let bobberTime = 15;
            let bobberSpeed = 1;

            for (let bobber = 0; bobber < analyser.usefulRange; bobber++) {
                // If bobber has been pushed up, reset it.
                if (data[bobber] >= this.peaks[bobber]) {
                    this.peaks[bobber] = data[bobber];
                    this.peakFrames[bobber] = visualizer.frameCount;
                // If the bobber isn't at the bottom...
                } else if (this.peaks[bobber] > 0) {
                    // If it's been floating longer than desired...
                    let waitFrames = bobberTime * visualizer.delta;
                    if (visualizer.frameCount - this.peakFrames[bobber] > waitFrames) {
                        // Fall.
                        this.peaks[bobber] = Math.max(this.peaks[bobber] - bobberSpeed * visualizer.delta, 0);
                    }
                }
            }

            draw.fillBars(
                [left, base],
                [width, height],
                foot, ratio,
                data, this.peaks
            );
        } else {
            draw.fillBars(
                [left, base],
                [width, height],
                foot, ratio,
                data
            );
        }
    }
}