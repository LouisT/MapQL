/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
module.exports = {
    '$size': {
        fn: function (val, size) {
            return (Array.isArray(val) ? (parseInt(size, 10) == val.length) : false);
        }
    }
};