const elastic = require("./elastic");
const server  = require("./server");


(async function main() {

  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {

    const elasticAutomatedTestsIndex = await elastic.esclient.indices.exists({index: elastic.automatedTestsIndex});

    if (!elasticAutomatedTestsIndex.body) {
      await elastic.createIndex(elastic.automatedTestsIndex);
      await elastic.setAutomatedTestsMapping();
    }

    const elasticReportsIndex = await elastic.esclient.indices.exists({index: elastic.reportsIndex});

    if (!elasticReportsIndex.body) {
      await elastic.createIndex(elastic.reportsIndex);
      await elastic.setReportsMapping();
    }

    server.start();

  }

})();