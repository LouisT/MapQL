/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
/*
 * A list of data types used in import/export.
 */
const DataTypes = {
          // List of primitives.
          'Boolean':     0,
          'Null':        1,
          'Undefined':   2,
          'Number':      3,
          'String':      4,
          'Symbol':      5,
          'Object':      6,
          // List of "extra" data types to handle.
          'Array':       7,
          'Function':    8,
          'Date':        9,
          'RegExp':      10,
          'Map':         11,
          'MapQL':       12,
          'Set':         13,
          'Buffer':      14, // Node.js API for Uint8Array()
          'Uint8Array':  15, // Browser equivalent of Node.js Buffer()
      },
      Ints = Object.keys(DataTypes).reduce((obj, key) => Object.assign({}, obj, { [DataTypes[key]]: key }), {});

module.exports = {
    typeToInt: (type = 'undefined') => {
        try {
            return type in DataTypes ? DataTypes[type] : type;
        } catch (error) { return type; }
    },
    intToType: (int = 2) => {
        try {
            return Ints[int] ? Ints[int] : String(int);
        } catch (error) { return int; }
    }
};
