const mysql = require('mysql');

mysql.createPool({
  connectionLimit: 10,
  password: 'admin',
  user: 'admin',
  database: 'files',
  host: 'localhost',
  port: 3306
})