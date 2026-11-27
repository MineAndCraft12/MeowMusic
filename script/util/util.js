/** Contains general-purpose JS utilities */

export { scrubObject }


// Methods

/**
 * Returns a copy of an object or array, not including properties which are undefined or null.
 * 
 * Not recursive; any sub-objects or sub-arrays are preserved as-is.
 * 
 * @example
 * let obj = { key1: "abc", key2: null, key3: "def" }
 * util.scrubObject(obj); // Returns { key1: "abc", key3: "def" }
 * 
 * @example
 * let arr = [0, 1, 2, undefined, 4];
 * let res = util.scrubObject(arr); // Returns [0, 1, 2, 4]
 * ( arr[4] === res[3] ) // => true
 * // arr[3] is skipped, so arr[4] shifts left to res[3]
 * 
 * @param {Object|Array} obj - An object or array
 * @returns {Object}
 */
function scrubObject(obj) {
    // Create an array
    if (Array.isArray(obj)) {
        let newObj = [];

        for (let item in obj) {
            if (obj[item] != null) {
                newObj.push(obj[item]);
            }
        }

        return newObj;
        
    // Create an object
    } else {
        let newObj = {};

        for (let item in obj) {
            if (obj[item] != null) {
                newObj[item] = obj[item];
            }
        }

        return newObj;
    }
}