var tape = require('tape'),
    randomDate = require('./random-date');

tape.test('getting a random date', function (t) {
    t.plan(1);
    t.equal(typeof randomDate(), 'number');
});
