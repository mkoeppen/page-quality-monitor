const mysql = require('mysql');
const pages = require('./pages');
const reports = require('./reports');
const migration = require('./migration');
const tasksPageRelations = require('./tasksPageRelations');

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'pagequalitymonitor',
  password: process.env.MYSQL_PASSWORD || 'qpmpass',
  database: process.env.MYSQL_DATABASE || 'pagequalitymonitor',
  multipleStatements: true
});

exports.connect = function() {
  return new Promise(async (resolve, reject) => {
    db.connect(async function(err) {
      if (err) throw err;      
    
      await migration.checkMigration(db);
    
      console.log("Connected!");
      resolve();
    });
  })
}


exports.get = function() {
  return db;
}

/**
 * PAGES
 */

exports.getPages = function() {
  return pages.get(db);
}

exports.getPagesWithScores = function() {
  return pages.getPagesWithScores(db);
}

exports.getPageById = function(id) {
  return pages.getById(db, id);
}

exports.generatePageReport = function(id) {
  return pages.generatePageReport(db, id);
}

exports.savePage = function(data) {
  return pages.insertOrUpdate(db, data);
}

exports.deletePage = function(id) {
  return pages.delete(db, id);
}

exports.getNextTest = function() {
  return pages.getNextTest(db);
}

exports.setReportGenerated = function(id, currentDate) {
  return pages.setReportGenerated(db, id, currentDate);
}

/**
 * REPORTS
 */

exports.getReports = function() {
  return reports.get(db);
}

exports.getReportById = function(id) {
  return reports.getById(db, id);
}

exports.getLastReportForPage = function(id) {
  return reports.getLastReportForPage(db, id);
}

exports.saveReport = function(data) {
  return reports.insertOrUpdate(db, data);
}

exports.deleteReport = function(id) {
  return reports.delete(db, id);
}

/**
 * TASK PAGE RELATION
 */

exports.changeCheckedState = function(pageId, taskId, checked) {
  return tasksPageRelations.changeCheckedState(db, pageId, taskId, checked);
}
exports.changeTaskPriority = function(pageId, taskId, priority) {
  return tasksPageRelations.changeTaskPriority(db, pageId, taskId, priority);
}
exports.getTasksRelationsForPageId = function(pageId) {
  return tasksPageRelations.getTasksRelationsForPageId(db, pageId);
}