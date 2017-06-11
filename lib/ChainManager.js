/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const Helpers = require('./Helpers');

class ChainManager {
      constructor (MapQL) {
          // Save a link to MapQL for `execute()`.
          this.MapQL = MapQL;

          // Place holder for chained queries.
          this._chains = {};

          // Place holder for chainable functions.
          this._chainables = {};

          // Generate the chainable functions.
          //   {Instance}.gt(<Key / Value>[, <Value>]).lt(<Key / Value>[, <Value>]).execute([<Projections>)
          Object.keys(this.MapQL.queryOperators).forEach((qo) => {
              let qoName = qo.replace(/^\$/,'');
              this[qoName] = (key, val = Helpers._null, getChain = false) => {
                  return (!getChain ? this._addChain : this._getOperatorChain).call(this, key, val, `${qo}`);
              };
              this._chainables[qoName] = (key, val) => {
                  return this[qoName].call(this, key, val, true);
              };
          });
          Object.keys(this.MapQL.logicalOperators).forEach((lo) => {
              let loName = lo.replace(/^\$/,'');
              this[loName] = (fn = () => { return [] }, getChain = false) => {
                  return (!getChain ? this._addChain : this._getLogicalChain).call(this, Helpers._null, fn, `${lo}`, true);
              };
              this._chainables[loName] = (fn = () => { return [] }) => {
                  return this[loName].call(this, fn, `${lo}`, true);
              };
          });
      }

      /*
       *  Return the chains for query object if not empty otherwise false.
       */
      get query () {
          return !!Object.keys(this._chains).length ? this._chains : false;
      }

      /*
       * Execute the chained commands.
       */
      execute (projections = {}, one = false) {
          return this.MapQL[one ? 'findOne' : 'find'](this.query, projections);
      }

      /*
       * Generate a chainable object.
       */
      _getOperatorChain (key, val = Helpers._null, $qo = '$eq') {
          try {
              return this.MapQL.constructor.queryOperators[$qo].chain(key, val, $qo);
           } catch (error) {
              return val !== Helpers._null ? { [key] : { [$qo]: val } } : { [$qo]: key };
          }
      }
      _getLogicalChain (undf, fn = () => { return [] }, $lo = '$and') {
          return { [$lo] : fn.call(this, this._chainables) };
      }

      /*
       * Builed the chain operator and logical object with all the queries.
       */
      _addChain (key, val, $type = '$eq', logical = false) {
          Object.assign(this._chains, (!logical ? this._getOperatorChain : this._getLogicalChain).call(this, key, val, $type));
          return this;
      }
}

/*
 * Export the chain manager for use!
 */
module.exports = ChainManager;
