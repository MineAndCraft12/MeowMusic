/** Overall framework for visualizer logic */

import * as canvas from "../ui/canvas.js";
import * as draw from "./draw.js";
import * as analyser from "../audio/analyser.js";
import * as themes from "../content/themes.js";
import * as scenes from "../content/scenes.js";

export {
    setup,
    play, pause,
    frame,
    frameCount,
    theme, scene,
    setTheme,
    setScene
}


// Variables

/**
 * Total number of frames rendered since launch.
 * Inclusive of the current frame being rendered.
 * @type {number}
 */
let frameCount = 0;

/**
 * Most recent second the visualizer was rendered.
 * 
 * Only active if `visualizer.debug` is `true`.
 * @type {number}
 */
let second = 0;

/**
 * Total number of frames rendered this second.
 * Inclusive of the latest rendered frame.
 * 
 * Only active if `visualizer.debug` is `true`.
 * @type {number}
 */
let framesThisSecond = 0;

/**
 * Total number of frames rendered in the latest full second.
 * 
 * Only active if `visualizer.debug` is `true`.
 * @type {number}
 */
let fps = 0;

/**
 * Whether `visualizer.frame()` is allowed to run when called by `requestAnimationFrame`
 * @type {boolean}
 */
let playing = false;

/**
 * Whether to display debug metrics on the visualizer and inside scenes
 * @type {boolean}
 */
let debug = true;

/**
 * References the current theme.
 * 
 * Use `theme.mix(amplitude, frequency)` to get a color.
 * 
 * If undefined, the visualizer is not set up yet.
 * @type {Object|undefined}
 */
let theme;

/**
 * The current scene.
 * 
 * If undefined, the visualizer is not set up yet.
 * 
 * TODO: Scenes are not yet implemented.
 * @type {Object|undefined}
 */
let scene; // TODO: do this when scenes are ready


// Setup

/**
 * Prepare for rendering and render the first frame.
 * Called by analyser.js
 * 
 * The weird chain of events between modules is necessary to prevent race conditions
 */
function setup() {
    draw.registerRenderingContext();
    setTheme("legacy");
    //chooseScene("bars");
    requestAnimationFrame(frame);
}

/** Select a new color theme and initialize it. */
function setTheme(newTheme) {
    theme = themes[newTheme];
    theme.setup();
}

/**
 * Select a new scene and initialize it.
 * 
 * TODO: Scenes are not yet implemented.
 */
function setScene(newScene) {
    scene = scenes[newScene];
    scene.setup();
}


// Operation

/** Allows the visualizer to render automatically */
function play() {
    playing = true;
}

/** Stops the visualizer from rendering automatically */
function pause() {
    playing = false;
}

/** Toggles debug mode */
function toggleDebug() {
    debug = !debug;
}


// Rendering

/**
 * Render a visualizer frame.
 * Called by `visualizer.setup()`
 * 
 * If called outside of `requestAnimationFrame`, runs even if visualizer is paused.
 * If called inside of `requestAnimationFrame`, automatically calls itself next frame.
 * 
 * @param {number} animationFrame - Automatically passed by `requestAnimationFrame`
 */
function frame(animationFrame) {
    // Calls itself to render every frame
    if (animationFrame) {
        requestAnimationFrame(frame);
    }

    if (playing || !animationFrame) {
        frameCount++;

        draw.clear(); // TODO: Implement scenes - these two calls are a temporary scene
        draw.fillBars(
            [canvas.width * 0.1, canvas.height * 0.75],
            [canvas.width * 0.8, canvas.height * -0.5],
            -1, 2 / 3,
            analyser.getData(true)
        );

        if (debug) {
            framesThisSecond++;
            let newSecond = Math.floor(Date.now() / 1000);
            if (newSecond !== second) {
                fps = framesThisSecond;
                framesThisSecond = 0;
                second = newSecond;
            }

            draw.setFill("#FFF");
            draw.ctx.fillText(`${fps}  ${frameCount}`, 20, 30);
        }
    }
}