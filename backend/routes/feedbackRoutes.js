const express = require('express');
const multer = require('multer');
const path = require('path');
const Feedback = require('../models/FeedbackModel');

const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { note, tag, metadata } = req.body;
    const meta = JSON.parse(metadata || '{}');
    const screenshot = req.file ? req.file.filename : null;

    const feedback = new Feedback({
      tag,
      note,
      url: meta.url || '',
      userAgent: meta.userAgent || '',
      metadata: meta.custom || {},
      consoleLogs: meta.consoleLogs || [],
      screenshot,
    });

    await feedback.save();
    res.status(201).json({ success: true, id: feedback._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

module.exports = router;
