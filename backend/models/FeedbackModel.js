const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  note: { type: String, required: true },
  url: String,
  userAgent: String,
  metadata: Object,
  consoleLogs: [String],
  screenshot: { type: String }, // GridFS file ID as string
  status: { type: String, default: 'Open' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
