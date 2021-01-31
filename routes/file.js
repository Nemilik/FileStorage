const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('file'), async (req, res) =>{
  try {
    if (req.file) {
      console.log(req.file);
    }
    res.status(200).json({message: 'Done'});
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;