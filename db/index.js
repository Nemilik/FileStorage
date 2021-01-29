const mysql = require('mysql');
require('dotenv').config()

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: 'root',
  database: 'files',
  host: 'localhost',
  port: 3306
});

let filesdb = {};

filesdb.all = () => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM files`, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
  });
};

module.exports = filesdb;