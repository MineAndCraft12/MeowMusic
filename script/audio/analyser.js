/** represents the audio frequency analyser */

import * as calc        from "../util/calc.js";
import * as effects     from  "./effects.js";
import * as visualizer  from "../graphics/visualizer.js";
import * as preferences from "../content/preferences.js";

export {
    node, registerNode, getData,
    bufferExponent, setBufferExponent,
    ratio, size
}


// Variables

/**
 * The AnalyserNode. If undefined it hasn't been registered yet.
 * @type {AnalyserNode|undefined}
 */
let node;

/**
 * The power of two which sets the size of the analyser.getData() array.
 * 
 * Default is 10 for 1024, minimum is 8 for 256, maximum is 14 for 16384.
 * @type {number}
 */
let bufferExponent = preferences.load("analyser.bufferExponent", 10);

/**
 * Describes the size ratios between each data bucket and the buffer.
 */
const ratio = {
    // The fft size MUST be 2x the buffer size; any other case is impossible.
    fft   : 2,
    buffer: 1,
    
    // These buckets start at the beginning of the buffer
    standard: (128 / 1024),
    bass    : ( 12 / 1024), // At buffer 256, bass becomes prime.

    // These buckets are "leftovers" of their parents
    mid   : (( 128 -  12) / 1024), // standard range which is not bass
    treble: ((1024 - 128) / 1024)  // buffer range which is not standard
}

/**
 * Describes the size of each data bucket.
 */
let size = {
    fft     : 1024 * ratio.fft,      // Default 2048
    buffer  : 1024 * ratio.buffer,   // Default 1024
    standard: 1024 * ratio.standard, // Default  128
    bass    : 1024 * ratio.bass,     // Default   12
    mid     : 1024 * ratio.mid,      // Default  116
    treble  : 1024 * ratio.treble    // Default  896
};

/** Contains the actual data buckets used by the visualizer. */
const buckets = {
    buffer: {
        source: "analyser",
        rangeAtEnd: false,
        data: new Uint8Array(size.buffer),

        averageAmplitude: 0,
        averageFrequency: 0,
        
        frame: {
            data            : 0,
            averageAmplitude: 0,
            averageFrequency: 0
        }
    },

    standard: {
        source: "buffer",
        rangeAtEnd: false,
        data: new Array(size.standard),
        amplitudeModifier: "sinusoid",

        averageAmplitude: 0,
        averageFrequency: 0,

        frame: {
            data            : 0,
            averageAmplitude: 0,
            averageFrequency: 0
        }
    },

    bass: {
        source: "standard",
        rangeAtEnd: false,
        data: new Array(size.bass),

        averageAmplitude: 0,
        averageFrequency: 0,

        frame: {
            data            : 0,
            averageAmplitude: 0,
            averageFrequency: 0
        }
    },

    mid: {
        source: "standard",
        rangeAtEnd: true,
        data: new Array(size.mid),

        averageAmplitude: 0,
        averageFrequency: 0,
        
        frame: {
            data            : 0,
            averageAmplitude: 0,
            averageFrequency: 0
        }
    },

    treble: {
        source: "buffer",
        rangeAtEnd: true,
        data: new Array(size.treble),

        averageAmplitudeModifier: "presenceSensitiveAverage",
        averageAmplitudeSensitivity: 1 / 4,
        averageAmplitude: 0,
        averageFrequency: 0,

        frame: {
            data            : 0,
            averageAmplitude: 0,
            averageFrequency: 0
        }
    }
};


// Registration

/**
 * Registers a new AnalyserNode and returns it for connection to other nodes.
 * 
 * You cannot use the analyser module until the audio module calls this function.
 * 
 * @param {AudioContext} context - The active AudioContext
 * @returns {AnalyserNode}
 */
function registerNode(context) {
    node = context.createAnalyser();

    setBufferExponent(bufferExponent);

    // Most of my music peaks around this range
    node.maxDecibels = -20;
    // Most of my music looks like random noise below this range
    node.minDecibels = -60;

    // Launch the visualizer
    requestAnimationFrame(visualizer.setup);

    return node;
}


// Methods

/**
 * Sets a new buffer length by raising 2 to a provided power.
 * 
 * @param {number} newExponent - A number between 8 and 14.
 */
