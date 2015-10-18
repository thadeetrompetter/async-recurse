var tape = require('tape'),
    index = require('./index'),
    collection = [
        {
            "key": "a7b3js930",
            "message": "dit is het eerste bericht",
            "timestamp": 1444939746401
        }, {
            "key": "lkas93nksd",
            "message": "dit is het tweede bericht",
            "timestamp": 1445058678832
        }, {
            "key": "8123098sdd",
            "message": "dit is het derde bericht",
            "timestamp": 1444974853329
        }
    ],
    property = 'message';

var getHashByPropertyValue = index.getHashByPropertyValue;

tape.test('getHashByPropertyValue', function (t) {
    var call = getHashByPropertyValue(property, collection);

    t.test('should return an object', function (t) {
        t.plan(2);
        t.equal(typeof call, 'object');
        t.equal(call.toString(), '[object Object]');
    });

    t.test('should contain as many properties as there were items in the given array', function (t) {
        t.plan(1);
        t.equal(Object.keys(call).length, 3);
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
