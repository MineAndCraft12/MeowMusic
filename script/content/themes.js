/** Represents visualizer color themes */

import * as color from "../graphics/color.js";

export { legacy, meowmusic }

const legacy = {
    title: "AaronOS Legacy",
    options: {
        style: {
              title: "Turn Red at Peak",
              value: true,
            default: true
        },
        alpha: {
            title: "Fade to Black",
              value: false,
            default: false
        }
    },
    maps: {
        redPeak: { // Pulled from AaronOS Music
            r: [                    [200, 0],             [255, 255]],
            g: [[0, 0],                       [220, 255], [255,   0]],
            b: [         [64, 255], [200, 0]                        ],
            a: [[0, 0],                       [220,   1]            ]
        },
        noPeak: {
            r: 0,
            g: [[0, 0],                       [255, 255]],
            b: [         [64, 255], [220, 0]            ],
            a: [[0, 0],                       [255,   1]]
        },
    },
    currentMap: undefined,
    setup: function() {
        if (this.options.style.value) {
            this.currentMap = this.maps.redPeak;
        } else {
            this.currentMap = this.maps.noPeak;
        }
    },
    mix: function(amplitude) { // this theme does not use frequency
        let red;
        let alpha;

        // Does this style use red?
        if (this.options.style.value) {
            red = color.gradient(this.currentMap.r, amplitude);
        } else {
            red = 0;
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

const meowmusic = {
    title: "MeowMusic",
    options: {
        style: {
              title: "Turn Red at Peak",
              value: true,
            default: true
        },
        alpha: {
            title: "Fade to Black",
              value: false,
            default: false
        }
    },
    maps: {
        redPeak: { // Values @32 and @112 are weighted between Blue and Green by these percentages...
            //   RGB Blue       (12.5%L 25%C 12.5%H)(62.5%L 50%C 87.5%H)   RGB Green          RGB Red
            l: [[ 0,   0.452014], [32, 0.50381725 ], [112,   0.71103025], [207,   0.86644 ], [255,  0.628 ]],
            c: [[ 0,   0.313214], [32, 0.30861725 ], [112,   0.3040205 ], [207,   0.294827], [255,  0.2577]],
            h: [[ 0, 264.052   ], [32, 248.8574125], [112, 157.6898875 ], [207, 142.4953  ], [255, 29.23  ]],
            a: [[ 0,   0       ],                                         [207,   1       ]                ]
        },
        noPeak: {
            l: [[ 0,   0.452014], [40, 0.50381725 ], [140,   0.71103025], [255,   0.86644 ]],
            c: [[ 0,   0.313214], [40, 0.30861725 ], [140,   0.3040205 ], [255,   0.294827]],
            h: [[ 0, 264.052   ], [40, 248.8574125], [140, 157.6898875 ], [255, 142.4953  ]],
            a: [[ 0,   0       ],                                         [255,   1       ]]
        },
    },
    currentMap: undefined,
    setup: function() {
        if (this.options.style.value) {
            this.currentMap = this.maps.redPeak;
        } else {
            this.currentMap = this.maps.noPeak;
        }
    },
    mix: function(amplitude) { // this theme does not use frequency
        let alpha;

        // Does this style use alpha?
        if (this.options.alpha.value) {
            alpha = color.gradient(this.currentMap.a, amplitude);
        } else {
            alpha = 1;
        }

        return color.create("oklch", [
            color.gradient(this.currentMap.l, amplitude),
            color.gradient(this.currentMap.c, amplitude),
            color.gradient(this.currentMap.h, amplitude),
            alpha
        ]);
    }
};