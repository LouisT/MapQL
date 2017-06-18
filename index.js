/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
// Support browser(ify) and node.
module.exports = (typeof window !== 'undefined' ? window : {}).MapQL = require('./src/MapQL');
