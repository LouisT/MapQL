/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
// Create a null Symbol as 'null' is a valid Map() key/value.
const _null = Symbol(null),
      __GLOBAL = new Function("try { return this === global; } catch (e) { return false; }")() ? global : window,
      { typeToInt, intToType } = require('./DataTypes');

/*
 * Get/set a value from an Object/Array based on dot notation.
 *   Search Object: dot(['a', 'b', 'c'], { a: { b: { c: 1 } } }) == 1
 *   Search Array:  dot(['a', 'b', 1], { a: { b: [1, 2, 3] } }) == 2
 *   Set:           dot(['a', 'b', 'c'], { a: { b: { c: 1 } } }, { value: 2 }) == { a: { b: { c: 2 } } }
 *   Unset:         dot(['a', 'b', 'c'], { a: { b: { c: 1 } } }, { unset: true }) == { a: { b: {} } }
 *   Defined:       dot(['a', 'b', 'c', 2], { a: { b: { c: 1 } } }, { defined: true }) == false
 */
function dot (keys = [], obj = {}, options = {}) {
         let opts = Object.assign({
                 autoCreate: true, // Create an Object key/value if it doesn't exist.
                 value: false,     // Function to set the value if not false.
                 unset: false,     // Unset the Object key if it exists.
                 defined: false    // Return undefined if key does not exist.
             }, options),
             _apply = function (keys, obj, value) {
                 if (keys.length == 1 && (value || opts.unset)) {
                    return opts.unset ? delete obj[keys[0]] : obj[keys[0]] = value.apply(this, [obj[keys[0]] || _null]);
                  } else if (!keys[0]) {
                    return obj;
                  } else if (!opts.autoCreate || opts.defined || opts.unset) {
                    return (obj.hasOwnProperty(keys[0]) ? _apply(keys.slice(1), obj[keys[0]], value) : undefined);
                 }
                 return _apply(keys.slice(1), (obj.hasOwnProperty(keys[0]) ? obj[keys[0]] : (obj[keys[0]] = (!isNaN(parseInt(keys[1], 10)) ? [] : {}))), value);
             };

         try {
             return _apply(keys, obj, (opts.value ? (is(opts.value, '!Function') ? (current, next) => { return next } : opts.value) : opts.value));
           } catch (e) {
             return undefined; // Value must not exist; return undefined!
         }
}

/*
 * Get the variable type.
 */
function getType (val) {
         try {
            if (__GLOBAL['Buffer'] && Buffer.isBuffer && Buffer.isBuffer(val)) {
               return 'Buffer';
            }
         } catch (error) { }
         return Object.prototype.toString.call(val).match(/(?:\[object (.+)\])/i)[1]
};

/*
 * Test if a variable is the provided type; if type arg is prefixed with `!` test if NOT type.
 * If typeOf is true, use 'typeof value' instead of getType.
 */
function is (val, type, typeOf = false) {
         try {
             return (/^!/.test(type) !== ((typeOf ? typeof val : getType(val).toLowerCase()) === type.toLowerCase().replace(/^!/,'')));
           } catch (error) {
             return false;
         }
}

/*
 * Deep clone Map/MapQL objects.
 */
function deepClone (obj, _Map = Map) {
         if (is(obj, 'Null') || is(obj, '!Object', true)) {
            return obj;
         }
         switch (getType(obj)) {
                case 'Date':
                    return new Date(obj.getTime());
                case 'MapQL': case 'Map':
                    return new _Map(deepClone(Array.from(obj), _Map));
                case 'Set':
                    return new Set(deepClone(Array.from(obj), _Map));
                case 'RegExp':
                    return new RegExp(obj);
                case 'Array':
                    return new Array(obj.length).fill(0).map((val, idx) => {
                        return deepClone(obj[idx], _Map)
                    });
                case 'Object':
                    return ((cloned) => {
                        for (let prop in obj) {
                            if (obj.hasOwnProperty(prop)) {
                               cloned[prop] = deepClone(obj[prop], _Map);
                            }
                        }
                        return cloned;
                    })({});
                default: return obj;
         }
}

/*
 * Export all of the helper functions.
 */
module.exports = {
    __GLOBAL: __GLOBAL,
    _null: _null,
    dotNotation: (keys = _null, obj = {}, options = {}) => {
        // If multiple objects are provided, get each value one via dot notation.
        return Array.isArray(obj) ? obj.map((_obj, idx) => {
                   // If `keys` is an array, use the corresponding object index.
                   return dot(String(Array.isArray(keys) ? keys[idx] : keys).trim().split('.'), _obj, options);
               }) : dot((keys !== _null ? String(keys).trim().split('.') : []), obj, options);
    },
    is: (val, type, typeOf = false, some = false) => {
        return Array.isArray(type) ? type[some ? 'some' : 'every']((t) => is(val, t, typeOf)) : is(val, type, typeOf);
    },
    getType: getType,
    deepClone: deepClone,
    typeToInt: typeToInt,
    intToType: intToType
};
