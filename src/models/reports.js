const { esclient, reportsIndex, reportsType } = require("../elastic");

async function getReports(req = {}) {
  const { body: { hits } } = await esclient.search({
    from:  req.page  || 0,
    size:  req.limit || 100,
    index: reportsIndex, 
    type:  reportsType,
  });

  const results = hits.total.value;
  const values  = hits.hits.map((hit) => {
    return {
      id: hit._id,
      automatedTestId:  hit._source.automatedTestId,
      url:  hit._source.url,
      createdDateTime: hit._source.createdDateTime,
      completedDateTime: hit._source.completedDateTime,
      score: hit._score
    }
  });

  return {
    results,
    values
  }

}

async function insertReport(body) {
  return esclient.index({
    index: reportsIndex,
    type: reportsType,
    body: {
      automatedTestId: body.automatedTestId,
      url: body.url,
      createdDateTime: new Date().getTime(),
    }
  })
}

async function updateReport(body) {
  return esclient.update({
    index: reportsIndex,
    type: reportsType,
    id: body.id,
    body: {
      doc: {
        automatedTestId: body.automatedTestId,
        url: body.url,
        createdDateTime: body.createdDateTime,
        completedDateTime: body.completedDateTime,
      }
    }
  })
}

async function deleteReport(id) {
  return esclient.delete({
    index: reportsIndex,
    type: reportsType,
    id: id
  })
}

module.exports = {
  getReports,
  insertReport,
  updateReport,
  deleteReport
}