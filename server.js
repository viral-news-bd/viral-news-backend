require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

/* =======================
   Database Connection
======================= */
connectDB();

/* =======================
   Middleware
======================= */

// Allow only specific origins (adjust later)
app.use(
  cors({
    origin: '*', // later: ['https://yourdomain.com']
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

/* =======================
   Health Check
======================= */
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running 🚀' });
});

/* =======================
   Routes
======================= */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/premium', require('./routes/premium'));

/* =======================
   404 Handler
======================= */
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* =======================
   Global Error Handler
======================= */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

/* =======================
   Server Start
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
