const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const Feedback = require('../models/FeedbackModel');
const mongoose = require('mongoose');
const router = express.Router();

const upload = multer(); // memory storage

// POST feedback with screenshot to GridFS
router.post('/', upload.single('screenshot'), async (req, res) => {
  try {
    const { note, tag, metadata } = req.body;
    const meta = JSON.parse(metadata || '{}');
    let screenshotId = null;

    if (req.file) {
      // Store screenshot in GridFS
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'screenshots' });
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });
      uploadStream.end(req.file.buffer);
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
      });
      screenshotId = uploadStream.id.toString();
    }

    const feedback = new Feedback({
      tag,
      note,
      url: meta.url || '',
      userAgent: meta.userAgent || '',
      metadata: meta.custom || {},
      consoleLogs: meta.consoleLogs || [],
      screenshot: screenshotId,
    });

    await feedback.save();
    res.status(201).json({ success: true, id: feedback._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// GET screenshot from GridFS by file ID
router.get('/screenshot/:id', async (req, res) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'screenshots' });
    const fileId = new ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }
    res.set('Content-Type', files[0].contentType || 'image/jpeg');
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch screenshot' });
  }
});

module.exports = router;
