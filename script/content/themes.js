/** Represents visualizer color themes */

import * as color from "../graphics/color.js";

export { legacy }

const legacy = {
    title: "Legacy",
    options: {
        style: {
              title: "Peak Style",
              value: "redPeak",
            default: "redPeak",
            choices: [
                ["redPeak", "Red Peak"],
                ["noPeak", "No Peak"]
            ]
        },
        alpha: {
            title: "Fade to Black",
              value: true,
            default: true
        }
    },
    maps: {
        redPeak: { // Pulled from AaronOS Music
            r: [                        [200, 0],             [255, 255]],
            g: [[  0,   0],                       [220, 255], [255,   0]],
            b: [            [ 64, 255], [200, 0]                        ],
            a: [[  0,   0],                       [220,   1]            ]
        },
        noPeak: {
            r: 0,
            g: [[  0,   0],                       [255, 255]],
            b: [            [ 64, 255], [220, 0]            ],
            a: [[  0,   0],                       [255,   1]]
        },
    },
    currentMap: undefined,
    setup: function() {
        // For options.style
        this.currentMap = this.maps[this.options.style.value];
    },
    mix: function(amplitude) { // this theme does not use frequency
        let red;
        let alpha;

        // Does this style use red?
        if (this.currentMap.r === 0) {
            red = 0;
        } else {
            red = color.gradient(this.currentMap.r, amplitude);
        }

        // Does this style use alpha?
        if (this.options.alpha.value) {
            alpha = color.gradient(this.currentMap.a, amplitude);
        } else {
            alpha = 1;
        }

        return color.create("rgba", [
            red,
            color.gradient(this.currentMap.g, amplitude),
            color.gradient(this.currentMap.b, amplitude),
            alpha
        ]);
    }
};