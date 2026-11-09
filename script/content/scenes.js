/** Represents visualizer scenes */

import * as analyser from "../audio/analyser.js";
import * as canvas from "../ui/canvas.js";
import * as draw from "../graphics/draw.js";
import * as visualizer from "../graphics/visualizer.js";

export { theme, bars }

const theme = {
    title: "View Theme",
    options: {
        fullSize: {
              title: "Fill Entire Screen",
              value: false,
            default: false
        }
    },
    setup: function() {
        let left = 0;
        let top = 0;
        let size = 256;

        if (this.options.fullSize.value) {
            if (canvas.width > canvas.height) {
                size = canvas.height;
                left = Math.round((canvas.width - canvas.height) / 2);
            } else {
                size = canvas.width;
                top = Math.round((canvas.height - canvas.width) / 2);
            }
        } else {
            left = Math.round(canvas.width / 2) - 128;
            top = Math.round(canvas.height / 2) - 128;
        }

        let bottom = canvas.height - top;

        for (var frequency = 0; frequency < size; frequency++) {
            for (var amplitude = 0; amplitude < size; amplitude++) {
                draw.setFill(visualizer.theme.mix(amplitude / size * 255, frequency / size));
                draw.ctx.fillRect(left + frequency, bottom - amplitude, 1, 1);
            }
        }
    },
    frame: function() { }
};

const bars = {
    title: "Bars",
    options: {
        bobbers: {
              title: "Use Bobbers",
              value: false,
            default: false
        }
    },
    peaks: null,
    peakFrames: null,
    setup: function() {
        this.peaks = new Uint8Array(analyser.usefulRange);
        this.peakFrames = new Array(analyser.usefulRange);
    },
    frame: function() {
        draw.clear();
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
};