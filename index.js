var http = require('http'),
    store = require('./store'),
    location = 'http://localhost:3000';

function getItems(location, store) {
    var stash = store.slice(),
        conversations = extractConversations(stash),
        cache = {},
        count = 0;
        function iterateConversations(history, success, error) {
            conversations.forEach(function (conversation, index, array) {
                history.forEach(function (historyItem) {
                    if(historyItem.key === conversation.channel){
                        conversation.message = historyItem.message;
                        count++;
                    }
                });
                if(count === conversations.length){
                    return process.nextTick(function () {
                        success(conversations)
                        process.exit();
                    });
                }
                return requestData(function (response) {
                    return process.nextTick(function () {
                        iterateConversations(response, success, error)
                    });
                }, error);
            });
        }
        return function (success, error) {
            requestData(function (response) {
                iterateConversations(response, success, error);
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
// requestData(function (response) {
//
// });

function storeHistory (items, cache) {
    var len = items.length,
        i = 0;

        while(i < l){
            if(!cache.hasOwnProperty(item)){
                cache[item] = items[item];
            }
            i++;
        }
}
function extractConversations(stash) {
    var conversations = [],
        len = stash.length,
        i = 0;
    while(i < len){
        if(stash[i].hasOwnProperty('conversations')){
            conversations = conversations.slice().concat(stash[i].conversations);
        }
        i++;
    }
    return conversations;
}
var retriever = getItems(location, store);

retriever(function (res) {
    console.log(res);
}, function (err) {
    console.log(err);
});
