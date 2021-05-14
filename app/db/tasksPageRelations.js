exports.changeCheckedState = function(db, pageId, taskId, checked) {

  const taskPageRelation = {
    page_id: pageId,
    task_id: taskId,
    checked: checked,
  }

  return new Promise((resolve, reject) => {
      db.query(`SELECT page_id FROM tasks_page_relation WHERE page_id = '${ pageId }' AND task_id = '${ taskId }'`, function(err, result, field) {
          if(result.length === 0){
              db.query('INSERT INTO tasks_page_relation SET ?', taskPageRelation, (err, res) => {
                  if(err) throw err;
                  resolve(res)
              });
          } else{  
              //existing match
              db.query(`UPDATE tasks_page_relation SET ? WHERE page_id = '${ pageId }' AND task_id = '${ taskId }'`, taskPageRelation, (err, res) => {
                  if(err) throw err;
                  resolve(res)
              });
          }
      })  
  })    
}

exports.changeTaskPriority = function(db, pageId, taskId, priority) {

  const taskPageRelation = {
    page_id: pageId,
    task_id: taskId,
    priority: priority,
  }

  return new Promise((resolve, reject) => {
      db.query(`SELECT page_id FROM tasks_page_relation WHERE page_id = '${ pageId }' AND task_id = '${ taskId }'`, function(err, result, field) {
          if(result.length === 0){
              db.query('INSERT INTO tasks_page_relation SET ?', taskPageRelation, (err, res) => {
                  if(err) throw err;
                  resolve(res)
              });
          } else{  
              //existing match
              db.query(`UPDATE tasks_page_relation SET ? WHERE page_id = '${ pageId }' AND task_id = '${ taskId }'`, taskPageRelation, (err, res) => {
                  if(err) throw err;
                  resolve(res)
              });
          }
      })  
  })    
}

exports.getTasksRelationsForPageId = function(db, pageId) {    
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM tasks_page_relation WHERE page_id=${pageId};`, (err, res) => {
            if(err) throw err;
            resolve(res)
        });
    })    
}