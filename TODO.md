IMPORTANT: Need to document ALL the things!
===

TODO
===
* Add more query operators. See [MongoDB Query and Projection Operators] for reference.
  * Improve the current ones as well.
  * ~~Split the (complicated?) query selectors into their own files?~~
* Add support for custom query operators.
* Implement the projection operators. See [Projection Operators] for reference.
* ~~Add tests with mocha.~~ Improve tests! Add better coverage of query operators.
* While the "[is-equal]" lib does what I want, it's a bit big. Find a smaller solution!?
* Document the chainable features.
  * Clean up the 'ChainManager' class in `./lib/` as well.
* Document 'Cursor' and 'QueryResult'.
* Document dot notation queries for object queries.
    * Example: MapQL.find({ 'foo.bar.baz': { '$gt': 10 } });
* Document 'findAsync'.
* Improve the ID generator; need to have a more (unique) uniform ID.
* Try to work out how to improve `$where` as if the entry is not an object it gets passed as an argument.
    * Example: MapQL.find({ '$where': function (arg) { return (this.foo || arg) == 1 } });
* Improve `MapQL.update(<Query>, <Update Operators>)` which require [Update Operators].
  * Improve the `Field` update modifiers.
* ~~Add `MapQL.remove(<Query>[, <multi>])` to remove entries via query.~~
  * Improve type checking of queries passed. Must be Array, String or Object.
* Implement babel with grunt; add polyfills to work with ES5 browsers.
  * Add checks to make sure the lib is supported in the user browser.
  * Improve browserify usage.
* Add browser tests.
* Document import/export feature.
* Everything else.
  * Work on the TODO!


[MongoDB Query and Projection Operators]: https://docs.mongodb.com/manual/reference/operator/query/
[Projection Operators]: https://docs.mongodb.com/manual/reference/operator/query/#projection-operators
[is-equal]: https://www.npmjs.com/package/is-equal
[Update Operators]: https://docs.mongodb.com/manual/reference/operator/update/
