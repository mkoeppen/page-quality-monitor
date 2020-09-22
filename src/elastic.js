const { Client } = require("@elastic/elasticsearch");

const elasticUrl = process.env.ELASTIC_URL || "http://localhost:9200";
const esclient   = new Client({ node: elasticUrl });
const automatedTestsIndex      = "automated_tests";
const automatedTestsType       = "automated_tests";
const reportsIndex      = "reports";
const reportsType       = "reports";

/**
 * @function createIndex
 * @returns {void}
 * @description Creates an index in ElasticSearch.
 */

async function createIndex(index) {
  try {

    await esclient.indices.create({ index });
    console.log(`Created index ${index}`);

  } catch (err) {

    console.error(`An error occurred while creating the index ${index}:`);
    console.error(err);

  }
}

/**
 * @function setAutomatedTestsMapping,
 * @returns {void}
 * @description Sets the automated tests mapping to the database.
 */

async function setAutomatedTestsMapping () {
  try {
    const schema = {
      name: {
        type: "text" 
      },
      url: {
        type: "text"
      },
      tags: {
        type: "text"
      },
      interval: {
        type: "integer"
      },
      color: {
        type: "text"
      },
    };
  
    await esclient.indices.putMapping({ 
      index: automatedTestsIndex, 
      type: automatedTestsType,
      include_type_name: true,
      body: { 
        properties: schema 
      } 
    })
    
    console.log("Automated tests mapping created successfully");
  
  } catch (err) {
    console.error("An error occurred while setting the automated tests mapping:");
    console.error(err);
  }
}

/**
 * @function setReportsMapping,
 * @returns {void}
 * @description Sets the reports mapping to the database.
 */

async function setReportsMapping () {
  try {
    const schema = {
      automatedTestId: {
        type: "text" 
      },
      url: {
        type: "text" 
      },
      createdDateTime: {
        type: "date"
      },
      completedDateTime: {
        type: "date"
      },
      resultHtml: {
        type: "text" 
      },
      resultJson: {
        type: "text" 
      },
    };
  
    await esclient.indices.putMapping({ 
      index: reportsIndex, 
      type: reportsType,
      include_type_name: true,
      body: { 
        properties: schema 
      } 
    })
    
    console.log("Reports mapping created successfully");
  } catch (err) {
    console.error("An error occurred while setting the automated reports:");
    console.error(err);
  }
}

/**
 * @function checkConnection
 * @returns {Promise<Boolean>}
 * @description Checks if the client is connected to ElasticSearch
 */

function checkConnection() {
  return new Promise(async (resolve) => {

    console.log("Checking connection to ElasticSearch...");
    let isConnected = false;

    while (!isConnected) {
      try {

        await esclient.cluster.health({});
        console.log("Successfully connected to ElasticSearch");
        isConnected = true;

      // eslint-disable-next-line no-empty
      } catch (_) {

      }
    }

    resolve(true);

  });
}

module.exports = {
  esclient,
  setAutomatedTestsMapping,
  setReportsMapping,
  checkConnection,
  createIndex,
  automatedTestsIndex,
  automatedTestsType,
  reportsIndex,
  reportsType
};