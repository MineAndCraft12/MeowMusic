/** Contains utils to help throw errors */

export { type, range, empty, custom }

/**
 * Returns a standardised TypeError but does not throw it
 * 
 * @example
 * // myModule.js
 * export function myFunction(myParameter) {
 *     // This function expects this parameter to be a string
 *     if (typeof myParameter !== "string") {
 *         throw error.type("myModule.myFunction", "myParameter", "string", typeof myParameter);
 *     }
 * }
 * 
 * @param {string} trace - Name of the error's origin function.
 * @param {string} parameter - Name of the function parameter that caused the error.
 * @param {string|Array.<string>} expected - Type or list of types expected.
 * @param {string} actual - The actual type encountered, which caused the error.
 * @returns {TypeError}
 */
function type(trace, parameter, expected, actual) {
    // Handle parameters
    if (typeof trace !== "string") {
        throw type("error.type", "trace", "string", typeof trace);
    }
    if (typeof parameter !== "string") {
        throw type("error.type", "parameter", "string", typeof parameter);
    }
    if (typeof expected === "object") {
        expected = expected.join(" or ");
    } else if (typeof expected !== "string") {
        throw type("error.type", "expected", ["string", "string[]"], typeof expected);
    }
    if (typeof actual !== "string") {
        throw type("error.type", "actual", "string", typeof actual);
    }
    
    // Contruct error
    return new TypeError(`Failed to execute '${trace}': Parameter '${parameter}' expects ${expected}, instead got ${actual}`);
}

/**
 * Returns a standardised RangeError but does not throw it
 * 
 * @example
 * // myModule.js
 * export function myFunction(myParameter) {
 *     // This function expects this parameter to contain exactly five items
 *     if (myParameter.length !== 5) {
 *         throw error.range("myModule.myFunction", "myParameter", "must contain exactly 5 items");
 *     }
 * }
 * 
 * @param {string} trace - Name of the error's origin function.
 * @param {string} parameter - Name of the function parameter that caused the error.
 * @param {string} message - Message which details why the parameter is out of range.
 * @returns {RangeError}
 */
function range(trace, parameter, message) {
    // Handle parameters
    if (typeof trace !== "string") {
        throw type("error.range", "trace", "string", typeof trace);
    }
    if (typeof parameter !== "string") {
        throw type("error.range", "parameter", "string", typeof parameter);
    }
    if (typeof message !== "string") {
        throw type("error.range", "message", "string", typeof message);
    }

    // Construct error
    return new RangeError(`Failed to execute '${trace}': Parameter '${parameter}' ${message}`);
}

/**
 * Returns a standardised RangeError for an empty string but does not throw it
 * 
 * @example
 * // myModule.js
 * export function myFunction(myParameter) {
 *     // This function expects this parameter to not be empty
 *     if (myParameter.length === 0) {
 *         throw error.empty("myModule.myFunction", "myParameter");
 *     }
 * }
 * 
 * @param {string} trace - Name of the error's origin function.
 * @param {string} parameter - Name of the function parameter that caused the error.
 * @param {string} message - Message which details why the parameter is out of range.
 * @returns {RangeError}
 */
function empty(trace, parameter) {
    // Handle parameters
    if (typeof trace !== "string") {
        throw type("error.empty", "trace", "string", typeof trace);
    }
    if (typeof parameter !== "string") {
        throw type("error.empty", "parameter", "string", typeof parameter);
    }

    // Construct error
    return new RangeError(`Failed to execute '${trace}': Parameter '${parameter}' must not be empty`);
}

/**
 * Returns a standardised Error with an empty message but does not throw it
 * 
 * @example
 * // myModule.js
 * export function myFunction() {
 *     // This function has encountered an error
 *     throw error.custom("myModule.myFunction", "Something went wrong");
 * }
 * 
 * @param {string} trace - Name of the error's origin function.
 * @param {string} parameter - Name of the function parameter that caused the error.
 * @param {string} message - Message which details why the parameter is out of range.
 * @returns {RangeError}
 */
function custom(trace, message) {
    // Handle parameters
    if (typeof trace !== "string") {
        throw type("error.custom", "trace", "string", typeof trace);
    }
    if (typeof message !== "string") {
        throw type("error.custom", "message", "string", typeof message);
    }

    // Construct error
    return new Error(`Failed to execute '${trace}': ${message}`);
}