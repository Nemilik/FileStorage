const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config()

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: 'db',
  host: 'localhost',
  port: 3306
});

pool.query("CREATE TABLE `db`.`users1` (`id` VARCHAR(100) NOT NULL,`password` VARCHAR(150) NULL,`password` DATETIME NULL,PRIMARY KEY (`id`),UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);")

let filesdb = {};




filesdb.getUsers = () => {
  return new Promise((resolve, reject) => {
    
    pool.query("CREATE TABLE users3 (id VARCHAR(100) NOT NULL, password VARCHAR(150) NULL, regDate DATETIME NULL,PRIMARY KEY (id),UNIQUE INDEX id_UNIQUE (id ASC) VISIBLE)", (err, res) => {
      if (err) {
        return reject(err);
      }
    
      return resolve(res);
    })
    // pool.query("SELECT * FROM users", (err, res) => {
    //   if (err) {
    //     return reject(err);
    //   }

    //   return resolve(res);
    // });
  });
}

filesdb.getUser = (userId) => {
  return new Promise((resolve, reject) => {

    pool.query("SELECT * FROM users WHERE id = ?", userId, (err, res) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else  {
        return resolve(res[0]);
      }
    });
  });
}

filesdb.signup = (userId, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const candidate = await filesdb.getUser(userId);

      if (candidate) {
        return resolve({status: 400, message: 'id is busy'});
      } else {
        sql = "INSERT INTO users (id, password, regDate) VALUES(?, ?, ?)";
        const hashPassword = bcrypt.hashSync(password, 7)

        value = [userId, hashPassword, new Date()]

        pool.query(sql, value, (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve({status: 201, message: 'Created'});
        });
      }
    } catch(e) {
      console.log(e);
    }
  });
}

filesdb.signin = (userId, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const candidate = await filesdb.getUser(userId);

      if (candidate) {
        const check = bcrypt.compareSync(password, candidate.password);

        if (check) {
          const token = jwt.sign({
            id: candidate.id
          }, process.env.JWT, {expiresIn: 60 * 10});

          const refreshToken = jwt.sign({
            id: candidate.id
          }, process.env.JWT_REFRESH, {expiresIn: 60 * 60});

          return resolve({status: 200, message: 'Success', token: `Bearer ${token}`, refreshToken});
        } else {
          return resolve({status: 401, message: 'Invalid password'});
        }
      } else {
        return resolve({status: 401, message: 'User is not found'});
      }
    } catch(e) {
      console.log(e);
    }
  });
}

filesdb.uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (file) {
        sql = "INSERT INTO files (id, name, extname, mimetype, size, uploadDate) VALUES(?, ?, ?)";
        const hashPassword = bcrypt.hashSync(password, 7)

        value = [userId, hashPassword, new Date()]

        pool.query(sql, value, (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve({status: 201, message: 'Created'});
        });
      } else {
        resolve({status: 400, message: "Bad Request"})
      }
    } catch(e) {
      console.log(e);
    }
  });
}

module.exports = filesdb;