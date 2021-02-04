const express = require('express')
const router = express.Router()

router.get('/reg', (req, res) => {
  res.send('Страница регистрации')
});

router.get('/login', (req, res) => {
  res.send('Страница авторизации')
});

module.exports = router;