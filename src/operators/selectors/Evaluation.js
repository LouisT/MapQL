/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const Helpers = require('../../Helpers');

module.exports = {
    '$regex': {
        fn: function (val, regex = /./gi) {
            return (Helpers.is(regex, 'regexp') ? new RegExp(regex) : new RegExp(regex, 'gi')).test(val);
        }
    },
    '$where': {
        fn: function (val, fn = ()=>{}, key, entry) {
            // XXX: Currently if an entry is NOT an object, it is passed as an argument.
            //      Need to figure out if this is the best method of handling this.
            return Helpers.is(fn, 'function') ? fn.call(Helpers.is(entry[1], 'object') ? entry[1] : {}, entry[1]) : false;
        }
    }
};
