/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const MapQL = require('../lib/MapQL'),
      ChainManager = require('../lib/ChainManager');

/*
 * Add the chain() function to MapQL to allow for chained queries.
 *     {Instance}.chain().gt('foo', 5).lt('bar', 100).execute();
 */
MapQL.prototype.chain = function () {
    return new ChainManager(this);
}

module.exports = MapQL;
