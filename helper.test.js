var tape = require('tape'),
    helpers = require('./helpers');

var getHashByPropertyValue = helpers.getHashByPropertyValue;

tape.test('getHashByPropertyValue', function (t) {
    var collection = require('./data2.json'),
        property = 'message';

    var call = getHashByPropertyValue(property, collection);

    t.test('should return an object', function (t) {
        t.plan(2);
        t.equal(typeof call, 'object');
        t.equal(call.toString(), '[object Object]');
    });

    t.test('should contain as many properties as there were items in the given array', function (t) {
        t.plan(1);
        t.equal(Object.keys(call).length, 10);
    });

    t.test('property values for given key in given array items should become the keys of the returned object', function (t) {
        collection.forEach(function (item) {
            t.ok(call.hasOwnProperty(item[property]));
        });
        t.end();
    });
    t.test('the values of the properties on the returned object should not contain the given key', function (t) {
        for(var key in call){
            t.notOk(property in call[key]);
        }
        t.end();
    });
    t.end();
});

var extractFromEach = helpers.extractFromEach;

tape.test('extractFromEach', function (tape) {
    var key = 'conversations',
        collection = require('./store.json'),
        fn = extractFromEach(key);

    tape.test('factory should return a function', function (tape) {
        tape.plan(1);
        tape.equal(typeof fn, 'function');
    });
    tape.test('function should return an array', function (tape) {
        tape.plan(1);
        tape.ok(Array.isArray(fn(collection)));
    });
    tape.test('result length should equal total of conversations in given collection', function (tape) {
        var conversationCount = helpers.getTotalByProperty(key, collection);
        tape.plan(1);
        tape.equal(fn(collection).length, conversationCount);
    });
    tape.test('object in collection without the given property should be skipped', function (tape) {
        // intentionally remove property
        var manipulatedCollection = collection.slice();
        delete manipulatedCollection[0][key];

        var conversationCount = helpers.getTotalByProperty(key, manipulatedCollection);
        tape.plan(1);
        tape.equal(fn(manipulatedCollection).length, conversationCount);
    });
});
