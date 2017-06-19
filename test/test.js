/*!
 * A MongoDB inspired ES6 Map() QL. - Copyright (c) 2017 Louis T. (https://lou.ist/)
 * Licensed under the MIT license https://raw.githubusercontent.com/LouisT/MapQL/master/LICENSE
 */
'use strict';
const MapQL = new (require('../chainable/'))(),
      assert = require('assert');

// Set extra data outside of the set tests,
// keep terminal spam down.
try {
    MapQL.set('test3', 'string');
    MapQL.set('test4', {
        qux: 1234,
    });
    MapQL.set('test5',{
        foo: 7,
        bar: null
    });
    MapQL.set('test6',{
        foo: 3,
        bar: 100,
        baz: -10
    });
    MapQL.set('test7', {
        array: ['A', 'B', 'C']
    });
    MapQL.set('test8', {
        array: ['A2', 'B2', 'C2']
    });
    MapQL.set('test9', {
        foo: 1,
        array: ['A3', 'C3', 'D3']
    });
    MapQL.set('test10', {
        foo: 'baz',
        array: ['A3', 'C3', 'D3']
    });
    MapQL.set('test11', {
        array: ['A4', 'C4', 'D4', 'E4']
    });
    MapQL.set('findByKey_0', 'This is an example.');
    MapQL.set('findByKey_1_A', 'This is an example.');
 } catch (e) {
}
describe('Set', () => {
    describe('#set()', () => {
        it('it should set test0 to 10', () => {
            assert.equal(MapQL.set('test0', 10), MapQL);
        });
        it('it should set test1 to { foo: \'bar\', foobar: true }', () => {
            assert.equal(MapQL.set('test1', { foo: 'bar', foobar: true }), MapQL);
        });
        it('it should set test2 to { bar: 5, baz: 6 }', () => {
            assert.equal(MapQL.set('test2', { bar: 5, baz: 6 }), MapQL);
        });
    });
});
describe('Get', () => {
    describe('#has()', () => {
        it('it should return true for test0', () => {
            assert.equal(MapQL.has('test0'), true);
        });
        it('it should return true for test6', () => {
            assert.equal(MapQL.has('test6'), true);
        });
    });
    describe('#get()', () => {
        it('it should return 10 for value of test0', () => {
            assert.equal(MapQL.get('test0'), 10);
        });
        it('it should return number for typeof of test0', () => {
            assert.equal(typeof MapQL.get('test0'), 'number');
        });
        it('it should return bar for value of test1.foo', () => {
            assert.equal(MapQL.get('test1').foo, 'bar');
        });
        it('it should return 5 for value of test2.bar', () => {
            assert.equal(MapQL.get('test2').bar, 5);
        });
        it('it should return "string" for value of test3', () => {
            assert.equal(MapQL.get('test3'), 'string');
        });
        it('it should return string for typeof of test3', () => {
            assert.equal(typeof MapQL.get('test3'), 'string');
        });
    });
    describe('#find()', () => {
        it('it should find test0 with: { \'$eq\': 10 }', () => {
            assert.equal(MapQL.find({ '$eq': 10 })[0]._id, 'test0');
        });
        it('it should find test0 with: { \'$gte\': 9 }', () => {
            assert.equal(MapQL.find({ '$gte': 9 })[0]._id, 'test0');
        });
        it('it should find test0 with: { \'$gte\': 10 }', () => {
            assert.equal(MapQL.find({ '$gte': 10 })[0]._id, 'test0');
        });
        it('it should find test0 with: { \'$lte\': 11 }', () => {
            assert.equal(MapQL.find({ '$gte': 9 })[0]._id, 'test0');
        });
        it('it should find test0 with: { \'$lte\': 10 }', () => {
            assert.equal(MapQL.find({ '$gte': 10 })[0]._id, 'test0');
        });
        it('it should find test1 with: { foo: { \'$eq\': \'bar\' } }', () => {
            assert.equal(MapQL.find({ foo: { '$eq': 'bar' } })[0]._id, 'test1');
        });
        it('it should find test1 with: { foo: \'bar\', foobar: { \'$exists\': true } }', () => {
            assert.equal(MapQL.find({ foo: 'bar', foobar: { '$exists': true } })[0]._id, 'test1');
        });
        it('it should find test2 with: { bar: { \'$lt\': 10 }, baz: { \'$gt\': 3 } }', () => {
            assert.equal(MapQL.find({ bar: { '$lt': 10 }, baz: { '$gt': 3 } })[0]._id, 'test2');
        });
        it('it should find test2 with: { bar: 5, foobar: { \'$exists\': false } }', () => {
            assert.equal(MapQL.find({ bar: 5, foobar: { '$exists': false } })[0]._id, 'test2');
        });
        it('it should find test3 with: { \'$regex\': /^Str/i }', () => {
            assert.equal(MapQL.find({ '$regex': /^Str/i })[0]._id, 'test3');
        });
        it('it should find test4 with: { qux: { \'$type\': \'number\' } }', () => {
            assert.equal(MapQL.find({ qux: { '$type': 'number' } })[0]._id, 'test4');
        });
        it('it should find test5 with: { \'$or\': [{ foo: { \'$eq\': 14 } }, { bar: { \'$eq\': null } ] }', () => {
            assert.equal(MapQL.find({ '$or': [{ foo: { '$eq': 14 } }, { bar: { '$eq': null } }] })[0]._id, 'test5');
        });
        it('it should find test6 with: { \'$and\': [{ foo: { \'$eq\': 3 } }, { \'$or\': [{ bar: { \'$eq\': null } }, { baz: { \'$eq\' : -10 } } ] } ] }', () => {
            assert.equal(MapQL.find({ '$and': [{ foo: { '$eq': 3 } }, { '$or': [{ bar: { '$eq': null } }, { baz: { '$eq' : -10 } } ] } ] })[0]._id, 'test6');
        });
        it('it should find test7 with: { \'array\': [\'A\', \'B\', \'C\'] }', () => {
            assert.equal(MapQL.find({ 'array': ['A', 'B', 'C'] })[0]._id, 'test7');
        });
        it('it should find test8 with: { \'array\': { \'$in\': [\'A2\'] } }', () => {
            assert.equal(MapQL.find({ 'array': { '$in': ['A2'] } })[0]._id, 'test8');
        });
        it('it should find test9 with: { foo: 1, \'array\': { \'$nin\': [\'B3\'] } }', () => {
            assert.equal(MapQL.find({ foo: 1, 'array': { '$nin': ['B3'] } })[0]._id, 'test9');
        });
        it('it should find test9 with: { foo: 1, \'array.2\': { \'$ne\': \'B3\' } }', () => {
            assert.equal(MapQL.find({ foo: 1, 'array.2': { '$ne': 'B3' } })[0]._id, 'test9');
        });
        it('it should find test10 with: { foo: \'baz\', \'$where\': function () { return Array.isArray(this.array); } }', () => {
            assert.equal(MapQL.find({ foo: 'baz', '$where': function () { return Array.isArray(this.array); } })[0]._id, 'test10');
        });
        it('it should find test10 with: { foo: \'baz\', array: { \'$type\': \'array\' } }', () => {
            assert.equal(MapQL.find({ foo: 'baz', array: { '$type': 'array' } })[0]._id, 'test10');
        });
        it('it should find test11 with: { \'array\': { \'$size\': 4 } }', () => {
            assert.equal(MapQL.find({ 'array': { '$size': 4 } })[0]._id, 'test11');
        });
    });
    describe('#findByKey()', () => {
        it('it should find findByKey_0 with: \'findByKey_0\'', () => {
            assert.equal(MapQL.findByKey('findByKey_0')[0]._id, 'findByKey_0');
        });
        it('it should find findByKey_1_A with: { \'$regex\': \'findByKey_\\\\d_A\' }', () => {
            assert.equal(MapQL.findByKey({ '$regex': 'findByKey_\\d_A' })[0]._id, 'findByKey_1_A');
        });
    });
    describe('#chain()', () => {
        it('it should return "{ \'$eq\' : 10 }" for chain().eq(10).query', () => {
            assert.deepEqual(MapQL.chain().eq(10).query, { '$eq' : 10 });
        });
        it('it should return "{ foo: { \'$eq\' : 10 } }" for chain().eq(\'foo\', 10).query', () => {
            assert.deepEqual(MapQL.chain().eq('foo', 10).query, { foo: { '$eq' : 10 } });
        });
        it('it should return "{ foo: { \'$gt\' : 10 }, bar: { \'$lt\': 100 } }" for chain().gt(\'foo\', 10).lt(\'bar\', 100).query', () => {
            assert.deepEqual(MapQL.chain().gt('foo', 10).lt('bar', 100).query, { foo: { "$gt" : 10 }, bar: { "$lt": 100 } });
        });
        it('it should find test0 for chain().eq(10).execute()', () => {
            assert.deepEqual(MapQL.chain().eq(10).execute()[0]._id, 'test0');
        });
        it('it should find test1 for chain().eq(\'foo\',\'bar\').execute()', () => {
            assert.deepEqual(MapQL.chain().eq('foo', 'bar').execute()[0]._id, 'test1');
        });
        it('it should find test2 for chain().and((chain) => { return [chain.eq(\'bar\', 5), chain.lt(\'baz\', 10)] }).execute()', () => {
            assert.deepEqual(MapQL.chain().and((chain) => { return [chain.eq('bar', 5), chain.lt('baz', 10)] }).execute()[0]._id, 'test2');
        });
    });
});
describe('Modify', () => {
    // Run all updates at the end so find()/findByKey()/chain() have the correct values.
    describe('#update()', () => {
        it('it should set "test0" to "100" for update({ \'$eq\': 10 }, { \'$set\': 100 })', () => {
            let $update = MapQL.update({ '$eq': 10 }, { '$set': 100 });
            assert.deepEqual($update[0].value, 100);
            assert.deepEqual($update[0]._id, 'test0');
        });
        it('it should increment "test0" to "200" for update(\'test0\', { \'$inc\': 100 })', () => {
            let $update = MapQL.update('test0', { '$inc': 100 });
            assert.deepEqual($update[0].value, 200);
            assert.deepEqual($update[0]._id, 'test0');
        });
        it('it should multiply "test0" to "400" for update(\'test0\', { \'$mul\': 2 })', () => {
            let $update = MapQL.update('test0', { '$mul': 2 });
            assert.deepEqual($update[0].value, 400);
            assert.deepEqual($update[0]._id, 'test0');
        });
        it('it should remove "foobar" from "test1" for update(\'test1\', { \'$unset\': { foobar: 1 } })', () => {
            let $update = MapQL.update('test1', { '$unset': { foobar: 1 } });
            assert.deepEqual($update[0].value.foobar, undefined);
            assert.deepEqual($update[0]._id, 'test1');
        });
        it('it should remove "A" from "test7" array for update(\'test7\', { \'$pop\': { \'array\': 1 } })', () => {
            let $update = MapQL.update('test7', { '$pop': { 'array': 1 } });
            assert.deepEqual($update[0].value.array, ['B', 'C']);
            assert.deepEqual($update[0]._id, 'test7');
        });
        it('it should remove "C" from "test7" array for update(\'test7\', { \'$pop\': { \'array\': -1 } })', () => {
            let $update = MapQL.update('test7', { '$pop': { 'array': -1 } });
            assert.deepEqual($update[0].value.array, ['B']);
            assert.deepEqual($update[0]._id, 'test7');
        });
    });
});
describe('Delete', () => {
    describe('#delete()', () => {
        it('it should remove test0', () => {
            assert.equal(MapQL.delete('test0'), true);
        });
    });
    describe('#remove()', () => {
        it('it should remove test1 for remove({ foo: \'bar\' })', () => {
            assert.equal(MapQL.remove({ foo: 'bar' })[0], 'test1');
        });
        it('it should remove test2 for remove({ bar: { \'$lt\': 10 }, baz: { \'$gt\': 3 } })', () => {
            assert.equal(MapQL.remove({ bar: { '$lt': 10 }, baz: { '$gt': 3 } })[0], 'test2');
        });
        it('it should remove test3 for remove({ \'$regex\': /^Str/i })', () => {
            assert.equal(MapQL.remove({ '$regex': /^Str/i })[0], 'test3');
        });
        it('it should remove test4 for remove({ qux: { \'$type\': \'number\' } })', () => {
            assert.equal(MapQL.remove({ qux: { '$type': 'number' } })[0], 'test4');
        });
    });
    describe('#clear()', () => {
        it('it should remove all entries', () => {
            MapQL.clear()
            assert.equal([...MapQL.entries()].length, 0);
        });
    });
});
