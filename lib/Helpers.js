/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
// Create a null Symbol as 'null' is a valid map key/value.
const _null = Symbol(null);

/*
 * Get/set a value from an Object/Array based on dot notation.
 *   Object: dot('a.b.c', { a: { b: { c: 1 } } }) == 1
 *   Array:  dot('a.b.1', { a: { b: [1, 2, 3] } }) == 2
 */
function dot (key = _null, obj = {}, value = _null) {
         return key !== _null ? String(key).trim().split('.').reduce((a, b, idx, arr) => {
            return value !== _null ? a[b] = (idx !== arr.length -1 ? (a[b] ? a[b] : {}) : value) : a[b];
         }, obj) : obj;
}

/*
 * Test if a variable is the provided type; if type arg is prefixed with `!` test if NOT type.
 */
function is (val, type) {
         try {
             return (/^!/.test(type) !== (Object.prototype.toString.call(val).toLowerCase() === `[object ${type.toLowerCase().replace(/^!/,'')}]`));
          } catch (error) {
             return false;
         }
}

/*
 * Export all of the helper functions.
 */
module.exports = {
    _null: _null,
    dotNotation: (keys = _null, obj = {}, value = _null) => {
        // If multiple objects are provided, get each value one via dot notation.
        return Array.isArray(obj) ? obj.map((o, idx) => {
                   // If `keys` is an array, use the corresponding object index.
                   return dot((Array.isArray(keys) ? keys[idx] : keys), o, value);
               }) : dot(keys, obj, value);
    },
    is: (val, type) => {
        return Array.isArray(type) ? type.some((t) => is(val, t)) : is(val, type);
    }
};
