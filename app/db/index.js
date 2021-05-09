const mysql = require('mysql');
const pages = require('./pages');
const reports = require('./reports');
const tasksPageRelations = require('./tasksPageRelations');

const db = mysql.createConnection({
  host: process.env.NODE_ENV === 'development' ? 'localhost' : "db",
  port: "3306",
  user: "pagequalitymonitor",
  password: "qpmpass",
  database: "pagequalitymonitor",
});


db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

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
exports.getTasksRelationsForPageId = function(pageId) {
  return tasksPageRelations.getTasksRelationsForPageId(db, pageId);
}