MapQL (WIP)
===
A __[MongoDB]__ inspired __[ES6 Map()]__ query language. - [![Build Status](https://travis-ci.org/LouisT/MapQL.svg?branch=dev)](https://travis-ci.org/LouisT/MapQL)

This is a ___WIP___; do __NOT__ use in production yet! See [TODO](TODO.md) for more information.

Testing
-
#### Node:
You can test with node.js via `npm test`.

#### Browser:
For local browser testing with [karma] run `npm run-script local` or `karma start tests/local.karma.js` to run tests with [PhantomJS] and/or any browsers you have access to.

#### [Sauce Labs]:
See [karma-sauce-launcher] and [sauce.karma.js](tests/sauce.karma.js).

```sh
 # See more about Open Source testing at https://saucelabs.com/open-source
 $ export SAUCE_USERNAME=*****        # Your Sauce Labs username.
 $ export SAUCE_ACCESS_KEY=*****      # Your Sauce Labs access key.
 $ karma start tests/sauce.karma.js   # npm run-script sauce
```

Browser Support
-
[![Build Status](https://saucelabs.com/browser-matrix/louist-mapql.svg)](https://saucelabs.com/u/louist-mapql)

### ES6 supported browsers:
```html
<!-- MapQL() WITHOUT chain() support (es6)-->
<script src="./dist/MapQL.es6.js"></script>
<!-- MapQL() WITH chain() support (es6) -->
<script src="./dist/MapQL.es6.chainable.js"></script>
````

### ES5 (babel transpiled):
```html
<!-- MapQL() WITHOUT chain() support-->
<script src="./dist/MapQL.es5.js"></script>
<!-- MapQL() WITH chain() support (es6) -->
<script src="./dist/MapQL.es5.chainable.js"></script>
```
You can use [unpkg] to retrieve dist files.

Implemented [Query Operators]
-
Used with `{Instance}.find(<Query>)` and `{Instance}.remove(<Query>[, <Multi (Boolean)>])`.

* Comparison
  * $eq, $gt, $gte, $lt, $lte, $ne, $in, $nin
* Logical
  * $or, $and
* Element
  * $exists, $type
* Evaluation
  * $regex, $where
* Array
  * $size

Implemented [Update Operators]
-
Used with `{Instance}.update(<Query>, <Update>)`.

* Fields
  * $set, $inc, $mul, $unset
* Array
  * $pop

Import/Export
-
Please note that importing and exporting data is highly experimental. This feature currently exports as json, so certain keys or references may not be supported.
As well, due to the way `Symbol()` works, it's impossible to export any key/value pairs from Objects if the key is a Symbol. Any input on how to improve import/export
of `Map()` would be greatly appreciated. Please see #5 for further information.

Current (known) supported [data types](/src/DataTypes.js):
* [Primitives]
  * Boolean, Null, Undefined, Number, String, Symbol, Object
* Extended support
  * Array, Function, Date, Map, Set, [Buffer]/[Uint8Array], RegExp, NaN
* Experimental support
  * [TypedArray]

[Buffer] and [Uint8Array] are similar enough that browsers will attempt to convert a Buffer into a Uint8Array if the Buffer constructor is unavailable. In the unlikely
event that nether are available, import() will then attempt to convert it to a normal [Array] with Array.from(). Typed arrays are tested with [ArrayBuffer.isView()],
this is an experimental (under tested) feature of MapQL. See [TypedArray] for more information about typed arrays.

Example: `MapQL.find()`
-
```javascript
const MapQL = new (require('mapql'))(),
    util = require('util'),
    _print = (obj) => {
        console.log('%s\n', util.inspect(obj, { depth: null, showHidden: true }));
    };

// Start out with some base data.
MapQL.set('test0', 10);
MapQL.set('test1', 'this is a string');
MapQL.set('test2',{
    foo: 7,
    bar: 3,
    baz: null,
});
MapQL.set('test11',{
    foo: 7,
    string: 'Look at me example all the things!'
});
MapQL.set('test12',{
    foo: 7,
    string: 'Another example string!',
    baz: 'qux'
});
MapQL.set('test13',{
    foo: 8,
    baz: 'qux'
});
// Fill with junk.
for (let num = 3; num < 10; num++) {
    MapQL.set(`test${num}`, {
       foo: Math.floor(Math.random()*15)+1,
       bar: Math.floor(Math.random()*15)+1
    });
}

// Sync!
_print(MapQL.find({
    foo: 8
}));
_print(MapQL.find({
    foo: { '$gt': 6 },
    bar: { '$lt': 10 }
}));
_print(MapQL.find({
   '$gt': 3
}));
_print(MapQL.find({
   '$eq': 'this is a string'
}));
_print(MapQL.find({
   string: { '$regex': /Things!$/i }
}));
_print(MapQL.find({
   '$regex': /String$/i
}));
_print(MapQL.find({
  '$and': [{
       foo: { '$eq': 7 },
    }, {
       '$or': [
           { string: { '$regex': /Things!$/i } },
           { string: { '$regex': /String!$/i } },
       ]
   }]
}));

// Promise!
MapQL.findAsync({ foo: { '$gt': 2 }, bar: { '$lt': 10 } }).then((results) => {
    _print(results);
 }).catch((error) => {
    console.log(error);
});
```

Example: `MapQL.chain()`
-
```javascript
const MapQL = new (require('mapql/chainable'))(),
      util = require('util');
7
// Add some base data.
MapQL.set('testing0', {
   foo: 4,
   bar: 11
});
MapQL.set('testing1', {
   foo: 2,
   bar: 9
});
MapQL.set('testing2', {
   foo: 8,
   bar: 3
});
MapQL.set('testing3', {
   foo: 2,
   bar: 100
});

// Generate a basic chained query.
let $gt = MapQL.chain().gt('foo', 3);

// Generate a somewhat complex query for $or.
let $or = MapQL.chain().or((chain) => {
    return [
        chain.eq('foo', 4),
        chain.eq('foo', 2)
    ]
});

// Generate a more complex chained query for $and.
let $and = MapQL.chain().and((chain) => {
    return [
        chain.lt('foo', 5),
        chain.or(() => {
            return [
                chain.lt('bar', 10),
                chain.eq('bar', 100)
            ];
        })
    ];
});

// Execute $gt!
console.log('$gt query:\n%s\n', util.inspect($gt.query, { depth: null }));
console.log('$gt results:\n%s\n', util.inspect($gt.execute(), { depth: null }));

// Execute $or!
console.log('$or query:\n%s\n', util.inspect($or.query, { depth: null }));
console.log('$or results:\n%s\n', util.inspect($or.execute(), { depth: null }));

// Execute $and!
console.log('$and query:\n%s\n', util.inspect($and.query, { depth: null }));
console.log('$and results:\n%s\n', util.inspect($and.execute(), { depth: null }));

// List all entries.
console.log('entries:\n%s', util.inspect([...MapQL.entries()], { depth: null }));
````

[MongoDB]: https://www.mongodb.com/
[ES6 Map()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[Classes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[Arrow]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[Query Operators]: https://docs.mongodb.com/manual/reference/operator/query/
[Update Operators]: https://docs.mongodb.com/manual/reference/operator/update/
[unpkg]: https://unpkg.com/mapql/
[karma]: http://karma-runner.github.io/
[karma-sauce-launcher]: https://github.com/karma-runner/karma-sauce-launcher
[Sauce Labs]: https://saucelabs.com/
[PhantomJS]: http://phantomjs.org/
[Primitives]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types
[Buffer]: https://nodejs.org/api/buffer.html
[Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[Array.from]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
[ArrayBuffer.isView()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView
[TypedArray]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray

