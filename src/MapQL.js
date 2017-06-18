/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const queryOperators = require('./operators/Query'),
      logicalOperators = require('./operators/Logical'),
      updateOperators = require('./operators/Update'),
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
       * Convert the query/update object to an Object with an Array
       * of queries or update modifiers.
       */
      compile (obj = {}, update = false) {
          let results = {
              operator: false,
              list: []
          };
          for (let key of Object.keys(obj)) {
              let isLO = this.isLogicalOperator(key);
              if (Helpers.is(obj[key], 'object')) {
                 for (let mode of Object.keys(obj[key])) {
                     results.list.push([key, mode, obj[key][mode]]);
                 }
               // If the query is an array, treat it as a logical operator.
               } else if (isLO && Array.isArray(obj[key])) {
                 for (let subobj of obj[key]) {
                     // Recursively compile sub-queries for logical operators.
                     results.list.push(this.compile(subobj));
                 }
                 // Store the logical operator for this query; used in _validate().
                 results.operator = key;
               } else {
                 let isUQ = (update ? this.isUpdateOperator(key) : this.isQueryOperator(key));
                 results.list.push([
                     update ? (isUQ ? key : '$set') : (isUQ ? Helpers._null : key),
                     (isUQ || update) ? key : '$eq',
                     obj[key]
                 ]);
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
       *  Get the valid query, logical, and update operators; with and without static to
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
      static get updateOperators () {
          return updateOperators;
      }
      get updateOperators () {
          return updateOperators;
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
       * Check if a string is an update operator.
       */
      isUpdateOperator (uo = Helpers._null) {
          return this.updateOperators.hasOwnProperty(uo) == true;
      }

      /*
       * Get the update operator by name.
       */
      getUpdateOperator (uo = '$_default') {
          return this.updateOperators[uo] ? this.updateOperators[uo] : this.updateOperators['$_default'];
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
                 return this.getQueryOperator(_query[1]).fn.apply(this, [
                     Helpers.dotNotation(_query[0], entry[1], { autoCreate: false }), // Entry value
                     _query[2], // Test value
                     _query[0], // Test key
                     entry      // Entry [<Key>, <Value>]
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
          let _queries = this.compile(queries);
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

      /*
       * Update entries using update modifiers if they match
       * the provided query operators. Returns the query Cursor,
       * after updates are applied to the Documents.
       */
      update (query, modifiers, options = {}) {
          let opts = Object.assign({ multi: false }, options),
              cursor = this[opts.multi ? 'find' : 'findOne'](query);
          if (!cursor.empty()) {
             let update = this.compile(modifiers, true);
             if (!!update.list.length) {
                for (let entry of cursor) {
                    update.list.forEach((_update) => {
                        this.getUpdateOperator(_update[0]).fn.apply(this, [_update[1], _update[2], entry, this]);
                    });
                }
             }
          }
          return cursor;
      }

      /*
       * Export current Document's to JSON key/value.
       *
       * Note: Any 'null' key gets converted to a string. Since null is a valid key,
       *       import() automatically converts every "null" string into null.
       */
      export (options = {}) {
          let opts = Object.assign({
              stringify: true,
              promise: false,
              pretty: false,
          }, options);
          try {
              let obj = Object.create(null);
              for (let [key, val] of this) {
                  obj[key] = val;
              }
              return ((res) => {
                  return (opts.promise ? Promise.resolve(res) : res);
              })(opts.stringify ? JSON.stringify(obj, true, (opts.pretty ? 4 : 0)) : obj);
           } catch (error) {
             return (promise ? Promise.reject(error) : error);
          }
      }

      /*
       * Import JSON key/value objects as entries; usually from export().
       *
       * Note: If a string is passed, attempt to parse with JSON.parse(),
       *       otherwise assume to be a valid Object.
       */
      import (json, options = {}) {
          let opts = Object.assign({
              promise: false
          }, options);
          try {
              let obj = (Helpers.is(json, 'string') ? JSON.parse(json) : json);
              for (let key of Object.keys(obj)) {
                  this.set((key === "null" ? null : key), obj[key]);
              }
           } catch (error) {
              if (opts.promise) {
                 return Promise.reject(error);
               } else {
                 throw error;
              }
          }
          return (opts.promise ? Promise.resolve(this) : this);
      }
}

/*
 * Export the module for use!
 */
module.exports = MapQL;
