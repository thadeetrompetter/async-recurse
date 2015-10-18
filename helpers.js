var http = require('http');
/**
 * requestData is a stub for PUBNUB.history
 *
 * @param  {function} successCallback
 * @param  {function} errorCallback
 * @return {undefined}
 */
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
exports.requestData = requestData;

// TODO: document
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

// TODO: document

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

// TODO: document

function getTotalByProperty(key, collection) {
    return collection.reduce(function (prev, curr) {
        return prev + (curr[key] ? curr[key].length : 0);
    },0);
}
exports.getTotalByProperty = getTotalByProperty;

// TODO: history threshold: if call returns fewer than N records, prevent
// additional calls
function iteratorFactory(success, error) {
    var count = 0;
    return function iterateConversations(conversations, history) {
        var historyByChannel = getHashByPropertyValue('key', history),
            hits = 0;
        for(var i = 0; i < conversations.length; i++){
            var conversation = conversations[i],
                channel = conversation.channel;
            if(historyByChannel.hasOwnProperty(channel)){
                conversation.timestamp = historyByChannel[channel].timestamp;
                count++;
                hits++;
            }
            if(hits === history.length){
                break;
            }
        }
        if(count === conversations.length){
            return success(conversations);
        }
        requestData(function (history) {
            iterateConversations(conversations, history);
        }, error);
    };
}
exports.iteratorFactory = iteratorFactory;
