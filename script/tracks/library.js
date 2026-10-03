/** Represents the music library and playlist */

import * as transport from "./transport.js";
import * as dom from "../util/dom.js";

export {
    ready,
    tracklist, directory, playlist,
    loadDirectory, buildPlaylist,
    trackInfoFromPlaylist,
    toggleShuffle
}

/**
 * Describes whether the library is ready for action.
 * 
 * true: It is safe to interact with the library.
 * 
 * false: It is unsafe to interact with the library right now.
 * @type {boolean}
 */
let ready = false;

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

/**
 * Revokes all ObjectURLs and empties the tracklist, directory, and playlist.
 * 
 * Makes the library unready for action.
 */
function clearTracklist() {
    ready = false;

    for (var i in tracklist) {
        URL.revokeObjectURL(trackList[i]);
    }

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
    if (path.length > 1) {
        let newList = path.shift();
        if (!list.hasOwnProperty(newList)) {
            list[newList] = {};
        }
        storeTrack(list[newList], path, file);
    } else {
        let trackInfo = {
            title: file.name.substring(0, file.name.indexOf(".")),
            src: URL.createObjectURL(file)
        }
        tracklist[file.webkitRelativePath] = trackInfo;
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
            storeTrack(directory, path, files[i]);
        } /*else if (files[i].name === ".meowmusic") {
            // TODO: implement
        }*/
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
    let debugLibrary = dom.get("#debug-library");
    if (shuffleMode) {
        // TODO: implement
    } else {
        // TODO: erase all instances of debugLibrary from js and html
        // TODO: implement the library GUI
        for(let i in tracklist) {
            playlist.push(i);
            debugLibrary.appendChild(dom.create("li", {
                textContent: tracklist[i].title
            }))
        }
    }
}

/**
 * Gets track info from the tracklist for a given index in the playlist.
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
 * Determines whether library.buildPlaylist() uses shuffle mode.
 * @type {boolean}
 */
let shuffleMode = false;

/**
 * Toggles shuffle mode then invokes library.buildPlaylist()
 */
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    buildPlaylist();
}