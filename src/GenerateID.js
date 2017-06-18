/*!
 * A MongoDB inspired ES6 Map() query language. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const _index = Symbol('_index'),
      _prefix = Symbol('_prefix');

class GenerateID {
      /*
       * The default prefix is the current UNIX timestamp, converted to a string with
       * a radix of 32. You can reverse the string with parseInt(<String>, 32) if needed.
       */
      constructor (prefix = `${(Date.now()/1000).toString(32)}`) {
          this[_index] = 0;
          this[_prefix] = prefix;
      }

      /*
       * Use ES6 generators to handle incrementation.
       */
      *gen () {
          yield `${this[_prefix]}-${this[_index]++}`;
      }

      /*
       * Get an incremented (prefixed) ID.
       */
      next () {
          return this.gen().next().value;
      }
}

/*
 * Export the GenerateID class for use!
 */
module.exports = GenerateID;
