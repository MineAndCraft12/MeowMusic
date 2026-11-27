/** Represents visualizer scenes */

import * as analyser    from "../audio/analyser.js";
import * as canvas      from "../ui/canvas.js";
import * as visualizer  from "../graphics/visualizer.js";
import * as draw        from "../graphics/draw.js";
import * as preferences from  "./preferences.js";

export {
    theme, debugData,
    bars
}


// Scenes

/** Displays a graph of possible colors from the theme */
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


/** Displays various graphs of audio data values */
const debugData = {
    title: "View Data",

    options: { },

    padding: 32,

    setup: function() { },

    frame: function() { // TODO: Show all data fields
        draw.clear();
        let data = analyser.getData({
            buffer: ["data"],
            standard: ["data"],
            treble: ["averageAmplitude"]
        });
        let leftNudge = this.padding;
        let topNudge = this.padding;

        // Standard data

        draw.setFill("oklch(0.5 0 0 / 1)");
        draw.ctx.fillText(
            `Standard  ( ${analyser.size.standard} )`,
            leftNudge,
            topNudge - 6
        );
        
        draw.setFill("oklch(0.25 0 0 / 1)");
        draw.ctx.fillRect(
            leftNudge,
            topNudge,
            analyser.size.standard,
            -1
        );

        draw.fillBars(
            [
                leftNudge,
                topNudge + 256
            ],
            [
                analyser.size.standard,
                -256
            ],
            -1, 1,
            data.standard.data
        );

        leftNudge += analyser.size.standard + this.padding;

        // Treble average amplitude
        
        draw.setFill("oklch(0.5 0 0 / 1)");
        draw.ctx.fillText(
            `Treble`,
            leftNudge,
            topNudge - 6
        );

        draw.setFill("oklch(0.25 0 0 / 1)");
        draw.ctx.fillRect(
            leftNudge,
            topNudge,
            this.padding,
            -1
        );

        draw.setFill(visualizer.theme.mix(data.treble.averageAmplitude));
        draw.ctx.fillRect(
            leftNudge,
            topNudge + 256,
            this.padding,
            data.treble.averageAmplitude * -1 - 1
        );

        leftNudge += this.padding * 2;

        // Buffer data

        draw.setFill("oklch(0.5 0 0 / 1)");
        draw.ctx.fillText(
            `Buffer Data  ( ${analyser.size.buffer} )`,
            leftNudge,
            topNudge - 6
        );

        draw.setFill("oklch(0.25 0 0 / 1)");
        draw.ctx.fillRect(
            leftNudge,
            topNudge,
            analyser.size.buffer,
            -1
        );
        draw.ctx.fillRect(
            leftNudge + analyser.size.standard,
            topNudge,
            1,
            256
        );

        draw.fillBars(
            [
                leftNudge,
                topNudge + 256
            ],
            [
                analyser.size.buffer,
                -256
            ],
            -1, 1,
            data.buffer.data
        );

        leftNudge = this.padding;
        topNudge += 256 + this.padding;
    }
}


/** A series of bars with bobbers and a treble bar */
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
        this.peaks = new Uint8Array(analyser.size.standard);
        this.peakFrames = new Array(analyser.size.standard);
    },

    frame: function() {
        draw.clear();

        let data = analyser.getData({
            standard: ["data"]
        }).standard.data;

        let left = canvas.width * 0.1;
        let base = canvas.height * 0.75;
        let width = canvas.width * 0.8;
        let height = canvas.height * -0.5;

        let trebleHints;

        if (this.options.bobbers.value) {
            // Bobber frames at 60fps
            let bobberTime = 15;
            let bobberSpeed = 1;

            for (let bobber = 0; bobber < analyser.size.standard; bobber++) {
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
            let trebleData = analyser.getData({
                treble: ["averageAmplitude"]
            }).treble.averageAmplitude;

            let trebleDec = trebleData / 255;

            let trebleTop = trebleHints.space * 2;
            let trebleFactor = height * -0.1 * (trebleHints.space + 1);
            let treblePush = trebleDec * trebleFactor;
            let trebleWidth = analyser.size.standard * (trebleHints.width + trebleHints.space) - trebleHints.space;
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