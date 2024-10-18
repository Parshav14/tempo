const express = require("express");
const mysql = require("mysql");

// database connection and query promisify
var conn = mysql.createPool({
  host: "localhost",
  user: "parshav",
  password: "hifrosty",
  database: "aircario",
  connectionLimit: 100,
});

function mySqlQury(query, params = []) {
  return new Promise((resolve, reject) => {
    conn.query(query, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

module.exports = { conn, mySqlQury };
