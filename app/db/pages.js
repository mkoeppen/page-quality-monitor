exports.insertOrUpdate = function(db, page) {

    const pageDetails = {
        id: page.id,
        url: page.url,
        pagename: page.pagename,
        parentId: page.parentId,
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

exports.generatePageReport = function(db, pageId) {

    const pageDetails = {
        id: pageId,
        forceReport: 1
    }

    return new Promise((resolve, reject) => {
        db.query(`UPDATE pages SET ? WHERE id = '${ pageDetails.id }'`, pageDetails, (err, res) => {
            if(err) throw err;
            resolve(res)
        }); 
    })    
}
  
exports.setReportGenerated = function(db, id, currentDate) {

    const pageDetails = {
        id: id,
        forceReport: 0,
        lastReportDate: currentDate.toISOString().slice(0, 19).replace('T', ' ')
    }

    return new Promise((resolve, reject) => {
        db.query(`UPDATE pages SET ? WHERE id = '${ pageDetails.id }'`, pageDetails, (err, res) => {
            if(err) throw err;
            resolve(res)
        }); 
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
exports.getPagesWithScores = function(db) {
    return new Promise((resolve, reject) => {

        const sql = `
            SELECT
                pages.*,
                last_report.score_performance,
                last_report.score_accessibility,
                last_report.score_best_practices,
                last_report.score_seo,
                last_report.score_pwa,
                last_report.lcp_display_value,
                last_report.lcp_score,
                last_report.fid_display_value,
                last_report.fid_score,
                last_report.cls_display_value,
                last_report.cls_score
            FROM
                pages
            LEFT JOIN(
                SELECT reports.*
                FROM
                    reports,
                    (
                    SELECT
                        page_id,
                        MAX(DATE) AS max_date
                    FROM
                        reports
                    GROUP BY
                        page_id
                ) last_page
            WHERE
                reports.page_id = last_page.page_id AND reports.date = max_date
            ) AS last_report
            ON
                last_report.page_id = pages.id;
        `;

        db.query(sql, (err, res) => {
            if(err) throw err;
            resolve(res)
        });
    })    
}  
exports.getById = function(db, id) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM pages WHERE id = ${id}`, (err, res) => {
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
  
exports.getNextTest = function(db) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM `pages` WHERE `forceReport` = 1 LIMIT 1', (err, res) => {
            if(err) throw err;
            resolve(res)
        });
    })    
}