/** Represents the music library and playlist */

import * as transport from "./transport.js";
import * as dom from "../ui/dom.js";
import * as ui from "../ui/ui.js";

export {
    ready,
    tracklist, directory, playlist,
    loadDirectory,
    highlightTrack,
    trackInfoFromPlaylist,
    playlistIndexFromPath,
    toggleShuffle
}


// Variables

/**
 * Host DOM node of the library
 * @type {HTMLElement}
 */
const node = dom.get("#library");

/**
 * Describes whether the library is ready for action.
 * @type {boolean}
 */
let ready = false;

/**
 * Determines whether library.buildPlaylist() uses shuffle mode.
 * @type {boolean}
 */
let shuffleMode = false;

/**
 * Points to the currently playing playlist index in the GUI
 * @type {number}
 */
let highlightedTrack = 0;

/**
 * Contains the full paths, titles and blob URLS of all tracks in a flat list.
 * 
 * @example
 * // A theoretical set of uploaded tracks
 * library.tracklist = {
 *     "Music/Artist1/Song1.mp3":
 *         { title: "Song1", src: ObjectURL },
 *     "Music/Artist1/Song1.flac":
 *         { title: "Song1", src: ObjectURL },
 *     "Music/Artist2/Song2.mp3":
 *         { title: "Song2", src: ObjectURL }
 * }
 */
let tracklist = {};

/**
 * Mirrors the directory structure of the uploaded directory.
 * 
 * @example
 * // A theoretical set of uploaded tracks
 * library.directory = {
 *     Music: {
 *         Artist1: {
 *             "Song1.mp3" : "Music/Artist1/Song1.mp3",
 *             "Song1.flac": "Music/Artist1/Song1.flac",
 *         },
 *         Artist2: {
 *             "Song2.mp3" : "Music/Artist2/Song2.mp3"
 *         }
 *     }
 * }
 */
let directory = {};

/**
 * Contains the current playlist as a sequence of tracklist paths.
 * 
 * @example
 * // A theoretical set of uploaded tracks
 * library.playlist = [
 *     "Music/Artist1/Song1.mp3",
 *     "Music/Artist1/Song1.flac",
 *     "Music/Artist2/Song2.mp3"
 * ]
 */
let playlist = [];


// Tracklist Construction

/**
 * Revokes all ObjectURLs and empties the tracklist, directory, and playlist.
 * 
 * Makes the library unready for action.
 */
function clearTracklist() {
    ready = false;
    clearUI();

    // Release our lock on the user's files
    for (let i in tracklist) {
        URL.revokeObjectURL(trackList[i]);
    }

    highlightedTrack = 0;

    tracklist = {};
    directory = {};
    playlist = [];
}

/**
 * Recursive function which builds the directory structure and tracklist entries for a file.
 * 
 * @param {Object} list - Host directory object to be built upon.
 * @param {Array.<string>} path - Full path to the file.
 * @param {File} file - File object from user's upload.
 */
function storeTrack(list, path, file) {
    // If we're looking at a directory...
    if (path.length > 1) {
        // Get the name of the dir
        let newList = path.shift();
        // If we don't already have this dir, create it
        if (!list.hasOwnProperty(newList)) {
            list[newList] = {};
        }
        // Move one depth deeper and try again
        storeTrack(list[newList], path, file);
    // If we're looking at a file, create its entry
    } else {
        tracklist[file.webkitRelativePath] = {
            title: file.name.substring(0, file.name.indexOf(".")),
            src: URL.createObjectURL(file)
        };
        list[file.name] = file.webkitRelativePath;
    }
}

/**
 * Loads the user's uploaded directory into the music library.
 * 
 * Also invokes library.buildPlaylist().
 * If the playlist is not empty. the library is ready for action.
 * 
 * @param {FileList} files - The user's uploaded FileList.
 */
function loadDirectory(files) {
    clearTracklist();
    transport.reset();

    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith("audio/")) {
            let path = files[i].webkitRelativePath.split("/");
            // Recursively create an object path to this file
            storeTrack(directory, path, files[i]);
        }
    }

    buildPlaylist();
    if (playlist.length > 0) {
        ready = true;
        transport.loadTrack(0);
    }
}

