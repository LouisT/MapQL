/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 *
 * NOTE: This file is used for transpiling ES6 to ES5! This loads needed polyfills.
 */
'use strict';

// Only require NEEDED polyfills.
require('core-js/es6/symbol');
require('core-js/es6/map');
require('core-js/es6/object');
require('core-js/es6/reflect');
require('core-js/es6/array');
require('core-js/es6/promise');
require('core-js/fn/typed/array-buffer');

module.exports = (typeof window !== 'undefined' ? window : {}).MapQL = require('../src/MapQL');
