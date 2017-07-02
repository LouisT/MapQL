IMPORTANT: Need to document ALL the things!
===

TODO
===
* Add more query operators. See [MongoDB Query and Projection Operators] for reference.
  * Improve the current ones as well.
  * ~~Split the (complicated?) query selectors into their own files?~~
* Add support for custom query operators.
* While the "[is-equal]" lib does what I want, it's a bit big. Find a smaller solution!?
* Document the chainable features.
* ~~Document 'Cursor' and 'Document'.~~
  * Improve documentation of 'Cursor' and 'Document'.
* ~~Document dot notation queries for object queries.~~
* ~~Document `findPromise()`.~~
  * Improve documentation of `findPromise()`, possible change this to async/await. 
* Improve the ID generator; need to have a more (unique) uniform ID.
* Improve `MapQL.update(<Query>, <Update Operators>)` which require [Update Operators].
  * Improve the `Field` and `Array` update modifiers.
* Document the `update()` method.
* ~~Add `MapQL.remove(<Query>[, <multi>])` to remove entries via query.~~
  * Improve type checking of queries passed. Must be Array, String or Object.
* ~~Implement babel with grunt; add polyfills to work with ES5 browsers.~~
* ~~Add browser tests.~~
* Document import/export feature.
  * Add more support for extended data types.
    * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
* Add examples to the examples folder!
* Everything else.
  * Work on the TODO!


[MongoDB Query and Projection Operators]: https://docs.mongodb.com/manual/reference/operator/query/
[Projection Operators]: https://docs.mongodb.com/manual/reference/operator/query/#projection-operators
[is-equal]: https://www.npmjs.com/package/is-equal
[Update Operators]: https://docs.mongodb.com/manual/reference/operator/update/
