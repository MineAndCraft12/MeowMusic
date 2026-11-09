/** Represents menus in the config screen */

import * as library from "../tracks/library.js";
import * as visualizer from "../graphics/visualizer.js";
import * as view from "../ui/view.js";
import * as config from "../ui/config.js";

export {
    landing, musiclibrary,
    visualizerScene, visualizerTheme
}

/** Options for the Music Library */
const musiclibrary = {
    title: "Music Library",
    select: {
        title: "Library Folder",
        details: "Select a folder of audio files from your device.<br><br>" +
            "<i>Your files will not be uploaded to the Internet.</i>",
        type: "directory",
        onchange: function(event) {
            library.loadDirectory(event.target.files);
            config.show();
            view.set("view-library");
        }
    }
};

/**
 * Event handler for configuring a content item
 * 
 * @param {Event} event 
 */
function handleContentOption(event) {
    let target = event.target.name.split("-");
    if (event.target.type === "checkbox") {
        visualizer[target[0]].options[target[1]].value = event.target.checked;
    }
    visualizer.setupContent();
}

/**
 * Event handler for selecting a content item
 * 
 * @param {Event} event 
 */
function handleContentSelect(event) {
    let target = event.target.id.split("-");
    if (target[2] === "theme") {
        visualizer.setTheme(target[3]);
        config.show("visualizerTheme");
    } else if (target[2] === "scene") {
        visualizer.setScene(target[3]);
        config.show("visualizerScene");
    }
}

/** Options for the scene */
const visualizerScene = {
    title: "Visualizer",
    options: {
        title: "Scene Options",
        type: "options",
        target: "scene",
        onchange: handleContentOption
    },
    list: {
        title: "Select a Scene",
        type: "list",
        target: "scene",
        onchange: handleContentSelect
    }
};

/** Options for the theme */
const visualizerTheme = {
    title: "Color Theme",
    options: {
        title: "Theme Options",
        type: "options",
        target: "theme",
        onchange: handleContentOption
    },
    list: {
        title: "Select a Theme",
        type: "list",
        target: "theme",
        onchange: handleContentSelect
    }
}

// This must stay at the end!
/** Links to config menus */
const landing = {
    title: "Settings",
    musicLibrary: {
        type: "link",
        target: "musiclibrary"
    },
    visualizerScene: {
        type: "link",
        target: "visualizerScene",
    },
    visualizerTheme: {
        type: "link",
        target: "visualizerTheme"
    }
};