/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const Helpers = require('./Helpers');

class Document {
      constructor (id = Helpers._null, value = {}) {
          this._id = id;
          this.value = value;
      }

      /*
       * Convert an array of entries to an array of Document objects.
       */
      static convert (entries) {
          return entries.map((entry) => {
               return new Document(entry[0], entry[1]);
          });
      }

      /*
       * Convert a Document to a plain Object.
       */
      static toObject (doc) {
          return Object.assign(Object.create(null), doc);
      }
      toObject (doc = this) {
          return this.constructor.toObject(doc);
      }

      /*
       * Validate a possible Document object.
       */
      static isDocument (obj = {}) {
          return (obj instanceof Document && '_id' in obj && 'value' in obj);
      }
      get isDocument () {
          return this.constructor.isDocument(this);
      }

      /*
       * Mark if this Document was added by the key.
       * Note: This is just extra metadata; not actively used anywhere.
       */
      bykey (value = false) {
          return (this[Symbol.for('bykey')] = value) === value ? this : false;
      }

      /*
       * Allow the class to have a custom object string tag.
       */
      get [Symbol.toStringTag]() {
          return (this.constructor.name || 'Document');
      }
}

/*
 * Export the Document class for use!
 */
module.exports = Document;