/**
 * Constructs a playlist from the current tracklist and stores it in library.playlist
 * 
 * TODO: Implement shuffle mode and other sort modes.
 */
function buildPlaylist() {
    playlist = [];
    if (shuffleMode) {
        // TODO: implement
    } else {
        for (let i in tracklist) {
            playlist.push(i);
        }
    }
    buildUI();
}


// Event Handlers

/**
 * Load and play a track when its button is clicked
 * @param {Event} event 
 */
function handleClick(event) {
    let trackIndex = parseInt(event.target.id.substring(6));
    transport.loadTrack(trackIndex);
    transport.play();
}

/**
 * Highlight a track's button in the DOM to show that it's playing
 * @param {number} newSelection 
 */
function highlightTrack(newSelection) {
    dom.get("#track_" + highlightedTrack).classList.remove("highlighted");
    highlightedTrack = newSelection;
    dom.get("#track_" + highlightedTrack).classList.add("highlighted");
}


// DOM Management

/**
 * Clear the library interface except its title
 */
function clearUI() {
    node.replaceChildren(ui.createParagraph("Music Library", ["library-title"]));
}

/**
 * Create a button for a playlist track on the DOM.
 * 
 * @param {HTMLElement} parent - DOM node to be appended to
 * @param {number} index - Playlist track index for click handler
 */
function buildTrackUI(parent, index) {
    parent.appendChild(dom.create("div", {
        id: "track_" + index,
        classList: ["library-item", "library-track-button"],
        textContent: trackInfoFromPlaylist(index).title, // TODO: If duplicate title exists, specify filetype and path
        eventListeners: {click: handleClick}
    }));
}

/**
 * Recursive function for building the directory hierarchy on the DOM.
 * 
 * @param {HTMLElement} parent - DOM node to be appended to, topmost is #library
 * @param {Object} obj - Object to crawl, topmost is library.directory
 * @param {string|Object} item - The specific item to handle this turn
 */
function buildDirectoryUI(parent, obj, item) {
    // If this is a track, create a button for it
    if (typeof obj[item] === "string") {
        buildTrackUI(parent, playlistIndexFromPath(obj[item]));
    // If this is a directory...
    } else {
        // Create a collapsible "folder"
        let directoryNode = ui.createDetails(
            item, "", 
            ["library-item", "library-directory-button"]
        );
        // Move one layer deeper and recurse to populate the collapsible
        for (var subItem in obj[item]) {
            buildDirectoryUI(directoryNode, obj[item], subItem);
        }
        // Add the collapsible to the flow
        parent.appendChild(directoryNode);
        // These should be uncollapsed by default for smooth UX
        directoryNode.open = true;
    }
}

/**
 * Construct the directory hierarchy or the playlist in the DOM tree.
 * 
 * Uses the playlist if shuffle is on, otherwise directory tree.
 */
function buildUI() {
    if (playlist.length === 0) {
        node.appendChild(ui.createParagraph("No tracks loaded.\nVisit Settings to load your tracks."));
    } else if (shuffleMode) {
        for (let item in playlist) {
            buildTrackUI(node, item);
        }
    } else {
        for (let item in directory) {
            buildDirectoryUI(node, directory, item);
        }
    }
}
clearUI(); // TODO: find a better place for these initial calls
buildUI();


// Playlist Operation

/**
 * Gets track info from the tracklist for a given index in the playlist.
 * 
 * This is basically a shorthand but I can't easily recall how to do this for some reason.
 * 
 * @example
 * // From a theoretical set of uploaded tracks
 * library.trackInfoFromPlaylist(0) = {
 *     title: "Song1",
 *     src: ObjectURL
 * }
 * 
 * @param {number} selected - Index of a track in the playlist
 * @returns {Object}
 */
function trackInfoFromPlaylist(selected) {
    return tracklist[playlist[selected]];
}

/**
 * Gets the playlist index for a track's file path.
 * 
 * This is basically a shorthand but I can't easily recall how to do this for some reason.
 * 
 * @param {string} selected - A full file path from the tracklist or directory
 * @returns {number}
 */
function playlistIndexFromPath(selected) {
    return playlist.indexOf(selected);
}

/**
 * Toggles shuffle mode then invokes library.buildPlaylist()
 */
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    buildPlaylist();
}