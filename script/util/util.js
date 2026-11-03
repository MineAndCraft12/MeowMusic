/** Contains general-purpose JS utilities */

export {
    Tau,
    scrubObject
}


// Mathematical Constants

const Tau = Math.PI * 2;


// Methods

/**
 * Returns a copy of an object, not including properties which are undefined or null.
 * 
 * @example
 * let obj = {
 *     key1: "abc",
 *     key2: undefined,
 *     key3: null
 * }
 * util.scrubObject(obj) // Returns { key1: "abc" }
 * 
 * @param {Object} obj
 * @returns {Object}
 */
function scrubObject(obj) {
    let newObj = {};

    for (let item in obj) {
        if (obj[item] != null) {
            newObj[item] = obj[item];
        }
    }

    return newObj;
}