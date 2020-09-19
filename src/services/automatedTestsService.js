var client = require('./elasticsearch.js'); 

module.exports = {
    create: (automatedTest) => {
        return client.index({
            index: 'automated_tests',
            body: {
                name: automatedTest.name,
                url: automatedTest.url,
                tags: automatedTest.tags,
                interval: automatedTest.interval,
                color: automatedTest.color
            }
        })
    },
    count: () => {
        return client.count({ index: 'automated_tests' });
    }
}

