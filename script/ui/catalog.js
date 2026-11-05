/** Represents the music library UI */

import * as dom from "../util/dom.js";
import * as ui from "../ui/ui.js";
import * as library from "../tracks/library.js";

export {
    buildUI, clearUI,
    highlightTrack, resetHighlight
}


// Variables

/**
 * Host DOM node of the library catalog
 * @type {HTMLElement}
 */
const node = dom.get("#library");

/**
 * Points to the highlighted GUI index representing the currently playing track
 * @type {number}
 */
let highlightedTrack = 0;


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

/**
 * Resets the currently highlighted track to index 0
 */
function resetHighlight() {
    highlightedTrack = 0;
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
        textContent: library.trackInfoFromPlaylist(index).title, // TODO: If duplicate title exists, specify filetype and path
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
        buildTrackUI(parent, library.playlistIndexFromPath(obj[item]));
    // If this is a directory...
    } else {
        // Create a collapsible "folder"
        let directoryNode = ui.createDetails(
            item, "", 
            ["library-item", "library-directory-button"],
            undefined, true
        );
        // Move one layer deeper and recurse to populate the collapsible
        for (var subItem in obj[item]) {
            buildDirectoryUI(directoryNode, obj[item], subItem);
        }
        // Add the collapsible to the flow
        parent.appendChild(directoryNode);
    }
}

/**
 * Construct the directory hierarchy or the playlist in the DOM tree.
 * 
 * Uses the playlist if shuffle is on, otherwise directory tree.
 */
function buildUI() {
    if (library.playlist.length === 0) {
        node.appendChild(ui.createParagraph("No tracks loaded.\nVisit Settings to load your tracks."));
    } else if (library.getShuffle()) {
        for (let item in library.playlist) {
            buildTrackUI(node, item);
        }
    } else {
        for (let item in library.directory) {
            buildDirectoryUI(node, library.directory, item);
        }
    }
}