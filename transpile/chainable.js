/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 *
 * NOTE: This file is used for transpiling ES6 to ES5! See `./main.js`.
 */
'use strict';

const MapQL = require('./polyfill'),
      ChainManager = require('../src/ChainManager');

/*
 * Add the chain() function to MapQL to allow for chained queries.
 *     {Instance}.chain().gt('foo', 5).lt('bar', 100).execute();
 */
MapQL.prototype.chain = function () {
    return new ChainManager(this);
}

module.exports = (typeof window !== 'undefined' ? window : {}).MapQL = MapQL;

