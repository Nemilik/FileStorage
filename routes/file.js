const express = require('express');
const passport = require('passport');
const router = express.Router();
const db = require('../db');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('file'), passport.authenticate('jwt', {session: false}), async (req, res) => {
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

router.get('/list', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    result = await db.fileList(req.query.list_size, req.query.page);

    res.status(200).json(result);
  } catch(e) {
    console.log(e);
  }
});

router.delete('/delete/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    result = await db.deleteFile(req.params.id);

    res.status(result.status).json({message: result.message});
  } catch(e) {
    console.log(e);
  }
});

router.get('/download/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    result = await db.getPathFile(req.params.id);

    res.download(result);
  } catch(e) {
    console.log(e);
  }
});

router.put('/update/:id', upload.single('file'), passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    path = await db.getPathFile(req.params.id);

    if (!path) {
      res.status(204).json({message: 'No Content'});
    }

    result = await db.updateFile(req.params.id, path, req.file);

    res.status(result.status).json({message: result.message})
  } catch(e) {
    console.log(e);
  }
});

router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) =>{
  try {
    result = await db.findFile(req.params.id);

    if (result.data) {
      res.status(200).json(result.data);
      return;
    }

    res.status(result.status).json({message: result.message});
  } catch(e) {
    console.log(e);
  }
});

module.exports = router;