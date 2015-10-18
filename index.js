var helpers = require('./helpers'),
    extractFromEach = helpers.extractFromEach,
    iteratorFactory = helpers.iteratorFactory,
    requestData = helpers.requestData,
    store = require('./store');

function getItems(store, iterator, errorCallback) {
    var stash = store.slice(),
        extractConversations = extractFromEach('conversations'),
        conversations = extractConversations(stash);

    requestData(function (history) {
        iterator(conversations, history);
    }, errorCallback);
}

var iterator = iteratorFactory(function (res) {
    console.log(res);
}, function (err) {
    console.log(err);
});

getItems(store, iterator, function () {
    console.log('bad shit');
});
