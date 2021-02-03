const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

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
//   `name` VARCHAR(150) CHARACTER SET 'utf8' NULL,
//   `extname` VARCHAR(50) NULL,
//   `mimetype` VARCHAR(150) NULL,
//   `size` INT NULL,
//   `uploadDate` DATETIME NULL,
//   `path` MEDIUMTEXT CHARACTER SET 'utf8' NULL
//   PRIMARY KEY (`id`),
//   UNIQUE INDEX `id_UNIQUE` (`id` ASC));

// CREATE TABLE `db`.`tokens` (
//   `userId` VARCHAR(150) NOT NULL,
//   `token` VARCHAR(300) NULL,
//   `refreshTokenId` VARCHAR(100) NULL
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

filesdb.getToken = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query('SELECT * FROM tokens WHERE userId = ?', userId, (err, res) => {
        if (err) {
          return reject(err);
        }

        if (res[0]) {
          return resolve(true);
        }
        return resolve(false);
      });
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
    const query = 'SELECT * FROM tokens WHERE refreshTokenId = ?';
    const value = payload.id;

    pool.query(query, value, (err, res) => {
      if (err) {
        reject(err);
      }
      console.log(res)
      if (res[0]) {
        const tokens = updateTokens(res[0].userId)

        return resolve({status: 200, token: tokens.token, refreshToken: tokens.refreshToken, message: "updated"});
      } else {
        return resolve({status: 400, message: 'Invalid token'});
      }
    });
  });
}

filesdb.logout = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query('DELETE FROM tokens WHERE userId = ?', userId, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve({status: 202, message: 'Accepted'});
      });
    } catch(e) {
      console.log(e);
    }
  });
}

filesdb.uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    try {
      if (file) {
        const sql = "INSERT INTO files (id, name, extname, mimetype, size, uploadDate, path) VALUES(?, ?, ?, ?, ?, ?, ?)";

        const value = [shortid.generate(), file.originalname, path.extname(file.originalname), file.mimetype, file.size, new Date(), file.path]

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

filesdb.fileList = (listSize = 10, page = 1) => {
  return new Promise((resolve, reject) => {
    try {
      const bias = (Number(page) - 1) * Number(listSize)
      pool.query(`SELECT * FROM files LIMIT ${bias}, ${listSize}`, (err, res) => {
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

filesdb.findFile = (id) => {
  return new Promise((resolve, reject) => {
    try {
      pool.query('SELECT * FROM files WHERE id = ?', id, (err, res) => {
        if (err) {
          return reject(err);
        }

        if (res[0]) {
          return resolve({status: 200, data: res[0]});
        } else {
          return resolve({status: 204, message: 'No Content'})
        }
      });
    } catch(e) {
      console.log(e);
    }
  });
}

filesdb.deleteFile = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const path = await filesdb.getPathFile(id);
        
      if (path) {
        fs.unlink(path, (e) => {
          if (e) {
            console.log(e);
            return;
          }
        });
        
        pool.query('DELETE FROM files WHERE id = ?', id, (err, res) => {
          if (err) {
            return reject(err);
          }
          
          resolve({status: 200, message: 'Deleted'});
        });
      } else {
        return resolve({status: 204, message: 'No Content'})
      }
    } catch(e) {
      console.log(e);
    }
  });
}

filesdb.downloadFile = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      path = await filesdb.getPathFile(id);
        
      if (path) {
        
      } else {
        return resolve({status: 204, message: 'No Content'})
      }
    } catch(e) {
      console.log(e);
    }
  });
}

filesdb.getPathFile = (id) => { 
  return new Promise((resolve, reject) => {
    try {
      pool.query('SELECT * FROM files WHERE id = ?', id, (err, res) => {
        if (err) {
          return reject(err);
        }

        if (res[0]) {
          return resolve(res[0].path);
        } else {
          return resolve(false);
        }
      });
    } catch(e) {
      console.log(e);
    }
  });  
}

filesdb.updateFile = (id, _path, file) => { 
  return new Promise((resolve, reject) => {
    try {
      fs.unlink(_path, (e) => {
        if (e) {
          console.log(e);
          return;
        }
      });

      const query = 'UPDATE files SET name = ?, extname = ?, mimetype = ?, size = ?, uploadDate = ?, path = ? WHERE id = ?';
      
      const value = [file.originalname, path.extname(file.originalname), file.mimetype, file.size, new Date(), file.path, id]
      pool.query(query, value, (err, res) => {
        if (err) {
          reject(err);
        }

        resolve({status: 202, message: 'Updated'});
      });
    } catch(e) {
      console.log(e);
    }
  });  
}

const replaceDbRefreshToken = (userId, bearerToken, refreshTokenId) => {
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
      const query = 'INSERT INTO tokens (userId, token, refreshTokenId) VALUES(?, ?, ?)';
      const value = [userId, bearerToken, refreshTokenId];

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

  replaceDbRefreshToken(userId, token, refreshToken.id);

  return {
    token,
    refreshToken: refreshToken.token,
  }
}

module.exports = filesdb;