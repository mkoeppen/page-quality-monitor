exports.insertOrUpdate = function(db, report) {

  const reportDetails = {
      id: report.id,
      page_id: report.page_id,
      date: report.date,
      html_path: report.html_path,
      json_path: report.json_path,
  }

  return new Promise((resolve, reject) => {
      db.query(`SELECT id FROM reports WHERE id = '${ reportDetails.id }'`, function(err, result, field) {
          if(result.length === 0){
              db.query('INSERT INTO reports SET ?', reportDetails, (err, res) => {
                  if(err) throw err;
                  resolve(res)
              });
          } else{  
              //existing match
              db.query(`UPDATE reports SET ? WHERE id = '${ reportDetails.id }'`, reportDetails, (err, res) => {
                  if(err) throw err;
                  resolve(res)
              });
          }
      })  
  })    
}

exports.get = function(db) {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM reports`, (err, res) => {
          if(err) throw err;
          resolve(res)
      });
  })    
}

exports.getById = function(db, id) {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM reports WHERE id = ${id}`, (err, res) => {
          if(err) throw err;
          resolve(res)
      });
  })    
}

exports.getLastReportForPage = function(db, id) {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM reports WHERE page_id = ${id} ORDER BY date DESC LIMIT 1;`, (err, res) => {
          if(err) throw err;
          resolve(res)
      });
  })    
}

exports.delete = function(db, id) {
  return new Promise((resolve, reject) => {

      if(!id) reject()

      db.query(`DELETE FROM reports WHERE id = ${id}`, (err, res) => {
          if(err) throw err;
          resolve(res)
      });
  })    
}
