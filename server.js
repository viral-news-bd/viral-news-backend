require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());

// Connect MongoDB
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running 🚀' });
});

// Auth Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/premium', require('./routes/premium'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

