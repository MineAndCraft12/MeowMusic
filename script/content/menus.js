/** Represents menus in the config screen */

import * as library from "../tracks/library.js";
import * as view from "../ui/view.js";
import * as config from "../ui/config.js";

export { landing, musiclibrary }

const musiclibrary = {
    title: "Music Library",
    welcome: {
        title: "Welcome",
        details: "<b>Please add your music to get started.</b>",
        type: "simple"
    },
    select: {
        title: "Music Library Folder",
        details: "Select a folder on your device which contains audio files.\n" +
            "Your files will not be uploaded to the Internet.",
        type: "directory",
        onchange: function(event) {
            library.loadDirectory(event.target.files);
            config.show(landing);
            view.set("view-library");
        }
    }
};

const visualizerScene = {
    title: "Visualizer"
};

const visualizerTheme = {
    title: "Color Theme"
}

// This must stay at the end!
const landing = {
    title: "Settings",
    musicLibrary: {
        type: "link",
        target: musiclibrary
    },
    visualizerScene: {
        type: "link",
        target: visualizerScene,
    },
    visualizerTheme: {
        type: "link",
        target: visualizerTheme
    }
};