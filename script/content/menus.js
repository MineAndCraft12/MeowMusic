/** Represents menus in the config screen */

import * as library from "../tracks/library.js";
import * as visualizer from "../graphics/visualizer.js";
import * as view from "../ui/view.js";
import * as config from "../ui/config.js";
import * as preferences from "./preferences.js";

export {
    landing, musiclibrary,
    visualizerScene, visualizerTheme,
    about
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
    let currentContent = visualizer[`${target[0]}Str`];

    if (event.target.type === "checkbox") {
        visualizer[target[0]].options[target[1]].value = event.target.checked;
        preferences.save(`${target[0]}s.${currentContent}.${target[1]}`, event.target.checked);
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
        preferences.save("visualizer.theme", target[3]);

    } else if (target[2] === "scene") {
        visualizer.setScene(target[3]);
        config.show("visualizerScene");
        preferences.save("visualizer.scene", target[3]);
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

const about = {
    title: "About MeowMusic",
    blurb: {
        title: "Summary",
        type: "paragraphs",
        details: [
            "MeowMusic is a music visualizer for audio files from your device.",
            "This project started small as an exercise in writing higher quality software, " +
                "but eventually gained a true identity of its own, becoming the spiritual " +
                "successor of my previous work, the AaronOS Music Player.",
            "Check out AaronOS Music below to see what types of visualizers may come " +
                "to MeowMusic in the future."
        ]
    },
    links: {
        title: "Links",
        type: "paragraphs",
        details: [
            'Visit the community: <a href="https://discord.gg/MhSEbKkyuJ">AaronOS & MeowMusic on Discord</a>',
            'View the source code: <a href="https://github.com/MineAndCraft12/MeowMusic" target="_blank">MeowMusic on GitHub</a>',
            'See the old project: <a href="https://aaronos.dev/AaronOS_Music/" target="_blank">AaronOS Music</a>',
            'Check out my other work: <a href="https://aaronos.dev/AaronOS/" target="_blank">AaronOS</a>'
        ]
    },
    legal: {
        title: "Legal",
        type: "paragraphs",
        details: [
            'Copyright © 2026 Aaron Adams. Free & Open Source at ' +
            '<a href="https://github.com/MineAndCraft12/MeowMusic" target="_blank">https://github.com/MineAndCraft12/MeowMusic/</a>',
            'Licensed under AGPLv3'
        ]
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
    },
    about: {
        type: "link",
        target: "about"
    }
};