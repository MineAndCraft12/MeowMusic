/** Overall framework for visualizer logic */

import * as draw from "./draw.js";
import * as themes from "../content/themes.js";
import * as scenes from "../content/scenes.js";

export {
    setup, setupContent,
    play, pause,
    frame, frameCount, delta,
    theme, scene,
    setTheme, setScene,
    toggleDebug
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
 * Most recent frame's time in microseconds.
 * @type {number}
 */
let timing = 0;

/**
 * Target frame time for 60fps.
 * @type {number}
 */
const idealFrameTime = 1000 / 60;

/**
 * Delta Time value used to account for frame rate.
 * @type {number}
 */
let delta = 1;

/**
 * Whether `visualizer.frame()` is allowed to run when called by `requestAnimationFrame`
 * @type {boolean}
 */
let playing = false;

/**
 * Whether to display debug metrics on the visualizer and inside scenes
 * @type {boolean}
 */
let debug = false;

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
    setScene("bars");
    setupContent();
    requestAnimationFrame(frame);
}

function setupContent() {
    theme.setup();
    scene.setup();
    frame();
}

/** Select a new color theme and initialize it. */
function setTheme(newTheme) {
    theme = themes[newTheme];
}

/**
 * Select a new scene and initialize it.
 * 
 * TODO: Scenes are not yet implemented.
 */
function setScene(newScene) {
    scene = scenes[newScene];
}


// Operation

/** Allows the visualizer to render automatically */
function play() {
    timing = performance.now();
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

    // Only runs if playing or not in an animationFrame
    if (playing || !animationFrame) {
        frameCount++;

        // Calculate delta time
        let newTiming = performance.now();
        delta = (newTiming - timing) / idealFrameTime;

        timing = newTiming;

        // Draw the scene
        draw.clear();
        try {
            scene.frame();
        } catch (error) {
            console.warn("Error in scene " + scene.title + " with theme " + theme.title);
            draw.setFill("#F00");
            draw.ctx.fillText('!', 10, 30);
            throw error;
        }

        // Framerate counter
        framesThisSecond++;
        let newSecond = Math.floor(Date.now() / 1000);
        if (newSecond !== second) {
            fps = framesThisSecond;
            framesThisSecond = 0;
            second = newSecond;
        }

        // Debug overlay
        if (debug) {
            draw.setFill("#FFF");
            draw.ctx.fillText(`${fps}`, 20, 30);
        }
    }
}