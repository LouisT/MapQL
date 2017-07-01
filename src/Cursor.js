/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const Helpers = require('./Helpers'),
      _query = Symbol('_query'),
      _limit = Symbol('_limit');

class Cursor extends Array {
      constructor (query = Helpers._null) {
          super();
          this[_limit] = false;
      }

      /*
       * Get the query used to create this Cursor object.
       */
      get query () {
          return this[_query] ? this[_query] : Helpers._null;
      }

      /*
       * Set the query used to generate this Cursor.
       */
      set query (value) {
          this[_query] = Object.assign({ }, value);
      }

      /*
       * Check if the Cursor already has a Document.
       */
      has (doc) {
          return !(this.indexOf(doc) <= -1);
      }

      /*
       * If `docs` is a valid Document object, add it to the Cursor if it doesn't already exist.
       */
      add (docs = []) {
          Array.prototype.push.apply(this, (Array.isArray(docs) ? docs : [docs]).filter((doc) => {
              return doc.isDocument && !this.has(doc);
          }));

          return this;
      }

      /*
       * Check if this is empty or not.
       */
      empty () {
          return !(this.length >= 1);
      }

      /*
       * Sort by object keys, -1 for descending.
       */
      sort (obj = {}) {
          Object.keys(obj).forEach((key, idx) => {
              Array.prototype.sort.call(this, (a, b) => {
                  if (!(Helpers.is(a.value, 'Object') && Helpers.is(b.value, 'Object'))) {
                     return 0;
                  }
                  let vals = Helpers.dotNotation(key, [a.value, b.value]);
                  return (vals[0] < vals[1]) ? -1 : ((vals[0] > vals[1]) ? 1 : 0);
               })[obj[key] === -1 ? 'reverse' : 'valueOf']().forEach((val, idx2) => {
                  this[idx2] = val;
              });
          });
          return this;
      }

      /*
       * Return a specified number of results, default to 1.
       */
      limit (num = 1) {
          return Helpers.is((this[_limit] = num), 'Number') ? this.slice(0, this[_limit]) : this;
      }

      /*
       * Allow the class to have a custom object string tag.
       */
      get [Symbol.toStringTag]() {
          return (this.constructor.name || 'Cursor');
      }
}

/*
 * Export the `Cursor` class for use!
 */
module.exports = Cursor;
