const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const path = require('path');

const { generateBearerToken, generateRefreshToken } = require('../helpers/auth');

require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
  database: 'db',
  host: 'localhost',
  port: 3306
});


let filesdb = {};

// CREATE TABLE `db`.`users` (
//   `id` VARCHAR(100) NOT NULL,
//   `password` VARCHAR(150) NULL,
//   `regDate` DATETIME NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `id_UNIQUE` (`id` ASC));

// CREATE TABLE `db`.`files` (
//   `id` VARCHAR(50) NOT NULL,
//   `name` VARCHAR(150) NULL,
//   `extname` VARCHAR(50) NULL,
//   `mimetype` VARCHAR(150) NULL,
//   `size` INT NULL,
//   `uploadDate` DATETIME NULL,
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `id_UNIQUE` (`id` ASC));

// CREATE TABLE `db`.`tokens` (
//   `userId` VARCHAR(150) NOT NULL,
//   `tokenId` VARCHAR(150) NULL,
//   PRIMARY KEY (`userId`),
//   UNIQUE INDEX `userId_UNIQUE` (`userId` ASC));



filesdb.getUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(res);
    });
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
          const { token, refreshToken } = updateTokens(userId);

          return resolve({status: 201, message: 'Created', token: `Bearer ${token}`, refreshToken});
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
          const { token, refreshToken } = updateTokens(userId);

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

filesdb.refreshTokens = (req, res) => {
  const { refreshToken } = req.body;
  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH);

    if (payload.type != 'refresh') {
      return {status: 400, message: 'Invalid token'};
    }
  } catch(e) {
    if (e instanceof jwt.TokenExpiredError) {
      return {status: 400, message: 'Token expired'};
    } else if (e instanceof jwt.JsonWebTokenError) {
      return {status: 400, message: 'Invalid token'};
    }
  }

  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM tokens WHERE tokenId = ?';
    const value = payload.id;

    pool.query(query, value, (err, res) => {
      if (err) {
        reject(err);
      }
      console.log(res)
      if (res[0]) {
        console.log(res[0])
        return resolve(updateTokens(res[0].userId));
      } else {
        return resolve({status: 400, message: 'Invalid token'});
      }
    });
  });
}

filesdb.uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (file) {
        const sql = "INSERT INTO files (id, name, extname, mimetype, size, uploadDate) VALUES(?, ?, ?, ?, ?, ?)";

        const value = [shortid.generate(), file.originalname, path.extname(file.originalname), file.mimetype, file.size, new Date()]

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

filesdb.fileList = () => {
  return new Promise((resolve, reject) => {
    try {
      pool.query('SELECT * FROM files', (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve(res);
      });
    } catch(e) {
      console.log(e);
    }
  });
}

filesdb.logout = (req) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken.split(' ');

  const decoded = jwt.verify(token[1], process.env.JWT);

  const result = updateTokens(decoded.id);

  if (result) {
    return {message: 'Done'}
  }
}

const replaceDbRefreshToken = (userId, tokenId) => {
  token = new Promise((resolve, reject) => {
    const query = 'SELECT * FROM tokens WHERE userId = ?';
    const value = userId;
    pool.query(query, value, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });

  return new Promise((resolve, reject) => {
    token.then(async (result) => {
      const query = 'INSERT INTO tokens (userId, tokenId) VALUES(?, ?)';
      const value = [userId, tokenId];

      if (result[0]) {
        pool.query('DELETE FROM tokens WHERE userId = ?', userId, (e, r) => {
          if (e) {
            return reject(e);
          }

          pool.query(query, value, (error, result) => {
            if (error) {
              return reject(error);
            }

            return resolve(result);
          });
        });
      } else {
        pool.query(query, value, (error, result) => {
          if (error) {
            return reject(error);
          }

          return resolve(result);
        });
      }
    });
  });
}

const updateTokens = (userId) => {
  const token = generateBearerToken(userId);
  const refreshToken = generateRefreshToken();

  replaceDbRefreshToken(userId, refreshToken.id);

  return {
    token,
    refreshToken: refreshToken.token,
  }
}

module.exports = filesdb;