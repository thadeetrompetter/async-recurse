var express = require('express'),
    data = require('./data2.json');

var app = express(),
    step = 2;

var counterFactory = function (step, data) {
    var count = 0,
        total = data.length;
    return function () {
        var next, slice;
        if(count + step < total){
            next = count + step;
            slice = data.slice(count, next);
            count = next;
        } else {
            next = total;
            slice = data.slice(count, next);
            count = 0;
        }
        return slice;
    };
};
var counter = counterFactory(step, data);

app.get('/', function(req, res) {
  res.send(counter());
});

var server = app.listen(3000);
