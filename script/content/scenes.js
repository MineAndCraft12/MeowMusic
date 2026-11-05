/** Represents visualizer scenes */

import * as analyser from "../audio/analyser.js";
import * as canvas from "../ui/canvas.js";
import * as draw from "../graphics/draw.js";

export { bars }

const bars = {
    title: "Bars",
    options: {

    },
    setup: function() {

    },
    frame: function() {
        draw.fillBars(
            [canvas.width * 0.1, canvas.height * 0.75],
            [canvas.width * 0.8, canvas.height * -0.5],
            -1, 2 / 3,
            analyser.getData(true)
        );
    }
}