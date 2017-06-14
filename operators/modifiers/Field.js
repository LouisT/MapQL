/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const isEqual = require('is-equal'),
      Helpers = require('../../lib/Helpers');

module.exports = {
    '$set': {
        fn: function (key, val, entry) {
            Helpers.is(entry.value, '!object') ? this.set(entry._id, (entry.value = val)) : Helpers.dotNotation(key, entry.value, () => {
                return val;
            });
        }
    },
    '$inc': {
        fn: function (key, val, entry) {
            let _val = parseInt(val, 10);
            Helpers.is(entry.value, '!object') ? this.set(entry._id, (entry.value = (parseInt(entry.value, 10) + _val))) : Helpers.dotNotation(key, entry.value, (current) => {
                return (current !== Helpers._null ? parseInt(current, 10) + _val : _val);
            });
        }
    },
    '$mul': {
        fn: function (key, val, entry) {
            let _val = parseInt(val, 10);

            Helpers.is(entry.value, '!object') ? this.set(entry._id, (entry.value = parseInt(entry.value, 10) * _val)) : Helpers.dotNotation(key, entry.value, (current) => {
                return (current !== Helpers._null ? parseInt(current, 10) * _val : _val);
            });
        }
    },
    '$unset': {
        fn: function (key, val, entry) {
            Helpers.is(entry.value, '!object') ? this.delete(entry._id, (entry.value = undefined)) : Helpers.dotNotation(key, entry.value, undefined, true);
        }
    }
};
