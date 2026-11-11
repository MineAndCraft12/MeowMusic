/** Represents the music library and playlist */

import * as transport from "./transport.js";
import * as catalog from "../ui/catalog.js";

export {
    ready,
    tracklist, directory, playlist,
    loadDirectory,
    trackInfoFromPlaylist,
    playlistIndexFromPath,
    toggleShuffle, getShuffle
}


// Variables

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


// Shuffle Controls

/**
 * Gets the state of Shuffle Mode
 * @returns {boolean}
 */
function getShuffle() {
    return shuffleMode;
}

/**
 * Toggles shuffle mode then invokes library.buildPlaylist()
 */
function toggleShuffle() {
    shuffleMode = !shuffleMode;
    let nowPlaying = playlist[transport.getPlayingIndex()];
    
    buildPlaylist();

    transport.setPlayingIndex(playlistIndexFromPath(nowPlaying));
    catalog.highlightTrack(playlistIndexFromPath(nowPlaying));
}


// Tracklist Construction

/**
 * Revokes all ObjectURLs and empties the tracklist, directory, and playlist.
 * 
 * Makes the library unready for action.
 */
function clearTracklist() {
    ready = false;
    catalog.clearUI();

    // Release our lock on the user's files
    for (let i in tracklist) {
        URL.revokeObjectURL(tracklist[i]);
    }

    catalog.resetHighlight();

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
        let fileMetaHints = file.webkitRelativePath.split("/");
        let album = "";
        let artist = "";

        if (fileMetaHints.length > 2) {
            album = fileMetaHints[fileMetaHints.length - 2];
            artist = fileMetaHints[fileMetaHints.length - 3];
        } else if (fileMetaHints.length === 2) {
            album = fileMetaHints[0];
        }

        let  title = file.name.substring(0, file.name.lastIndexOf("."));

        tracklist[file.webkitRelativePath] = {
            title: title,
            src: URL.createObjectURL(file),
            meta: new MediaMetadata({
                title: title,
                album: album,
                artist: artist
            })
        };

        list[file.name] = file.webkitRelativePath;
    }
}

/**
 * Pass to Array.sort() for alphabetical sort based on full filepath.
 * 
 * @param {File} fileA - First file to compare
 * @param {File} fileB - Second file to compare
 * @returns {number} Information for Array.sort()
 */
function sortFiles(fileA, fileB) {
    return fileA.webkitRelativePath.localeCompare(fileB.webkitRelativePath, undefined, {
        sensitivity: "base",
        numeric: true
    });
}

/**
 * Loads the user's uploaded directory into the music library.
 * 
 * Also invokes library.buildPlaylist().
 * If the playlist is not empty. the library is ready for action.
 * 
 * @param {FileList} uploadedFiles - The user's uploaded FileList.
 */
function loadDirectory(uploadedFiles) {
    clearTracklist();
    transport.reset();

    let files = Array.from(uploadedFiles);
    files.sort(sortFiles);

    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith("audio/")) {
            let path = files[i].webkitRelativePath.split("/");
            // Recursively create an object path to this file
            storeTrack(directory, path, files[i]);
        }
    }

    buildPlaylist();
    if (playlist.length > 0) {
        catalog.clearUI();
        catalog.buildUI();
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

    for (let item in tracklist) {
        playlist.push(item);
    }

    if (shuffleMode) {
        // Fisher-Yates algo from javascript.info
        for (let item = playlist.length - 1; item > 0; item--) {
            let pointer = Math.floor(Math.random() * (item + 1));
            [
                playlist[item],
                playlist[pointer]
            ] = [
                playlist[pointer],
                playlist[item]
            ];
        }
    }

    catalog.clearUI();
    catalog.buildUI();
}


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