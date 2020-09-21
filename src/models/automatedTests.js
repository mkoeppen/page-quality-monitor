const { esclient, automatedTestsIndex, automatedTestsType } = require("../elastic");

async function getAutomatedTests(req = {}) {
  console.log('test', automatedTestsIndex);
  const { body: { hits } } = await esclient.search({
    from:  req.page  || 0,
    size:  req.limit || 100,
    index: automatedTestsIndex, 
    type:  automatedTestsType,
  });

  const results = hits.total.value;
  const values  = hits.hits.map((hit) => {
    return {
      id:     hit._id,
      name:  hit._source.name,
      url: hit._source.url,
      tags: hit._source.tags,
      interval: hit._source.interval,
      color: hit._source.color,
      score:  hit._score
    }
  });

  return {
    results,
    values
  }

}

async function insertNewAutomatedTest(body) {
  return esclient.index({
    index: automatedTestsIndex,
    type: automatedTestsType,
    body: {
      name: body.name,
      url: body.url,
      tags: body.tags,
      interval: body.interval,
      color: body.color,
    }
  })
}

async function updateAutomatedTest(body) {
  return esclient.update({
    index: automatedTestsIndex,
    type: automatedTestsType,
    id: body.id,
    body: {
      doc: {
        name: body.name,
        url: body.url,
        tags: body.tags,
        interval: body.interval,
        color: body.color,
      }
    }
  })
}

async function deleteNewAutomatedTest(id) {
  return esclient.delete({
    index: automatedTestsIndex,
    type: automatedTestsType,
    id: id
  })
}

module.exports = {
  getAutomatedTests,
  insertNewAutomatedTest,
  updateAutomatedTest,
  deleteNewAutomatedTest
}