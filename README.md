MapQL (WIP)
===
A __[MongoDB]__ inspired __[ES6 Map()]__ QL. - [![Build Status](https://travis-ci.org/LouisT/MapQL.svg?branch=dev)](https://travis-ci.org/LouisT/MapQL)

This is a ___WIP___; do __NOT__ use in production yet! See [TODO](TODO.md) for more information.

Implemented [Query Operators]
===
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
===
* Fields
  * $set, $inc, $mul
* Array

### Example: `MapQL.find()`
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

### Example: `MapQL.chain()`
```javascript
const MapQL = new (require('mapql/chainable'))(),
      util = require('util');

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
[Query Operators]: https://docs.mongodb.com/manual/reference/operator/query/
[Update Operators]: https://docs.mongodb.com/manual/reference/operator/update/
