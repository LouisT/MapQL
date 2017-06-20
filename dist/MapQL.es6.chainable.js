/*!
 * MapQL v0.0.4 - A MongoDB inspired ES6 Map() query langauge. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license - https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 * Updated on 20-06-2017 at 22:06:48
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
const MapQL = require('../'),
      ChainManager = require('../src/ChainManager');
MapQL.prototype.chain = function () {
    return new ChainManager(this);
}

module.exports = (typeof window !== 'undefined' ? window : {}).MapQL = MapQL;


},{"../":2,"../src/ChainManager":19}],2:[function(require,module,exports){
'use strict';
module.exports = (typeof window !== 'undefined' ? window : {}).MapQL = require('./src/MapQL');

},{"./src/MapQL":24}],3:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],4:[function(require,module,exports){
var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":3}],5:[function(require,module,exports){
var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":4}],6:[function(require,module,exports){
'use strict';

var isCallable = require('is-callable');
var fnToStr = Function.prototype.toString;
var isNonArrowFnRegex = /^\s*function/;
var isArrowFnWithParensRegex = /^\([^\)]*\) *=>/;
var isArrowFnWithoutParensRegex = /^[^=]*=>/;

module.exports = function isArrowFunction(fn) {
	if (!isCallable(fn)) { return false; }
	var fnStr = fnToStr.call(fn);
	return fnStr.length > 0 &&
		!isNonArrowFnRegex.test(fnStr) &&
		(isArrowFnWithParensRegex.test(fnStr) || isArrowFnWithoutParensRegex.test(fnStr));
};

},{"is-callable":8}],7:[function(require,module,exports){
'use strict';

var boolToStr = Boolean.prototype.toString;

var tryBooleanObject = function tryBooleanObject(value) {
	try {
		boolToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var boolClass = '[object Boolean]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isBoolean(value) {
	if (typeof value === 'boolean') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryBooleanObject(value) : toStr.call(value) === boolClass;
};

},{}],8:[function(require,module,exports){
'use strict';

var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class /;
var isES6ClassFn = function isES6ClassFn(value) {
	try {
		var fnStr = fnToStr.call(value);
		var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
		var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
		var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
		return constructorRegex.test(spaceStripped);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionObject(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};

},{}],9:[function(require,module,exports){
'use strict';

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function () {
	var mapForEach = (function () {
		if (typeof Map !== 'function') { return null; }
		try {
			Map.prototype.forEach.call({}, function () {});
		} catch (e) {
			return Map.prototype.forEach;
		}
		return null;
	}());

	var setForEach = (function () {
		if (typeof Set !== 'function') { return null; }
		try {
			Set.prototype.forEach.call({}, function () {});
		} catch (e) {
			return Set.prototype.forEach;
		}
		return null;
	}());

	return { Map: mapForEach, Set: setForEach };
};

},{}],11:[function(require,module,exports){
'use strict';

var isSymbol = require('is-symbol');

module.exports = function getSymbolIterator() {
	var symbolIterator = typeof Symbol === 'function' && isSymbol(Symbol.iterator) ? Symbol.iterator : null;

	if (typeof Object.getOwnPropertyNames === 'function' && typeof Map === 'function' && typeof Map.prototype.entries === 'function') {
		Object.getOwnPropertyNames(Map.prototype).forEach(function (name) {
			if (name !== 'entries' && name !== 'size' && Map.prototype[name] === Map.prototype.entries) {
				symbolIterator = name;
			}
		});
	}

	return symbolIterator;
};

},{"is-symbol":18}],12:[function(require,module,exports){
'use strict';

var whyNotEqual = require('./why');

module.exports = function isEqual(value, other) {
	return whyNotEqual(value, other) === '';
};

},{"./why":13}],13:[function(require,module,exports){
'use strict';

var ObjectPrototype = Object.prototype;
var toStr = ObjectPrototype.toString;
var booleanValue = Boolean.prototype.valueOf;
var has = require('has');
var isArrowFunction = require('is-arrow-function');
var isBoolean = require('is-boolean-object');
var isDate = require('is-date-object');
var isGenerator = require('is-generator-function');
var isNumber = require('is-number-object');
var isRegex = require('is-regex');
var isString = require('is-string');
var isSymbol = require('is-symbol');
var isCallable = require('is-callable');

var isProto = Object.prototype.isPrototypeOf;

var namedFoo = function foo() {};
var functionsHaveNames = namedFoo.name === 'foo';

var symbolValue = typeof Symbol === 'function' ? Symbol.prototype.valueOf : null;
var symbolIterator = require('./getSymbolIterator')();

var collectionsForEach = require('./getCollectionsForEach')();

var getPrototypeOf = Object.getPrototypeOf;
if (!getPrototypeOf) {
	if (typeof 'test'.__proto__ === 'object') {
		getPrototypeOf = function (obj) {
			return obj.__proto__;
		};
	} else {
		getPrototypeOf = function (obj) {
			var constructor = obj.constructor,
				oldConstructor;
			if (has(obj, 'constructor')) {
				oldConstructor = constructor;
				if (!(delete obj.constructor)) { // reset constructor
					return null; // can't delete obj.constructor, return null
				}
				constructor = obj.constructor; // get real constructor
				obj.constructor = oldConstructor; // restore constructor
			}
			return constructor ? constructor.prototype : ObjectPrototype; // needed for IE
		};
	}
}

var isArray = Array.isArray || function (value) {
	return toStr.call(value) === '[object Array]';
};

var normalizeFnWhitespace = function normalizeWhitespace(fnStr) {
	return fnStr.replace(/^function ?\(/, 'function (').replace('){', ') {');
};

var tryMapSetEntries = function tryCollectionEntries(collection) {
	var foundEntries = [];
	try {
		collectionsForEach.Map.call(collection, function (key, value) {
			foundEntries.push([key, value]);
		});
	} catch (notMap) {
		try {
			collectionsForEach.Set.call(collection, function (value) {
				foundEntries.push([value]);
			});
		} catch (notSet) {
			return false;
		}
	}
	return foundEntries;
};

module.exports = function whyNotEqual(value, other) {
	if (value === other) { return ''; }
	if (value == null || other == null) {
		return value === other ? '' : String(value) + ' !== ' + String(other);
	}

	var valToStr = toStr.call(value);
	var otherToStr = toStr.call(other);
	if (valToStr !== otherToStr) {
		return 'toStringTag is not the same: ' + valToStr + ' !== ' + otherToStr;
	}

	var valIsBool = isBoolean(value);
	var otherIsBool = isBoolean(other);
	if (valIsBool || otherIsBool) {
		if (!valIsBool) { return 'first argument is not a boolean; second argument is'; }
		if (!otherIsBool) { return 'second argument is not a boolean; first argument is'; }
		var valBoolVal = booleanValue.call(value);
		var otherBoolVal = booleanValue.call(other);
		if (valBoolVal === otherBoolVal) { return ''; }
		return 'primitive value of boolean arguments do not match: ' + valBoolVal + ' !== ' + otherBoolVal;
	}

	var valIsNumber = isNumber(value);
	var otherIsNumber = isNumber(value);
	if (valIsNumber || otherIsNumber) {
		if (!valIsNumber) { return 'first argument is not a number; second argument is'; }
		if (!otherIsNumber) { return 'second argument is not a number; first argument is'; }
		var valNum = Number(value);
		var otherNum = Number(other);
		if (valNum === otherNum) { return ''; }
		var valIsNaN = isNaN(value);
		var otherIsNaN = isNaN(other);
		if (valIsNaN && !otherIsNaN) {
			return 'first argument is NaN; second is not';
		} else if (!valIsNaN && otherIsNaN) {
			return 'second argument is NaN; first is not';
		} else if (valIsNaN && otherIsNaN) {
			return '';
		}
		return 'numbers are different: ' + value + ' !== ' + other;
	}

	var valIsString = isString(value);
	var otherIsString = isString(other);
	if (valIsString || otherIsString) {
		if (!valIsString) { return 'second argument is string; first is not'; }
		if (!otherIsString) { return 'first argument is string; second is not'; }
		var stringVal = String(value);
		var otherVal = String(other);
		if (stringVal === otherVal) { return ''; }
		return 'string values are different: "' + stringVal + '" !== "' + otherVal + '"';
	}

	var valIsDate = isDate(value);
	var otherIsDate = isDate(other);
	if (valIsDate || otherIsDate) {
		if (!valIsDate) { return 'second argument is Date, first is not'; }
		if (!otherIsDate) { return 'first argument is Date, second is not'; }
		var valTime = +value;
		var otherTime = +other;
		if (valTime === otherTime) { return ''; }
		return 'Dates have different time values: ' + valTime + ' !== ' + otherTime;
	}

	var valIsRegex = isRegex(value);
	var otherIsRegex = isRegex(other);
	if (valIsRegex || otherIsRegex) {
		if (!valIsRegex) { return 'second argument is RegExp, first is not'; }
		if (!otherIsRegex) { return 'first argument is RegExp, second is not'; }
		var regexStringVal = String(value);
		var regexStringOther = String(other);
		if (regexStringVal === regexStringOther) { return ''; }
		return 'regular expressions differ: ' + regexStringVal + ' !== ' + regexStringOther;
	}

	var valIsArray = isArray(value);
	var otherIsArray = isArray(other);
	if (valIsArray || otherIsArray) {
		if (!valIsArray) { return 'second argument is an Array, first is not'; }
		if (!otherIsArray) { return 'first argument is an Array, second is not'; }
		if (value.length !== other.length) {
			return 'arrays have different length: ' + value.length + ' !== ' + other.length;
		}

		var index = value.length - 1;
		var equal = '';
		var valHasIndex, otherHasIndex;
		while (equal === '' && index >= 0) {
			valHasIndex = has(value, index);
			otherHasIndex = has(other, index);
			if (!valHasIndex && otherHasIndex) { return 'second argument has index ' + index + '; first does not'; }
			if (valHasIndex && !otherHasIndex) { return 'first argument has index ' + index + '; second does not'; }
			equal = whyNotEqual(value[index], other[index]);
			index -= 1;
		}
		return equal;
	}

	var valueIsSym = isSymbol(value);
	var otherIsSym = isSymbol(other);
	if (valueIsSym !== otherIsSym) {
		if (valueIsSym) { return 'first argument is Symbol; second is not'; }
		return 'second argument is Symbol; first is not';
	}
	if (valueIsSym && otherIsSym) {
		return symbolValue.call(value) === symbolValue.call(other) ? '' : 'first Symbol value !== second Symbol value';
	}

	var valueIsGen = isGenerator(value);
	var otherIsGen = isGenerator(other);
	if (valueIsGen !== otherIsGen) {
		if (valueIsGen) { return 'first argument is a Generator; second is not'; }
		return 'second argument is a Generator; first is not';
	}

	var valueIsArrow = isArrowFunction(value);
	var otherIsArrow = isArrowFunction(other);
	if (valueIsArrow !== otherIsArrow) {
		if (valueIsArrow) { return 'first argument is an Arrow function; second is not'; }
		return 'second argument is an Arrow function; first is not';
	}

	if (isCallable(value) || isCallable(other)) {
		if (functionsHaveNames && whyNotEqual(value.name, other.name) !== '') {
			return 'Function names differ: "' + value.name + '" !== "' + other.name + '"';
		}
		if (whyNotEqual(value.length, other.length) !== '') {
			return 'Function lengths differ: ' + value.length + ' !== ' + other.length;
		}

		var valueStr = normalizeFnWhitespace(String(value));
		var otherStr = normalizeFnWhitespace(String(other));
		if (whyNotEqual(valueStr, otherStr) === '') { return ''; }

		if (!valueIsGen && !valueIsArrow) {
			return whyNotEqual(valueStr.replace(/\)\s*\{/, '){'), otherStr.replace(/\)\s*\{/, '){')) === '' ? '' : 'Function string representations differ';
		}
		return whyNotEqual(valueStr, otherStr) === '' ? '' : 'Function string representations differ';
	}

	if (typeof value === 'object' || typeof other === 'object') {
		if (typeof value !== typeof other) { return 'arguments have a different typeof: ' + typeof value + ' !== ' + typeof other; }
		if (isProto.call(value, other)) { return 'first argument is the [[Prototype]] of the second'; }
		if (isProto.call(other, value)) { return 'second argument is the [[Prototype]] of the first'; }
		if (getPrototypeOf(value) !== getPrototypeOf(other)) { return 'arguments have a different [[Prototype]]'; }

		if (symbolIterator) {
			var valueIteratorFn = value[symbolIterator];
			var valueIsIterable = isCallable(valueIteratorFn);
			var otherIteratorFn = other[symbolIterator];
			var otherIsIterable = isCallable(otherIteratorFn);
			if (valueIsIterable !== otherIsIterable) {
				if (valueIsIterable) { return 'first argument is iterable; second is not'; }
				return 'second argument is iterable; first is not';
			}
			if (valueIsIterable && otherIsIterable) {
				var valueIterator = valueIteratorFn.call(value);
				var otherIterator = otherIteratorFn.call(other);
				var valueNext, otherNext, nextWhy;
				do {
					valueNext = valueIterator.next();
					otherNext = otherIterator.next();
					if (!valueNext.done && !otherNext.done) {
						nextWhy = whyNotEqual(valueNext, otherNext);
						if (nextWhy !== '') {
							return 'iteration results are not equal: ' + nextWhy;
						}
					}
				} while (!valueNext.done && !otherNext.done);
				if (valueNext.done && !otherNext.done) { return 'first argument finished iterating before second'; }
				if (!valueNext.done && otherNext.done) { return 'second argument finished iterating before first'; }
				return '';
			}
		} else if (collectionsForEach.Map || collectionsForEach.Set) {
			var valueEntries = tryMapSetEntries(value);
			var otherEntries = tryMapSetEntries(other);
			var valueEntriesIsArray = isArray(valueEntries);
			var otherEntriesIsArray = isArray(otherEntries);
			if (valueEntriesIsArray && !otherEntriesIsArray) { return 'first argument has Collection entries, second does not'; }
			if (!valueEntriesIsArray && otherEntriesIsArray) { return 'second argument has Collection entries, first does not'; }
			if (valueEntriesIsArray && otherEntriesIsArray) {
				var entriesWhy = whyNotEqual(valueEntries, otherEntries);
				return entriesWhy === '' ? '' : 'Collection entries differ: ' + entriesWhy;
			}
		}

		var key, valueKeyIsRecursive, otherKeyIsRecursive, keyWhy;
		for (key in value) {
			if (has(value, key)) {
				if (!has(other, key)) { return 'first argument has key "' + key + '"; second does not'; }
				valueKeyIsRecursive = !!value[key] && value[key][key] === value;
				otherKeyIsRecursive = !!other[key] && other[key][key] === other;
				if (valueKeyIsRecursive !== otherKeyIsRecursive) {
					if (valueKeyIsRecursive) { return 'first argument has a circular reference at key "' + key + '"; second does not'; }
					return 'second argument has a circular reference at key "' + key + '"; first does not';
				}
				if (!valueKeyIsRecursive && !otherKeyIsRecursive) {
					keyWhy = whyNotEqual(value[key], other[key]);
					if (keyWhy !== '') {
						return 'value at key "' + key + '" differs: ' + keyWhy;
					}
				}
			}
		}
		for (key in other) {
			if (has(other, key) && !has(value, key)) {
				return 'second argument has key "' + key + '"; first does not';
			}
		}
		return '';
	}

	return false;
};

},{"./getCollectionsForEach":10,"./getSymbolIterator":11,"has":5,"is-arrow-function":6,"is-boolean-object":7,"is-callable":8,"is-date-object":9,"is-generator-function":14,"is-number-object":15,"is-regex":16,"is-string":17,"is-symbol":18}],14:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var generatorFunc = getGeneratorFunc();
var GeneratorFunction = generatorFunc ? getProto(generatorFunc) : {};

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	return getProto(fn) === GeneratorFunction;
};

},{}],15:[function(require,module,exports){
'use strict';

var numToStr = Number.prototype.toString;
var tryNumberObject = function tryNumberObject(value) {
	try {
		numToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var numClass = '[object Number]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isNumberObject(value) {
	if (typeof value === 'number') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryNumberObject(value) : toStr.call(value) === numClass;
};

},{}],16:[function(require,module,exports){
'use strict';

var has = require('has');
var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	if (!hasToStringTag) {
		return toStr.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};

},{"has":5}],17:[function(require,module,exports){
'use strict';

var strValue = String.prototype.valueOf;
var tryStringObject = function tryStringObject(value) {
	try {
		strValue.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var strClass = '[object String]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isString(value) {
	if (typeof value === 'string') { return true; }
	if (typeof value !== 'object') { return false; }
	return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
};

},{}],18:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') { return false; }
		return symStringRegex.test(symToStr.call(value));
	};
	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') { return true; }
		if (toStr.call(value) !== '[object Symbol]') { return false; }
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {
	module.exports = function isSymbol(value) {
		return false;
	};
}

},{}],19:[function(require,module,exports){
'use strict';
const Helpers = require('./Helpers');

class ChainManager {
      constructor (MapQL) {
          this.MapQL = MapQL;
          this._chains = {};
          this._chainables = {};
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
      get query () {
          return !!Object.keys(this._chains).length ? this._chains : false;
      }
      execute (projections = {}, one = false) {
          return this.MapQL[one ? 'findOne' : 'find'](this.query, projections);
      }
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
      _addChain (key, val, $type = '$eq', logical = false) {
          Object.assign(this._chains, (!logical ? this._getOperatorChain : this._getLogicalChain).call(this, key, val, $type));
          return this;
      }
}
module.exports = ChainManager;

},{"./Helpers":23}],20:[function(require,module,exports){
'use strict';
const Helpers = require('./Helpers'),
      _query = Symbol('_query'),
      _limit = Symbol('_limit');

class Cursor extends Array {
      constructor (query = Helpers._null, bykey = false) {
          super();
          this[_query] = Object.assign({ bykey: bykey }, { query: query });
          this[_limit] = false;
      }
      get query () {
          return this[_query] ? this[_query] : Helpers._null;
      }
      add (result = []) {
          return Array.prototype.push.apply(this, (Array.isArray(result) ? result : [result]).filter((res) => {
              return res.isDocument;
          })) >= 1 ? this : false;
      }
      empty () {
          return !(this.length >= 1);
      }
      sort (obj = {}) {
          Object.keys(obj).forEach((key, idx) => {
              Array.prototype.sort.call(this, (a, b) => {
                  if (!(Helpers.is(a.value, 'object') && Helpers.is(b.value, 'object'))) {
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
      limit (num = 1) {
          return Helpers.is((this[_limit] = num), 'number') ? this.slice(0, this[_limit]) : this;
      }
}
module.exports = Cursor;

},{"./Helpers":23}],21:[function(require,module,exports){
'use strict';
const Helpers = require('./Helpers');

class Document {
      constructor (id = Helpers._null, value = {}) {
          this._id = id;
          this.value = value;
      }
      static convert (entries) {
          return entries.map((entry) => {
               return new Document(entry[0], entry[1]);
          });
      }
      static toObject (doc) {
          return Object.assign(Object.create(null), doc);
      }
      toObject (doc = this) {
          return this.constructor.toObject(doc);
      }
      static isDocument (obj = {}) {
          return (obj instanceof Document && '_id' in obj && 'value' in obj);
      }
      get isDocument () {
          return this.constructor.isDocument(this);
      }
}
module.exports = Document;

},{"./Helpers":23}],22:[function(require,module,exports){
'use strict';
const _index = Symbol('_index'),
      _prefix = Symbol('_prefix');

class GenerateID {
      constructor (prefix = `${(Date.now()/1000).toString(32)}`) {
          this[_index] = 0;
          this[_prefix] = prefix;
      }
      *gen () {
          yield `${this[_prefix]}-${this[_index]++}`;
      }
      next () {
          return this.gen().next().value;
      }
}
module.exports = GenerateID;

},{}],23:[function(require,module,exports){
'use strict';
const _null = Symbol(null);
function dot (keys = [], obj = {}, options = {}) {
         let opts = Object.assign({
                 autoCreate: true, // Create an Object key/value if it doesn't exist.
                 value: false,     // Function to set the value if not false.
                 unset: false,     // Unset the Object key if it exists.
                 defined: false    // Return undefined if key does not exist.
             }, options),
             _apply = function (keys, obj, value) {
                 if (keys.length == 1 && (value || opts.unset)) {
                    return opts.unset ? delete obj[keys[0]] : obj[keys[0]] = value.apply(this, [obj[keys[0]] || _null]);
                  } else if (!keys[0]) {
                    return obj;
                  } else if (!opts.autoCreate || opts.defined || opts.unset) {
                    return (obj.hasOwnProperty(keys[0]) ? _apply(keys.slice(1), obj[keys[0]], value) : undefined);
                 }
                 return _apply(keys.slice(1), (obj.hasOwnProperty(keys[0]) ? obj[keys[0]] : (obj[keys[0]] = (!isNaN(parseInt(keys[1], 10)) ? [] : {}))), value);
             };

         try {
             return _apply(keys, obj, (opts.value ? (is(opts.value, '!function') ? (current, next) => { return next } : opts.value) : opts.value));
           } catch (e) {
             return undefined; // Value must not exist; return undefined!
         }
}
function is (val, type) {
         try {
             return (/^!/.test(type) !== (Object.prototype.toString.call(val).toLowerCase() === `[object ${type.toLowerCase().replace(/^!/,'')}]`));
          } catch (error) {
             return false;
         }
}
module.exports = {
    _null: _null,
    dotNotation: (keys = _null, obj = {}, options = {}) => {
        return Array.isArray(obj) ? obj.map((_obj, idx) => {
                   return dot(String(Array.isArray(keys) ? keys[idx] : keys).trim().split('.'), _obj, options);
               }) : dot((keys !== _null ? String(keys).trim().split('.') : []), obj, options);
    },
    is: (val, type) => {
        return Array.isArray(type) ? type.some((t) => is(val, t)) : is(val, type);
    }
};

},{}],24:[function(require,module,exports){
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
      set (key = Helpers._null, value = Helpers._null) {
          return this[_set]((value === Helpers._null ? this[_keygen].next() : key), (value !== Helpers._null ? value : key));
      }
      compile (queries = {}, update = false) {
          let results = {
              operator: false,
              list: []
          };
          for (let key of Object.keys(queries)) {
              let isLO = this.isLogicalOperator(key);
              if (Helpers.is(queries[key], 'object')) {
                 for (let mode of Object.keys(queries[key])) {
                     results.list.push([key, mode, queries[key][mode]]);
                 }
               } else if (isLO && Array.isArray(queries[key])) {
                 for (let subobj of queries[key]) {
                     results.list.push(this.compile(subobj));
                 }
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
      isDocument (obj) {
          return Document.isDocument(obj);
      }
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
      isQueryOperator (qs = Helpers._null) {
          return this.queryOperators.hasOwnProperty(qs) == true;
      }
      getQueryOperator (qs = '$_default') {
          return this.queryOperators[qs] ? this.queryOperators[qs] : this.queryOperators['$_default'];
      }
      isLogicalOperator (lo = Helpers._null) {
          return this.logicalOperators.hasOwnProperty(lo) == true;
      }
      getLogicalOperator (lo) {
          return this.logicalOperators[lo] ? this.logicalOperators[lo] : { fn: [].every };
      }
      isUpdateOperator (uo = Helpers._null) {
          return this.updateOperators.hasOwnProperty(uo) == true;
      }
      getUpdateOperator (uo = '$_default') {
          return this.updateOperators[uo] ? this.updateOperators[uo] : this.updateOperators['$_default'];
      }
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
      findOne (queries = {}, projections = {}) {
          return this.find(queries, projections, true);
      }
      findByKey (queries = {}, projections = {}, one = false) {
          return this.find(queries, projections, one, true);
      }
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
      update (queries, modifiers, options = {}) {
          let opts = Object.assign({
                  multi: false,
                  projections: {}
              }, options),
              cursor = this[Helpers.is(queries, 'string') ? 'findByKey' : 'find'](queries, opts.projections, !opts.multi);
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
      remove (queries, multi = false) {
          let removed = [];
          if (Helpers.is(queries, '!object')) {
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
module.exports = MapQL;

},{"./Cursor":20,"./Document":21,"./GenerateID":22,"./Helpers":23,"./operators/Logical":25,"./operators/Query":26,"./operators/Update":27}],25:[function(require,module,exports){
'use strict';
module.exports = {
    '$or': {
        fn: [].some
    },
    '$and': {
        fn: [].every
    }
};

},{}],26:[function(require,module,exports){
'use strict';
const _Comparison = require('./selectors/Comparison'),
      _Element = require('./selectors/Element'),
      _Evaluation = require('./selectors/Evaluation'),
      _Array = require('./selectors/Array');
module.exports = Object.assign({
    '$_default': {
        fn: function () {
            return true;
        }
    }
}, _Comparison, _Element, _Evaluation, _Array);

},{"./selectors/Array":30,"./selectors/Comparison":31,"./selectors/Element":32,"./selectors/Evaluation":33}],27:[function(require,module,exports){
'use strict';
const _Array = require('./modifiers/Array'),
      _Field = require('./modifiers/Field');
module.exports = Object.assign({
    '$_default': {
        fn: function () {
            return true;
        }
    }
}, _Array, _Field);

},{"./modifiers/Array":28,"./modifiers/Field":29}],28:[function(require,module,exports){
'use strict';
let Helpers = require('../../Helpers');

module.exports = {
     '$pop': {
         fn: function (key, val, entry) {
             if (Helpers.is(entry.value, 'object')) {
                Helpers.dotNotation(key, entry.value, {
                    value: (current) => {
                        if (Array.isArray(current)) {
                           current[(val == -1 ? 'pop' : 'shift')]();
                        }
                        return (current !== Helpers._null ? current : []);
                    }
                });
              } else if (Helpers.is(entry.value, 'array')) {
                entry.value[(val == -1 ? 'pop' : 'shift')]();
             }
         }
     }
};

},{"../../Helpers":23}],29:[function(require,module,exports){
'use strict';
const isEqual = require('is-equal'),
      Helpers = require('../../Helpers');

module.exports = {
    '$set': {
        fn: function (key, val, entry) {
            Helpers.is(entry.value, '!object') ? this.set(entry._id, (entry.value = val)) : Helpers.dotNotation(key, entry.value, {
                value: () => {
                    return val;
                }
            });
        }
    },
    '$inc': {
        fn: function (key, val, entry) {
            let _val = parseInt(val, 10);
            Helpers.is(entry.value, '!object') ? this.set(entry._id, (entry.value = (parseInt(entry.value, 10) + _val))) : Helpers.dotNotation(key, entry.value, {
                value: (current) => {
                    return (current !== Helpers._null ? parseInt(current, 10) + _val : _val);
                }
            });
        }
    },
    '$mul': {
        fn: function (key, val, entry) {
            let _val = parseInt(val, 10);
            Helpers.is(entry.value, '!object') ? this.set(entry._id, (entry.value = parseInt(entry.value, 10) * _val)) : Helpers.dotNotation(key, entry.value, {
                value: (current) => {
                    return (current !== Helpers._null ? parseInt(current, 10) * _val : _val);
                }
            });
        }
    },
    '$unset': {
        fn: function (key, val, entry) {
            Helpers.is(entry.value, '!object') ? this.delete(entry._id, (entry.value = undefined)) : Helpers.dotNotation(key, entry.value, { unset: true });
        }
    }
};

},{"../../Helpers":23,"is-equal":12}],30:[function(require,module,exports){
'use strict';
module.exports = {
    '$size': {
        fn: function (val, size) {
            return (Array.isArray(val) ? (parseInt(size, 10) == val.length) : false);
        }
    }
};

},{}],31:[function(require,module,exports){
'use strict';
const isEqual = require('is-equal'),
      Helpers = require('../../Helpers');
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

},{"../../Helpers":23,"is-equal":12}],32:[function(require,module,exports){
'use strict';
const Helpers = require('../../Helpers');

module.exports = {
    '$exists': {
        chain: function (key, val) {
            let isbool = Helpers.is(key, 'boolean'),
                check = val !== Helpers._null ? val : (isbool ? key : true);
            return !isbool || val !== Helpers._null ? { [key] : { '$exists': check } } : { '$exists': check };
        },
        fn: function (val, bool, keys = Helpers._null, entry) {
            try {
               return bool === (Helpers.dotNotation(keys, entry[1], { defined: true }) !== undefined);
             } catch (error) {
               return keys === Helpers._null ? (bool === undefined ? true : bool) : false;
            }
        }
    },
    '$type': {
        fn: function (val, type, keys = Helpers._null, entry) {
            return Helpers.is(Helpers.dotNotation(keys, entry[1], { defined: true }), type);
        }
    }
};

},{"../../Helpers":23}],33:[function(require,module,exports){
'use strict';
const Helpers = require('../../Helpers');

module.exports = {
    '$regex': {
        fn: function (val, regex = /./gi) {
            return (Helpers.is(regex, 'regexp') ? new RegExp(regex) : new RegExp(regex, 'gi')).test(val);
        }
    },
    '$where': {
        fn: function (val, fn = ()=>{}, key, entry) {
            return Helpers.is(fn, 'function') ? fn.call(Helpers.is(entry[1], 'object') ? entry[1] : {}, entry[1]) : false;
        }
    }
};

},{"../../Helpers":23}]},{},[1]);
