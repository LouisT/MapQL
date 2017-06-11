/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const queryOperators = require('../operators/Query'),
      logicalOperators = require('../operators/Logical'),
      Document = require('./Document'),
      Cursor = require('./Cursor'),
      Helpers = require('./Helpers'),
      GenerateID = require('./GenerateID'),
      _set = Symbol('_set'),
      _keygen = Symbol('_keygen');

class MapQL extends Map {
      constructor (_map) {
          super(_map);
          this[_set] = Map.prototype.set;
          this[_keygen] = new GenerateID();
      }

      /*
       * Allow MapQL to generate an incremented key if key is omitted.
       */
      set (key = Helpers._null, value = Helpers._null) {
          return this[_set]((value === Helpers._null ? this[_keygen].next() : key), (value !== Helpers._null ? value : key));
      }

      /*
       * Convert the query object to an Object with an Array of queries.
       */
      compileQueries (obj = {}) {
          let results = {
              operator: false,
              list: []
          };
          for (let key of Object.keys(obj)) {
              let isOP = this.isOperator(key),
                  isLO = this.isLogical(key);
              if (Helpers.is(obj[key], 'object')) {
                 for (let mode of Object.keys(obj[key])) {
                     results.list.push([key, mode, obj[key][mode]]);
                 }
               // If the query is an array, treat it as a logical operator.
               } else if (isLO && Array.isArray(obj[key])) {
                 for (let subobj of obj[key]) {
                     // Recursively compile sub-queries for logical operators.
                     results.list.push(this.compileQueries(subobj));
                 }
                 // Store the logical operator for this query; used in _validate().
                 results.operator = key;
               } else {
                 results.list.push([isOP ? Helpers._null : key, isOP ? key: '$eq', obj[key]]);
              }
          }
          return results;
      }

      /*
       * Validate a possible Document.
       */
      isDocument (obj) {
          return Document.isDocument(obj);
      }

      /*
       *  Get the valid query and logical operators; with and without static to
       *  avoid this.constructor.<name> calls within the MapQL library itself.
       */
      static get queryOperators () {
          return queryOperators;
      }
      get queryOperators () {
          return queryOperators;
      }
      static get logicalOperators () {
          return logicalOperators;
      }
      get logicalOperators () {
          return logicalOperators;
      }

      /*
       * Check if a string is a query operator.
       */
      isQueryOperator (qs = Helpers._null) {
          return this.queryOperators.hasOwnProperty(qs) == true;
      }

      /*
       * Get the query selector to test against.
       */
      getQueryOperator (qs = '$_default') {
          return this.queryOperators[qs] ? this.queryOperators[qs] : this.queryOperators['$_default'];
      }

      /*
       * Check if a string is a logic operator.
       */
      isLogicalOperator (lo = Helpers._null) {
          return this.logicalOperators.hasOwnProperty(lo) == true;
      }

      /*
       * Get the logic operator by name.
       */
      getLogicalOperator (lo) {
          return this.logicalOperators[lo] ? this.logicalOperators[lo] : { fn: [].every };
      }

      /*
       * Check if a string is a query operator OR a logical operator.
       */
      isOperator (op) {
         return this.isQueryOperator(op);
      }
      isLogical (lo) {
         return this.isLogicalOperator(lo);
      }

      /*
       * Recursively test the query operator(s) against an entry, checking against any
       * logic operators provided.
       */
      _validate (entry = [], queries = {}) {
          return this.getLogicalOperator(queries.operator).fn.call(queries.list, (_query) => {
              if (this.isLogicalOperator(queries.operator)) {
                 return this._validate(entry, _query);
               } else {
                 let value = undefined;
                 try {
                    value = Helpers.dotNotation(_query[0], entry[1]);
                 } catch (error) { }
                 return this.getQueryOperator(_query[1]).fn.apply(this, [
                     value,      // Entry value
                     _query[2],  // Test value
                     _query[0],  // Test key
                     entry       // Entry [<Key>, <Value>]
                 ]);
              }
          });
      }

      /*
       * Check all entries against every provided query selector.
       */
      find (queries = {}, projections = {}, one = false, bykey = false) {
          if (Helpers.is(queries, '!object')) {
             if (this.has(queries)) {
                return new Cursor(queries, true).add(new Document(queries, this.get(queries)));
             }
             queries = { '$eq' : queries };
          }
          let _queries = this.compileQueries(queries);
          if (!!_queries.list.length) {
             let cursor = new Cursor(queries, bykey);
             for (let entry of this.entries()) {
                 if (this._validate(!bykey ? entry : [entry[0], entry[0]], _queries)) {
                    cursor.add(new Document(entry[0], entry[1], bykey));
                    if (one) {
                       return cursor;
                    }
                 }
             }
             return cursor;
           } else {
             return new Cursor().add(Document.convert(one ? [[...this.entries()][0]] : [...this.entries()]));
          }
      }

      /*
       * Check all entries against every provided query selector; return one.
       */
      findOne (queries = {}, projections = {}) {
          return this.find(queries, projections, true);
      }

      /*
       * Check all entry keys against every provided query selector.
       */
      findByKey (queries = {}, projections = {}, one = false) {
          return this.find(queries, projections, one, true);
      }

      /*
       * Check all entries against every provided query selector; Promise based.
       */
      findAsync (queries = {}, projections = {}, one = false) {
          return new Promise((resolve, reject) => {
              try {
                  let results = this.find(queries, projections, one);
                  return !!results.length ? resolve(results) : reject(new Error('No entries found.'));
               } catch (error) {
                  reject(error);
              }
          });
      }
}

/*
 * Export the module for use!
 */
module.exports = MapQL;
