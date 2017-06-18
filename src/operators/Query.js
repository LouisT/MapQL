/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const _Comparison = require('./selectors/Comparison'),
      _Element = require('./selectors/Element'),
      _Evaluation = require('./selectors/Evaluation'),
      _Array = require('./selectors/Array');
/*
 * Export with all selectors combined into a single Object.
 */
module.exports = Object.assign({
    '$_default': {
        fn: function () {
            return true;
        }
    }
}, _Comparison, _Element, _Evaluation, _Array);
