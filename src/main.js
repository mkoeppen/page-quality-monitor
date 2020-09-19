const elastic = require("./elastic");
const server  = require("./server");
                require("dotenv").config();


(async function main() {

  const isElasticReady = await elastic.checkConnection();

  if (isElasticReady) {

    const elasticAutomatedTestsIndex = await elastic.esclient.indices.exists({index: elastic.automatedTestsIndex});

    if (!elasticAutomatedTestsIndex.body) {
      await elastic.createIndex(elastic.automatedTestsIndex);
      await elastic.setAutomatedTestsMapping();
    }

    server.start();

  }

})();