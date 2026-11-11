/** Represents visualizer scenes */

import * as analyser from "../audio/analyser.js";
import * as canvas from "../ui/canvas.js";
import * as visualizer from "../graphics/visualizer.js";
import * as draw from "../graphics/draw.js";
import * as preferences from "./preferences.js";

export {
    theme, debugData,
    bars
}


// View Theme

const theme = {
    title: "View Theme",
    options: {
        fullSize: {
              title: "Fill Entire Screen",
              value: preferences.load("scenes.theme.fullSize", false),
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


// View Data

const debugData = {
    title: "View Data",
    options: { },
    padding: 32,
    setup: function() { },
    frame: function() {
        draw.clear();
        let data = analyser.getData();
        let filteredData = analyser.getData("filter");
        let trebleData = analyser.getData("treble");

        // Filtered data
        draw.setFill("oklch(0.5 0 0 / 1)");
        draw.ctx.fillText(
            `Filtered Data  ( ${analyser.usefulRange} )`,
            this.padding,
            this.padding - 6
        );
        
        draw.setFill("oklch(0.25 0 0 / 1)");
        draw.ctx.fillRect(
            this.padding,
            this.padding,
            analyser.usefulRange,
            -1
        );

        draw.fillBars(
            [
                this.padding,
                this.padding + 256
            ],
            [
                analyser.usefulRange,
                -256
            ],
            -1, 1,
            filteredData
        );

        // Raw data
        draw.setFill("oklch(0.5 0 0 / 1)");
        draw.ctx.fillText(
            `Raw Audio Data  ( ${analyser.bufferLength} )`,
            this.padding * 2 + analyser.usefulRange,
            this.padding - 6
        );

        draw.setFill("oklch(0.25 0 0 / 1)");
        draw.ctx.fillRect(
            this.padding * 2 + analyser.usefulRange,
            this.padding,
            analyser.bufferLength,
            -1
        );
        draw.ctx.fillRect(
            this.padding * 2 + analyser.usefulRange * 2,
            this.padding,
            1,
            256
        );

        draw.fillBars(
            [
                this.padding * 2 + analyser.usefulRange,
                this.padding + 256
            ],
            [
                analyser.bufferLength,
                -256
            ],
            -1, 1,
            data
        );

        // Treble data
        // Raw data
        draw.setFill("oklch(0.5 0 0 / 1)");
        draw.ctx.fillText(
            `Treble`,
            this.padding * 3 + analyser.usefulRange + analyser.bufferLength,
            this.padding - 6
        );

        draw.setFill("oklch(0.25 0 0 / 1)");
        draw.ctx.fillRect(
            this.padding * 3 + analyser.usefulRange + analyser.bufferLength,
            this.padding,
            this.padding,
            -1
        );

        draw.setFill(visualizer.theme.mix(trebleData));
        draw.ctx.fillRect(
            this.padding * 3 + analyser.usefulRange + analyser.bufferLength,
            this.padding + 256,
            this.padding,
            trebleData * -1 - 1
        );

    }
}


// Bars

const bars = {
    title: "Bars",
    options: {
        bobbers: {
              title: "Use Bobbers",
              value: preferences.load("scenes.bars.bobbers", false),
            default: false
        },
        treble: {
              title: "Treble Line",
              value: preferences.load("scenes.bars.treble", true),
            default: true
        }
    },
    peaks: null,
    peakFrames: null,
    foot: -1 / 5,
    ratio: 5 / 6,
    setup: function() {
        this.peaks = new Uint8Array(analyser.usefulRange);
        this.peakFrames = new Array(analyser.usefulRange);
    },
    frame: function() {
        draw.clear();
        let data = analyser.getData("filter");

        let left = canvas.width * 0.1;
        let base = canvas.height * 0.75;
        let width = canvas.width * 0.8;
        let height = canvas.height * -0.5;

        let trebleHints;

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

            trebleHints = draw.fillBars(
                [left, base],
                [width, height],
                this.foot, this.ratio,
                data, this.peaks
            );
        } else {
            trebleHints = draw.fillBars(
                [left, base],
                [width, height],
                this.foot, this.ratio,
                data
            );
        }

        if (this.options.treble.value) {
            let trebleData = analyser.getData("treble");

            let trebleTop = trebleHints.space * 2;
            let trebleDec = trebleData / 255;
            let trebleFactor = height / -10 * (trebleHints.space + 1);
            let treblePush = trebleDec * trebleFactor;
            let trebleWidth = analyser.usefulRange * (trebleHints.width + trebleHints.space) - trebleHints.space;
            let trebleHeight = Math.max(trebleHints.space, 1);

            draw.setFill(visualizer.theme.mix(trebleData, trebleDec));
            draw.ctx.fillRect(
                trebleHints.left,
                Math.round(base + trebleTop + treblePush),
                trebleWidth,
                trebleHeight
            );
        }
    }
};