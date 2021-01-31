const express = require('express');
const db = require('../db');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/',  async (req, res, next) => {
  try {
    let result = await db.getUsers();
    res.json(result);
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const data = req.body;

    let result = await db.signup(data.id, data.password);

    res.status(result.status).json({message: result.message});
  } catch(e) {
    console.log(e);
    res.sendStatus(500);
  }

});

router.post('/signin', async (req, res) => {
  try {
    const data = req.body;

    let result = await db.signin(data.id, data.password);

    if (result.status === 200) {
      res.status(result.status).json({message: result.message, token: result.token, refreshToken: result.refreshToken});
    } else {
      res.status(result.status).json({message: result.message});
    }
  } catch(e) {
    console.log(e);
    res.status(500);
  }
});

// router.post('/signin/new_token', async (req, res) => {
//   try {
//     const data = req.body;

//     let result = await db.signin(data.id, data.password);

//     if (result.status === 200) {
//       res.status(result.status).json({message: result.message, token: result.token, refreshToken: result.refreshToken});
//     } else {
//       res.status(result.status).json({message: result.message});
//     }
//   } catch(e) {
//     console.log(e);
//     res.status(500);
//   }
// });

router.get('/info', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(' ');

    const decoded = jwt.verify(token[1], process.env.JWT);

    if (decoded.id) {
      res.status(200).json({id: decoded.id});
    } else {
      res.status(404).json({message: 'Not found'});
    }
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;