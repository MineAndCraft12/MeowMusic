/** Represents menus in the config screen */

import * as library from "../tracks/library.js";
import * as view from "../ui/view.js";
import * as config from "../ui/config.js";

export { landing, musiclibrary }

const musiclibrary = {
    title: "Load your Music Library",
    welcome: {
        title: "Welcome",
        details: "<b>Please add your music to get started.</b>",
        type: "simple"
    },
    select: {
        title: "Music Library Folder",
        details: "Select a folder on your local drive to use as the Music Library.",
        type: "directory",
        onchange: function(event) {
            library.loadDirectory(event.target.files);
            config.show(landing);
            view.set("view-library");
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