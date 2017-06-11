/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
module.exports = ((list) => {
    let operators = {
        '$_default': {
            fn: function () {
                return true;
            }
         }
    };
    list.forEach((name) => {
        Object.assign(operators, require(`./modifiers/${name}`));
    });
    return operators;
})(['Array', 'Update']);
