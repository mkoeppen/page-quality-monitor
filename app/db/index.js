const mysql = require('mysql');
const pages = require('./pages');

const db = mysql.createConnection({
  host: "localhost",
  port: "3406",
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

exports.savePage = function(data) {
  return pages.insertOrUpdate(db, data);
}

exports.deletePage = function(id) {
  return pages.delete(db, id);
}