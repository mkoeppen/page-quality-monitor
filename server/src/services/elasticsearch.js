var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    host: 'http://localhost:16662/',
    log: 'info'
});

module.exports = client;