/** Handles user preferences persistence */

import * as modal from "../ui/modal.js";

export { load, save }

// Variables

/**
 * Object representation of stored user preferences.
 * @type {Object}
 */
let data = {};

/**
 * Whether preferences data has been loaded yet.
 * @type {boolean}
 */
let ready = false;


// Methods

/** Loads preferences data from localStorage to the module */
function init() {
    let str = localStorage.getItem("MeowMusic_Preferences");

    if (str !== null) {
        try {
            data = JSON.parse(str);
        } catch (err) {
            console.warn("Preferences JSON is corrupted!");
            console.log({str});
            data = {};
            modal.showAlert(
                "Preferences JSON is corrupted!\nYour preferences have been reset.",
                function() { }
            );
        }
    }

    ready = true;
}

/**
 * Get a value from a preferences key, or return the fallback value.
 * 
 * @param {*} key - Key to get from preferences
 * @param {*} fallback - Default value for if key is not found.
 * @returns {any} Value from preferences if key is found, otherwise fallback value
 */
function load(key, fallback) {
    if (!ready) {
        init();
    }

    if (data.hasOwnProperty(key)) {
        return data[key];
    } else {
        return fallback;
    };
}

/**
 * Store a value to a preferences key.
 * 
 * @param {*} key - Key to save to preferences
 * @param {*} value - Value to save with the key.
 */
function save(key, value) {
    data[key] = value;

    try {
        localStorage.setItem("MeowMusic_Preferences", JSON.stringify(data));
    } catch(err) {
        console.warn("Failed to convert preferences to JSON!");
        console.log({data});
        modal.showAlert(
            "Failed to convert preferences to JSON!\nYour preferences are not saved.",
            function() { }
        );
    }
}