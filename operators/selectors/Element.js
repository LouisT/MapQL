/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const Helpers = require('../../lib/Helpers');

module.exports = {
    '$exists': {
        chain: function (key, val) {
            let isbool = Helpers.is(key, 'boolean'),
                check = val !== Helpers._null ? val : (isbool ? key : true);
            return !isbool || val !== Helpers._null ? { [key] : { '$exists': check } } : { '$exists': check };
        },
        fn: function (val, bool, keys = Helpers._null, entry) {
            try {
               return bool === (Helpers.dotNotation(keys, entry[1]) !== undefined);
             } catch (error) {
               return keys === Helpers._null ? (bool === undefined ? true : bool) : false;
            }
        }
    },
    '$type': {
        fn: function (val, type) {
            return Helpers.is(val, type);
        }
    }
};
