async function getReports(req = {}) {
  // const { body: { hits } } = await esclient.search({
  //   from:  req.page  || 0,
  //   size:  req.limit || 100,
  //   index: reportsIndex, 
  //   type:  reportsType,
  // });

  // const results = hits.total.value;
  // const values  = hits.hits.map((hit) => {
  //   return {
  //     id: hit._id,
  //     automatedTestId:  hit._source.automatedTestId,
  //     url:  hit._source.url,
  //     createdDateTime: hit._source.createdDateTime,
  //     completedDateTime: hit._source.completedDateTime,
  //     score: hit._score
  //   }
  // });

  // return {
  //   results,
  //   values
  // }

}


async function getDetails(id) {
  // const result = await esclient.get({
  //   index: reportsIndex, 
  //   type:  reportsType,
  //   id: id
  // });
  // const data = {
  //   id: result.body._id,
  //   automatedTestId:  result.body._source.automatedTestId,
  //   url:  result.body._source.url,
  //   createdDateTime: result.body._source.createdDateTime,
  //   completedDateTime: result.body._source.completedDateTime,
  //   filepath: result.body._source.filepath
  // };

  // return data;
}

// async function getNextTest(req = {}) {
  // const { body: { hits } } = await esclient.search({
  //   from:  0,
  //   size:  1,
  //   index: reportsIndex, 
  //   type:  reportsType,
  //   body: {
  //     query: {
  //       bool: {
  //         must_not: {
  //           exists: {
  //             field: "completedDateTime"
  //           }
  //         }
  //       }
  //     },
  //     sort: [{"createdDateTime": "asc"}]
  //   }
  // });

  // const results = hits.total.value;
  // const values  = hits.hits.map((hit) => {
  //   return {
  //     id: hit._id,
  //     automatedTestId:  hit._source.automatedTestId,
  //     url:  hit._source.url,
  //     createdDateTime: hit._source.createdDateTime,
  //     completedDateTime: hit._source.completedDateTime,
  //     score: hit._score
  //   }
  // });

  // return {
  //   results,
  //   values
  // }
// }

async function insertReport(body) {
  // return esclient.index({
  //   index: reportsIndex,
  //   type: reportsType,
  //   body: {
  //     automatedTestId: body.automatedTestId,
  //     url: body.url,
  //     createdDateTime: new Date().getTime(),
  //   }
  // })
}

async function updateReport(body) {
  // return esclient.update({
  //   index: reportsIndex,
  //   type: reportsType,
  //   id: body.id,
  //   body: {
  //     doc: {
  //       automatedTestId: body.automatedTestId,
  //       url: body.url,
  //       createdDateTime: body.createdDateTime,
  //       completedDateTime: body.completedDateTime,
  //       filepath: body.filepath
  //     }
  //   }
  // })
}
exports.getNextTest = function(db) {
  return new Promise((resolve, reject) => {
      db.query('SELECT * FROM `pages` WHERE `forceReport` = 1 LIMIT 1', (err, res) => {
          if(err) throw err;
          resolve(res)
      });
  })    
}

async function deleteReport(id) {
  // return esclient.delete({
  //   index: reportsIndex,
  //   type: reportsType,
  //   id: id
  // })
}