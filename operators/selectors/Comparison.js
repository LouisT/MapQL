/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const isEqual = require('is-equal'),
      Helpers = require('../../lib/Helpers');

/*
 * Validate $in/$nin with support for RegExp, fallback
 * to includes() for arrays and isEqual() otherwise.
 */
class inOrNin {
      validate (val, check) {
          if (Array.isArray(check)) {
             return (Array.isArray(val)) ? val.some(v2 => check.some(c2 => this.test(v2, c2))) : check.some(c2 => this.test(val, c2));
           } else if (Array.isArray(val)) {
             return val.some(v2 => this.test(v2, check));
          }
          return this.test(val, check);
      }
      test (val, check) {
          if (Helpers.is(val, 'RegExp') && Helpers.is(check, 'RegExp')) {
             return isEqual(val, check);
           } else if (Helpers.is(val, 'RegExp')) {
             return val.test(check);
           } else if (Helpers.is(check, 'RegExp')) {
             return check.test(val);
          }
          return (Array.isArray(check) ? check.includes(val) : (Array.isArray(val) ? val.includes(check) : isEqual(val, check)));
      }
}

module.exports = {
    '$eq': {
        fn: function (val = true, eq = false) {
            return isEqual(val, eq);
        }
    },
    '$gt': {
        fn: function (val, lt) {
            return val > lt;
        }
    },
    '$gte': {
        fn: function (val, lte) {
            return val >= lte;
        }
    },
    '$lt': {
        fn: function (val, gt) {
            return val < gt;
        }
    },
    '$lte': {
        fn: function (val, gte) {
            return val <= gte;
        }
    },
    '$ne': {
        fn: function (val, ne) {
            return val !== ne;
        }
    },
    '$in': {
        fn: function (val, _in) {
            return new inOrNin().validate(val, _in);
        }
    },
    '$nin': {
        fn: function (val, nin) {
            return !(new inOrNin().validate(val, nin));
        }
    }
};
