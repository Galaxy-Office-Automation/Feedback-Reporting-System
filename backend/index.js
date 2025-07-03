const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const feedbackRoutes = require('./routes/feedbackRoutes');
const Feedback = require('./models/FeedbackModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config();
connectDB(); // ← This will connect to MongoDB using the .env URI

const app = express();

app.use(cors({
  origin: '*', // or specific domains
}));




app.use(express.json());

// Demo admin user (replace with DB in production)
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10); // password: admin123
const JWT_SECRET = 'your_jwt_secret_key'; // Use a strong secret in production

// Admin login endpoint
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Middleware to check admin JWT
function requireAdminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const token = auth.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// PATCH feedback status
app.patch('/feedback/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Open', 'In-Progress', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    await Feedback.findByIdAndUpdate(req.params.id, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

app.use('/feedback', feedbackRoutes);

app.use('/embed', express.static(path.join(__dirname, 'public/embed')));

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
