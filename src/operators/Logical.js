/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
module.exports = {
    '$or': {
        fn: [].some
    },
    '$and': {
        fn: [].every
    }
};
