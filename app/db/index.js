const mysql = require('mysql');
const pages = require('./pages');
const reports = require('./reports');

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

exports.getPages = function() {
  return pages.get(db);
}

exports.getPageById = function(id) {
  return pages.getById(db, id);
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