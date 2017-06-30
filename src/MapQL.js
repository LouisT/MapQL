/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const queryOperators = require('./operators/Query'),
      logicalOperators = require('./operators/Logical'),
      updateOperators = require('./operators/Update'),
      MapQLDocument = require('./Document'),
      Cursor = require('./Cursor'),
      Helpers = require('./Helpers'),
      GenerateID = new (require('./GenerateID'))(),
      isEqual = require('is-equal');

class MapQL extends Map {
      constructor (_map) {
          super(_map);
      }

      /*
       * Allow MapQL to generate an incremented key if key is omitted.
       */
      set (key = Helpers._null, value = Helpers._null) {
          return Map.prototype.set.call(this, (value === Helpers._null ? GenerateID.next() : key), (value !== Helpers._null ? value : key));
      }

      /*
       *  Check if MapQL has a specific key, if strict is false return
       *  true if the keys are only similar.
       */
      has (key, strict = true) {
          if (!strict) {
             return [...this.keys()].some((_key) => {
                 return isEqual(key, _key);
             });
          }
          return Map.prototype.has.call(this, key);
      }
      /*
       * Get a key if it exists, if strict is false return value if the
       * keys are only similar.
       */
      get (key, strict = true) {
          if (!strict) {
             for (let [_key, value] of [...this.entries()]) {
                 if (isEqual(key, _key)) {
                    return value;
                 }
             }
             return Helpers._null;
          }
          return Map.prototype.get.call(this, key);
      }


