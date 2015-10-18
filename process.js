require('fs').writeFileSync('./data2.json', JSON.stringify(require('./data.json').map(function(h) {
    return Object.assign({}, h, {
        timestamp: require('./random-date')()
    });
})));
