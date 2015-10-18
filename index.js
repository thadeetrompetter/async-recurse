var http = require('http'),
    store = require('./store'),
    location = 'http://localhost:3000',
    randomDate = require('./random-date');

function getItems(store, iterator, errorCallback) {
    var stash = store.slice(),
        extractConversations = extractFromEach('conversations'),
        conversations = extractConversations(stash);

    requestData(function (history) {
        // TODO: in the pubnub history call, iterator needs to be configured to
        // only accept history as argument.
        iterator(conversations, history);
    }, errorCallback);
}
// TODO: add option to break out of conversations loop if as many results were
// collected as there are items in retrieved history.
function iteratorFactory(success, error) {
    var count = 0;
    return function iterateConversations(conversations, history) {
        var historyByChannel = getHashByPropertyValue('key', history),
            hits = 0;
        conversations.forEach(function (conversation, index) {
            var channel = conversation.channel;
            if(historyByChannel.hasOwnProperty(channel)){
                conversation.timestamp = historyByChannel[channel].timestamp;
                count++;
                hits++;
            }
            if(hits === history.length){
                // this does not work in a foreach, re-write to for loop
                // to use 'break'
                return false;
            }
        });
        if(count === conversations.length){
            return success(conversations);
        }
        requestData(function (history) {
            iterateConversations(conversations, history);
        }, error);
    };
}
function requestData(successCallback, errorCallback) {
    return http.get({
        port: 3000
    }, function (res) {
        var response = '';
        res.on('data', function (chunk) {
            response += chunk;
        });
        res.on('end', function () {
            successCallback(JSON.parse(response));
        });
        res.on('error', errorCallback);
    });
}
function getHashByPropertyValue (property, collection) {
    var len = collection.length,
        i = 0,
        collector = {};

    while(i < len){
        var current;
        if(collection[i].hasOwnProperty(property)){
            current = collector[collection[i][property]] = {};
            for(var prop in collection[i]){
                if(prop !== property){
                    current[prop] = collection[i][prop];
                }
            }
        }
        i++;
    }
    return collector;
}
exports.getHashByPropertyValue = getHashByPropertyValue;

function extractFromEach(key) {
    return function (collection) {
        var collector = [],
            len = collection.length,
            i = 0;
        while(i < len){
            if(collection[i].hasOwnProperty(key)){
                collector = collector.concat(collection[i][key]);
            }
            i++;
        }
        return collector;
    };
}
exports.extractFromEach = extractFromEach;

var iterator = iteratorFactory(function (res) {
    console.log(res);
}, function (err) {
    console.log(err);
});

getItems(store, iterator, function () {
    console.log('bad shit');
});
