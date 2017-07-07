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

### `#find(<Query>)`
Search the `MapQL()` with the supplied query operators. The result is a `Cursor` with matching `Document` objects. Entries that have an `Object` as the value can be searched with `dot notation` fields.
###### `Dot notation`
```javascript
#find({ '<Field>.<Field>.<Field>': { <Query Operators> } });
```
###### Example:
```javascript
// Cursor [ Document { _id: 'foo', value: { bar: { baz: 1 } } } ]
{Instance}.find({ 'bar.baz': { $eq: 1 } });
```
### `#findAsync(<Query Operators>)`
The `Promise` based version of `#find()`. More information to come.

#### Cursor
The `Cursor` class is an extended `Array` containing `Document` objects found with `find()`, providing `sort()` and `limit()` methods along with the rest of the [Array methods]. Please note that calling `limit()` _BEFORE_ `sort()` will limit the number of documents _BEFORE_ sorting and vise versa.

##### `#sort(<Sort>)` -- Returns results ordered according to a sort specification.
Specifies the order in which the query returns matching documents. Specify in the sort parameter the field or fields to sort by and a value of `1` or `-1` to specify an ascending or descending sort respectively.

##### `#limit(<Limit>)` -- Constrains the size of a cursor's result set.
Use the limit() method on a cursor to specify the maximum number of documents the cursor will return.

#### Document
The `Document` class is an extended `Object` containing the `MapQL()` entry within `Cursor`. The `Document` consits of an `_id` (entry `key`) and a `value` (entry `value`).
```javascript
// Cursor [ Document { _id: 'Foo', value: 'Bar' } ]
{Instance}.set('Foo', 'Bar')
```

Implemented Query Operators
-
###  Comparison
##### $eq -- Matches values that are equal to a specified value.
The `$eq` operator matches documents where the value of a field equals (`==`) the specified value. This is also the default `find()` operator.
```
<value> OR { <field>: { $eq: <value> } }
```
The following examples query against `MapQL` with the following documents:
```javascript
{Instance}.set('foo1', 'bar');
{Instance}.set('foo2', { bar: 'baz' });
{Instance}.set('bar', 'foo3');
```
The following example queries the `MapQL` instance to select all documents where the value equals `{ bar: 'baz' }` or `bar`. If a `Document` is added to the `Cursor` by it's key value, `Symbol(bykey)` will be true in the `Document`.
```javascript
// Cursor [ Document { _id: 'foo2', value: { bar: 'baz' } } ]
{Instance}.find({ bar: { $eq: 'baz' } });
// Cursor [ Document { _id: 'foo1', value: 'bar' } ]
{Instance}.find({ $eq: 'bar' });
/*
Cursor [
  Document { _id: 'bar', value: 'foo3', [Symbol(bykey)]: true },
  Document { _id: 'foo1', value: 'bar', [Symbol(bykey)]: false },
]
*/
{Instance}.find('bar');
```

##### $gt -- Matches values that are greater than a specified value.
The `$gt` operator selects those documents where the value is greater than (`>`) the specified value.

##### $gte -- Matches values that are greater than or equal to a specified value.
The `$gte` operator selects the documents where the value of the field is greater than or equal to (`>=`) the specified value.

##### $lt -- Matches values that are less than a specified value.
The `$lt` operator selects the documents where the value of the field is less than (`<`) the specified value.

##### $lte -- Matches values that are less than or equal to a specified value.
The `$lte` operator selects the documents where the value of the field is less than or equal to (`<=`) the specified value.

##### $ne -- Matches all values that are not equal to a specified value.
The `$ne` operator selects the documents where the value of the field is not equal (`!=`) to the specified value. This includes documents that do not contain the field.

##### $in -- Matches any of the values specified in an array.
The `$in` operator selects the documents where the value of a field equals any value in the specified `Array`.

##### $nin -- Matches none of the values specified in an array.
The `$nin` operator selects the documents where the field value is not in the specified `Array` or the field does not exist.

#### Logical
##### $or -- Joins query clauses with a logical OR returns all documents that match the conditions of either clause.
The `$or` operator performs a logical OR operation on an `Array` of two or more `expressions` and selects the documents that satisfy at least one of the `expressions`.

##### $and -- Joins query clauses with a logical AND returns all documents that match the conditions of both clauses.
The `$and` operator performs a logical AND operation on an `Array` of two or more expressions (e.g. `expression1`, `expression2`, etc.) and selects the documents that satisfy all the expressions in the `Array`.

#### Element
##### $exists -- Matches documents that have the specified field.
When `boolean` is `true`, `$exists` matches the documents that contain the field, including documents where the field value is `null`. If `boolean` is `false`, the query returns only the documents that do not contain the field.

##### $type -- Selects documents if a field is of the specified type.
The `$type` operator selects the documents where the value of the field is an instance of the specified data type. Querying by data type is useful when dealing with highly unstructured data where data types are not predictable.

#### Evaluation
##### $regex -- Selects documents where values match a specified regular expression.
Provides regular expression capabilities for pattern matching strings in queries. `MapQL()` uses JavaScript regular expressions ([RegExp]).

##### $where -- Matches documents that satisfy a JavaScript expression.
Use the `$where` operator to pass a JavaScript function to the query system. The `$where` provides greater flexibility, but requires that the `MapQL()` processes the function for each document. Reference the document in the function using either `this` or as the first function `argument`.

#### Array
##### $size -- Selects documents if the array field is a specified size.
The `$size` operator matches any `Array` with the number of elements specified by the argument.

Implemented Update Operators
-
#### Fields
##### $set -- Sets the value of a field in a document.
The `$set` operator sets or replaces the value of a field with the specified value.

##### $inc -- Increments the value of the field by the specified amount.
The `$inc` operator increments a field by a specified value.

##### $mul -- Multiplies the value of the field by the specified amount.
The `$mul` operator multiplies the value of a field by a number.

##### $unset -- Removes the specified field from a document.
The `$unset` operator deletes a particular field.

#### Array
##### $pop -- Removes the first or last item of an array.
The `$pop` operator removes the first or last element of an `Array`. Pass `$pop` a value of `-1` to remove the first element of an `Array` and `1` to remove the last element in an `Array`.

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


[MongoDB]: https://www.mongodb.com/
[ES6 Map()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[Classes]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
[RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[Arrow]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[unpkg]: https://unpkg.com/mapql/
[karma]: http://karma-runner.github.io/
[karma-sauce-launcher]: https://github.com/karma-runner/karma-sauce-launcher
[Sauce Labs]: https://saucelabs.com/
[PhantomJS]: http://phantomjs.org/
[Primitives]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types
[Buffer]: https://nodejs.org/api/buffer.html
[Uint8Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[Array methods]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#Methods
[Array.from]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
[ArrayBuffer.isView()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView
[TypedArray]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
