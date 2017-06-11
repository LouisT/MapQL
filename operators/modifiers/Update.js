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
            Helpers.is(entry.value, '!object') ? this.set(entry._id, (entry.value = val)) : Helpers.dotNotation(key, entry.value, val);
        }
    }
};
