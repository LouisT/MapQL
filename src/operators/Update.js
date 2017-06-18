/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const _Array = require('./modifiers/Array'),
      _Field = require('./modifiers/Field');

/*
 * Export with all modifiers combined into a single Object.
 */
module.exports = Object.assign({
    '$_default': {
        fn: function () {
            return true;
        }
    }
}, _Array, _Field);
