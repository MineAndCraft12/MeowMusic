/** Represents menus in the config screen */

import * as library     from "../tracks/library.js";
import * as analyser    from "../audio/analyser.js";
import * as visualizer  from "../graphics/visualizer.js";
import * as view        from "../ui/view.js";
import * as config      from "../ui/config.js";
import * as preferences from  "./preferences.js";

export {
    landing, musiclibrary,
    visualizerScene, visualizerTheme,
    audioAnalyser,
    help, about, supportDeveloper
}


// Event Handlers

/**
 * Event handler for switching library folders
 * 
 * @param {Event} event 
 */
function handleLibraryChange(event) {
    library.loadDirectory(event.target.files);
    config.show();
    view.set("view-library");
}

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

function handleAnalyserLOD(event) {
    console.log("New exponent: " + (parseInt(event.target.value) + 8));
    analyser.setBufferExponent(parseInt(event.target.value) + 8);
}


// Menus

/** Options for the Music Library */
const musiclibrary = {
    title: "Music Library",

    select: {
        title: "Library Folder",
        type: "directory",
        details: "Select a folder of audio files from your device.<br><br>" +
            "<i>Your files will not be uploaded to the Internet.</i>",
        onchange: handleLibraryChange
    }
};


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
};

const audioAnalyser = {
    title: "Audio Analyser",

    lod: {
        title: "Level of Detail",
        type: "select",

        details: "Higher settings reveal finer details, but reduce visualizer responsiveness and may degrade performance.<br><br>" +
            "<i>Setting this to 8x or 16x can break the visualizer or make it very lethargic, and is not recommended.</i>",

        value: preferences.load("analyser.bufferExponent", 10) - 8,
        options: ["(1/4x) Very Low", "(1/2x) Low", "(1x) Default", "(2x) High", "(4x) Very High", "(8x) Crazy", "(16x) Insane"],
        onchange: handleAnalyserLOD
    }
};

const help = {
    title: "Help",

    chromeAndroid: {
        title: "Chrome on Android",
        type: "paragraphs",
        details: [
            "<b>Poor Framerate:</b> Chrome on Android enforces a mandatory framerate cap on audio analysis.",
            "Workaround 1: Use Firefox or try another browser.",
            "Workaround 2: Visit MeowMusic on PC instead."
        ]
    },

    firefoxAndroid: {
        title: "Firefox on Android",
        type: "paragraphs",
        details: [
            "<b>Poor Performance:</b> Firefox on Android can become unresponsive, freeze, or crash if a large music library folder is loaded.",
            "Workaround 1: Select a folder with a fewer audio files.",
            "Workaround 2: Visit MeowMusic on PC instead."
        ]
    },

    community: {
        title: "Need support?",
        type: "paragraphs",
        details: [
            'Visit our <a href="https://discord.gg/MhSEbKkyuJ" target="_blank">Discord community</a> to get in touch!',
            "I don't own many devices to test with; I will be happy to work with you to get a fix going."
        ]
    }
};

/** Information about the application */
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
            "Check out the AaronOS Music Player below to see what types of visualizers may come " +
                "to MeowMusic in the future."
        ]
    },

    links: {
        title: "Links",
        type: "imagelinks",
        details: [
            {
                alt: "Visit the Discord community",
                href: "https://discord.gg/MhSEbKkyuJ",
                image: "image/thirdparty/discord.svg",
                responsive: true
            },
            {
                alt: "View the source on GitHub",
                href: "https://github.com/MineAndCraft12/MeowMusic",
                image: "image/thirdparty/github.svg",
                responsive: true
            },
            {
                alt: "Check out AaronOS",
                href: "https://aaronos.dev/AaronOS/",
                image: "image/brand/aaronos.png",
                smarticon: true
            },
            {
                alt: "Check out the AaronOS Music Player",
                href: "https://aaronos.dev/AaronOS_Music/",
                image: "image/brand/aaronos-music.png",
                smarticon: true
            }
        ]
    },

    attribution: {
        title: "Attribution",
        type: "paragraphs",
        details: [
            'Button icons from Uicons by <a href="https://www.flaticon.com/uicons" target="_blank">Flaticon</a>'
        ]
    },

    legal: {
        title: "Legal",
        type: "paragraphs",
        details: [
            'Copyright © 2026 Aaron Adams. Free & Open Source at ' +
            '<a href="https://github.com/MineAndCraft12/MeowMusic" target="_blank">https://github.com/MineAndCraft12/MeowMusic/</a>',
            'Licensed under GNU AGPLv3'
        ]
    }
};

const supportDeveloper = {
    title: "Support the Developer",

    kofi: {
        type: "ko-fi",
        /* This is the ko-fi username, i.e. `ko-fi.com/${details}` */
        details: "aaronadams_aaronos"
    }
};


/**
 * Links to config menus.
 * This must stay at the bottom of the file!
 */
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

    audioAnalyser: {
        type: "link",
        target: "audioAnalyser"
    },

    help: {
        type: "link",
        target: "help"
    },
    
    about: {
        type: "link",
        target: "about"
    },

    supportDeveloper: {
        type: "link",
        target: "supportDeveloper"
    }
};