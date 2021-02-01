const jwt = require('jsonwebtoken');
const shortid = require('shortid');

require('dotenv').config();

const generateBearerToken = (userId) => {
  const payload = {
    id: userId,
    type: 'access'
  };

  return jwt.sign(payload, process.env.JWT, {expiresIn: 60 * 10});
}

const generateRefreshToken = () => {
  const payload = {
    id: shortid.generate(),
    type: 'refresh'
  };

  return {
    id: payload.id,
    token: jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn: 60 * 60})
  }
}

module.exports = {
  generateBearerToken,
  generateRefreshToken
}