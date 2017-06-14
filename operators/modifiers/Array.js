/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
let Helpers = require('../../lib/Helpers');

module.exports = {
     '$pop': {
         fn: function (key, val, entry) {
             if (Helpers.is(entry.value, 'object')) {
                Helpers.dotNotation(key, entry.value, {
                    value: (current) => {
                        if (Array.isArray(current)) {
                           current[(val == -1 ? 'pop' : 'shift')]();
                        }
                        return (current !== Helpers._null ? current : []);
                    }
                });
              } else if (Helpers.is(entry.value, 'array')) {
                entry.value[(val == -1 ? 'pop' : 'shift')]();
             }
         }
     }
};
