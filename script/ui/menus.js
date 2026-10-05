/** Represents menus in the config screen */

import * as library from "../tracks/library.js";

export { landing, musiclibrary }

// TODO: I don't like this. Finish standardizing UI then come back.

const musiclibrary = {
    title: "Load your Music Library",
    welcome: {
        title: "Welcome",
        details: "<b>Please add your music to get started.</b><br>" +
            "<i>Your files are not uploaded and will never leave your device.</i><br>" +
            "<i>Currently you must select your folder each time.</i>",
        type: "simple"
    },
    select: {
        title: "Music Library Folder",
        details: "Select a folder on your local drive to use as the Music Library.",
        type: "directory",
        onchange: function(event) {
            library.loadDirectory(event.target.files);
        }
    }
};

const landing = {
    title: "Settings",
    library: {
        type: "link",
        target: musiclibrary
    }
};