      /*
       * Convert the query/update object to an Object with an Array
       * of queries or update modifiers.
       */
      compile (queries = {}, update = false) {
          let results = {
              operator: false,
              list: []
          };
          for (let key of Object.keys(queries)) {
              let isLO = this.isLogicalOperator(key);
              if (Helpers.is(queries[key], 'Object')) {
                 for (let mode of Object.keys(queries[key])) {
                     results.list.push([key, mode, queries[key][mode]]);
                 }
               // If the query is an array, treat it as a logical operator.
               } else if (isLO && Array.isArray(queries[key])) {
                 for (let subobj of queries[key]) {
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
                     queries[key]
                 ]);
              }
          }
          return results;
      }

      /*
       * Validate a possible Document.
       */
      isDocument (obj) {
          return MapQLDocument.isDocument(obj);
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
          return this.queryOperators.hasOwnProperty(qs) === true;
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
          return this.logicalOperators.hasOwnProperty(lo) === true;
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
          return this.updateOperators.hasOwnProperty(uo) === true;
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
          if (Helpers.is(queries, '!Object')) {
             let value;
             if ((value = this.get(queries, false)) !== Helpers._null) {
                return new Cursor(queries, true).add(new MapQLDocument(queries, value));
             }
             queries = { '$eq' : queries };
          }
          let _queries = this.compile(queries);
          if (!!_queries.list.length) {
             let cursor = new Cursor(queries, bykey);
             for (let entry of this.entries()) {
                 if (this._validate(!bykey ? entry : [entry[0], entry[0]], _queries)) {
                    cursor.add(new MapQLDocument(entry[0], entry[1], bykey));
                    if (one) {
                       return cursor;
                    }
                 }
             }
             return cursor;
           } else {
             return new Cursor().add(MapQLDocument.convert(one ? [[...this.entries()][0]] : [...this.entries()]));
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
      update (queries, modifiers, options = {}) {
          let opts = Object.assign({
                  multi: false,
                  projections: {}
              }, options),
              cursor = this[Helpers.is(queries, 'String') ? 'findByKey' : 'find'](queries, opts.projections, !opts.multi);
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
       * Delete entries if they match the provided query operators.
       * If queries is an Array or String of key(s), treat as array
       * and remove each key. Returns an Array of deleted IDs. If
       * `multi` is true remove all matches.
       */
      remove (queries, multi = false) {
          let removed = [];
          if (Helpers.is(queries, '!Object')) {
             for (let key of (Array.isArray(queries) ? queries : [queries])) {
                 if (this.has(key) && this.delete(key)) {
                    removed.push(key);
                 }
             }
           } else {
             let _queries = this.compile(queries);
             if (!!_queries.list.length) {
                for (let entry of this.entries()) {
                    if (this._validate(entry, _queries)) {
                       if (this.delete(entry[0])) {
                          if (!multi) {
                             return [entry[0]];
                           } else {
                             removed.push(entry[0]);
                          }
                       }
                    }
                }
             }
          }
          return removed;
      }

      /*
       * Export current Document's to JSON key/value.
       *
       * Please see README about current import/export downfalls.
       */
      export (options = {}) {
          let opts = Object.assign({
              stringify: true,
              promise: false,
              pretty: false,
          }, options);
          try {
              let _export = (value) => {
                      if (Helpers.is(value, 'Set')) {
                         return [...value].map((k) => [_export(k), Helpers.typeToInt(Helpers.getType(k))]);
                       } else if (Helpers.is(value, ['MapQL', 'Map'], false, true)) {
                         return [...value].map(([k,v]) => [_export(k), _export(v), Helpers.typeToInt(Helpers.getType(k)), Helpers.typeToInt(Helpers.getType(v))]);
                       } else if (Helpers.is(value, 'Array')) {
                         return value.map((value) => { return [_export(value), Helpers.typeToInt(Helpers.getType(value))]; });
                       } else if (Helpers.is(value, 'Object')) {
                         for (let key of Object.keys(value)) {
                             value[key] = convertValueByType(value[key], Helpers.getType(value[key]), _export);
                         }
                       } else if (isTypedArray(value)) {
                         return Array.from(value);
                      }
                      return convertValueByType(value, Helpers.getType(value));
                  },
                  exported = _export(Helpers.deepClone(this, MapQL));

              return ((res) => {
                  return (opts.provalueise ? Promise.resolve(res) : res);
              })(opts.stringify ? JSON.stringify(exported, null, (opts.pretty ? 4 : 0)) : exported);
            } catch (error) {
              return (opts.promise ? Promise.reject(error) : error);
          }
      }

      /*
       * Import JSON key/value objects as entries; usually from export().
       *
       * Please see README about current import/export downfalls.
       *
       * Note: If a string is passed, attempt to parse with JSON.parse(),
       *       otherwise assume to be a valid Object.
       */
      import (json, options = {}) {
          let opts = Object.assign({
              promise: false
          }, options);
          try {
              (Helpers.is(json, 'String') ? JSON.parse(json) : json).map((entry) => {
                  this.set(fromType(entry[0], entry[2] || ''), fromType(entry[1], entry[3] || ''));
              });
            } catch (error) {
              if (opts.promise) {
                 return Promise.reject(error);
               } else {
                 throw error;
              }
          }
          return (opts.promise ? Promise.resolve(this) : this);
      }


      /*
       * Allow the class to have a custom object string tag.
       */
      get [Symbol.toStringTag]() {
          return (this.constructor.name || 'MapQL');
      }
}

/*
 * Check if is typed array or Buffer (Uint8Array).
 */
function isTypedArray (value) {
         try {
             if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
                return true;
             }
         } catch (error) { }
         return false;
}

/*
 * Convert specific data types to specific values based on type for export().
 */
function convertValueByType (value, type, _export = false) {
         let _return = ((_exp) => {
             return (v, t) => {
                 return _exp ? [_exp(v), t] : v
             }
         })(_export);

         let typeint = Helpers.typeToInt(type);
         switch (type) {
             case 'Date':
                 return _return(value.getTime(), typeint);
             case 'Number':
                 return _return(isNaN(value) ? value.toString() : Number(value), typeint)
             case 'Symbol':
                 return  _return(String(value).slice(7, -1), typeint);
             default:
                 if (_export) {
                    return _return(value, typeint);
                  } else {
                    return _return(Helpers.is(value, ['!Null', '!Boolean', '!Object']) ? value.toString() : value, typeint);
                 }
         }
};

/*
 * Convert strings to required data type, used in import().
 */
function fromType (entry, type) {
         let inttype = Helpers.intToType(type);
         switch (inttype) {
             case 'MapQL': case 'Map':
                 return (new MapQL()).import(entry); // Convert all 'Map()' entries to MapQL.
             case 'Set':
                 return new Set(entry.map((val) => {
                     return fromType(val[0], val[1]);
                 }));
             case 'Array':
                 return entry.map((val) => {
                     return fromType(val[0], val[1]);
                 });
             case 'Object':
                 return ((obj) => {
                     for (let key of Object.keys(obj)) {
                         obj[key] = fromType(obj[key][0], obj[key][1]);
                     }
                     return obj;
                 })(entry);
             case 'Function':
                 // XXX: Function() is a form of eval()!
                 return new Function(`return ${entry};`)();
             case 'RegExp':
                 return RegExp.apply(null, entry.match(/\/(.*?)\/([gimuy])?$/).slice(1));
             case 'Date':
                 return new Date(entry);
             case 'Uint8Array':
                 try {
                     if (Uint8Array && Helpers.getType(Uint8Array) === 'Function') {
                        return new Uint8Array(entry);
                     }
                   } catch (error) {
                     try {
                        return Buffer.from(entry);
                     } catch (error) { return Array.from(entry); }
                 }
             case 'Buffer':
                 try {
                     return Buffer.from(entry);
                   } catch (error) {
                     try {
                         if (Uint8Array && Helpers.getType(Uint8Array) === 'Function') {
                            return new Uint8Array(entry);
                         }
                     } catch (error) { return Array.from(entry); }
                 }
             default:
                 // Execute the function/constructor with the entry value. If type is not a
                 // function or constructor, just return the value. Try without `new`, if
                 // that fails try again with `new`. This attempts to import unknown types.
                 let _fn = (Helpers.__GLOBAL[inttype] ? (new Function(`return ${inttype}`))() : (e) => { return e });
                 try { return _fn(entry); } catch (e) { try { return new _fn(entry); } catch (error) { console.trace(error); } }
         }
}

/*
 * Export the module for use!
 */
module.exports = MapQL;
