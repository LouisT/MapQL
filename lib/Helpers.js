/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
// Create a null Symbol as 'null' is a valid Map() key/value.
const _null = Symbol(null);

/*
 * Get/set a value from an Object/Array based on dot notation.
 *   Object: dot(['a', 'b', 'c'], { a: { b: { c: 1 } } }) == 1
 *   Array:  dot(['a', 'b', 1], { a: { b: [1, 2, 3] } }) == 2
 *   Set: dot(['a', 'b', 'c'], { a: { b: { c: 1 } } }, 2) == 2
 */
function dot (keys = [], obj = {}, value = _null) {
         let _apply = function (keys, obj, value) {
             if (keys.length == 1 && value !== _null) {
                return obj[keys[0]] = value.apply(this, [obj[keys[0]] || _null]);
              } else {
                return (!keys[0] ? obj : _apply(keys.slice(1), (obj.hasOwnProperty(keys[0]) ? obj[keys[0]] : (obj[keys[0]] = {})), value));
             }
         };
         return _apply(keys, obj, (value !== _null ? (is(value, '!function') ? (o, n) => { return n } : value) : value));
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
                   return dot(String(Array.isArray(keys) ? keys[idx] : keys).trim().split('.'), o, value);
               }) : dot((keys !== _null ? String(keys).trim().split('.') : []), obj, value);
    },
    is: (val, type) => {
        return Array.isArray(type) ? type.some((t) => is(val, t)) : is(val, type);
    }
};