function setBufferExponent(newExponent) {
    // Application breaks if exponent is outside these clamp bounds
    bufferExponent = calc.clamp(newExponent, 8, 14);
    let bufferLength = 2 ** bufferExponent;

    size = {
        fft     : bufferLength * ratio.fft,
        buffer  : bufferLength * ratio.buffer,
        standard: bufferLength * ratio.standard,
        bass    : bufferLength * ratio.bass,
        mid     : bufferLength * ratio.mid,
        treble  : bufferLength * ratio.treble
    };

    buckets.buffer  .data = new Uint8Array(size.buffer  );
    buckets.standard.data = new      Array(size.standard);
    buckets.bass    .data = new      Array(size.bass    );
    buckets.mid     .data = new      Array(size.mid     );
    buckets.treble  .data = new Uint8Array(size.treble  );

    node.fftSize = size.fft;
    effects.setDelayByFFT(size.fft);

    if (visualizer.ready) {
        visualizer.setupContent();
    }
}

/**
 * Renders a data bucket and any prerequisite buckets.
 * 
 * @param {string} bucket 
 * @param {string} selected 
 * @returns {Object}
 */
function renderData(bucket, selected) {
    // If the selected hasn't been rendered yet...
    if (buckets[bucket].frame[selected] !== visualizer.frameCount) {
        // If this bucket's data hasn't been rendered yet...
        if (buckets[bucket].frame.data !== visualizer.frameCount) {
            let source = buckets[bucket].source;
            
            // If this bucket's data comes straight from the analyser...
            if (source === "analyser") {
                node.getByteFrequencyData(buckets[bucket].data);

            // If this bucket's data comes from another bucket...
            } else {
                // Recurse to render that bucket's data
                renderData(source, "data");

                // Check if this data comes from the end of the source
                let scanStart = 0;
                let scanEnd = size[bucket];
                if (buckets[bucket].rangeAtEnd) {
                    scanStart = size[source] - size[bucket]; // TODO: See if this needs -1
                    scanEnd = size[source];
                }

                // Apply effects and render this bucket's data based on its source
                if (buckets[bucket].hasOwnProperty("amplitudeModifier")) {
                    
                    let amplitudeModifier = calc[buckets[bucket].amplitudeModifier];
                    buckets[bucket].data = amplitudeModifier(buckets[source].data, 255, scanStart, scanEnd);
                
                // No effects are required, just do a plain data copy
                } else {
                    for (let index = 0; index < size[bucket]; index++) {
                        buckets[bucket].data[index] = buckets[source].data[index + scanStart];
                    }
                }
            }

            buckets[bucket].frame.data = visualizer.frameCount;
            
            // If selected is data, we now have it and we are done here.
            if (selected === "data") {
                return buckets[bucket].data;
            }
        }

        if (selected === "averageAmplitude") {
            // If this bucket uses a special averager...
            if (buckets[bucket].hasOwnProperty("averageAmplitudeModifier")) {

                // Presence Sensitive Average
                if (buckets[bucket].averageAmplitudeModifier === "presenceSensitiveAverage") {
                    buckets[bucket].averageAmplitude =
                        calc.presenceSensitiveAverage(buckets[bucket].data, 255, buckets[bucket].averageAmplitudeSensitivity);

                // Fallback to standard average
                } else {
                    buckets[bucket].averageAmplitude = calc.average(buckets[bucket].data);
                }
            // Standard average
            } else {
                buckets[bucket].averageAmplitude = calc.average(buckets[bucket].data);
            }

        } else if (selected === "averageFrequency") {
            buckets[bucket].averageFrequency = calc.weightedAverage(buckets[bucket].data);
        }

        buckets[bucket].frame[selected] = visualizer.frameCount;
    }

    return buckets[bucket][selected];
}

/**
 * Get a certain set of data from the AnalyserNode.
 * 
 * @example
 * // Gets all data types
 * getData({
 *     buffer  : ["data", "averageAmplitude", "averageFrequency"],
 *     standard: ["data", "averageAmplitude", "averageFrequency"],
 *     bass    : ["data", "averageAmplitude", "averageFrequency"],
 *     mid     : ["data", "averageAmplitude", "averageFrequency"],
 *     treble  : ["data", "averageAmplitude", "averageFrequency"],
 * });
 * // Returns an object like this...
 * // Check analyser.size for the length of each data array
 * {
 *     buffer: {
 *         data: number[],
 *         averageAmplitude: number,
 *         averageFrequency: number
 *     },
 *     ...
 * }
 * 
 * @param {Object} options
 * @returns {Uint8Array}
 */
function getData(options) {
    let obj = {};

    for (let bucket in options) {
        for (let dataset in options[bucket]) {
            if (!obj.hasOwnProperty(bucket)) {
                obj[bucket] = {};
            }
            obj[bucket][ options[bucket][dataset] ] = renderData(bucket, options[bucket][dataset]);
        }
    }

    return obj;
}