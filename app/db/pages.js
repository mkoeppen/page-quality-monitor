exports.insertOrUpdate = function(db, page) {

    const pageDetails = {
        id: page.id,
        pagename: page.pagename,
        pageId: page.pageId,
        color: page.color,
    }

    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM pages WHERE id = '${ pageDetails.id }'`, function(err, result, field) {
            if(result.length === 0){
                db.query('INSERT INTO pages SET ?', pageDetails, (err, res) => {
                    if(err) throw err;
                    resolve(res)
                });
            } else{  
                //existing match
                db.query(`UPDATE pages SET ? WHERE id = '${ pageDetails.id }'`, pageDetails, (err, res) => {
                    if(err) throw err;
                    resolve(res)
                });
            }
        })  
    })    
}
  
exports.get = function(db) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM pages`, (err, res) => {
            if(err) throw err;
            resolve(res)
        });
    })    
}
  
exports.delete = function(db, id) {
    return new Promise((resolve, reject) => {

        if(!id) reject()

        db.query(`DELETE FROM pages WHERE id = ${id}`, (err, res) => {
            if(err) throw err;
            resolve(res)
        });
    })    
}
  