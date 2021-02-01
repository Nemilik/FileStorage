const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('file'), async (req, res) =>{
  try {
    if (req.file) {
      result = await db.uploadFile(req.file);

      res.status(result.status).json({message: result.message});
    } else {
      res.status(400).json({message: "Bad Request"});
    }
  } catch(e) {
    console.log(e);
  }
});

router.get('/list', async (req, res) =>{
  try {
    result = await db.fileList();

    res.status(200).json(result);
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;