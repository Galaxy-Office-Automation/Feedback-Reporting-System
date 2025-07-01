const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const feedbackRoutes = require('./routes/feedbackRoutes');
const Feedback = require('./models/FeedbackModel');

dotenv.config();
connectDB(); // ← This will connect to MongoDB using the .env URI

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/uploads', express.static('uploads'));
app.use('/feedback', feedbackRoutes);

app.get('/feedback-list', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
});
